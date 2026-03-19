import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function Calendar({ selectedDate, onDateSelect, events = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const hasEvent = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.some(event => event.date === dateStr);
    };

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const isSelected = (day) => {
        if (!selectedDate) return false;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return dateStr === selectedDate;
    };

    const handleDayClick = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onDateSelect?.(dateStr);
    };

    const getDayClasses = (day, isOtherMonth = false) => {
        if (isOtherMonth) {
            return 'calendar-day other-month';
        }

        let classes = ['calendar-day'];
        if (isToday(day)) classes.push('today');
        if (isSelected(day)) classes.push('selected');
        if (hasEvent(day)) classes.push('has-event');

        return classes.join(' ');
    };

    const renderDays = () => {
        const days = [];

        // Previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${i}`} className={getDayClasses(prevMonthDays - i, true)}>
                    {prevMonthDays - i}
                </div>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <div
                    key={day}
                    className={getDayClasses(day)}
                    onClick={() => handleDayClick(day)}
                    style={{ position: 'relative' }}
                >
                    {day}
                </div>
            );
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push(
                <div key={`next-${i}`} className={getDayClasses(i, true)}>
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-bg-card rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{MONTHS[month]} {year}</h3>
                <div className="flex gap-1">
                    <button
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-transparent text-text-secondary hover:bg-white/5 transition-all duration-200"
                        onClick={prevMonth}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-transparent text-text-secondary hover:bg-white/5 transition-all duration-200"
                        onClick={nextMonth}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {DAYS.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-text-tertiary py-2">
                        {day}
                    </div>
                ))}
                {renderDays()}
            </div>
        </div>
    );
}

export default Calendar;
