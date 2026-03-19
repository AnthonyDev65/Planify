import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

// Inicializar y pedir permisos
export async function initializeNotifications() {
  if (!isNative) {
    console.log('Local notifications only work on native platforms');
    return false;
  }

  try {
    // Pedir permisos
    const permission = await LocalNotifications.requestPermissions();
    
    if (permission.display === 'granted') {
      console.log('✅ Notification permissions granted');
      
      // Crear canal de notificaciones para Android
      if (Capacitor.getPlatform() === 'android') {
        await LocalNotifications.createChannel({
          id: 'subscriptions',
          name: 'Recordatorios de Suscripciones',
          description: 'Notificaciones de próximos pagos de suscripciones',
          importance: 5, // Max importance para que aparezca incluso con app cerrada
          visibility: 1, // Public
          sound: 'default',
          vibration: true,
          lights: true,
          lightColor: '#8b5cf6',
        });
        
        console.log('✅ Notification channel created');
      }
      
      return true;
    } else {
      console.log('❌ Notification permissions denied');
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing notifications:', error);
    return false;
  }
}

// Programar notificación para una suscripción
export async function scheduleSubscriptionReminder(subscription) {
  if (!isNative) return;

  try {
    const nextPaymentDate = new Date(subscription.nextPayment);
    const oneDayBefore = new Date(nextPaymentDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    oneDayBefore.setHours(9, 0, 0, 0); // 9:00 AM

    // Solo programar si la fecha es futura
    if (oneDayBefore > new Date()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: parseInt(subscription.id.replace(/[^0-9]/g, '').slice(0, 9)) || Math.floor(Math.random() * 1000000),
            title: '💳 Recordatorio de Pago',
            body: `Mañana se cobra ${subscription.name}: $${subscription.price}`,
            schedule: {
              at: oneDayBefore,
              allowWhileIdle: true,
            },
            sound: 'default',
            channelId: 'subscriptions',
            extra: {
              subscriptionId: subscription.id,
              type: 'subscription_reminder',
            },
          },
        ],
      });

      console.log(`Notification scheduled for ${subscription.name} at ${oneDayBefore}`);
      return true;
    }
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
}

// Programar notificaciones para todas las suscripciones activas
export async function scheduleAllSubscriptionReminders(subscriptions) {
  if (!isNative) return;

  try {
    // Cancelar todas las notificaciones existentes
    await LocalNotifications.cancel({ notifications: [] });

    // Programar nuevas notificaciones
    const activeSubscriptions = subscriptions.filter(s => s.active);
    
    for (const subscription of activeSubscriptions) {
      await scheduleSubscriptionReminder(subscription);
    }

    console.log(`Scheduled ${activeSubscriptions.length} subscription reminders`);
    return true;
  } catch (error) {
    console.error('Error scheduling all notifications:', error);
    return false;
  }
}

// Cancelar notificación de una suscripción
export async function cancelSubscriptionReminder(subscriptionId) {
  if (!isNative) return;

  try {
    const notificationId = parseInt(subscriptionId.replace(/[^0-9]/g, '').slice(0, 9)) || 0;
    
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }],
    });

    console.log(`Notification cancelled for subscription ${subscriptionId}`);
    return true;
  } catch (error) {
    console.error('Error cancelling notification:', error);
    return false;
  }
}

// Obtener notificaciones pendientes
export async function getPendingNotifications() {
  if (!isNative) return [];

  try {
    const { notifications } = await LocalNotifications.getPending();
    return notifications;
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
}

// Manejar cuando se toca una notificación
export function addNotificationListener(callback) {
  if (!isNative) return;

  LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
    console.log('Notification tapped:', notification);
    if (callback) callback(notification);
  });
}

// Programar notificación de prueba
export async function scheduleTestNotification() {
  if (!isNative) return;

  try {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 5); // 5 segundos desde ahora

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999999,
          title: '🎉 Notificación de Prueba',
          body: 'Las notificaciones están funcionando correctamente!',
          schedule: {
            at: now,
            allowWhileIdle: true,
          },
          sound: 'default',
          channelId: 'subscriptions',
        },
      ],
    });

    console.log('Test notification scheduled for 5 seconds from now');
    return true;
  } catch (error) {
    console.error('Error scheduling test notification:', error);
    return false;
  }
}

// Enviar notificación de debug inmediata (simula recordatorio de pago)
export async function sendDebugPaymentNotification(subscription) {
  if (!isNative) {
    console.log('Debug notifications only work on native platforms');
    return false;
  }

  try {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 2); // 2 segundos desde ahora

    const subName = subscription?.name || 'Netflix';
    const subPrice = subscription?.price || '$9.99';

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 888888,
          title: '💳 Recordatorio de Pago',
          body: `Mañana se cobra ${subName}: ${subPrice}`,
          schedule: {
            at: now,
            allowWhileIdle: true,
          },
          sound: 'default',
          channelId: 'subscriptions',
          extra: {
            subscriptionId: subscription?.id || 'debug',
            type: 'subscription_reminder',
          },
        },
      ],
    });

    console.log('Debug payment notification scheduled for 2 seconds from now');
    return true;
  } catch (error) {
    console.error('Error sending debug notification:', error);
    return false;
  }
}

// Verificar días hasta el próximo pago
export function getDaysUntilPayment(nextPaymentDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const paymentDate = new Date(nextPaymentDate);
  paymentDate.setHours(0, 0, 0, 0);
  
  const diffTime = paymentDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Verificar si una suscripción necesita notificación
export function needsNotification(subscription) {
  if (!subscription.active) return false;
  
  const daysUntil = getDaysUntilPayment(subscription.nextPayment);
  return daysUntil === 1; // Notificar 1 día antes
}

export default {
  initializeNotifications,
  scheduleSubscriptionReminder,
  scheduleAllSubscriptionReminders,
  cancelSubscriptionReminder,
  getPendingNotifications,
  addNotificationListener,
  scheduleTestNotification,
  sendDebugPaymentNotification,
  getDaysUntilPayment,
  needsNotification,
};
