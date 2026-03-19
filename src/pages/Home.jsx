import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    CreditCard,
    Calendar,
    Lock,
    TrendingUp,
    ChevronRight,
    Zap
} from 'lucide-react';
import { AppContext } from '../App';
import Header from '../components/Header';
import SubscriptionCard from '../components/SubscriptionCard';
import ActivityCard from '../components/ActivityCard';
import PasswordCard from '../components/PasswordCard';
import NotificationSettings from '../components/NotificationSettings';
import {
    formatCurrency,
    calculateMonthlyTotal,
    getNextPayment,
    daysUntil,
    formatDate
} from '../utils/helpers';

function Home() {
    const { subscriptions, activities, passwords } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState('');

    const monthlyTotal = calculateMonthlyTotal(subscriptions);
    const nextPayment = getNextPayment(subscriptions);
    const todayActivities = activities.filter(
        a => a.date === new Date().toISOString().split('T')[0]
    );

    // Filtrar por búsqueda
    const filterBySearch = (items, fields) => {
        if (!searchQuery) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            fields.some(field =>
                item[field]?.toString().toLowerCase().includes(query)
            )
        );
    };

    const activeSubscriptions = filterBySearch(
        subscriptions.filter(s => s.active),
        ['name', 'category']
    );

    const filteredActivities = filterBySearch(
        todayActivities,
        ['title', 'description']
    );

    const recentPasswords = filterBySearch(
        passwords,
        ['name', 'username', 'url']
    );

    // Determinar si hay búsqueda activa
    const isSearching = searchQuery.trim().length > 0;

    // Contar resultados
    const hasSubscriptionResults = activeSubscriptions.length > 0;
    const hasActivityResults = filteredActivities.length > 0;
    const hasPasswordResults = recentPasswords.length > 0;
    const hasAnyResults = hasSubscriptionResults || hasActivityResults || hasPasswordResults;

    // Mostrar solo los primeros 3 cuando no hay búsqueda
    const displaySubscriptions = isSearching ? activeSubscriptions : activeSubscriptions.slice(0, 3);
    const displayActivities = isSearching ? filteredActivities : filteredActivities.slice(0, 3);
    const displayPasswords = isSearching ? recentPasswords : recentPasswords.slice(0, 2);

    return (
        <div className="animate-fade-in min-h-screen">
            <Header onSearch={setSearchQuery} />

            <div className="pt-24 md:pt-28 px-4 md:px-8 max-w-7xl mx-auto pb-24 md:pb-8">
                {/* Mostrar solo cuando NO hay búsqueda */}
                {!isSearching && (
                    <>
                        {/* Summary Card */}
                        <div className="mb-6 p-6 rounded-2xl bg-accent-gradient shadow-card-lg">
                            <div className="flex items-center justify-between mb-4 ">
                                <span className="">Monthly Expenses</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/80">
                                    <TrendingUp size={12} />
                                    This month
                                </span>
                            </div>

                            <div className="text-5xl font-bold mb-6">
                                <span className="text-3xl text-white/80">$</span>
                                {monthlyTotal.toFixed(2)}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-white/60">Active Subscriptions</span>
                                    <span className="text-lg font-bold text-white">
                                        {subscriptions.filter(s => s.active).length}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-white/60">Next Payment</span>
                                    <span className="text-lg font-bold">
                                        {nextPayment ? (
                                            <>
                                                {formatCurrency(nextPayment.price)}
                                                <small className="text-text-tertiary ml-1 text-xs">
                                                    in {daysUntil(nextPayment.nextPayment)}d
                                                </small>
                                            </>
                                        ) : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-4 md:grid-cols-4 gap-3 mb-6">
                            <Link to="/subscriptions" className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-bg-card border border-white/5 transition-all duration-200 hover:bg-bg-tertiary hover:border-accent-primary/50 hover:scale-105 no-underline">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-secondary">
                                    <CreditCard size={20} />
                                </div>
                                <span className="text-xs font-medium text-text-secondary">Add Sub</span>
                            </Link>

                            <Link to="/planner" className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-bg-card border border-white/5 transition-all duration-200 hover:bg-bg-tertiary hover:border-accent-primary/50 hover:scale-105 no-underline">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-secondary">
                                    <Calendar size={20} />
                                </div>
                                <span className="text-xs font-medium text-text-secondary">Add Task</span>
                            </Link>

                            <Link to="/vault" className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-bg-card border border-white/5 transition-all duration-200 hover:bg-bg-tertiary hover:border-accent-primary/50 hover:scale-105 no-underline">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-secondary">
                                    <Lock size={20} />
                                </div>
                                <span className="text-xs font-medium text-text-secondary">Add Pass</span>
                            </Link>

                            <div className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-bg-card border border-white/5 transition-all duration-200 hover:bg-bg-tertiary hover:border-accent-primary/50 hover:scale-105 cursor-pointer">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent-gradient flex items-center justify-center">
                                    <Zap size={20} className="text-white" />
                                </div>
                                <span className="text-xs font-medium text-text-secondary">Quick</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Mensaje cuando hay búsqueda pero sin resultados */}
                {isSearching && !hasAnyResults && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
                        <p className="text-text-tertiary">Intenta con otro término de búsqueda</p>
                    </div>
                )}

                {/* Desktop Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Active Subscriptions - Mostrar solo si hay resultados o no hay búsqueda */}
                    {(!isSearching || hasSubscriptionResults) && (
                        <section className="md:col-span-2 lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold">
                                    {isSearching ? `Subscriptions (${displaySubscriptions.length})` : 'Active Subscriptions'}
                                </h2>
                                {!isSearching && (
                                    <Link to="/subscriptions" className="text-sm text-accent-primary font-medium flex items-center gap-1 transition-colors duration-200 hover:text-accent-secondary no-underline">
                                        See all <ChevronRight size={14} className="inline" />
                                    </Link>
                                )}
                            </div>

                            {displaySubscriptions.length > 0 ? (
                                displaySubscriptions.map(sub => (
                                    <SubscriptionCard key={sub.id} subscription={sub} />
                                ))
                            ) : (
                                <div className="bg-bg-card rounded-xl p-6 border border-white/5 text-center">
                                    <p className="text-text-tertiary">No active subscriptions</p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Sidebar Content */}
                    <section className={`space-y-6 ${isSearching && !hasActivityResults && !hasPasswordResults ? 'hidden' : ''}`}>
                        {/* Today's Activities - Mostrar solo si hay resultados o no hay búsqueda */}
                        {(!isSearching || hasActivityResults) && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">
                                        {isSearching ? `Schedule (${displayActivities.length})` : "Today's Schedule"}
                                    </h2>
                                    {!isSearching && (
                                        <Link to="/planner" className="text-sm text-accent-primary font-medium flex items-center gap-1 transition-colors duration-200 hover:text-accent-secondary no-underline">
                                            See all <ChevronRight size={14} className="inline" />
                                        </Link>
                                    )}
                                </div>

                                {displayActivities.length > 0 ? (
                                    displayActivities.map(activity => (
                                        <ActivityCard key={activity.id} activity={activity} />
                                    ))
                                ) : (
                                    <div className="bg-bg-card rounded-xl p-6 border border-white/5 text-center">
                                        <p className="text-text-tertiary text-sm">
                                            {searchQuery ? 'No se encontraron actividades' : 'No activities for today'}
                                        </p>
                                        {!isSearching && (
                                            <Link to="/planner" className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-sm bg-accent-gradient text-white shadow-card hover:shadow-card-md hover:scale-105 active:scale-95 mt-3 no-underline">
                                                <Plus size={16} /> Add Activity
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Password Vault Preview - Mostrar solo si hay resultados o no hay búsqueda */}
                        {(!isSearching || hasPasswordResults) && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">
                                        {isSearching ? `Passwords (${displayPasswords.length})` : 'Password Vault'}
                                    </h2>
                                    {!isSearching && (
                                        <Link to="/vault" className="text-sm text-accent-primary font-medium flex items-center gap-1 transition-colors duration-200 hover:text-accent-secondary no-underline">
                                            See all <ChevronRight size={14} className="inline" />
                                        </Link>
                                    )}
                                </div>

                                {!isSearching && (
                                    <div className="bg-bg-card rounded-xl p-4 border border-white/5 mb-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm text-text-tertiary">Stored Passwords</div>
                                                <div className="text-2xl font-bold">{passwords.length}</div>
                                            </div>
                                            <div className="w-12 h-12 bg-accent-gradient rounded-xl flex items-center justify-center">
                                                <Lock size={24} />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="text-xs text-text-tertiary mb-2">Security Score</div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div
                                                        key={i}
                                                        className={`flex-1 h-1.5 rounded-full ${i <= 4 ? 'bg-success' : 'bg-bg-tertiary'}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-sm text-success mt-2">Strong Security</div>
                                        </div>
                                    </div>
                                )}

                                {displayPasswords.map(password => (
                                    <PasswordCard key={password.id} password={password} />
                                ))}
                            </div>
                        )}

                        {/* Notification Settings - Solo mostrar cuando NO hay búsqueda */}
                        {!isSearching && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">Notificaciones</h2>
                                </div>
                                <NotificationSettings />
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home;



