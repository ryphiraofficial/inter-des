import React from 'react';
import { Clock, ExternalLink, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

const TYPE_LABELS = {
    'Material': 'Material Request',
    'Milestone': 'Milestone Review',
    'Vendor': 'Vendor Approval',
    'Design': 'Design Variance'
};

const formatCurrency = (value) => {
    if (!value) return null;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

const GeneralApprovalsTable = ({ filteredApprovals, expandedRow, toggleRow, handleUpdateStatus }) => {
    return (
        <div className="pm-table-container">
            <table className="pm-table">
                <thead>
                    <tr>
                        <th>Request Details</th>
                        <th className="pm-desktop-only">Project</th>
                        <th className="pm-desktop-only">Submitted By</th>
                        <th className="pm-desktop-only">Stage / Value</th>
                        <th>Status</th>
                        <th className="pm-desktop-only" style={{ textAlign: 'right' }}>Actions</th>
                        <th className="pm-mobile-only"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApprovals.map(item => (
                        <React.Fragment key={item._id}>
                            <tr className={`pm-table-row ${expandedRow === item._id ? 'active' : ''}`} onClick={() => window.innerWidth <= 768 && toggleRow(item._id)}>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {item.requestType === 'Vendor' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>}
                                        {item.requestTitle}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} /> {new Date(item.submittedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                        <span className="pm-mobile-only" style={{ marginLeft: '4px', color: '#94a3b8' }}>• {item.projectName}</span>
                                    </div>
                                </td>
                                <td className="pm-desktop-only">
                                    <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{item.projectName}</div>
                                </td>
                                <td className="pm-desktop-only">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div className="pm-team-avatar" style={{ width: '24px', height: '24px', fontSize: '0.7rem', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                                            {item.submittedBy ? item.submittedBy.split(' ').map(n=>n[0]).join('').substring(0,2) : '?'}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: '#334155' }}>{item.submittedBy}</span>
                                    </div>
                                </td>
                                <td className="pm-desktop-only">
                                    <span className="pm-status-badge planning" style={{ display: 'inline-block', marginBottom: '4px' }}>{TYPE_LABELS[item.requestType] || item.requestType}</span>
                                    {item.value > 0 && <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{formatCurrency(item.value)}</div>}
                                </td>
                                <td>
                                    <span className={`pm-status-badge ${item.status.toLowerCase() === 'approved' ? 'active' : item.status.toLowerCase() === 'rejected' ? 'on-hold' : 'planning'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="pm-desktop-only">
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button className="pm-icon-btn" title="View Details" style={{ color: '#3b82f6', background: '#eff6ff' }}>
                                            <ExternalLink size={16} />
                                        </button>
                                        {item.status.toLowerCase() === 'pending' && (
                                            <>
                                                <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item._id, 'rejected'); }} className="pm-icon-btn" title="Reject" style={{ color: '#ef4444', background: '#fee2e2' }}>
                                                    <XCircle size={16} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item._id, 'approved'); }} className="pm-icon-btn" title="Approve" style={{ color: '#10b981', background: '#dcfce7' }}>
                                                    <CheckCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="pm-mobile-only">
                                    <ChevronDown size={18} style={{ color: '#94a3b8', transform: expandedRow === item._id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </td>
                            </tr>
                            {expandedRow === item._id && (
                                <tr className="pm-expanded-row">
                                    <td colSpan="7">
                                        <div className="pm-expanded-content">
                                            <div className="pm-expanded-grid">
                                                <div className="pm-expanded-item">
                                                    <span className="pm-expanded-label">Submitted By</span>
                                                    <span className="pm-expanded-value">{item.submittedBy}</span>
                                                </div>
                                                <div className="pm-expanded-item">
                                                    <span className="pm-expanded-label">Type / Category</span>
                                                    <span className="pm-expanded-value">{TYPE_LABELS[item.requestType] || item.requestType}</span>
                                                </div>
                                                {item.value > 0 && (
                                                    <div className="pm-expanded-item">
                                                        <span className="pm-expanded-label">Estimated Value</span>
                                                        <span className="pm-expanded-value">{formatCurrency(item.value)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                                                <button className="pm-quick-action-btn" style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                                                    <ExternalLink size={16} /> View Details
                                                </button>
                                                {item.status.toLowerCase() === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(item._id, 'rejected')} className="pm-quick-action-btn" style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }}>
                                                            Reject
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(item._id, 'approved')} className="pm-quick-action-btn" style={{ flex: 1, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                                                            Approve
                                                        </button>
                                                    </>
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

export default GeneralApprovalsTable;
