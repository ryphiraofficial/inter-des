import React from 'react';
import { FileText, Clock, ShoppingCart, Package, TrendingUp } from 'lucide-react';

const POStats = ({ purchaseOrders }) => {
    const statsData = [
        { label: 'Total POs', value: purchaseOrders.length, icon: <FileText size={24} />, color: 'stat-purple' },
        { label: 'Pending', value: purchaseOrders.filter(p => p.status === 'Pending').length, icon: <Clock size={24} />, color: 'stat-yellow' },
        { label: 'Ordered', value: purchaseOrders.filter(p => p.status === 'Ordered').length, icon: <ShoppingCart size={24} />, color: 'stat-magenta' },
        { label: 'Received', value: purchaseOrders.filter(p => p.status === 'Received').length, icon: <Package size={24} />, color: 'stat-green' },
        { label: 'Total Value', value: `₹${purchaseOrders.reduce((sum, p) => sum + (p.totalAmount || 0), 0).toLocaleString()}`, icon: <TrendingUp size={24} />, color: 'stat-blue' }
    ];

    return (
        <div className="po-stats-grid">
            {statsData.map((stat, index) => (
                <div key={index} className="po-stat-card">
                    <div className="stat-info">
                        <h4>{stat.label}</h4>
                        <h2>{stat.value}</h2>
                    </div>
                    <div className={`stat-icon ${stat.color}`}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default POStats;
