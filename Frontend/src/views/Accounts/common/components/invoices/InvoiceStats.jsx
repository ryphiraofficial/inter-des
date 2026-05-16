import React from 'react';
import { CreditCard, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const InvoiceStats = ({ invoices }) => {
    const unpaidTotal = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const overdueTotal = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const paidTotal = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.grandTotal || 0), 0);

    const statsData = [
        { label: 'Outstanding', value: `₹${unpaidTotal.toLocaleString()}`, icon: <CreditCard size={24} />, color: 'blue' },
        { label: 'Overdue', value: `₹${overdueTotal.toLocaleString()}`, icon: <AlertCircle size={24} />, color: 'red' },
        { label: 'Paid (Total)', value: `₹${paidTotal.toLocaleString()}`, icon: <CheckCircle size={24} />, color: 'green' },
        { label: 'Total Invoices', value: invoices.length, icon: <FileText size={24} />, color: 'purple' },
    ];

    return (
        <div className="invoice-stats-grid">
            {statsData.map((stat, i) => (
                <div key={i} className="invoice-stat-card">
                    <div className="stat-content">
                        <h4>{stat.label}</h4>
                        <h2>{stat.value}</h2>
                    </div>
                    <div className={`stat-icon-wrapper ${stat.color}`}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InvoiceStats;
