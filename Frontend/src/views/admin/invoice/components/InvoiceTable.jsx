import React from 'react';
import { Download, CheckCircle, Trash2, ChevronDown, FileText } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';

const InvoiceTable = ({ 
    invoices, loading, expandedRow, toggleRow, handleUpdatePayment, handleDelete 
}) => {
    if (loading) {
        return <TableSkeleton rows={10} cols={6} />;
    }

    if (invoices.length === 0) {
        return (
            <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                <FileText size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <h3>No invoices found</h3>
            </div>
        );
    }

    return (
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
                {invoices.map((inv) => (
                    <React.Fragment key={inv._id}>
                        <tr 
                            className={`inv-row ${expandedRow === inv._id ? 'expanded' : ''}`}
                            onClick={() => window.innerWidth <= 768 && toggleRow(inv._id)}
                        >
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
                            <td className="desktop-hide">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                            <td className="desktop-hide">{new Date(inv.dueDate).toLocaleDateString()}</td>
                            <td className="amount-cell desktop-hide">₹{inv.grandTotal?.toLocaleString()}</td>
                            <td className="desktop-hide">
                                <span className={`status-badge ${inv.status?.toLowerCase()}`}>
                                    {inv.status}
                                </span>
                            </td>
                            <td className="desktop-hide">
                                <div className="invoice-actions">
                                    <button className="btn-inv-action primary" title="Download"><Download size={16} /></button>
                                    {inv.status !== 'Paid' && (
                                        <button
                                            className="btn-inv-action success"
                                            title="Mark Paid"
                                            onClick={(e) => { e.stopPropagation(); handleUpdatePayment(inv._id, inv.grandTotal - (inv.amountPaid || 0)); }}
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                    )}
                                    <button
                                        className="btn-inv-action danger"
                                        title="Delete"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(inv._id); }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                            <td className="mobile-show amount-cell">₹{inv.grandTotal?.toLocaleString()}</td>
                            <td className="mobile-show toggle-cell">
                                <ChevronDown size={18} className={`toggle-icon ${expandedRow === inv._id ? 'active' : ''}`} />
                            </td>
                        </tr>
                        {expandedRow === inv._id && (
                            <tr className="mobile-expansion-row mobile-show">
                                <td colSpan="4">
                                    <div className="expansion-content">
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <label>Invoice Date</label>
                                                <span>{new Date(inv.invoiceDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="info-item">
                                                <label>Due Date</label>
                                                <span>{new Date(inv.dueDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="info-item">
                                                <label>Status</label>
                                                <span className={`status-badge ${inv.status?.toLowerCase()}`}>{inv.status}</span>
                                            </div>
                                            <div className="info-item">
                                                <label>Paid Amount</label>
                                                <span>₹{(inv.amountPaid || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="expansion-actions">
                                            <button className="btn-mobile-action primary"><Download size={16} /> Download PDF</button>
                                            {inv.status !== 'Paid' && (
                                                <button className="btn-mobile-action success" onClick={() => handleUpdatePayment(inv._id, inv.grandTotal - (inv.amountPaid || 0))}>
                                                    <CheckCircle size={16} /> Mark as Paid
                                                </button>
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
    );
};

export default InvoiceTable;
