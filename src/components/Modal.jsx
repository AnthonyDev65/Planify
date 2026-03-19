import { useEffect } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, footer }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed mb-20 inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-[28rem] bg-[#16161f] rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
                style={{ animation: 'slideUp 0.3s ease-out' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        className="p-2.5 rounded-xl bg-transparent text-white/70 hover:bg-white/5 transition-all duration-200"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    {children}
                </div>

                {footer && (
                    <div className="flex gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;
