import React from 'react';

export const ReportMetrics = ({ stats }) => {
    if (!stats) return null;
    const items = [
        { label: 'Total Revenue', val: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: '#10b981' },
        { label: 'Pending Payments', val: `₹${(stats.pendingPayments || 0).toLocaleString()}`, color: '#f59e0b' },
        { label: 'Total Projects', val: stats.totalProjects || 0, color: '#6366f1' },
        { label: 'Approved Quotations', val: stats.approvedQuotes || 0, color: '#8b5cf6' }
    ];

    return (
        <div className="report-metrics-grid">
            {items.map(i => (
                <div key={i.label} className="metric-card">
                    <p>{i.label}</p>
                    <h2 style={{ color: i.color }}>{i.val}</h2>
                </div>
            ))}
        </div>
    );
};

export const ReportSummaryTable = ({ quotations }) => {
    return (
        <div className="table-responsive-wrapper">
            <table className="accounts-table">
                <thead><tr><th>Quotation</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                    {quotations.map(q => (
                        <tr key={q._id}>
                            <td>{q.quotationNumber}</td>
                            <td>{q.client?.name}</td>
                            <td>₹{(q.grandTotal || 0).toLocaleString()}</td>
                            <td><span className={`badge-${q.status?.toLowerCase()}`}>{q.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
