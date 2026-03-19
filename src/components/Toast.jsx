import { useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const borderColors = {
        success: 'border-green-500',
        error: 'border-red-500',
        warning: 'border-yellow-500'
    };

    const icons = {
        success: <CheckCircle size={20} className="text-green-400" />,
        error: <AlertCircle size={20} className="text-red-400" />,
        warning: <AlertTriangle size={20} className="text-yellow-400" />
    };

    return (
        <div className={`fixed bottom-24 left-4 right-4 max-w-[28rem] mx-auto bg-[#16161f] rounded-xl p-4 border-l-4 ${borderColors[type]} flex items-center gap-3 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}
             style={{ animation: 'slideUp 0.3s ease-out' }}>
            {icons[type]}
            <span className="flex-1 text-white">{message}</span>
            <button
                className="p-2 rounded-lg bg-transparent text-white/70 hover:bg-white/5 transition-all duration-200"
                onClick={onClose}
            >
                <X size={16} />
            </button>
        </div>
    );
}

export default Toast;
