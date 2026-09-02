import React from 'react';

const InvoiceStats = ({ invoices = [] }) => {
    const unpaidTotal = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const overdueTotal = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const paidTotal = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.grandTotal || 0), 0);

    const statsData = [
        { label: 'Outstanding', value: `₹${unpaidTotal.toLocaleString('en-IN')}` },
        { label: 'Overdue', value: `₹${overdueTotal.toLocaleString('en-IN')}` },
        { label: 'Paid (Total)', value: `₹${paidTotal.toLocaleString('en-IN')}` },
        { label: 'Total Invoices', value: invoices.length },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
        }}>
            {statsData.map((stat, i) => (
                <div
                    key={i}
                    style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '6px'
                    }}>
                        {stat.label}
                    </span>
                    <h2 style={{
                        fontSize: '1.65rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '-0.03em',
                        margin: 0
                    }}>
                        {stat.value}
                    </h2>
                </div>
            ))}
        </div>
    );
};

export default InvoiceStats;
