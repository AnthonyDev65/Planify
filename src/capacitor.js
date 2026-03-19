import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

// Verificar si estamos en una plataforma nativa
export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

// Inicializar Capacitor
export async function initializeCapacitor() {
  console.log('Initializing Capacitor...');
  
  if (!isNative) {
    console.log('Running in browser');
    return;
  }

  console.log(`Running on ${platform}`);

  // Ocultar SplashScreen después de que la app cargue
  try {
    setTimeout(async () => {
      await SplashScreen.hide();
      console.log('SplashScreen hidden');
    }, 100);
  } catch (error) {
    console.error('SplashScreen error:', error);
  }
}

export default {
  initializeCapacitor,
  isNative,
  platform
};
