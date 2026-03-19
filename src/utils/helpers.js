// Format date to readable string
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// Format date to full string
export const formatDateFull = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};

// Format time to 12-hour format
export const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return {
        hour: hour12,
        period,
        formatted: `${hour12}:${String(minutes).padStart(2, '0')} ${period}`
    };
};

// Calculate days until date
export const daysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Generate random password
export const generatePassword = (length = 16, options = {}) => {
    const {
        includeUppercase = true,
        includeLowercase = true,
        includeNumbers = true,
        includeSymbols = true
    } = options;

    let chars = '';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Check password strength
export const checkPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 3) return 'weak';
    if (score <= 5) return 'medium';
    return 'strong';
};

// Get category color
export const getCategoryColor = (category) => {
    const colors = {
        'Entertainment': '#E50914',
        'Music': '#1DB954',
        'Cloud': '#3693F3',
        'Gaming': '#5865F2',
        'Productivity': '#FF6B6B',
        'News': '#1DA1F2',
        'Fitness': '#FC5200',
        'Education': '#FF9500',
        'Other': '#8b5cf6'
    };
    return colors[category] || colors['Other'];
};

// Calculate total monthly expense
export const calculateMonthlyTotal = (subscriptions) => {
    return subscriptions
        .filter(sub => sub.active)
        .reduce((total, sub) => {
            if (sub.period === 'yearly') {
                return total + (sub.price / 12);
            }
            return total + sub.price;
        }, 0);
};

// Get next payment subscription
export const getNextPayment = (subscriptions) => {
    const active = subscriptions.filter(sub => sub.active);
    if (active.length === 0) return null;

    return active.sort((a, b) =>
        new Date(a.nextPayment) - new Date(b.nextPayment)
    )[0];
};

// Group activities by date
export const groupActivitiesByDate = (activities) => {
    return activities.reduce((groups, activity) => {
        const date = activity.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(activity);
        return groups;
    }, {});
};

// Generate unique ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Update subscription next payment date if it has passed
export const updateNextPaymentDate = (subscription) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextPaymentDate = new Date(subscription.nextPayment);
    nextPaymentDate.setHours(0, 0, 0, 0);
    
    // Si la fecha de pago ya pasó, calcular la siguiente
    if (nextPaymentDate < today) {
        const newDate = new Date(nextPaymentDate);
        
        switch (subscription.period) {
            case 'daily':
                // Calcular cuántos días han pasado y agregar
                const daysPassed = Math.ceil((today - nextPaymentDate) / (1000 * 60 * 60 * 24));
                newDate.setDate(newDate.getDate() + daysPassed);
                break;
                
            case 'weekly':
                // Agregar semanas hasta que sea mayor que hoy
                while (newDate < today) {
                    newDate.setDate(newDate.getDate() + 7);
                }
                break;
                
            case 'monthly':
                // Agregar meses hasta que sea mayor que hoy
                while (newDate < today) {
                    newDate.setMonth(newDate.getMonth() + 1);
                }
                break;
                
            case 'yearly':
                // Agregar años hasta que sea mayor que hoy
                while (newDate < today) {
                    newDate.setFullYear(newDate.getFullYear() + 1);
                }
                break;
                
            default:
                // Por defecto, asumir mensual
                while (newDate < today) {
                    newDate.setMonth(newDate.getMonth() + 1);
                }
        }
        
        // Retornar la suscripción actualizada
        return {
            ...subscription,
            nextPayment: newDate.toISOString().split('T')[0]
        };
    }
    
    // Si la fecha no ha pasado, retornar sin cambios
    return subscription;
};

// Check and update all subscriptions with passed payment dates
export const checkAndUpdateSubscriptions = (subscriptions) => {
    return subscriptions.map(sub => updateNextPaymentDate(sub));
};
