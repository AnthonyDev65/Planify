import { Moon, Sun, Globe, Bell, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { useSettings } from '../contexts/SettingsContext';
import { t } from '../i18n/translations';
import { initializeNotifications } from '../services/localNotifications';

function Settings() {
    const { theme, language, notificationsEnabled, updateTheme, updateLanguage, updateNotifications } = useSettings();

    const handleThemeChange = async (newTheme) => {
        await updateTheme(newTheme);
    };

    const handleLanguageChange = async (newLanguage) => {
        await updateLanguage(newLanguage);
    };

    const handleNotificationsToggle = async () => {
        if (!notificationsEnabled) {
            // Solicitar permisos
            const granted = await initializeNotifications();
            if (granted) {
                await updateNotifications(true);
            }
        } else {
            await updateNotifications(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            <Header />
            
            <div className="pt-24 px-4 pb-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-primary mb-6">{t('settings', language)}</h1>

                {/* Apariencia */}
                <div className="bg-bg-card rounded-2xl p-4 mb-4" style={{ border: '1px solid var(--border-color)' }}>
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        {t('appearance', language)}
                    </h2>
                    
                    <div className="space-y-2">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                                theme === 'light' 
                                    ? 'bg-accent-gradient text-white' 
                                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/70'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Sun size={18} />
                                <span className="font-medium">{t('light', language)}</span>
                            </div>
                            {theme === 'light' && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </button>

                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                                theme === 'dark' 
                                    ? 'bg-accent-gradient text-white' 
                                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/70'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Moon size={18} />
                                <span className="font-medium">{t('dark', language)}</span>
                            </div>
                            {theme === 'dark' && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Idioma */}
                <div className="bg-bg-card rounded-2xl p-4 mb-4" style={{ border: '1px solid var(--border-color)' }}>
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                        <Globe size={20} />
                        {t('language', language)}
                    </h2>
                    
                    <div className="space-y-2">
                        <button
                            onClick={() => handleLanguageChange('es')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                                language === 'es' 
                                    ? 'bg-accent-gradient text-white' 
                                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/70'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🇪🇸</span>
                                <span className="font-medium">{t('spanish', language)}</span>
                            </div>
                            {language === 'es' && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </button>

                        <button
                            onClick={() => handleLanguageChange('en')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                                language === 'en' 
                                    ? 'bg-accent-gradient text-white' 
                                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/70'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🇺🇸</span>
                                <span className="font-medium">{t('english', language)}</span>
                            </div>
                            {language === 'en' && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Notificaciones */}
                <div className="bg-bg-card rounded-2xl p-4" style={{ border: '1px solid var(--border-color)' }}>
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                        <Bell size={20} />
                        {t('notifications', language)}
                    </h2>
                    
                    <button
                        onClick={handleNotificationsToggle}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-tertiary hover:bg-bg-tertiary/70 transition-all duration-200"
                    >
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-medium text-primary">{t('paymentReminders', language)}</span>
                            <span className="text-xs text-text-tertiary">
                                {t('notificationDescription', language)}
                            </span>
                        </div>
                        
                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            notificationsEnabled ? 'bg-accent-primary' : 'bg-bg-secondary'
                        }`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                        </div>
                    </button>
                </div>

                {/* Info */}
                <div className="mt-8 text-center">
                    <p className="text-text-tertiary text-sm">Planify {t('version', language)} 1.0.0</p>
                    <p className="text-text-tertiary text-xs mt-1">{t('smartManager', language)}</p>
                </div>
            </div>
        </div>
    );
}

export default Settings;
