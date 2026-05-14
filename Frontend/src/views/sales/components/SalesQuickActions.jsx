import React from 'react';
import { FileText, Users, AlertCircle } from 'lucide-react';

const SalesQuickActions = ({ navigate }) => {
    const quickActions = [
        { name: 'New Quotation', icon: FileText, path: '/staff/quotations/new', color: '#6366f1' },
        { name: 'Add Client', icon: Users, path: '/staff/clients', color: '#0ea5e9' },
        { name: 'Log Visit', icon: AlertCircle, path: '/staff/site-visits', color: '#f59e0b' },
    ];

    return (
        <div className="quick-actions-card">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
                {quickActions.map((action) => (
                    <button
                        key={action.name}
                        className="action-card"
                        onClick={() => navigate(action.path)}
                        style={{ '--hover-color': action.color }}
                    >
                        <div className="action-icon-wrapper" style={{ background: action.color + '15', color: action.color }}>
                            <action.icon size={24} />
                        </div>
                        <span>{action.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SalesQuickActions;
