export const translations = {
    es: {
        // Navigation
        home: 'Inicio',
        planner: 'Planificador',
        subscriptions: 'Suscripciones',
        vault: 'Bóveda',
        settings: 'Configuración',
        
        // Header
        search: 'Buscar...',
        synced: 'Sincronizado',
        localOnly: 'Solo local',
        guest: 'Invitado',
        signOut: 'Cerrar sesión',
        signInToSync: 'Iniciar sesión para sincronizar',
        
        // Home
        welcome: 'Bienvenido',
        summary: 'Resumen',
        totalSubscriptions: 'Suscripciones totales',
        monthlySpending: 'Gasto mensual',
        monthlyExpenses: 'Gastos mensuales',
        upcomingPayments: 'Próximos pagos',
        quickActions: 'Acciones rápidas',
        addSubscription: 'Agregar suscripción',
        addActivity: 'Agregar actividad',
        addPassword: 'Agregar contraseña',
        notificationSettings: 'Configuración de notificaciones',
        activeSubscriptions: 'Suscripciones activas',
        schedule: 'Agenda',
        passwords: 'Contraseñas',
        viewAll: 'Ver todo',
        noResults: 'No se encontraron resultados',
        thisMonth: 'Este mes',
        nextPayment: 'Próximo pago',
        daysLeft: 'días restantes',
        noActiveSubscriptions: 'No hay suscripciones activas',
        noUpcomingActivities: 'No hay actividades próximas',
        noPasswordsSaved: 'No hay contraseñas guardadas',
        
        // Subscriptions
        service: 'Servicio',
        price: 'Precio',
        billingCycle: 'Ciclo de facturación',
        nextPayment: 'Próximo pago',
        monthly: 'Mensual',
        yearly: 'Anual',
        weekly: 'Semanal',
        daily: 'Diario',
        save: 'Guardar',
        cancel: 'Cancelar',
        edit: 'Editar',
        delete: 'Eliminar',
        
        // Planner
        title: 'Título',
        date: 'Fecha',
        time: 'Hora',
        description: 'Descripción',
        
        // Vault
        username: 'Usuario',
        password: 'Contraseña',
        website: 'Sitio web',
        notes: 'Notas',
        
        // Settings
        appearance: 'Apariencia',
        light: 'Claro',
        dark: 'Oscuro',
        language: 'Idioma',
        spanish: 'Español',
        english: 'English',
        notifications: 'Notificaciones',
        paymentReminders: 'Recordatorios de pagos',
        notificationDescription: 'Recibe notificaciones 1 día antes del pago',
        version: 'Versión',
        
        // Auth
        email: 'Correo electrónico',
        continueAsGuest: 'Continuar como invitado',
        login: 'Iniciar sesión',
        register: 'Registrarse',
        dontHaveAccount: '¿No tienes cuenta?',
        alreadyHaveAccount: '¿Ya tienes cuenta?',
        
        // Common
        loading: 'Cargando Planify...',
        smartManager: 'Smart Manager',
    },
    en: {
        // Navigation
        home: 'Home',
        planner: 'Planner',
        subscriptions: 'Subscriptions',
        vault: 'Vault',
        settings: 'Settings',
        
        // Header
        search: 'Search...',
        synced: 'Synced',
        localOnly: 'Local only',
        guest: 'Guest',
        signOut: 'Sign Out',
        signInToSync: 'Sign In to Sync',
        
        // Home
        welcome: 'Welcome',
        summary: 'Summary',
        totalSubscriptions: 'Total Subscriptions',
        monthlySpending: 'Monthly Spending',
        monthlyExpenses: 'Monthly Expenses',
        upcomingPayments: 'Upcoming Payments',
        quickActions: 'Quick Actions',
        addSubscription: 'Add Subscription',
        addActivity: 'Add Activity',
        addPassword: 'Add Password',
        notificationSettings: 'Notification Settings',
        activeSubscriptions: 'Active Subscriptions',
        schedule: 'Schedule',
        passwords: 'Passwords',
        viewAll: 'View All',
        noResults: 'No results found',
        thisMonth: 'This month',
        nextPayment: 'Next Payment',
        daysLeft: 'days left',
        noActiveSubscriptions: 'No active subscriptions',
        noUpcomingActivities: 'No upcoming activities',
        noPasswordsSaved: 'No passwords saved',
        
        // Subscriptions
        service: 'Service',
        price: 'Price',
        billingCycle: 'Billing Cycle',
        nextPayment: 'Next Payment',
        monthly: 'Monthly',
        yearly: 'Yearly',
        weekly: 'Weekly',
        daily: 'Daily',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        
        // Planner
        title: 'Title',
        date: 'Date',
        time: 'Time',
        description: 'Description',
        
        // Vault
        username: 'Username',
        password: 'Password',
        website: 'Website',
        notes: 'Notes',
        
        // Settings
        appearance: 'Appearance',
        light: 'Light',
        dark: 'Dark',
        language: 'Language',
        spanish: 'Español',
        english: 'English',
        notifications: 'Notifications',
        paymentReminders: 'Payment Reminders',
        notificationDescription: 'Get notified 1 day before payment',
        version: 'Version',
        
        // Auth
        email: 'Email',
        continueAsGuest: 'Continue as Guest',
        login: 'Login',
        register: 'Register',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        
        // Common
        loading: 'Loading Planify...',
        smartManager: 'Smart Manager',
    }
};

export const t = (key, language = 'es') => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    return value || key;
};
