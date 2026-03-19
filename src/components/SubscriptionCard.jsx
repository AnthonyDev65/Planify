import { formatDate, formatCurrency } from '../utils/helpers';

function SubscriptionCard({ subscription, onClick }) {
    const { name, logo, color, price, currency, period, nextPayment } = subscription;
    
    // Verificar si el logo es una URL
    const isUrl = logo && (logo.startsWith('http://') || logo.startsWith('https://'));

    return (
        <div className="subscription-item" onClick={onClick}>
            <div
                className="subscription-logo"
                style={{ backgroundColor: isUrl ? 'transparent' : color }}
            >
                {isUrl ? (
                    <img 
                        src={logo} 
                        alt={name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                            // Si la imagen falla, mostrar la primera letra
                            e.target.style.display = 'none';
                            e.target.parentElement.style.backgroundColor = color;
                            e.target.parentElement.textContent = name.charAt(0).toUpperCase();
                        }}
                    />
                ) : (
                    logo
                )}
            </div>

            <div className="subscription-info">
                <div className="subscription-name">{name}</div>
                <div className="subscription-date">
                    Next: {formatDate(nextPayment)}
                </div>
            </div>

            <div className="subscription-price">
                <div className="subscription-amount">
                    {formatCurrency(price, currency)}
                </div>
                <div className="subscription-period">/{period}</div>
            </div>
        </div>
    );
}

export default SubscriptionCard;
