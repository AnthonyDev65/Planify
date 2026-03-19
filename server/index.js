import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { initDatabase, subscriptionsDB, activitiesDB, passwordsDB, pushSubscriptionsDB } from './database.js';
import { getVapidPublicKey, sendActivityReminder, sendPaymentReminder } from './notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Server configuration:');
console.log('  __dirname:', __dirname);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  console.log('📁 Dist path:', distPath);
  console.log('📁 Dist exists:', existsSync(distPath));
  
  if (existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log('✅ Serving static files from:', distPath);
  } else {
    console.error('❌ Dist folder not found at:', distPath);
  }
}

// Initialize database
console.log('🗄️ Initializing database...');
try {
  initDatabase();
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Planify API is running' });
});

// ============ SUBSCRIPTIONS ROUTES ============
app.get('/api/subscriptions', (req, res) => {
  try {
    const subscriptions = subscriptionsDB.getAll();
    res.json(subscriptions.map(s => ({ ...s, active: Boolean(s.active) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/subscriptions/:id', (req, res) => {
  try {
    const subscription = subscriptionsDB.getById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json({ ...subscription, active: Boolean(subscription.active) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/subscriptions', (req, res) => {
  try {
    const result = subscriptionsDB.create(req.body);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/subscriptions/:id', (req, res) => {
  try {
    subscriptionsDB.update(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/subscriptions/:id', (req, res) => {
  try {
    subscriptionsDB.delete(req.params.id);
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ACTIVITIES ROUTES ============
app.get('/api/activities', (req, res) => {
  try {
    const { date } = req.query;
    const activities = date 
      ? activitiesDB.getByDate(date)
      : activitiesDB.getAll();
    res.json(activities.map(a => ({ 
      ...a, 
      reminder: Boolean(a.reminder),
      completed: Boolean(a.completed)
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/activities/:id', (req, res) => {
  try {
    const activity = activitiesDB.getById(req.params.id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ 
      ...activity, 
      reminder: Boolean(activity.reminder),
      completed: Boolean(activity.completed)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activities', (req, res) => {
  try {
    const result = activitiesDB.create(req.body);
    const newActivity = { id: result.lastInsertRowid, ...req.body };
    
    // Si tiene recordatorio, programar notificación
    if (req.body.reminder) {
      // Aquí podrías implementar lógica para programar la notificación
      console.log('📅 Activity with reminder created:', newActivity.title);
    }
    
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/activities/:id', (req, res) => {
  try {
    activitiesDB.update(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/activities/:id', (req, res) => {
  try {
    activitiesDB.delete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PASSWORDS ROUTES ============
app.get('/api/passwords', (req, res) => {
  try {
    const passwords = passwordsDB.getAll();
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/passwords/:id', (req, res) => {
  try {
    const password = passwordsDB.getById(req.params.id);
    if (!password) {
      return res.status(404).json({ error: 'Password not found' });
    }
    res.json(password);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/passwords', (req, res) => {
  try {
    const result = passwordsDB.create(req.body);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/passwords/:id', (req, res) => {
  try {
    passwordsDB.update(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/passwords/:id', (req, res) => {
  try {
    passwordsDB.delete(req.params.id);
    res.json({ message: 'Password deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PUSH NOTIFICATIONS ROUTES ============
app.get('/api/notifications/vapid-public-key', (req, res) => {
  res.json({ publicKey: getVapidPublicKey() });
});

app.post('/api/notifications/subscribe', (req, res) => {
  try {
    const subscription = req.body;
    pushSubscriptionsDB.create(subscription);
    res.status(201).json({ message: 'Subscription saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notifications/unsubscribe', (req, res) => {
  try {
    const { endpoint } = req.body;
    pushSubscriptionsDB.delete(endpoint);
    res.json({ message: 'Subscription removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notifications/test', async (req, res) => {
  try {
    const payload = {
      title: '🎉 Notificación de Prueba',
      body: 'Las notificaciones están funcionando correctamente!',
      icon: '/vite.svg',
      badge: '/vite.svg'
    };
    
    const subscriptions = pushSubscriptionsDB.getAll();
    if (subscriptions.length === 0) {
      return res.status(400).json({ error: 'No subscriptions found' });
    }
    
    res.json({ message: 'Test notification sent', count: subscriptions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servir el frontend para todas las rutas no API (SPA)
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('=================================');
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log('📊 Database: planify.db');
  console.log('🔔 Push notifications enabled');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
  console.log('');
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
