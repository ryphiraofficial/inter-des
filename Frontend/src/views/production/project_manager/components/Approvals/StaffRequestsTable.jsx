import React from 'react';
import { UserX, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

const StaffRequestsTable = ({ filteredApprovals, expandedRow, toggleRow, handleActionStaffRequest }) => {
    return (
        <div className="pm-table-container">
            <table className="pm-table">
                <thead>
                    <tr>
                        <th>Replacement For</th>
                        <th className="pm-desktop-only">Project</th>
                        <th className="pm-desktop-only">Reason</th>
                        <th className="pm-desktop-only">Requested By</th>
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
                                        <UserX size={16} color="#ef4444" />
                                        {item.currentStaffId?.fullName}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Role: {item.staffType}</div>
                                </td>
                                <td className="pm-desktop-only">
                                    <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{item.projectId?.projectName}</div>
                                </td>
                                <td className="pm-desktop-only">
                                    <div style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.reason}>
                                        {item.reason}
                                    </div>
                                </td>
                                <td className="pm-desktop-only">
                                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>{item.requestedBy?.fullName}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td>
                                    <span className={`pm-status-badge ${item.status.toLowerCase() === 'approved' ? 'active' : item.status.toLowerCase() === 'rejected' ? 'on-hold' : 'planning'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="pm-desktop-only">
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        {item.status.toLowerCase() === 'pending' && (
                                            <>
                                                <button onClick={(e) => { e.stopPropagation(); handleActionStaffRequest(item._id, 'Rejected'); }} className="pm-icon-btn" title="Reject" style={{ color: '#ef4444', background: '#fee2e2' }}>
                                                    <XCircle size={16} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleActionStaffRequest(item._id, 'Approved'); }} className="pm-icon-btn" title="Approve" style={{ color: '#10b981', background: '#dcfce7' }}>
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
                                                    <span className="pm-expanded-label">Project</span>
                                                    <span className="pm-expanded-value">{item.projectId?.projectName}</span>
                                                </div>
                                                <div className="pm-expanded-item">
                                                    <span className="pm-expanded-label">Reason for replacement</span>
                                                    <span className="pm-expanded-value" style={{ fontWeight: 400, fontStyle: 'italic' }}>"{item.reason}"</span>
                                                </div>
                                                <div className="pm-expanded-item">
                                                    <span className="pm-expanded-label">Requested By</span>
                                                    <span className="pm-expanded-value">{item.requestedBy?.fullName} ({new Date(item.createdAt).toLocaleDateString()})</span>
                                                </div>
                                            </div>
                                            {item.status.toLowerCase() === 'pending' && (
                                                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                                                    <button onClick={() => handleActionStaffRequest(item._id, 'Rejected')} className="pm-quick-action-btn" style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }}>
                                                        Reject
                                                    </button>
                                                    <button onClick={() => handleActionStaffRequest(item._id, 'Approved')} className="pm-quick-action-btn" style={{ flex: 1, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                                                        Approve
                                                    </button>
                                                </div>
                                            )}
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

export default StaffRequestsTable;
