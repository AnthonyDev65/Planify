import { Eye, Copy } from 'lucide-react';
import { useState } from 'react';

function PasswordCard({ password, onClick, onCopy }) {
    const { name, username, strength, favicon } = password;
    
    // Verificar si el favicon es una URL
    const isUrl = favicon && (favicon.startsWith('http://') || favicon.startsWith('https://'));

    const getStrengthSegments = () => {
        const segments = 4;
        let activeCount = 0;

        switch (strength) {
            case 'weak':
                activeCount = 1;
                break;
            case 'medium':
                activeCount = 2;
                break;
            case 'strong':
                activeCount = 4;
                break;
            default:
                activeCount = 0;
        }

        return Array.from({ length: segments }, (_, i) => ({
            active: i < activeCount,
            strength
        }));
    };

    return (
        <div className="password-item" onClick={onClick}>
            <div className="password-icon">
                {isUrl ? (
                    <img 
                        src={favicon} 
                        alt={name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                            // Si la imagen falla, mostrar emoji de llave
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-2xl">🔑</span>';
                        }}
                    />
                ) : (
                    <span className="text-2xl">{favicon || '🔑'}</span>
                )}
            </div>

            <div className="password-info">
                <div className="password-name">{name}</div>
                <div className="password-username">{username}</div>
                <div className="strength-bar">
                    {getStrengthSegments().map((segment, index) => (
                        <div
                            key={index}
                            className={`strength-segment ${segment.active ? `active ${segment.strength}` : ''}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-1">
                <button
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-transparent text-text-secondary hover:bg-white/5 transition-all duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        onCopy?.();
                    }}
                >
                    <Copy size={16} />
                </button>
                <button className="inline-flex items-center justify-center p-2 rounded-lg bg-transparent text-text-secondary hover:bg-white/5 transition-all duration-200">
                    <Eye size={16} />
                </button>
            </div>
        </div>
    );
}

export default PasswordCard;
