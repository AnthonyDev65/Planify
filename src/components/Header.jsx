import { useContext, useState } from 'react';
import { Bell, Settings, Search, User, LogOut, Cloud, CloudOff } from 'lucide-react';
import { AppContext } from '../App';
import { supabaseAuth } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

function Header({ onSearch }) {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    const handleLogout = async () => {
        try {
            await supabaseAuth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const getUserInitial = () => {
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'G';
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-bg-secondary/95 backdrop-blur-md border-b border-white/5"
            style={{
                paddingTop: '32px',
                paddingBottom: '0.5rem',
                paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
                paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
            }}>
            <div className="max-w-7xl mx-auto flex items-center gap-2">
                {/* Profile Avatar */}
                <div className="relative flex-shrink-0">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-200"
                    >
                        {getUserInitial()}
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div className="absolute top-12 left-0 w-64 bg-bg-card rounded-xl border border-white/10 shadow-card-lg z-50 overflow-hidden">
                                {/* User Info */}
                                <div className="p-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-lg">
                                            {getUserInitial()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {user ? (
                                                <>
                                                    <div className="text-sm font-medium text-white truncate">
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-success mt-1">
                                                        <Cloud size={12} />
                                                        Synced
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-sm font-medium text-white">
                                                        Guest
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-text-tertiary mt-1">
                                                        <CloudOff size={12} />
                                                        Local only
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    {user ? (
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-white transition-colors duration-200"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                navigate('/login');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-accent-primary hover:bg-bg-tertiary transition-colors duration-200"
                                        >
                                            <Cloud size={16} />
                                            Sign In to Sync
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2 bg-bg-tertiary rounded-xl py-2 px-3 border border-white/5 transition-all duration-200 flex-1 focus-within:border-accent-primary/50 focus-within:shadow-glow min-w-0">
                    <Search size={16} className="text-text-tertiary flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="flex-1 bg-transparent border-none outline-none text-sm text-white font-sans placeholder:text-text-tertiary min-w-0"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="inline-flex items-center justify-center p-2 rounded-xl bg-transparent text-text-secondary hover:bg-white/5 transition-all duration-200">
                        <Bell size={18} />
                    </button>
                    <button className="inline-flex items-center justify-center p-2 rounded-xl bg-transparent text-text-secondary hover:bg-white/5 transition-all duration-200">
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
