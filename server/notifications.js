import webpush from 'web-push';
import { pushSubscriptionsDB } from './database.js';

// VAPID keys - En producción, estas deben estar en variables de entorno
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDCoXjbK-6N3v_rtBUYXRGrRTv-kV0ihTMrlqvV0erXI';
const VAPID_PRIVATE_KEY = 'UUxI4O8-FbRouAevSmBQ6o7GnywL0u-GCU1fLYZqYYM';

webpush.setVapidDetails(
  'mailto:planify@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

export async function sendNotification(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    
    // Si el endpoint ya no es válido, eliminarlo
    if (error.statusCode === 410) {
      pushSubscriptionsDB.delete(subscription.endpoint);
    }
    
    return { success: false, error: error.message };
  }
}

export async function sendNotificationToAll(payload) {
  const subscriptions = pushSubscriptionsDB.getAll();
  const results = [];

  for (const sub of subscriptions) {
    const subscription = {
      endpoint: sub.endpoint,
      keys: JSON.parse(sub.keys)
    };
    
    const result = await sendNotification(subscription, payload);
    results.push(result);
  }

  return results;
}

// Función para enviar recordatorios de actividades
export async function sendActivityReminder(activity) {
  const payload = {
    title: '⏰ Recordatorio de Actividad',
    body: `${activity.title} - ${activity.time}`,
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: `activity-${activity.id}`,
    data: {
      type: 'activity',
      id: activity.id,
      url: '/planner'
    }
  };

  return await sendNotificationToAll(payload);
}

// Función para enviar recordatorios de pagos
export async function sendPaymentReminder(subscription) {
  const payload = {
    title: '💳 Recordatorio de Pago',
    body: `${subscription.name} - $${subscription.price} vence pronto`,
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: `payment-${subscription.id}`,
    data: {
      type: 'subscription',
      id: subscription.id,
      url: '/subscriptions'
    }
  };

  return await sendNotificationToAll(payload);
}

export default {
  getVapidPublicKey,
  sendNotification,
  sendNotificationToAll,
  sendActivityReminder,
  sendPaymentReminder
};
