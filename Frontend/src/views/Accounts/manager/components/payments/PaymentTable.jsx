import React from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';

const PaymentTable = ({ loading, filtered, onDelete }) => {
    const methodColor = { 'Cash': '#10b981', 'Bank Transfer': '#3b82f6', 'Cheque': '#8b5cf6', 'UPI': '#f59e0b', 'Card': '#ef4444' };

    if (loading) return <TableSkeleton rows={8} cols={6} />;

    if (filtered.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <CreditCard size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p>No payments found.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                    <tr style={{ background: '#f8fafc' }}>
                        {['Date', 'Client', 'Method', 'Reference', 'Amount', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((p, i) => (
                        <tr key={p._id || i} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                                {new Date(p.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>{p.client?.name || '—'}</td>
                            <td style={{ padding: '14px 16px' }}>
                                <span style={{ background: (methodColor[p.paymentMethod] || '#6366f1') + '20', color: methodColor[p.paymentMethod] || '#6366f1', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                                    {p.paymentMethod}
                                </span>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{p.reference || '—'}</td>
                            <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10b981' }}>₹{Number(p.amount || 0).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '14px 16px' }}>
                                <button onClick={() => onDelete(p._id)} className="action-btn-sm delete"><Trash2 size={14} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentTable;
