import { formatTime } from '../utils/helpers';

function ActivityCard({ activity, onClick }) {
    const { title, description, time, priority } = activity;
    const { hour, period } = formatTime(time);

    return (
        <div className="activity-item" onClick={onClick}>
            <div className="activity-time">
                <span className="activity-hour">{hour}</span>
                <span className="activity-period">{period}</span>
            </div>

            <div className="activity-content">
                <div className="activity-title">{title}</div>
                <div className="activity-desc">{description}</div>
            </div>

            <div className={`activity-priority ${priority}`}></div>
        </div>
    );
}

export default ActivityCard;
