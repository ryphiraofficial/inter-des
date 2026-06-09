import React, { useState } from 'react';
import { Download, CheckCircle, Trash2, ChevronDown, FileText, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';

const InvoiceTable = ({ 
    invoices, loading, expandedRow, toggleRow, handleUpdatePayment, handleDelete, onDownload, onView 
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    if (loading) return <TableSkeleton rows={10} cols={6} />;

    if (invoices.length === 0) {
        return (
            <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                <FileText size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <h3>No invoices found</h3>
            </div>
        );
    }

    const totalPages = Math.ceil(invoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = invoices.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    return (
        <>
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Client</th>
                        <th className="desktop-hide">Date</th>
                        <th className="desktop-hide">Due Date</th>
                        <th className="desktop-hide">Amount</th>
                        <th className="desktop-hide">Status</th>
                        <th className="desktop-hide">Actions</th>
                        <th className="mobile-show">Amount</th>
                        <th className="mobile-show"></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((inv) => (
                        <React.Fragment key={inv._id}>
                            <tr className={`inv-row ${expandedRow === inv._id ? 'expanded' : ''}`} onClick={() => window.innerWidth <= 768 && toggleRow(inv._id)}>
                                <td className="inv-id">{inv.invoiceNumber}</td>
                                <td className="client-name-cell">
                                    <div className="client-info">
                                        <span className="name">{inv.client?.name || 'Unknown'}</span>
                                        <span className="mobile-status-hint mobile-show">
                                            <span className={`status-dot ${inv.status?.toLowerCase()}`}></span>
                                            {inv.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="desktop-hide">{new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString()}</td>
                                <td className="desktop-hide">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                <td className="amount-cell desktop-hide">₹{inv.grandTotal?.toLocaleString() || inv.totalAmount?.toLocaleString() || 0}</td>
                                <td className="desktop-hide">
                                    <span className={`status-badge ${inv.status?.toLowerCase()}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="desktop-hide">
                                    <div className="invoice-actions">
                                        <button className="btn-inv-action primary" title="View" onClick={(e) => { e.stopPropagation(); onView && onView(inv); }}><Eye size={16} /></button>
                                        <button className="btn-inv-action primary" title="Download" onClick={(e) => { e.stopPropagation(); onDownload && onDownload(inv); }}><Download size={16} /></button>
                                        {inv.status !== 'Paid' && (
                                            <button className="btn-inv-action success" title="Mark Paid" onClick={(e) => { e.stopPropagation(); handleUpdatePayment(inv._id, inv.grandTotal - (inv.amountPaid || 0)); }}><CheckCircle size={16} /></button>
                                        )}
                                        <button className="btn-inv-action danger" title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(inv._id); }}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                                <td className="mobile-show amount-cell">₹{inv.grandTotal?.toLocaleString()}</td>
                                <td className="mobile-show toggle-cell"><ChevronDown size={18} className={`toggle-icon ${expandedRow === inv._id ? 'active' : ''}`} /></td>
                            </tr>
                            {expandedRow === inv._id && (
                                <tr className="mobile-expansion-row mobile-show">
                                    <td colSpan="4">
                                        <div className="expansion-content">
                                            <div className="info-grid">
                                                <div className="info-item"><label>Invoice Date</label><span>{new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString()}</span></div>
                                                <div className="info-item"><label>Due Date</label><span>{new Date(inv.dueDate).toLocaleDateString()}</span></div>
                                                <div className="info-item"><label>Status</label><span className={`status-badge ${inv.status?.toLowerCase()}`}>{inv.status}</span></div>
                                                <div className="info-item"><label>Paid Amount</label><span>₹{(inv.amountPaid || 0).toLocaleString()}</span></div>
                                            </div>
                                            <div className="expansion-actions">
                                                <button className="btn-mobile-action primary" onClick={() => onView && onView(inv)}><Eye size={16} /> View Invoice</button>
                                                <button className="btn-mobile-action primary" onClick={() => onDownload && onDownload(inv)}><Download size={16} /> Download PDF</button>
                                                {inv.status !== 'Paid' && (
                                                    <button className="btn-mobile-action success" onClick={() => handleUpdatePayment(inv._id, inv.grandTotal - (inv.amountPaid || 0))}><CheckCircle size={16} /> Mark as Paid</button>
                                                )}
                                                <button className="btn-mobile-action danger" onClick={() => handleDelete(inv._id)}><Trash2 size={16} /> Delete</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 10px', paddingBottom: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, invoices.length)} of {invoices.length} entries
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

export default InvoiceTable;
