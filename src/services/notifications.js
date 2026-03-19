import { notificationsAPI } from './api';

let swRegistration = null;

// Función para convertir VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Registrar Service Worker
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    swRegistration = registration;
    console.log('✅ Service Worker registered');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Verificar si las notificaciones están soportadas
export function isNotificationSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

// Verificar el estado del permiso de notificaciones
export function getNotificationPermission() {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Solicitar permiso para notificaciones
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    throw new Error('Notifications not supported');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

// Suscribirse a notificaciones push
export async function subscribeToPushNotifications() {
  try {
    // Asegurarse de que el Service Worker está registrado
    if (!swRegistration) {
      swRegistration = await registerServiceWorker();
    }

    if (!swRegistration) {
      throw new Error('Service Worker not available');
    }

    // Solicitar permiso
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // Obtener la clave pública VAPID
    const { publicKey } = await notificationsAPI.getVapidPublicKey();
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    // Suscribirse a push notifications
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });

    // Guardar la suscripción en el servidor
    await notificationsAPI.subscribe(subscription.toJSON());

    console.log('✅ Push notification subscription successful');
    return subscription;
  } catch (error) {
    console.error('Push notification subscription failed:', error);
    throw error;
  }
}

// Desuscribirse de notificaciones push
export async function unsubscribeFromPushNotifications() {
  try {
    if (!swRegistration) {
      return;
    }

    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      await notificationsAPI.unsubscribe(subscription.endpoint);
      await subscription.unsubscribe();
      console.log('✅ Push notification unsubscription successful');
    }
  } catch (error) {
    console.error('Push notification unsubscription failed:', error);
    throw error;
  }
}

// Verificar si está suscrito
export async function isPushSubscribed() {
  try {
    if (!swRegistration) {
      swRegistration = await navigator.serviceWorker.getRegistration();
    }

    if (!swRegistration) {
      return false;
    }

    const subscription = await swRegistration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

// Enviar notificación de prueba
export async function sendTestNotification() {
  try {
    await notificationsAPI.sendTest();
    console.log('✅ Test notification sent');
  } catch (error) {
    console.error('Test notification failed:', error);
    throw error;
  }
}

// Mostrar notificación local (sin push)
export function showLocalNotification(title, options = {}) {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    });
  }
}

export default {
  registerServiceWorker,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isPushSubscribed,
  sendTestNotification,
  showLocalNotification
};
