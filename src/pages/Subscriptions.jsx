import { useContext, useState } from 'react';
import { Plus, Filter, Trash2, CreditCard, Bell } from 'lucide-react';
import { AppContext } from '../App';
import Header from '../components/Header';
import SubscriptionCard from '../components/SubscriptionCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { syncSubscriptions } from '../services/dataSync';
import { scheduleSubscriptionReminder, cancelSubscriptionReminder, sendDebugPaymentNotification } from '../services/localNotifications';
import { Capacitor } from '@capacitor/core';
import {
    formatCurrency,
    calculateMonthlyTotal,
    getCategoryColor
} from '../utils/helpers';
import { getIconAndColor } from '../utils/serviceIcons';

const CATEGORIES = [
    'Entertainment', 'Music', 'Cloud', 'Gaming',
    'Productivity', 'News', 'Fitness', 'Education', 'Other'
];

const PERIODS = ['monthly', 'yearly'];

function Subscriptions() {
    const { subscriptions, setSubscriptions } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category: 'Entertainment',
        price: '',
        period: 'monthly',
        nextPayment: '',
    });

    const monthlyTotal = calculateMonthlyTotal(subscriptions);
    const activeCount = subscriptions.filter(s => s.active).length;

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
        if (!searchQuery) return matchesCategory;
        const query = searchQuery.toLowerCase();
        return matchesCategory && (
            sub.name.toLowerCase().includes(query) ||
            sub.category.toLowerCase().includes(query)
        );
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.nextPayment) {
            setToast({ visible: true, message: 'Please fill all required fields', type: 'error' });
            return;
        }

        try {
            // Obtener icono y color automáticamente
            const iconData = getIconAndColor(
                formData.name,
                editingSubscription?.logo,
                editingSubscription?.color
            );

            const newSubscription = {
                name: formData.name,
                logo: iconData.icon || iconData.fallback, // Usar URL o fallback
                color: iconData.color,
                price: parseFloat(formData.price),
                currency: 'USD',
                period: formData.period,
                nextPayment: formData.nextPayment,
                category: formData.category,
                active: true
            };

            if (editingSubscription) {
                const updated = await syncSubscriptions.update(editingSubscription.id, newSubscription);
                setSubscriptions(prev =>
                    prev.map(s => s.id === editingSubscription.id ? updated : s)
                );
                
                // Reprogramar notificación
                if (Capacitor.isNativePlatform() && updated.active) {
                    await scheduleSubscriptionReminder(updated);
                }
                
                setToast({ visible: true, message: 'Subscription updated!', type: 'success' });
            } else {
                const created = await syncSubscriptions.create(newSubscription);
                setSubscriptions(prev => [...prev, created]);
                
                // Programar notificación
                if (Capacitor.isNativePlatform() && created.active) {
                    await scheduleSubscriptionReminder(created);
                }
                
                setToast({ visible: true, message: 'Subscription added!', type: 'success' });
            }

            closeModal();
        } catch (error) {
            setToast({ visible: true, message: error.message, type: 'error' });
        }
    };

    const handleEdit = (subscription) => {
        setEditingSubscription(subscription);
        setFormData({
            name: subscription.name,
            category: subscription.category,
            price: subscription.price.toString(),
            period: subscription.period,
            nextPayment: subscription.nextPayment,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await syncSubscriptions.delete(id);
            setSubscriptions(prev => prev.filter(s => s.id !== id));
            
            // Cancelar notificación
            if (Capacitor.isNativePlatform()) {
                await cancelSubscriptionReminder(id);
            }
            
            setToast({ visible: true, message: 'Subscription deleted', type: 'success' });
        } catch (error) {
            setToast({ visible: true, message: error.message, type: 'error' });
        }
    };

    const handleToggleActive = async (id) => {
        try {
            const subscription = subscriptions.find(s => s.id === id);
            const updated = await syncSubscriptions.update(id, { ...subscription, active: !subscription.active });
            setSubscriptions(prev =>
                prev.map(s => s.id === id ? updated : s)
            );
        } catch (error) {
            setToast({ visible: true, message: error.message, type: 'error' });
        }
    };

    const handleDebugNotification = async () => {
        if (!Capacitor.isNativePlatform()) {
            setToast({ visible: true, message: 'Notifications only work on Android', type: 'error' });
            return;
        }

        try {
            // Usar la primera suscripción activa o crear una de ejemplo
            const activeSub = subscriptions.find(s => s.active) || {
                name: 'Netflix',
                price: '$9.99',
                id: 'debug-sub'
            };

            await sendDebugPaymentNotification(activeSub);
            setToast({ visible: true, message: 'Debug notification sent! Check in 2 seconds', type: 'success' });
        } catch (error) {
            setToast({ visible: true, message: error.message, type: 'error' });
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSubscription(null);
        setFormData({
            name: '',
            category: 'Entertainment',
            price: '',
            period: 'monthly',
            nextPayment: '',
        });
    };

    return (
        <div className="animate-fade-in min-h-screen">
            <Header onSearch={setSearchQuery} />

            <div className="pt-24 md:pt-28 px-4 md:px-8 max-w-7xl mx-auto pb-24 md:pb-8">
                {/* Stats Header */}
                <div className="mb-6">
                <div className="bg-gradient-to-br from-[#16161f] to-[#1a1a24] rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-sm text-white/50">Total Monthly</div>
                            <div className="text-3xl font-bold mt-1 text-white">
                                {formatCurrency(monthlyTotal)}
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#8b5cf6]/20 text-[#8b5cf6]">
                            {activeCount} active
                        </span>
                    </div>

                    <div className="flex gap-3 mt-5">
                        <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-[#1a1a24] text-white/70 hover:bg-[#1a1a24]/80 hover:text-white transition-all duration-200">
                            <Filter size={16} /> Manage
                        </button>
                        {Capacitor.isNativePlatform() && (
                            <button
                                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-[#1a1a24] text-white/70 hover:bg-[#1a1a24]/80 hover:text-white transition-all duration-200"
                                onClick={handleDebugNotification}
                                title="Test payment notification"
                            >
                                <Bell size={16} />
                            </button>
                        )}
                        <button
                            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all duration-200"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus size={16} /> Add new
                        </button>
                    </div>
                </div>
            </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                <button
                    className={`inline-flex items-center justify-center py-2 px-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${selectedCategory === 'All'
                            ? 'bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white'
                            : 'bg-[#1a1a24] text-white/60'
                        }`}
                    onClick={() => setSelectedCategory('All')}
                >
                    All
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`inline-flex items-center justify-center py-2 px-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${selectedCategory === cat
                                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white'
                                : 'bg-[#1a1a24] text-white/60'
                            }`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

                {/* Subscriptions List */}
                <section className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Your Subscriptions</h2>
                </div>

                {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map(sub => (
                        <div key={sub.id} className="relative">
                            <SubscriptionCard
                                subscription={sub}
                                onClick={() => handleEdit(sub)}
                            />
                            {!sub.active && (
                                <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-danger/20 text-danger">
                                    Cancelled
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                        <CreditCard size={48} className="text-white/20" />
                        <h3 className="text-lg font-semibold text-white/80">No subscriptions found</h3>
                        <p className="text-sm text-text-tertiary">Add your first subscription to track your expenses</p>
                        <button
                            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-accent-gradient text-white shadow-card hover:shadow-card-md hover:scale-105 active:scale-95"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus size={18} /> Add Subscription
                        </button>
                    </div>
                )}
                </section>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
                footer={
                    <>
                        <button
                            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-bg-tertiary text-text-secondary hover:bg-bg-hover hover:text-white transition-all duration-200"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-accent-gradient text-white shadow-card hover:shadow-card-md hover:scale-105 active:scale-95"
                            onClick={handleSubmit}
                        >
                            {editingSubscription ? 'Update' : 'Add'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-white/80">Name *</label>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            placeholder="e.g., Netflix"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-white/80">Category</label>
                        <select
                            name="category"
                            className="input cursor-pointer"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/80">Price *</label>
                            <input
                                type="number"
                                name="price"
                                className="input"
                                placeholder="9.99"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/80">Period</label>
                            <select
                                name="period"
                                className="input cursor-pointer"
                                value={formData.period}
                                onChange={handleInputChange}
                            >
                                {PERIODS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-white/80">Next Payment Date *</label>
                        <input
                            type="date"
                            name="nextPayment"
                            className="input"
                            value={formData.nextPayment}
                            onChange={handleInputChange}
                        />
                    </div>

                    {editingSubscription && (
                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-bg-tertiary text-text-secondary hover:bg-bg-hover hover:text-white transition-all duration-200"
                                onClick={() => {
                                    handleToggleActive(editingSubscription.id);
                                    closeModal();
                                }}
                            >
                                {editingSubscription.active ? 'Mark as Cancelled' : 'Reactivate'}
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2.5 rounded-xl font-medium text-sm bg-danger text-white"
                                onClick={() => {
                                    handleDelete(editingSubscription.id);
                                    closeModal();
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </form>
            </Modal>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast({ ...toast, visible: false })}
            />
        </div>
    );
}

export default Subscriptions;
