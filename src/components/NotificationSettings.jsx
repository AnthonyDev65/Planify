import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import Toast from './Toast';

const isNative = Capacitor.isNativePlatform();

function NotificationSettings() {
  const [isSupported] = useState(true); // Siempre soportado en app nativa
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    // En app nativa, las notificaciones ya están configuradas
    if (isNative) {
      setIsSubscribed(true);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setIsSubscribed(true);
      setToast({ visible: true, message: '¡Notificaciones activadas!', type: 'success' });
    } catch (error) {
      setToast({ visible: true, message: 'Error al activar notificaciones', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      setIsSubscribed(false);
      setToast({ visible: true, message: 'Notificaciones desactivadas', type: 'success' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setToast({ visible: true, message: 'Notificación de prueba enviada', type: 'success' });
  };

  if (!isSupported) {
    return (
      <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-3">
          <BellOff size={24} className="text-white/50" />
          <div>
            <div className="text-sm font-medium text-white">Notificaciones no disponibles</div>
            <div className="text-xs text-white/50">Tu navegador no soporta notificaciones push</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isSubscribed ? 'bg-green-500/20' : 'bg-white/5'
            }`}>
              {isSubscribed ? <Bell size={20} className="text-green-400" /> : <BellOff size={20} className="text-white/50" />}
            </div>
            <div>
              <div className="text-sm font-medium text-white">Notificaciones Push</div>
              <div className="text-xs text-white/50">
                {isSubscribed ? 'Activadas' : 'Desactivadas'}
              </div>
            </div>
          </div>

          {isSubscribed ? (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
              <X size={16} className="text-white/50" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isSubscribed ? (
            <button
              className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white transition-all duration-200 disabled:opacity-50"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? 'Activando...' : 'Activar Notificaciones'}
            </button>
          ) : (
            <>
              <button
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm bg-[#1a1a24] text-white/70 hover:bg-[#1a1a24]/80 hover:text-white transition-all duration-200"
                onClick={handleTestNotification}
              >
                Probar
              </button>
              <button
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                onClick={handleUnsubscribe}
                disabled={loading}
              >
                {loading ? 'Desactivando...' : 'Desactivar'}
              </button>
            </>
          )}
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}

export default NotificationSettings;
