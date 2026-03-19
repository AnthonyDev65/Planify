import { HashRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useState, createContext, useEffect } from 'react';
import { Home as HomeIcon, Calendar, CreditCard, Lock } from 'lucide-react';
import BottomNav from './components/BottomNav';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Subscriptions from './pages/Subscriptions';
import Vault from './pages/Vault';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import { SettingsProvider } from './contexts/SettingsContext';
import { subscriptionsStorage, activitiesStorage, passwordsStorage, storageUtils } from './services/storage';
import { syncSubscriptions, syncActivities, syncPasswords } from './services/dataSync';
import { supabaseAuth } from './services/supabase';
import { initializeNotifications, scheduleAllSubscriptionReminders, addNotificationListener } from './services/localNotifications';
import { checkAndUpdateSubscriptions } from './utils/helpers';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import './index.css';

export const AppContext = createContext();

// Componente para verificar si mostrar navbar
function AppLayout({ children }) {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/welcome'].includes(location.pathname);

  return (
    <>
      {children}
      {!hideNavbar && <BottomNav />}
    </>
  );
}

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Configure Status Bar for Android/iOS
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === 'android') {
        StatusBar.setOverlaysWebView({ overlay: true });
        StatusBar.setBackgroundColor({ color: 'transparent' });
      }
      
      // Inicializar notificaciones locales
      initializeNotifications().then((granted) => {
        if (granted) {
          console.log('Notifications initialized successfully');
        }
      });
      
      // Escuchar cuando se toca una notificación
      addNotificationListener((notification) => {
        console.log('Notification tapped:', notification);
      });

      // Listener para cuando la app vuelve del background
      CapApp.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. isActive:', isActive);
        if (isActive) {
          // La app volvió al foreground, no hacer nada
          // El estado ya está cargado
          console.log('App resumed from background');
        }
      });
    }

    // Verificar autenticación
    checkAuth();

    // Escuchar cambios de autenticación
    const { data: authListener } = supabaseAuth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      // Solo actualizar si hay un cambio real de sesión
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setIsFirstTime(false);
        await loadData();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        await loadLocalData();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
      if (Capacitor.isNativePlatform()) {
        CapApp.removeAllListeners();
      }
    };
  }, []);

  const checkAuth = async () => {
    try {
      console.log('checkAuth: Starting authentication check');
      
      // Verificar si es la primera vez
      const hasVisited = localStorage.getItem('planify_has_visited');
      const guestMode = localStorage.getItem('planify_guest_mode');
      
      console.log('checkAuth: hasVisited:', hasVisited, 'guestMode:', guestMode);
      
      if (!hasVisited && !guestMode) {
        console.log('checkAuth: First time user, showing welcome');
        setIsFirstTime(true);
        setAuthChecked(true);
        setLoading(false);
        return;
      }

      // Ya no es primera vez
      setIsFirstTime(false);
      
      // Marcar como visitado
      localStorage.setItem('planify_has_visited', 'true');

      const session = await supabaseAuth.getSession();
      const currentUser = session?.user || null;
      console.log('checkAuth: Current user:', currentUser?.email || 'Guest');
      
      setUser(currentUser);
      if (currentUser) {
        await loadData();
      } else {
        // Cargar datos locales si no hay usuario
        await loadLocalData();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      await loadLocalData();
    } finally {
      setAuthChecked(true);
      console.log('checkAuth: Finished');
    }
  };

  const loadData = async () => {
    try {
      // Solo mostrar loading screen si es la carga inicial
      if (!initialLoadComplete) {
        setLoading(true);
      }
      console.log('loadData: Starting to load data from Supabase/local');
      
      // Timeout de seguridad: si tarda más de 10 segundos, usar datos locales
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Load timeout')), 10000)
      );
      
      const dataPromise = Promise.all([
        syncSubscriptions.getAll(),
        syncActivities.getAll(),
        syncPasswords.getAll()
      ]);
      
      let [subsData, activitiesData, passwordsData] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]);
      
      // Verificar y actualizar fechas de pago que hayan pasado
      const updatedSubs = checkAndUpdateSubscriptions(subsData);
      
      // Si hubo cambios, guardar las suscripciones actualizadas
      const hasChanges = updatedSubs.some((sub, index) => 
        sub.nextPayment !== subsData[index].nextPayment
      );
      
      if (hasChanges) {
        console.log('Updating subscriptions with new payment dates');
        // Guardar cada suscripción actualizada
        for (const sub of updatedSubs) {
          if (sub.nextPayment !== subsData.find(s => s.id === sub.id)?.nextPayment) {
            await syncSubscriptions.update(sub.id, sub);
          }
        }
        subsData = updatedSubs;
      }
      
      setSubscriptions(subsData);
      setActivities(activitiesData);
      setPasswords(passwordsData);
      
      // Programar notificaciones para suscripciones
      if (Capacitor.isNativePlatform()) {
        await scheduleAllSubscriptionReminders(subsData);
      }
      
      console.log('loadData: Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      // Si falla, cargar datos locales
      try {
        const [subsData, activitiesData, passwordsData] = await Promise.all([
          subscriptionsStorage.getAll(),
          activitiesStorage.getAll(),
          passwordsStorage.getAll()
        ]);
        
        setSubscriptions(subsData);
        setActivities(activitiesData);
        setPasswords(passwordsData);
      } catch (localError) {
        console.error('Error loading local data:', localError);
        // Si todo falla, establecer arrays vacíos
        setSubscriptions([]);
        setActivities([]);
        setPasswords([]);
      }
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
      console.log('loadData: Finished');
    }
  };

  const loadLocalData = async () => {
    try {
      // Solo mostrar loading screen si es la carga inicial
      if (!initialLoadComplete) {
        setLoading(true);
      }
      console.log('loadLocalData: Starting to load local data');
      
      // Inicializar con datos de ejemplo si es la primera vez
      await storageUtils.seedData();
      
      // Cargar datos del almacenamiento local
      let [subsData, activitiesData, passwordsData] = await Promise.all([
        subscriptionsStorage.getAll(),
        activitiesStorage.getAll(),
        passwordsStorage.getAll()
      ]);
      
      // Verificar y actualizar fechas de pago que hayan pasado
      const updatedSubs = checkAndUpdateSubscriptions(subsData);
      
      // Si hubo cambios, guardar las suscripciones actualizadas
      const hasChanges = updatedSubs.some((sub, index) => 
        sub.nextPayment !== subsData[index].nextPayment
      );
      
      if (hasChanges) {
        console.log('Updating local subscriptions with new payment dates');
        // Guardar cada suscripción actualizada
        for (const sub of updatedSubs) {
          if (sub.nextPayment !== subsData.find(s => s.id === sub.id)?.nextPayment) {
            await subscriptionsStorage.update(sub.id, sub);
          }
        }
        subsData = updatedSubs;
      }
      
      setSubscriptions(subsData);
      setActivities(activitiesData);
      setPasswords(passwordsData);
      
      // Programar notificaciones para suscripciones
      if (Capacitor.isNativePlatform()) {
        await scheduleAllSubscriptionReminders(subsData);
      }
      
      console.log('loadLocalData: Local data loaded successfully');
    } catch (error) {
      console.error('Error loading local data:', error);
      // Si falla, establecer arrays vacíos
      setSubscriptions([]);
      setActivities([]);
      setPasswords([]);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
      console.log('loadLocalData: Finished');
    }
  };

  const contextValue = {
    subscriptions, setSubscriptions,
    activities, setActivities,
    passwords, setPasswords,
    user, setUser, loading,
    refreshData: loadData,
    checkAuth // Agregar checkAuth al contexto
  };

  if (!authChecked || (loading && !initialLoadComplete)) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bg-tertiary border-t-accent-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-tertiary">Cargando Planify...</p>
        </div>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <AppContext.Provider value={contextValue}>
        <Router>
          <AppLayout>
            <div className="min-h-screen bg-bg-primary md:bg-bg-secondary" style={{ overscrollBehavior: 'none' }}>
              {/* Desktop Sidebar - Hide on auth pages */}
              <DesktopSidebar />

              {/* Main Content */}
              <div className="md:ml-64 min-h-screen">
                <main className="pb-20 md:pb-8">
                  <Routes>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={isFirstTime ? <Navigate to="/welcome" replace /> : <Home />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/vault" element={<Vault />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </div>
          </AppLayout>
        </Router>
      </AppContext.Provider>
    </SettingsProvider>
  );
}

// Componente Sidebar separado
function DesktopSidebar() {
  const location = useLocation();
  const hideOnPages = ['/login', '/register', '/welcome'];
  
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-bg-card border-r border-white/5 flex-col p-4 z-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-accent-gradient bg-clip-text text-transparent">Planify</h1>
        <p className="text-xs text-text-tertiary mt-1">Smart Manager</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive ? 'bg-accent-gradient text-white' : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
          }`}
        >
          <HomeIcon size={20} />
          <span className="font-medium">Home</span>
        </NavLink>
        
        <NavLink
          to="/planner"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive ? 'bg-accent-gradient text-white' : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
          }`}
        >
          <Calendar size={20} />
          <span className="font-medium">Planner</span>
        </NavLink>
        
        <NavLink
          to="/subscriptions"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive ? 'bg-accent-gradient text-white' : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
          }`}
        >
          <CreditCard size={20} />
          <span className="font-medium">Subscriptions</span>
        </NavLink>
        
        <NavLink
          to="/vault"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive ? 'bg-accent-gradient text-white' : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
          }`}
        >
          <Lock size={20} />
          <span className="font-medium">Vault</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default App;
