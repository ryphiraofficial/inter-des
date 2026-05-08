import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, MessageSquare, ExternalLink, Plus, Filter, X, Users, UserX, ChevronDown } from 'lucide-react';
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
                        <div className="pm-filter-chip">
                            {filterStatus}
                            <button onClick={() => setFilterStatus('all')} className="pm-filter-chip-close">
                                <X size={12} />
                            </button>
                        </div>
                    )}
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
                                    onClick={() => setFilterStatus(s)} 
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
                    onClick={() => setActiveTab('general')}
                    className={`pm-approvals-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                >
                    <FileText size={18} /> General
                </button>
                <button 
                    onClick={() => setActiveTab('staff')}
                    className={`pm-approvals-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
                >
                    <Users size={18} /> Staff
                </button>
                <button 
                    onClick={() => setActiveTab('leaves')}
                    className={`pm-approvals-tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
                >
                    <Clock size={18} /> Leaves
                </button>
            </div>

            {error && <div className="pm-error-message">{error}</div>}

            <div className={activeTab !== 'leaves' ? "pm-card" : ""} style={{ padding: activeTab === 'leaves' ? 0 : undefined, overflow: 'hidden' }}>
                {loading && activeTab !== 'leaves' ? (
                    <div className="pm-mobile-approvals-list" style={{ display: 'block', padding: '1rem' }}>
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={`approval-skeleton-${idx}`} className="pm-approval-mobile-card">
                                <div className="pm-skeleton-line" style={{ width: '62%', marginBottom: '10px' }} />
                                <div className="pm-skeleton-line" style={{ width: '42%', marginBottom: '14px' }} />
                                <div className="pm-skeleton-line" style={{ width: '85%', marginBottom: '8px' }} />
                                <div className="pm-skeleton-line" style={{ width: '74%' }} />
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'general' ? (
                    <>
                        {/* Desktop Table */}
                        <div className="pm-table-container pm-desktop-only">
                            <table className="pm-table">
                                <thead>
                                    <tr>
                                        <th>Request Details</th>
                                        <th>Project</th>
                                        <th>Submitted By</th>
                                        <th>Stage / Value</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApprovals.map(item => (
                                        <tr key={item._id} className="pm-table-row">
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {item.requestType === 'Vendor' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>}
                                                    {item.requestTitle}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={12} /> {new Date(item.submittedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{item.projectName}</div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div className="pm-team-avatar" style={{ width: '24px', height: '24px', fontSize: '0.7rem', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                                                        {item.submittedBy ? item.submittedBy.split(' ').map(n=>n[0]).join('').substring(0,2) : '?'}
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#334155' }}>{item.submittedBy}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="pm-status-badge planning" style={{ display: 'inline-block', marginBottom: '4px' }}>{TYPE_LABELS[item.requestType] || item.requestType}</span>
                                                {item.value > 0 && <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{formatCurrency(item.value)}</div>}
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                                                    background: item.status.toLowerCase() === 'approved' ? '#dcfce7' : item.status.toLowerCase() === 'rejected' ? '#fee2e2' : '#fef3c7',
                                                    color: item.status.toLowerCase() === 'approved' ? '#16a34a' : item.status.toLowerCase() === 'rejected' ? '#ef4444' : '#d97706'
                                                }}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button className="pm-icon-btn" title="View Details" style={{ color: '#3b82f6', background: '#eff6ff' }}>
                                                        <ExternalLink size={16} />
                                                    </button>
                                                    {item.status.toLowerCase() === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleUpdateStatus(item._id, 'rejected')} className="pm-icon-btn" title="Reject" style={{ color: '#ef4444', background: '#fee2e2' }}>
                                                                <XCircle size={16} />
                                                            </button>
                                                            <button onClick={() => handleUpdateStatus(item._id, 'approved')} className="pm-icon-btn" title="Approve" style={{ color: '#10b981', background: '#dcfce7' }}>
                                                                <CheckCircle size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List */}
                        <div className="pm-mobile-approvals-list">
                            {filteredApprovals.map(item => (
                                <div key={item._id} className="pm-approval-mobile-card">
                                    <div className="pm-approval-card-header">
                                        <div>
                                            <div className="pm-approval-card-title">{item.requestTitle}</div>
                                            <div className="pm-approval-card-project">
                                                <FileText size={14} /> {item.projectName}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                                            background: item.status.toLowerCase() === 'approved' ? '#dcfce7' : item.status.toLowerCase() === 'rejected' ? '#fee2e2' : '#fef3c7',
                                            color: item.status.toLowerCase() === 'approved' ? '#16a34a' : item.status.toLowerCase() === 'rejected' ? '#ef4444' : '#d97706'
                                        }}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="pm-approval-card-meta">
                                        <div className="pm-approval-meta-item">
                                            <span className="pm-approval-meta-label">Submitted By</span>
                                            <span className="pm-approval-meta-value">{item.submittedBy}</span>
                                        </div>
                                        <div className="pm-approval-meta-item">
                                            <span className="pm-approval-meta-label">Type / Value</span>
                                            <span className="pm-approval-meta-value">
                                                {item.requestType} {item.value > 0 ? `(${formatCurrency(item.value)})` : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pm-approval-card-actions">
                                        <button className="pm-icon-btn" style={{ color: '#3b82f6', background: '#eff6ff' }}>
                                            <ExternalLink size={16} />
                                        </button>
                                        {item.status.toLowerCase() === 'pending' && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(item._id, 'rejected')} className="pm-icon-btn" style={{ color: '#ef4444', background: '#fee2e2' }}>
                                                    <XCircle size={16} />
                                                </button>
                                                <button onClick={() => handleUpdateStatus(item._id, 'approved')} className="pm-icon-btn" style={{ color: '#10b981', background: '#dcfce7' }}>
                                                    <CheckCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'staff' ? (
                    <>
                        {/* Desktop Table */}
                        <div className="pm-table-container pm-desktop-only">
                            <table className="pm-table">
                                <thead>
                                    <tr>
                                        <th>Replacement For</th>
                                        <th>Project</th>
                                        <th>Reason</th>
                                        <th>Requested By</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApprovals.map(item => (
                                        <tr key={item._id} className="pm-table-row">
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <UserX size={16} color="#ef4444" />
                                                    {item.currentStaffId?.fullName}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Role: {item.staffType}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{item.projectId?.projectName}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.reason}>
                                                    {item.reason}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem', color: '#334155' }}>{item.requestedBy?.fullName}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                                                    background: item.status.toLowerCase() === 'approved' ? '#dcfce7' : item.status.toLowerCase() === 'rejected' ? '#fee2e2' : '#fef3c7',
                                                    color: item.status.toLowerCase() === 'approved' ? '#16a34a' : item.status.toLowerCase() === 'rejected' ? '#ef4444' : '#d97706'
                                                }}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    {item.status.toLowerCase() === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleActionStaffRequest(item._id, 'Rejected')} className="pm-icon-btn" title="Reject" style={{ color: '#ef4444', background: '#fee2e2' }}>
                                                                <XCircle size={16} />
                                                            </button>
                                                            <button onClick={() => handleActionStaffRequest(item._id, 'Approved')} className="pm-icon-btn" title="Approve" style={{ color: '#10b981', background: '#dcfce7' }}>
                                                                <CheckCircle size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List */}
                        <div className="pm-mobile-approvals-list">
                            {filteredApprovals.map(item => (
                                <div key={item._id} className="pm-approval-mobile-card">
                                    <div className="pm-approval-card-header">
                                        <div>
                                            <div className="pm-approval-card-title">{item.currentStaffId?.fullName}</div>
                                            <div className="pm-approval-card-project">
                                                <UserX size={14} /> {item.staffType}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                                            background: item.status.toLowerCase() === 'approved' ? '#dcfce7' : item.status.toLowerCase() === 'rejected' ? '#fee2e2' : '#fef3c7',
                                            color: item.status.toLowerCase() === 'approved' ? '#16a34a' : item.status.toLowerCase() === 'rejected' ? '#ef4444' : '#d97706'
                                        }}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', fontStyle: 'italic' }}>
                                        "{item.reason}"
                                    </div>
                                    <div className="pm-approval-card-meta">
                                        <div className="pm-approval-meta-item">
                                            <span className="pm-approval-meta-label">Project</span>
                                            <span className="pm-approval-meta-value">{item.projectId?.projectName}</span>
                                        </div>
                                        <div className="pm-approval-meta-item">
                                            <span className="pm-approval-meta-label">Requested By</span>
                                            <span className="pm-approval-meta-value">{item.requestedBy?.fullName}</span>
                                        </div>
                                    </div>
                                    <div className="pm-approval-card-actions">
                                        {item.status.toLowerCase() === 'pending' && (
                                            <>
                                                <button onClick={() => handleActionStaffRequest(item._id, 'Rejected')} className="pm-icon-btn" style={{ color: '#ef4444', background: '#fee2e2' }}>
                                                    <XCircle size={16} />
                                                </button>
                                                <button onClick={() => handleActionStaffRequest(item._id, 'Approved')} className="pm-icon-btn" style={{ color: '#10b981', background: '#dcfce7' }}>
                                                    <CheckCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'leaves' ? (
                    <div style={{ padding: '0 1rem' }}>
                        <LeaveApprovals />
                    </div>
                ) : null}
                
                {activeTab !== 'leaves' && filteredApprovals.length === 0 && !loading && (
                    <div className="pm-loading-state">No requests found for this filter.</div>
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
