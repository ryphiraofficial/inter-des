import React, { useState } from 'react';
import { FileText, Edit2, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';

const ExpenseTable = ({ loading, filtered, handleDelete, handleEdit }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    return (
        <>
            {/* Desktop Table View */}
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
                        {paginatedData.map((e, i) => (
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
                                    {e.vendorName || (typeof e.vendor === 'object' ? e.vendor?.name : (e.vendor || '—'))}
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
                                        <button className="action-btn" title="Edit" onClick={() => handleEdit(e)}><Edit2 size={16} /></button>
                                        <button className="action-btn delete" title="Delete" onClick={() => handleDelete(e._id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Dropdown/Accordion View */}
            <div className="expense-mobile-container">
                {paginatedData.map((e, i) => {
                    const id = e._id || i;
                    const isExpanded = expandedId === id;
                    const dateStr = e.expenseDate ? new Date(e.expenseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                    
                    return (
                        <div key={id} className="expense-mobile-card">
                            <div className="expense-mobile-header" onClick={() => toggleExpand(id)}>
                                <div className="expense-mobile-info">
                                    <div className="expense-avatar">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <span className="expense-name">{e.description?.slice(0, 20)}{e.description?.length > 20 ? '...' : ''}</span>
                                        <span className="expense-date-sm">{dateStr}</span>
                                    </div>
                                </div>
                                <div className="expense-amount-sm">
                                    {formatCurrency(e.amount)}
                                    <div className={`expense-mobile-toggle ${isExpanded ? 'expanded' : ''}`}>
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`expense-mobile-details ${isExpanded ? 'expanded' : ''}`}>
                                <div className="expense-detail-row">
                                    <span className="expense-detail-label">Category</span>
                                    <span className="expense-detail-value">
                                        <span className="category-badge" style={{ padding: '2px 8px', fontSize: '11px', background: (catColor[e.category] || '#64748b') + '15', color: catColor[e.category] || '#64748b' }}>
                                            {e.category || 'Misc'}
                                        </span>
                                    </span>
                                </div>
                                <div className="expense-detail-row">
                                    <span className="expense-detail-label">Vendor</span>
                                    <span className="expense-detail-value">{e.vendorName || (typeof e.vendor === 'object' ? e.vendor?.name : (e.vendor || '—'))}</span>
                                </div>
                                <div className="expense-detail-row">
                                    <span className="expense-detail-label">Status</span>
                                    <span className="expense-detail-value">
                                        <span className={`status-badge status-${e.status?.toLowerCase() || 'paid'}`} style={{ padding: '2px 8px', fontSize: '11px' }}>
                                            {e.status || 'Paid'}
                                        </span>
                                    </span>
                                </div>
                                
                                <div className="expense-mobile-actions">
                                    <button className="btn-mobile-edit" onClick={() => handleEdit(e)}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button className="btn-mobile-delete" onClick={() => handleDelete(e._id)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 10px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1}
                            style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === 1 ? '#f8fafc' : '#fff', color: currentPage === 1 ? '#cbd5e1' : '#475569', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages}
                            style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === totalPages ? '#f8fafc' : '#fff', color: currentPage === totalPages ? '#cbd5e1' : '#475569', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ExpenseTable;
