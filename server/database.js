import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'planify.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
export function initDatabase() {
  // Subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo TEXT,
      color TEXT,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      period TEXT NOT NULL,
      nextPayment TEXT NOT NULL,
      category TEXT,
      active INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Activities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      reminder INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Passwords table (encrypted)
  db.exec(`
    CREATE TABLE IF NOT EXISTS passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      url TEXT,
      notes TEXT,
      strength TEXT,
      favicon TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Push subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT UNIQUE NOT NULL,
      keys TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database initialized');
}

// Subscriptions queries
export const subscriptionsDB = {
  getAll: () => db.prepare('SELECT * FROM subscriptions ORDER BY nextPayment').all(),
  getById: (id) => db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id),
  create: (data) => {
    const stmt = db.prepare(`
      INSERT INTO subscriptions (name, logo, color, price, currency, period, nextPayment, category, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(data.name, data.logo, data.color, data.price, data.currency, data.period, data.nextPayment, data.category, data.active ? 1 : 0);
  },
  update: (id, data) => {
    const stmt = db.prepare(`
      UPDATE subscriptions 
      SET name = ?, logo = ?, color = ?, price = ?, currency = ?, period = ?, nextPayment = ?, category = ?, active = ?
      WHERE id = ?
    `);
    return stmt.run(data.name, data.logo, data.color, data.price, data.currency, data.period, data.nextPayment, data.category, data.active ? 1 : 0, id);
  },
  delete: (id) => db.prepare('DELETE FROM subscriptions WHERE id = ?').run(id)
};

// Activities queries
export const activitiesDB = {
  getAll: () => db.prepare('SELECT * FROM activities ORDER BY date, time').all(),
  getById: (id) => db.prepare('SELECT * FROM activities WHERE id = ?').get(id),
  getByDate: (date) => db.prepare('SELECT * FROM activities WHERE date = ? ORDER BY time').all(date),
  create: (data) => {
    const stmt = db.prepare(`
      INSERT INTO activities (title, description, date, time, priority, reminder, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(data.title, data.description, data.date, data.time, data.priority, data.reminder ? 1 : 0, 0);
  },
  update: (id, data) => {
    const stmt = db.prepare(`
      UPDATE activities 
      SET title = ?, description = ?, date = ?, time = ?, priority = ?, reminder = ?, completed = ?
      WHERE id = ?
    `);
    return stmt.run(data.title, data.description, data.date, data.time, data.priority, data.reminder ? 1 : 0, data.completed ? 1 : 0, id);
  },
  delete: (id) => db.prepare('DELETE FROM activities WHERE id = ?').run(id)
};

// Passwords queries
export const passwordsDB = {
  getAll: () => db.prepare('SELECT * FROM passwords ORDER BY name').all(),
  getById: (id) => db.prepare('SELECT * FROM passwords WHERE id = ?').get(id),
  create: (data) => {
    const stmt = db.prepare(`
      INSERT INTO passwords (name, username, password, url, notes, strength, favicon)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(data.name, data.username, data.password, data.url, data.notes, data.strength, data.favicon);
  },
  update: (id, data) => {
    const stmt = db.prepare(`
      UPDATE passwords 
      SET name = ?, username = ?, password = ?, url = ?, notes = ?, strength = ?, favicon = ?
      WHERE id = ?
    `);
    return stmt.run(data.name, data.username, data.password, data.url, data.notes, data.strength, data.favicon, id);
  },
  delete: (id) => db.prepare('DELETE FROM passwords WHERE id = ?').run(id)
};

// Push subscriptions queries
export const pushSubscriptionsDB = {
  getAll: () => db.prepare('SELECT * FROM push_subscriptions').all(),
  create: (subscription) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO push_subscriptions (endpoint, keys)
      VALUES (?, ?)
    `);
    return stmt.run(subscription.endpoint, JSON.stringify(subscription.keys));
  },
  delete: (endpoint) => db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint)
};

export default db;
