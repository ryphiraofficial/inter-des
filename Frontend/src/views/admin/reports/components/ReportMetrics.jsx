import React from 'react';
import { DollarSign, TrendingUp, Users, Target, Clock, FileText, Calendar, ExternalLink } from 'lucide-react';

const ReportMetrics = ({ stats, conversionRate }) => {
    const metrics = [
        {
            label: 'Total Revenue',
            value: `₹${stats?.revenue?.approved?.toLocaleString() || '0'}`,
            icon: <DollarSign size={20} />,
            iconClass: 'cyan',
            id: 'rev-total'
        },
        {
            label: 'Pending Revenue',
            value: `₹${stats?.revenue?.potential?.toLocaleString() || '0'}`,
            icon: <TrendingUp size={20} />,
            iconClass: 'orange',
            id: 'rev-pending'
        },
        {
            label: 'Total Clients',
            value: stats?.clients?.total || '0',
            icon: <Users size={20} />,
            iconClass: 'cyan',
            id: 'clients-active'
        },
        {
            label: 'Conversion Rate',
            value: `${conversionRate}%`,
            icon: <Target size={20} />,
            iconClass: 'orange',
            id: 'conv-rate'
        },
        {
            label: 'Active Tasks',
            value: stats?.tasks?.inProgress || '0',
            icon: <Clock size={20} />,
            iconClass: 'pink',
            id: 'tasks-active'
        },
        {
            label: 'Total Quotations',
            value: stats?.quotations?.total || '0',
            icon: <FileText size={20} />,
            iconClass: 'pink',
            id: 'quotes-total'
        },
        {
            label: 'Approved Quotes',
            value: stats?.quotations?.approved || '0',
            icon: <Calendar size={20} />,
            iconClass: 'purple',
            id: 'quotes-approved'
        },
        {
            label: 'Inventory Alerts',
            value: (stats?.inventory?.lowStock || 0) + (stats?.inventory?.outOfStock || 0),
            icon: <TrendingUp size={20} />,
            iconClass: 'pink',
            id: 'inv-alerts'
        }
    ];

    return (
        <div className="reports-stats-matrix">
            {metrics.map((stat) => (
                <div key={stat.id} className={`stat-metric-card ${stat.variant || ''}`}>
                    <div className="stat-top-row">
                        <div className={`stat-icon-box ${stat.iconClass || ''}`}>
                            {stat.icon}
                        </div>
                        <ExternalLink size={14} style={{ opacity: 0.4 }} />
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                </div>
            ))}
        </div>
    );
};

export default ReportMetrics;
