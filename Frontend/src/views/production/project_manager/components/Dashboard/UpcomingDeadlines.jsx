import React from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

const getDeadlineColor = (priority) => {
    const map = { urgent: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#94a3b8' };
    return map[priority] || '#94a3b8';
};

const UpcomingDeadlines = ({ deadlines }) => {
    return (
        <div className="pm-card pm-deadline-card">
            <div className="pm-card-header">
                <h3><Timer size={18} /> Upcoming Deadlines</h3>
            </div>
            <div className="pm-deadline-list">
                {deadlines.map(dl => (
                    <div className="pm-deadline-item" key={dl.id}>
                        <div className="pm-deadline-indicator" style={{ background: getDeadlineColor(dl.priority) }}></div>
                        <div className="pm-deadline-info">
                            <span className="pm-deadline-task">{dl.task}</span>
                            <span className="pm-deadline-project">{dl.project}</span>
                        </div>
                        <div className="pm-deadline-countdown" style={{ color: getDeadlineColor(dl.priority) }}>
                            {dl.daysLeft <= 3 ? (
                                <span className="pm-deadline-urgent">
                                    <AlertTriangle size={14} /> {dl.daysLeft < 0 ? 'Overdue' : dl.daysLeft + 'd'}
                                </span>
                            ) : (
                                <span>{dl.daysLeft} days</span>
                            )}
                        </div>
                    </div>
                ))}
                {deadlines.length === 0 && <p className="pm-empty-text" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No upcoming deadlines.</p>}
            </div>
        </div>
    );
};

export default UpcomingDeadlines;
