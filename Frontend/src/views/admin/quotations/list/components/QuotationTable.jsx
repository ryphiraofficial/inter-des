import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, Trash2, ChevronDown } from 'lucide-react';

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'approved': return 'q-status-approved';
        case 'under review': return 'q-status-pending';
        case 'rejected': return 'q-status-rejected';
        default: return 'q-status-default';
    }
};

const QuotationTable = ({ quotations, expandedRow, toggleRow, handleApprove, handleDelete, isStaff, canApprove, submitting }) => {
    return (
        <div className="quotations-table-container">
            <table className="quotations-table">
                <thead>
                    <tr>
                        <th>Quote #</th>
                        <th>Project & Client</th>
                        <th className="desktop-hide">Amount</th>
                        <th className="desktop-hide">Date</th>
                        <th className="desktop-hide">Status</th>
                        <th className="desktop-hide">Actions</th>
                        <th className="mobile-show">Amount</th>
                        <th className="mobile-show"></th>
                    </tr>
                </thead>
                <tbody>
                    {quotations.map((q) => (
                        <React.Fragment key={q._id}>
                            <tr 
                                className={`q-row ${expandedRow === q._id ? 'expanded' : ''}`}
                                onClick={() => window.innerWidth <= 768 && toggleRow(q._id)}
                            >
                                <td className="quote-number-cell">#{q.quotationNumber}</td>
                                <td>
                                    <div className="project-client-cell">
                                        <span className="project-name">{q.projectName}</span>
                                        <span className="client-name">{q.client?.name || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="desktop-hide">₹{(q.totalAmount || 0).toLocaleString()}</td>
                                <td className="desktop-hide">{new Date(q.createdAt).toLocaleDateString()}</td>
                                <td className="desktop-hide">
                                    <span className={`q-status-badge ${getStatusClass(q.status)}`}>
                                        {q.status}
                                    </span>
                                </td>
                                <td className="desktop-hide">
                                    <div className="q-action-buttons">
                                        <Link to={`/quotations/view/${q._id}`} className="btn-icon view" title="View">
                                            <Eye size={18} />
                                        </Link>
                                        {!isStaff && canApprove && q.status === 'Under Review' && (
                                            <button
                                                className="btn-icon approve"
                                                onClick={(e) => { e.stopPropagation(); handleApprove(q); }}
                                                disabled={submitting}
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        {!isStaff && canApprove && (
                                            <button
                                                className="btn-icon delete"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(q._id); }}
                                                disabled={submitting}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="mobile-show">
                                    <span className="mobile-amount">₹{(q.totalAmount || 0).toLocaleString()}</span>
                                </td>
                                <td className="mobile-show toggle-cell">
                                    <ChevronDown size={18} className={`toggle-icon ${expandedRow === q._id ? 'active' : ''}`} />
                                </td>
                            </tr>
                            {expandedRow === q._id && (
                                <tr className="mobile-expansion-row mobile-show">
                                    <td colSpan="8">
                                        <div className="expansion-content">
                                            <div className="info-grid">
                                                <div className="info-item">
                                                    <label>Date</label>
                                                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="info-item">
                                                    <label>Status</label>
                                                    <span className={`q-status-badge ${getStatusClass(q.status)}`}>
                                                        {q.status}
                                                    </span>
                                                </div>
                                                <div className="info-item">
                                                    <label>Items</label>
                                                    <span>{q.lineItems?.length || 0} Items</span>
                                                </div>
                                            </div>
                                            <div className="expansion-actions">
                                                <Link to={`/quotations/view/${q._id}`} className="btn-mobile-action primary">
                                                    <Eye size={16} />
                                                    View Detailed Quote
                                                </Link>
                                                {!isStaff && canApprove && q.status === 'Under Review' && (
                                                    <button className="btn-mobile-action success" onClick={() => handleApprove(q)}>
                                                        <CheckCircle size={16} />
                                                        Approve Quotation
                                                    </button>
                                                )}
                                                {!isStaff && canApprove && (
                                                    <button className="btn-mobile-action danger" onClick={() => handleDelete(q._id)}>
                                                        <Trash2 size={16} />
                                                        Delete Quotation
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuotationTable;
