import { supabaseSubscriptions, supabaseActivities, supabasePasswords, supabaseAuth } from './supabase';
import { subscriptionsStorage, activitiesStorage, passwordsStorage } from './storage';
import { Capacitor } from '@capacitor/core';

// Verificar si hay conexión a internet
async function isOnline() {
  if (!Capacitor.isNativePlatform()) {
    return navigator.onLine;
  }
  
  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    return true;
  } catch {
    return false;
  }
}

// Verificar si el usuario está autenticado
async function isAuthenticated() {
  try {
    const session = await supabaseAuth.getSession();
    const isAuth = !!(session && session.user);
    console.log('🔐 isAuthenticated:', isAuth, session?.user?.email || 'no session');
    return isAuth;
  } catch (error) {
    console.error('❌ isAuthenticated error:', error);
    return false;
  }
}

// Decidir si usar Supabase o almacenamiento local
async function shouldUseSupabase() {
  const online = await isOnline();
  const authenticated = await isAuthenticated();
  console.log('🌐 shouldUseSupabase - online:', online, 'authenticated:', authenticated);
  return online && authenticated;
}

// ============ SUBSCRIPTIONS ============
export const syncSubscriptions = {
  getAll: async () => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const session = await supabaseAuth.getSession();
        if (!session || !session.user) {
          console.log('No session found, using local storage');
          return await subscriptionsStorage.getAll();
        }
        
        const data = await supabaseSubscriptions.getAll(session.user.id);
        // Guardar en local como backup
        await subscriptionsStorage.syncFromCloud(data);
        return data;
      } catch (error) {
        console.error('Error fetching from Supabase, using local:', error);
        return await subscriptionsStorage.getAll();
      }
    }
    
    return await subscriptionsStorage.getAll();
  },

  create: async (data) => {
    const useSupabase = await shouldUseSupabase();
    console.log('=== SYNC CREATE START ===');
    console.log('useSupabase:', useSupabase);
    
    if (useSupabase) {
      try {
        const session = await supabaseAuth.getSession();
        console.log('Session:', session ? 'EXISTS' : 'NULL');
        console.log('User:', session?.user?.email || 'NO USER');
        
        if (!session || !session.user) {
          console.log('❌ No session found, saving locally only');
          return await subscriptionsStorage.create({ ...data, synced: false });
        }
        
        console.log('✅ Creating subscription in Supabase for user:', session.user.id);
        const created = await supabaseSubscriptions.create(data, session.user.id);
        console.log('✅ Subscription created in Supabase:', JSON.stringify(created));
        
        // Guardar en local como backup
        await subscriptionsStorage.create({ ...created, synced: true });
        return created;
      } catch (error) {
        console.error('❌ Error creating in Supabase:', error.message);
        console.error('Error details:', JSON.stringify(error));
        return await subscriptionsStorage.create({ ...data, synced: false });
      }
    }
    
    console.log('💾 Saving subscription locally (not authenticated)');
    return await subscriptionsStorage.create({ ...data, synced: false });
  },

  update: async (id, data) => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const session = await supabaseAuth.getSession();
        if (!session || !session.user) {
          console.log('No session found, updating locally only');
          return await subscriptionsStorage.update(id, { ...data, synced: false });
        }
        
        const updated = await supabaseSubscriptions.update(id, data);
        await subscriptionsStorage.update(id, { ...updated, synced: true });
        return updated;
      } catch (error) {
        console.error('Error updating in Supabase, saving locally:', error);
        return await subscriptionsStorage.update(id, { ...data, synced: false });
      }
    }
    
    return await subscriptionsStorage.update(id, { ...data, synced: false });
  },

  delete: async (id) => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const session = await supabaseAuth.getSession();
        if (session && session.user) {
          await supabaseSubscriptions.delete(id);
        }
        await subscriptionsStorage.delete(id);
        return true;
      } catch (error) {
        console.error('Error deleting in Supabase, deleting locally:', error);
        return await subscriptionsStorage.delete(id);
      }
    }
    
    return await subscriptionsStorage.delete(id);
  },
};

// ============ ACTIVITIES ============
export const syncActivities = {
  getAll: async () => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const user = await supabaseAuth.getUser();
        const data = await supabaseActivities.getAll(user.id);
        return data;
      } catch (error) {
        console.error('Error fetching from Supabase, using local:', error);
        return await activitiesStorage.getAll();
      }
    }
    
    return await activitiesStorage.getAll();
  },

  create: async (data) => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const user = await supabaseAuth.getUser();
        const created = await supabaseActivities.create(data, user.id);
        await activitiesStorage.create({ ...created, synced: true });
        return created;
      } catch (error) {
        console.error('Error creating in Supabase, saving locally:', error);
        return await activitiesStorage.create({ ...data, synced: false });
      }
    }
    
    return await activitiesStorage.create({ ...data, synced: false });
  },

  update: async (id, data) => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const updated = await supabaseActivities.update(id, data);
        await activitiesStorage.update(id, { ...updated, synced: true });
        return updated;
      } catch (error) {
        console.error('Error updating in Supabase, saving locally:', error);
        return await activitiesStorage.update(id, { ...data, synced: false });
      }
    }
    
    return await activitiesStorage.update(id, { ...data, synced: false });
  },

  delete: async (id) => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        await supabaseActivities.delete(id);
        await activitiesStorage.delete(id);
        return true;
      } catch (error) {
        console.error('Error deleting in Supabase, deleting locally:', error);
        return await activitiesStorage.delete(id);
      }
    }
    
    return await activitiesStorage.delete(id);
  },
};

// ============ PASSWORDS ============
export const syncPasswords = {
  getAll: async () => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const user = await supabaseAuth.getUser();
        const data = await supabasePasswords.getAll(user.id);
        return data;
      } catch (error) {
        console.error('Error fetching from Supabase, using local:', error);
        return await passwordsStorage.getAll();
      }
    }
    
    return await passwordsStorage.getAll();
  },

  create: async (data) => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const user = await supabaseAuth.getUser();
        const created = await supabasePasswords.create(data, user.id);
        await passwordsStorage.create({ ...created, synced: true });
        return created;
      } catch (error) {
        console.error('Error creating in Supabase, saving locally:', error);
        return await passwordsStorage.create({ ...data, synced: false });
      }
    }
    
    return await passwordsStorage.create({ ...data, synced: false });
  },

  update: async (id, data) => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        const updated = await supabasePasswords.update(id, data);
        await passwordsStorage.update(id, { ...updated, synced: true });
        return updated;
      } catch (error) {
        console.error('Error updating in Supabase, saving locally:', error);
        return await passwordsStorage.update(id, { ...data, synced: false });
      }
    }
    
    return await passwordsStorage.update(id, { ...data, synced: false });
  },

  delete: async (id) => {
    const useSupabase = await shouldUseSupabase();
    
    if (useSupabase) {
      try {
        await supabasePasswords.delete(id);
        await passwordsStorage.delete(id);
        return true;
      } catch (error) {
        console.error('Error deleting in Supabase, deleting locally:', error);
        return await passwordsStorage.delete(id);
      }
    }
    
    return await passwordsStorage.delete(id);
  },
};

export default {
  syncSubscriptions,
  syncActivities,
  syncPasswords,
  isOnline,
  isAuthenticated,
  shouldUseSupabase,
};
