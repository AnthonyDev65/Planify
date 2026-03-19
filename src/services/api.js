import { Capacitor } from '@capacitor/core';

// Detectar si estamos en una plataforma nativa
const isNative = Capacitor.isNativePlatform();

// En Android, usar 10.0.2.2 para emulador o la IP de tu red local para dispositivo real
// Para dispositivo real, necesitas cambiar esto por tu IP local (ejemplo: 192.168.1.100)
const getApiUrl = () => {
  if (isNative) {
    // Intenta primero con la variable de entorno
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes('localhost')) {
      return envUrl;
    }
    
    // Si no hay variable de entorno o usa localhost, usa 10.0.2.2 para emulador
    // IMPORTANTE: Si usas dispositivo real, cambia esto por tu IP local
    return 'http://10.0.2.2:3001/api';
  }
  
  // En navegador web, usa localhost o la variable de entorno
  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

console.log('API URL:', API_URL, 'isNative:', isNative);

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// ============ SUBSCRIPTIONS API ============
export const subscriptionsAPI = {
  getAll: () => fetchAPI('/subscriptions'),
  getById: (id) => fetchAPI(`/subscriptions/${id}`),
  create: (data) => fetchAPI('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/subscriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/subscriptions/${id}`, {
    method: 'DELETE',
  }),
};

// ============ ACTIVITIES API ============
export const activitiesAPI = {
  getAll: () => fetchAPI('/activities'),
  getByDate: (date) => fetchAPI(`/activities?date=${date}`),
  getById: (id) => fetchAPI(`/activities/${id}`),
  create: (data) => fetchAPI('/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/activities/${id}`, {
    method: 'DELETE',
  }),
};

// ============ PASSWORDS API ============
export const passwordsAPI = {
  getAll: () => fetchAPI('/passwords'),
  getById: (id) => fetchAPI(`/passwords/${id}`),
  create: (data) => fetchAPI('/passwords', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/passwords/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/passwords/${id}`, {
    method: 'DELETE',
  }),
};

// ============ NOTIFICATIONS API ============
export const notificationsAPI = {
  getVapidPublicKey: () => fetchAPI('/notifications/vapid-public-key'),
  subscribe: (subscription) => fetchAPI('/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
  }),
  unsubscribe: (endpoint) => fetchAPI('/notifications/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ endpoint }),
  }),
  sendTest: () => fetchAPI('/notifications/test', {
    method: 'POST',
  }),
};

export default {
  subscriptionsAPI,
  activitiesAPI,
  passwordsAPI,
  notificationsAPI,
};
