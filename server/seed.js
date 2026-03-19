import { initDatabase, subscriptionsDB, activitiesDB, passwordsDB } from './database.js';

// Initialize database
initDatabase();

console.log('🌱 Seeding database with sample data...');

// Sample subscriptions
const subscriptions = [
  {
    name: 'Netflix',
    logo: 'N',
    color: '#E50914',
    price: 15.99,
    currency: 'USD',
    period: 'monthly',
    nextPayment: '2026-02-15',
    category: 'Entertainment',
    active: 1
  },
  {
    name: 'Spotify',
    logo: 'S',
    color: '#1DB954',
    price: 9.99,
    currency: 'USD',
    period: 'monthly',
    nextPayment: '2026-02-10',
    category: 'Music',
    active: 1
  },
  {
    name: 'Disney+',
    logo: 'D+',
    color: '#0063e5',
    price: 7.99,
    currency: 'USD',
    period: 'monthly',
    nextPayment: '2026-02-20',
    category: 'Entertainment',
    active: 1
  },
  {
    name: 'iCloud',
    logo: '☁️',
    color: '#3693F3',
    price: 2.99,
    currency: 'USD',
    period: 'monthly',
    nextPayment: '2026-02-05',
    category: 'Cloud',
    active: 1
  }
];

// Sample activities
const activities = [
  {
    title: 'Team Meeting',
    description: 'Weekly sync with the team',
    date: '2026-02-01',
    time: '10:00',
    priority: 'high',
    reminder: 1,
    completed: 0
  },
  {
    title: 'Gym Session',
    description: 'Cardio and weights',
    date: '2026-02-01',
    time: '18:00',
    priority: 'medium',
    reminder: 1,
    completed: 0
  },
  {
    title: 'Read Book',
    description: 'Chapter 5 of Atomic Habits',
    date: '2026-02-01',
    time: '21:00',
    priority: 'low',
    reminder: 0,
    completed: 0
  }
];

// Sample passwords
const passwords = [
  {
    name: 'Google',
    username: 'user@gmail.com',
    password: 'SecurePass123!',
    url: 'https://google.com',
    notes: 'Main account',
    strength: 'strong',
    favicon: '🔵'
  },
  {
    name: 'GitHub',
    username: 'developer123',
    password: 'GitH@bP@ss456',
    url: 'https://github.com',
    notes: 'Work account',
    strength: 'strong',
    favicon: '⚫'
  },
  {
    name: 'Amazon',
    username: 'shopper@email.com',
    password: 'Shop2024!',
    url: 'https://amazon.com',
    notes: 'Shopping account',
    strength: 'medium',
    favicon: '🟠'
  }
];

// Insert data
try {
  subscriptions.forEach(sub => {
    subscriptionsDB.create(sub);
  });
  console.log('✅ Subscriptions seeded');

  activities.forEach(activity => {
    activitiesDB.create(activity);
  });
  console.log('✅ Activities seeded');

  passwords.forEach(password => {
    passwordsDB.create(password);
  });
  console.log('✅ Passwords seeded');

  console.log('🎉 Database seeding completed!');
} catch (error) {
  console.error('❌ Error seeding database:', error);
}
