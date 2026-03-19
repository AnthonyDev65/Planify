import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://msfgmjdeklksijxycyha.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zZmdtamRla2xrc2lqeHljeWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5OTY2NTYsImV4cCI6MjA4NTU3MjY1Nn0.V8oIEc0lO59XTufVMZDPq7vJpAERDSjKOEPsuFaI6b4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============ SUBSCRIPTIONS ============
export const supabaseSubscriptions = {
  // Transformar de camelCase a snake_case para Supabase
  toSupabase: (subscription) => ({
    name: subscription.name,
    logo: subscription.logo,
    color: subscription.color,
    price: subscription.price,
    currency: subscription.currency || 'USD',
    period: subscription.period,
    next_payment: subscription.nextPayment,
    category: subscription.category,
    active: subscription.active !== undefined ? subscription.active : true,
  }),

  // Transformar de snake_case a camelCase para la app
  fromSupabase: (subscription) => ({
    id: subscription.id,
    name: subscription.name,
    logo: subscription.logo,
    color: subscription.color,
    price: subscription.price,
    currency: subscription.currency,
    period: subscription.period,
    nextPayment: subscription.next_payment,
    category: subscription.category,
    active: subscription.active,
    createdAt: subscription.created_at,
    updatedAt: subscription.updated_at,
  }),

  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(supabaseSubscriptions.fromSupabase);
  },

  create: async (subscription, userId) => {
    console.log('📤 supabaseSubscriptions.create called');
    console.log('   userId:', userId);
    console.log('   subscription:', JSON.stringify(subscription));
    
    const supabaseData = supabaseSubscriptions.toSupabase(subscription);
    console.log('   transformed:', JSON.stringify(supabaseData));
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{ ...supabaseData, user_id: userId }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase create error:', error.message);
      console.error('   Error code:', error.code);
      console.error('   Error details:', JSON.stringify(error.details));
      throw error;
    }
    console.log('✅ Supabase create success:', JSON.stringify(data));
    return supabaseSubscriptions.fromSupabase(data);
  },

  update: async (id, subscription) => {
    const supabaseData = supabaseSubscriptions.toSupabase(subscription);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .update(supabaseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return supabaseSubscriptions.fromSupabase(data);
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
};

// ============ ACTIVITIES ============
export const supabaseActivities = {
  toSupabase: (activity) => ({
    title: activity.title,
    description: activity.description,
    date: activity.date,
    time: activity.time,
    priority: activity.priority,
    reminder: activity.reminder !== undefined ? activity.reminder : false,
    completed: activity.completed !== undefined ? activity.completed : false,
  }),

  fromSupabase: (activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    date: activity.date,
    time: activity.time,
    priority: activity.priority,
    reminder: activity.reminder,
    completed: activity.completed,
    createdAt: activity.created_at,
    updatedAt: activity.updated_at,
  }),

  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return (data || []).map(supabaseActivities.fromSupabase);
  },

  getByDate: async (userId, date) => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('time', { ascending: true });
    
    if (error) throw error;
    return (data || []).map(supabaseActivities.fromSupabase);
  },

  create: async (activity, userId) => {
    const supabaseData = supabaseActivities.toSupabase(activity);
    
    const { data, error } = await supabase
      .from('activities')
      .insert([{ ...supabaseData, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return supabaseActivities.fromSupabase(data);
  },

  update: async (id, activity) => {
    const supabaseData = supabaseActivities.toSupabase(activity);
    
    const { data, error } = await supabase
      .from('activities')
      .update(supabaseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return supabaseActivities.fromSupabase(data);
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
};

// ============ PASSWORDS ============
export const supabasePasswords = {
  toSupabase: (password) => ({
    name: password.name,
    username: password.username,
    password: password.password,
    url: password.url,
    notes: password.notes,
    strength: password.strength,
    favicon: password.favicon,
  }),

  fromSupabase: (password) => ({
    id: password.id,
    name: password.name,
    username: password.username,
    password: password.password,
    url: password.url,
    notes: password.notes,
    strength: password.strength,
    favicon: password.favicon,
    createdAt: password.created_at,
    updatedAt: password.updated_at,
  }),

  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('passwords')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(supabasePasswords.fromSupabase);
  },

  create: async (password, userId) => {
    const supabaseData = supabasePasswords.toSupabase(password);
    
    const { data, error } = await supabase
      .from('passwords')
      .insert([{ ...supabaseData, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return supabasePasswords.fromSupabase(data);
  },

  update: async (id, password) => {
    const supabaseData = supabasePasswords.toSupabase(password);
    
    const { data, error } = await supabase
      .from('passwords')
      .update(supabaseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return supabasePasswords.fromSupabase(data);
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('passwords')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
};

// ============ AUTH ============
export const supabaseAuth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('getUser error:', error);
        throw error;
      }
      console.log('getUser result:', user ? `${user.email} (${user.id})` : 'null');
      return user;
    } catch (error) {
      console.error('getUser exception:', error);
      return null;
    }
  },

  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ getSession error:', error);
        throw error;
      }
      console.log('🔑 getSession result:', session ? `${session.user.email}` : 'null');
      return session;
    } catch (error) {
      console.error('❌ getSession exception:', error);
      return null;
    }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default {
  supabase,
  supabaseSubscriptions,
  supabaseActivities,
  supabasePasswords,
  supabaseAuth,
};
