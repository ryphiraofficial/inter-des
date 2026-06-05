import React, { useState } from 'react';
import { CreditCard, Trash2, ChevronDown } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';
import '../../../css/PaymentTable.css';

const PaymentTable = ({ loading, filtered, onDelete }) => {
    const [expandedRow, setExpandedRow] = useState(null);
    const methodColor = { 'Cash': '#10b981', 'Bank Transfer': '#3b82f6', 'Cheque': '#8b5cf6', 'UPI': '#f59e0b', 'Card': '#ef4444' };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

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
        <div className="payment-table-wrapper">
            <table className="payment-table">
                <thead>
                    <tr style={{ background: '#f8fafc' }}>
                        {['Date', 'Client', 'Method', 'Reference', 'Amount', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((p, i) => {
                        const rowId = p._id || i;
                        const isExpanded = expandedRow === rowId;
                        const dateStr = new Date(p.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        
                        return (
                            <tr key={rowId} className={isExpanded ? 'expanded' : ''} style={{ borderBottom: '1px solid #f8fafc' }}>
                                {/* Mobile Header cell (combines Client, Date, Amount for mobile, acts as normal Date cell on desktop) */}
                                <td className="mobile-header" style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                                    <span className="desktop-only">{dateStr}</span>
                                    <div className="mobile-only mobile-header-content" onClick={() => toggleRow(rowId)}>
                                        <div className="mobile-header-left">
                                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>{p.client?.name || '—'}</span>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>{dateStr}</span>
                                        </div>
                                        <div className="mobile-header-right">
                                            <span style={{ fontWeight: 700, color: '#10b981', fontSize: '15px' }}>₹{Number(p.amount || 0).toLocaleString('en-IN')}</span>
                                            <button className={`mobile-toggle-btn ${isExpanded ? 'expanded' : ''}`}>
                                                <ChevronDown size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                
                                {/* Desktop only Client cell */}
                                <td className="desktop-only-cell" style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>
                                    {p.client?.name || '—'}
                                </td>
                                
                                {/* Detail cells */}
                                <td className="detail-col" data-label="Method" style={{ padding: '14px 16px' }}>
                                    <span style={{ background: (methodColor[p.paymentMethod] || '#6366f1') + '20', color: methodColor[p.paymentMethod] || '#6366f1', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                                        {p.paymentMethod}
                                    </span>
                                </td>
                                <td className="detail-col" data-label="Reference" style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                                    {p.reference || '—'}
                                </td>
                                
                                {/* Desktop only Amount cell */}
                                <td className="desktop-only-cell" style={{ padding: '14px 16px', fontWeight: 700, color: '#10b981' }}>
                                    ₹{Number(p.amount || 0).toLocaleString('en-IN')}
                                </td>
                                
                                {/* Action cell */}
                                <td className="action-col" style={{ padding: '14px 16px' }}>
                                    <button onClick={() => onDelete(p._id)} className="action-btn-sm delete" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                                        <Trash2 size={14} /> <span className="mobile-only">Delete Payment</span>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentTable;
