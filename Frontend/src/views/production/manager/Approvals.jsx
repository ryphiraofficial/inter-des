import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, MessageSquare, ExternalLink, Plus, Filter, X, Users, UserX, ChevronDown, AlertCircle } from 'lucide-react';
import '../css/ProductionManagement.css';
import { approvalAPI, productionAPI } from '../../../models/api';
import LeaveApprovals from '../shared/LeaveApprovals';
import CustomSelect from '../../common/CustomSelect';

const TYPE_LABELS = {
    'Material': 'Material Request',
    'Milestone': 'Milestone Review',
    'Vendor': 'Vendor Approval',
    'Design': 'Design Variance'
};

const Approvals = () => {
    const [approvals, setApprovals] = useState([]);
    const [staffRequests, setStaffRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('general'); // 'general' or 'staff'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };
    
    const [newRequest, setNewRequest] = useState({
        requestTitle: '',
        projectName: '',
        submittedBy: '',
        requestType: 'Material',
        value: ''
    });

    const fetchApprovals = async () => {
        try {
            setLoading(true);
            const [genRes, staffRes] = await Promise.all([
                approvalAPI.getApprovals(),
                productionAPI.getReplacementRequests()
            ]);
            
            if (genRes.success) setApprovals(genRes.data);
            if (staffRes.success) setStaffRequests(staffRes.data);
            
            if (!genRes.success && !staffRes.success) {
                setError("Failed to fetch data");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    useEffect(() => {
        const handleOpenModal = () => setIsModalOpen(true);
        window.addEventListener('open-create-approval-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-approval-modal', handleOpenModal);
    }, []);

    const filteredApprovals = (activeTab === 'general' ? approvals : staffRequests).filter(item => {
        if (filterStatus === 'all') return true;
        // Normalize casing for comparison
        return item.status.toLowerCase() === filterStatus.toLowerCase();
    });

    const pendingCount = (activeTab === 'general' ? approvals : staffRequests).filter(item => item.status.toLowerCase() === 'pending').length;

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...newRequest,
                value: newRequest.value ? Number(newRequest.value) : 0
            };
            const res = await approvalAPI.createApproval(dataToSubmit);
            if (res.success) {
                setIsModalOpen(false);
                setNewRequest({ requestTitle: '', projectName: '', submittedBy: '', requestType: 'Material', value: '' });
                fetchApprovals();
            } else {
                alert("Error: " + res.message);
            }
        } catch (err) {
            alert("Error creating request: " + err.message);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await approvalAPI.updateApproval(id, { status: newStatus });
            if (res.success) {
                fetchApprovals();
            } else {
                alert("Error updating status: " + res.message);
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const handleActionStaffRequest = async (id, status) => {
        const remarks = prompt("Enter remarks (optional):");
        try {
            const res = await productionAPI.actionReplacementRequest(id, { status, adminRemarks: remarks });
            if (res.success) {
                fetchStaffRequests(); // Wait, I should just use fetchApprovals()
                fetchApprovals();
            } else {
                alert("Error: " + res.message);
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const formatCurrency = (value) => {
        if (!value) return null;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="pm-dashboard">
            {/* Toolbar */}
            <div className="pm-approvals-toolbar">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            onClick={() => setFiltersOpen(o => !o)}
                            className={`pm-filter-toggle-btn ${filtersOpen ? 'active' : ''}`}
                        >
                            <Filter size={15} />
                            <span className="pm-desktop-only">Filters</span>
                            {filterStatus !== 'all' && (
                                <span className="pm-filter-count">1</span>
                            )}
                            <ChevronDown size={14} className={`pm-chevron ${filtersOpen ? 'open' : ''}`} />
                        </button>
                        {filterStatus !== 'all' && (
                            <div className="pm-filter-chip pm-desktop-only">
                                {filterStatus}
                                <button onClick={() => setFilterStatus('all')} className="pm-filter-chip-close">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsModalOpen(true)} className="pm-quick-action-btn">
                        <Plus size={16} /> <span>New Request</span>
                    </button>
                </div>
            </div>

            {/* Collapsible Filter Panel */}
            <div className={`pm-filter-panel-wrapper ${filtersOpen ? 'open' : ''}`}>
                <div className="pm-filter-panel">
                    <div className="pm-status-chips">
                        <span className="pm-status-label">Status:</span>
                        <div className="pm-status-chips-scroll">
                            {['all', 'Pending', 'Approved', 'Rejected'].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => { setFilterStatus(s); setFiltersOpen(false); }} 
                                    className={`pm-status-chip-btn ${filterStatus === s ? 'active' : ''}`}
                                >
                                    {s === 'all' ? 'All Statuses' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-tabs */}
            <div className="pm-approvals-tabs">
                <button 
                    onClick={() => { setActiveTab('general'); setExpandedRow(null); }}
                    className={`pm-approvals-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                >
                    <FileText size={18} /> <span>General Approvals</span>
                </button>
                <button 
                    onClick={() => { setActiveTab('staff'); setExpandedRow(null); }}
                    className={`pm-approvals-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
                >
                    <Users size={18} /> <span>Staff Replacements</span>
                </button>
                <button 
                    onClick={() => { setActiveTab('leaves'); setExpandedRow(null); }}
                    className={`pm-approvals-tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
                >
                    <Clock size={18} /> <span>Team Leaves</span>
                </button>
            </div>

            {error && <div className="pm-error-message">{error}</div>}

            <div className={activeTab !== 'leaves' ? "pm-card" : ""} style={{ padding: 0, overflow: 'hidden', border: activeTab === 'leaves' ? 'none' : undefined, background: activeTab === 'leaves' ? 'transparent' : undefined, boxShadow: activeTab === 'leaves' ? 'none' : undefined }}>
                {loading && activeTab !== 'leaves' ? (
                    <div className="pm-loading-state">
                        <div className="pm-loading-spinner"></div>
                        <span>Loading requests...</span>
                    </div>
                ) : activeTab === 'general' ? (
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
                ) : activeTab === 'staff' ? (
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
                ) : activeTab === 'leaves' ? (
                    <div style={{ padding: '0' }}>
                        <LeaveApprovals />
                    </div>
                ) : null}
                
                {activeTab !== 'leaves' && filteredApprovals.length === 0 && !loading && (
                    <div className="pm-loading-state">
                        <AlertCircle size={24} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                        <span>No requests found for this filter.</span>
                    </div>
                )}
            </div>

            {/* Add Request Modal */}
            {isModalOpen && (
                <div className="pm-modal-overlay">
                    <div className="pm-modal">
                        <div className="pm-modal-header">
                            <h2>Create Approval Request</h2>
                            <button onClick={() => setIsModalOpen(false)} className="pm-modal-close"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateRequest} className="pm-modal-form">
                            <div className="pm-form-group">
                                <label>Request Title *</label>
                                <input required type="text" value={newRequest.requestTitle} onChange={e => setNewRequest({...newRequest, requestTitle: e.target.value})} />
                            </div>
                            <div className="pm-form-group">
                                <label>Project Name *</label>
                                <input required type="text" value={newRequest.projectName} onChange={e => setNewRequest({...newRequest, projectName: e.target.value})} />
                            </div>
                            <div className="pm-form-group">
                                <label>Submitted By *</label>
                                <input required type="text" value={newRequest.submittedBy} onChange={e => setNewRequest({...newRequest, submittedBy: e.target.value})} />
                            </div>
                            <div className="pm-form-group">
                                <label>Request Type</label>
                                <select value={newRequest.requestType} onChange={e => setNewRequest({...newRequest, requestType: e.target.value})} style={{ background: 'white' }}>
                                    <option value="Material">Material</option>
                                    <option value="Milestone">Milestone</option>
                                    <option value="Vendor">Vendor</option>
                                    <option value="Design">Design</option>
                                </select>
                            </div>
                            <div className="pm-form-group">
                                <label>Value / Amount (Optional)</label>
                                <input type="number" min="0" value={newRequest.value} onChange={e => setNewRequest({...newRequest, value: e.target.value})} />
                            </div>
                            
                            <button type="submit" className="pm-modal-submit-btn">
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Approvals;
