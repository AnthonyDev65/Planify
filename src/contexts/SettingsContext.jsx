import { createContext, useState, useEffect, useContext } from 'react';
import { Preferences } from '@capacitor/preferences';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [language, setLanguage] = useState('es');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        applyTheme();
    }, [theme]);

    const loadSettings = async () => {
        try {
            const { value: savedTheme } = await Preferences.get({ key: 'planify_theme' });
            const { value: savedLanguage } = await Preferences.get({ key: 'planify_language' });
            const { value: savedNotifications } = await Preferences.get({ key: 'planify_notifications' });

            if (savedTheme) setTheme(savedTheme);
            if (savedLanguage) setLanguage(savedLanguage);
            if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyTheme = () => {
        const root = document.documentElement;
        
        if (theme === 'light') {
            // Light theme colors
            root.style.setProperty('--bg-primary', '#f8f9fa');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--bg-tertiary', '#f1f3f5');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.setProperty('--bg-hover', '#e9ecef');
            root.style.setProperty('--text-primary', '#212529');
            root.style.setProperty('--text-secondary', '#495057');
            root.style.setProperty('--text-tertiary', '#868e96');
            root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
            
            // Update body background for light theme
            document.body.style.backgroundColor = '#f8f9fa';
        } else {
            // Dark theme colors
            root.style.setProperty('--bg-primary', '#0a0a0f');
            root.style.setProperty('--bg-secondary', '#13131a');
            root.style.setProperty('--bg-tertiary', '#1a1a24');
            root.style.setProperty('--bg-card', '#13131a');
            root.style.setProperty('--bg-hover', '#1e1e2a');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#a0a0ab');
            root.style.setProperty('--text-tertiary', '#6b6b76');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.05)');
            
            // Update body background for dark theme
            document.body.style.backgroundColor = '#0a0a0f';
        }
    };

    const updateTheme = async (newTheme) => {
        setTheme(newTheme);
        await Preferences.set({ key: 'planify_theme', value: newTheme });
    };

    const updateLanguage = async (newLanguage) => {
        setLanguage(newLanguage);
        await Preferences.set({ key: 'planify_language', value: newLanguage });
    };

    const updateNotifications = async (enabled) => {
        setNotificationsEnabled(enabled);
        await Preferences.set({ key: 'planify_notifications', value: enabled.toString() });
    };

    const value = {
        theme,
        language,
        notificationsEnabled,
        isLoading,
        updateTheme,
        updateLanguage,
        updateNotifications
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
