import { useContext, useState } from 'react';
import { Plus, Clock, Flag, Bell, Trash2 } from 'lucide-react';
import { AppContext } from '../App';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import ActivityCard from '../components/ActivityCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { syncActivities } from '../services/dataSync';
import { formatDateFull } from '../utils/helpers';

const PRIORITIES = [
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'medium', label: 'Medium', color: '#eab308' },
    { value: 'low', label: 'Low', color: '#22c55e' }
];

function Planner() {
    const { activities, setActivities } = useContext(AppContext);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('day');
    const [showModal, setShowModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: selectedDate,
        time: '09:00',
        priority: 'medium',
        reminder: true
    });

    const dayActivities = activities
        .filter(a => {
            const matchesDate = a.date === selectedDate;
            if (!searchQuery) return matchesDate;
            const query = searchQuery.toLowerCase();
            return matchesDate && (
                a.title.toLowerCase().includes(query) ||
                a.description?.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => a.time.localeCompare(b.time));

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.date || !formData.time) {
            setToast({ visible: true, message: 'Please fill all required fields', type: 'error' });
            return;
        }

        try {
            const activityData = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                priority: formData.priority,
                reminder: formData.reminder,
                completed: false
            };

            if (editingActivity) {
                const updated = await syncActivities.update(editingActivity.id, activityData);
                setActivities(prev =>
                    prev.map(a => a.id === editingActivity.id ? updated : a)
                );
                setToast({ visible: true, message: 'Activity updated!', type: 'success' });
            } else {
                const created = await syncActivities.create(activityData);
                setActivities(prev => [...prev, created]);
                setToast({ visible: true, message: 'Activity added!', type: 'success' });
            }

            closeModal();
        } catch (error) {
            setToast({ visible: true, message: error.message, type: 'error' });
        }
    };

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setFormData({
            title: activity.title,
            description: activity.description,
            date: activity.date,
            time: activity.time,
            priority: activity.priority,
            reminder: activity.reminder
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await syncActivities.delete(id);
            setActivities(prev => prev.filter(a => a.id !== id));
            setToast({ visible: true, message: 'Activity deleted', type: 'success' });
        } catch (error) {
            setToast({ visible: true, message: error.message, type: 'error' });
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingActivity(null);
        setFormData({
            title: '',
            description: '',
            date: selectedDate,
            time: '09:00',
            priority: 'medium',
            reminder: true
        });
    };

    const openAddModal = () => {
        setFormData(prev => ({ ...prev, date: selectedDate }));
        setShowModal(true);
    };

    const tabBase = "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-none font-sans";
    const tabInactive = "bg-bg-tertiary text-white/60";
    const tabActive = "bg-accent-gradient text-white";

    return (
        <div className="animate-fade-in min-h-screen">
            <Header onSearch={setSearchQuery} />

            <div className="pt-24 md:pt-28 px-4 md:px-8 max-w-7xl mx-auto pb-24 md:pb-8">
                {/* View Mode Tabs */}
                <div className="flex gap-2 mb-4">
                <button
                    className={`${tabBase} ${viewMode === 'day' ? tabActive : tabInactive}`}
                    onClick={() => setViewMode('day')}
                >
                    Day
                </button>
                <button
                    className={`${tabBase} ${viewMode === 'week' ? tabActive : tabInactive}`}
                    onClick={() => setViewMode('week')}
                >
                    Week
                </button>
                <button
                    className={`${tabBase} ${viewMode === 'month' ? tabActive : tabInactive}`}
                    onClick={() => setViewMode('month')}
                >
                    Month
                </button>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <section className="lg:col-span-1">
                        <Calendar
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            events={activities}
                        />
                    </section>

                    {/* Selected Date Schedule */}
                    <section className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold">Schedule</h2>
                        <p className="text-sm text-text-tertiary mt-1">
                            {formatDateFull(selectedDate)}
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-sm bg-accent-gradient text-white shadow-card hover:shadow-card-md hover:scale-105 active:scale-95"
                        onClick={openAddModal}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>

                {/* Timeline */}
                {dayActivities.length > 0 ? (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-10 top-5 bottom-5 w-0.5 bg-bg-tertiary rounded-full" />

                        {dayActivities.map((activity, index) => (
                            <div
                                key={activity.id}
                                className={`relative pl-[60px] ${index < dayActivities.length - 1 ? 'mb-3' : ''}`}
                            >
                                {/* Timeline dot */}
                                <div
                                    className="absolute left-[35px] top-5 w-3 h-3 rounded-full border-2 border-bg-primary"
                                    style={{
                                        background: PRIORITIES.find(p => p.value === activity.priority)?.color || '#8b5cf6'
                                    }}
                                />

                                <ActivityCard
                                    activity={activity}
                                    onClick={() => handleEdit(activity)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                        <Clock size={48} className="text-white/20" />
                        <h3 className="text-lg font-semibold text-white/80">No activities scheduled</h3>
                        <p className="text-sm text-text-tertiary">Add an activity for {formatDateFull(selectedDate)}</p>
                        <button
                            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-accent-gradient text-white shadow-card hover:shadow-card-md hover:scale-105 active:scale-95"
                            onClick={openAddModal}
                        >
                            <Plus size={18} /> Add Activity
                        </button>
                    </div>
                )}
                    </section>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingActivity ? 'Edit Activity' : 'Add Activity'}
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
                            {editingActivity ? 'Update' : 'Add'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-white/80">Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="input"
                            placeholder="e.g., Team Meeting"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-white/80">Description</label>
                        <textarea
                            name="description"
                            className="input resize-none"
                            placeholder="Add details..."
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex gap-3 mb-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/80">Date *</label>
                            <input
                                type="date"
                                name="date"
                                className="input"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/80">Time *</label>
                            <input
                                type="time"
                                name="time"
                                className="input"
                                value={formData.time}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-white/80">Priority</label>
                        <div className="flex gap-2">
                            {PRIORITIES.map(p => (
                                <button
                                    key={p.value}
                                    type="button"
                                    className={`inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${formData.priority === p.value
                                            ? 'text-white border-none'
                                            : 'bg-bg-tertiary text-text-secondary'
                                        }`}
                                    style={formData.priority === p.value ? {
                                        background: p.color
                                    } : {}}
                                    onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                                >
                                    <Flag size={14} /> {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="reminder"
                                checked={formData.reminder}
                                onChange={handleInputChange}
                                className="w-5 h-5 accent-accent-primary"
                            />
                            <span className="flex items-center gap-2">
                                <Bell size={16} /> Enable reminder
                            </span>
                        </label>
                    </div>

                    {editingActivity && (
                        <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-danger text-white mt-3"
                            onClick={() => {
                                handleDelete(editingActivity.id);
                                closeModal();
                            }}
                        >
                            <Trash2 size={16} /> Delete Activity
                        </button>
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

export default Planner;
