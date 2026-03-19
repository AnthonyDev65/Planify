import { Preferences } from '@capacitor/preferences';

// Almacenamiento local usando Capacitor Preferences
// Funciona en web (localStorage) y nativo (SharedPreferences/UserDefaults)

const KEYS = {
  SUBSCRIPTIONS: 'planify_subscriptions',
  ACTIVITIES: 'planify_activities',
  PASSWORDS: 'planify_passwords',
};

// Helper para obtener datos
async function getData(key) {
  try {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return [];
  }
}

// Helper para guardar datos
async function setData(key, data) {
  try {
    await Preferences.set({
      key,
      value: JSON.stringify(data),
    });
    return true;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    return false;
  }
}

// Generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============ SUBSCRIPTIONS STORAGE ============
export const subscriptionsStorage = {
  getAll: async () => {
    return await getData(KEYS.SUBSCRIPTIONS);
  },

  getById: async (id) => {
    const items = await getData(KEYS.SUBSCRIPTIONS);
    return items.find(item => item.id === id);
  },

  create: async (data) => {
    const items = await getData(KEYS.SUBSCRIPTIONS);
    const newItem = {
      id: data.id || generateId(),
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    items.push(newItem);
    await setData(KEYS.SUBSCRIPTIONS, items);
    return newItem;
  },

  update: async (id, data) => {
    const items = await getData(KEYS.SUBSCRIPTIONS);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Subscription not found');
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await setData(KEYS.SUBSCRIPTIONS, items);
    return items[index];
  },

  delete: async (id) => {
    const items = await getData(KEYS.SUBSCRIPTIONS);
    const filtered = items.filter(item => item.id !== id);
    await setData(KEYS.SUBSCRIPTIONS, filtered);
    return true;
  },

  syncFromCloud: async (cloudData) => {
    await setData(KEYS.SUBSCRIPTIONS, cloudData);
    return true;
  },
};

// ============ ACTIVITIES STORAGE ============
export const activitiesStorage = {
  getAll: async () => {
    return await getData(KEYS.ACTIVITIES);
  },

  getByDate: async (date) => {
    const items = await getData(KEYS.ACTIVITIES);
    return items.filter(item => item.date === date);
  },

  getById: async (id) => {
    const items = await getData(KEYS.ACTIVITIES);
    return items.find(item => item.id === id);
  },

  create: async (data) => {
    const items = await getData(KEYS.ACTIVITIES);
    const newItem = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    await setData(KEYS.ACTIVITIES, items);
    return newItem;
  },

  update: async (id, data) => {
    const items = await getData(KEYS.ACTIVITIES);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Activity not found');
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await setData(KEYS.ACTIVITIES, items);
    return items[index];
  },

  delete: async (id) => {
    const items = await getData(KEYS.ACTIVITIES);
    const filtered = items.filter(item => item.id !== id);
    await setData(KEYS.ACTIVITIES, filtered);
    return true;
  },
};

// ============ PASSWORDS STORAGE ============
export const passwordsStorage = {
  getAll: async () => {
    return await getData(KEYS.PASSWORDS);
  },

  getById: async (id) => {
    const items = await getData(KEYS.PASSWORDS);
    return items.find(item => item.id === id);
  },

  create: async (data) => {
    const items = await getData(KEYS.PASSWORDS);
    const newItem = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    await setData(KEYS.PASSWORDS, items);
    return newItem;
  },

  update: async (id, data) => {
    const items = await getData(KEYS.PASSWORDS);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Password not found');
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await setData(KEYS.PASSWORDS, items);
    return items[index];
  },

  delete: async (id) => {
    const items = await getData(KEYS.PASSWORDS);
    const filtered = items.filter(item => item.id !== id);
    await setData(KEYS.PASSWORDS, filtered);
    return true;
  },
};

// ============ UTILITY FUNCTIONS ============
export const storageUtils = {
  // Limpiar todos los datos
  clearAll: async () => {
    await Preferences.clear();
  },

  // Exportar todos los datos
  exportData: async () => {
    const subscriptions = await getData(KEYS.SUBSCRIPTIONS);
    const activities = await getData(KEYS.ACTIVITIES);
    const passwords = await getData(KEYS.PASSWORDS);
    
    return {
      subscriptions,
      activities,
      passwords,
      exportedAt: new Date().toISOString(),
    };
  },

  // Importar datos
  importData: async (data) => {
    if (data.subscriptions) await setData(KEYS.SUBSCRIPTIONS, data.subscriptions);
    if (data.activities) await setData(KEYS.ACTIVITIES, data.activities);
    if (data.passwords) await setData(KEYS.PASSWORDS, data.passwords);
    return true;
  },

  // Inicializar con datos de ejemplo (deshabilitado)
  seedData: async () => {
    // No cargar datos de ejemplo
    // Los usuarios empezarán con la app vacía
    return true;
  },
};

export default {
  subscriptionsStorage,
  activitiesStorage,
  passwordsStorage,
  storageUtils,
};
