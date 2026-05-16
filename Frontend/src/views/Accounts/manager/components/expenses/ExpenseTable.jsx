import React from 'react';
import { FileText, Edit2, Trash2 } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';

const ExpenseTable = ({ loading, filtered, handleDelete }) => {
    const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
    const catColor = {
        'Materials': '#3b82f6', 'Labour': '#10b981', 'Transport': '#f59e0b',
        'Tools & Equipment': '#8b5cf6', 'Office': '#06b6d4', 'Utilities': '#ef4444', 'Miscellaneous': '#64748b'
    };

    if (loading) return <TableSkeleton rows={8} cols={7} />;

    if (filtered.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon"><FileText size={28} /></div>
                <h3>No expenses found</h3>
                <p>Adjust your filters or add a new expense to get started.</p>
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="expenses-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Vendor</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((e, i) => (
                        <tr key={e._id || i}>
                            <td style={{ color: '#64748b' }}>
                                {e.expenseDate ? new Date(e.expenseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </td>
                            <td style={{ fontWeight: 600, color: '#0f172a' }}>{e.description}</td>
                            <td>
                                <span className="category-badge" style={{ background: (catColor[e.category] || '#64748b') + '15', color: catColor[e.category] || '#64748b' }}>
                                    {e.category || 'Misc'}
                                </span>
                            </td>
                            <td style={{ color: '#475569' }}>
                                {typeof e.vendor === 'object' ? e.vendor?.name : (e.vendor || '—')}
                            </td>
                            <td style={{ fontWeight: 700, color: '#0f172a' }}>
                                {formatCurrency(e.amount)}
                            </td>
                            <td>
                                <span className={`status-badge status-${e.status?.toLowerCase() || 'paid'}`}>
                                    {e.status || 'Paid'}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="action-btn" title="Edit"><Edit2 size={16} /></button>
                                    <button className="action-btn delete" title="Delete" onClick={() => handleDelete(e._id)}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseTable;
