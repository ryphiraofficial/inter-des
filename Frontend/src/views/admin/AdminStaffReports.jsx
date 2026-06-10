import React, { useState } from 'react';
import { 
    useGetStaffReportsQuery,
    useUpdateStaffReportStatusMutation
} from '../../store/api/sharedApi';
import { FileText, MessageSquare, AlertCircle, Clock, CheckCircle, Search, Filter, X } from 'lucide-react';
import { useToast } from '../../models/context/ToastContext';
import './css/AdminStaffReports.css';

const AdminStaffReports = () => {
    const { showToast } = useToast();
    const { data: reportsRes, isLoading, refetch } = useGetStaffReportsQuery();
    const reports = reportsRes?.data || [];
    
    const [updateStatus, { isLoading: isUpdating }] = useUpdateStaffReportStatusMutation();

    const [selectedReport, setSelectedReport] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const handleUpdateStatus = async (reportId, newStatus) => {
        try {
            await updateStatus({ id: reportId, status: newStatus, adminNotes }).unwrap();
            showToast('Report updated successfully', 'success');
            setSelectedReport(null);
            setAdminNotes('');
            refetch();
        } catch (err) {
            showToast(err?.data?.message || 'Failed to update report', 'error');
        }
    };

    const getStatusBadge = (status) => {
        const className = `status-badge ${status.replace(' ', '-')}`;
        switch(status) {
            case 'Resolved': return <span className={className}><CheckCircle size={14}/> Resolved</span>;
            case 'In Progress': return <span className={className}><Clock size={14}/> In Progress</span>;
            default: return <span className={className}><AlertCircle size={14}/> Pending</span>;
        }
    };

    const filteredReports = reports.filter(r => {
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = r.title.toLowerCase().includes(searchLower) || 
                              r.submittedBy?.fullName?.toLowerCase().includes(searchLower) ||
                              r.type.toLowerCase().includes(searchLower);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="admin-staff-reports">
            <div className="page-header">
                <div>
                    <h1>Staff Reports</h1>
                    <p>Manage and resolve issues, feedback, and daily updates submitted by staff.</p>
                </div>
            </div>

            <div className="controls-bar">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search reports..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <Filter size={18} className="filter-icon" />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-state">Loading reports...</div>
            ) : (
                <div className="reports-grid">
                    {filteredReports.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={48} />
                            <p>No reports found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredReports.map(report => (
                            <div key={report._id} className="report-item-card">
                                <div className="report-item-header">
                                    <h3 className="report-title">{report.title}</h3>
                                    {getStatusBadge(report.status)}
                                </div>
                                
                                <div className="report-meta">
                                    <span className="meta-type">
                                        <FileText size={14}/> {report.type}
                                    </span>
                                    <span className={`meta-priority priority-${report.priority}`}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                        {report.priority}
                                    </span>
                                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="user-row">
                                    <div className="user-avatar">
                                        {report.submittedBy?.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="user-details">
                                        <span className="user-name">{report.submittedBy?.fullName || 'Unknown'}</span>
                                        <span className="user-role">{report.submittedBy?.role || 'Staff'}</span>
                                    </div>
                                    <button 
                                        className="btn-review"
                                        onClick={() => {
                                            setSelectedReport(report);
                                            setAdminNotes(report.adminNotes || '');
                                        }}
                                    >
                                        Review Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedReport && (
                <div className="drawer-overlay" onClick={() => setSelectedReport(null)}>
                    <div className="drawer-content" onClick={e => e.stopPropagation()}>
                        <div className="drawer-header">
                            <h2>Report Details</h2>
                            <button className="btn-close" onClick={() => setSelectedReport(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="drawer-body">
                            <div className="detail-section">
                                <h3>Overview</h3>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                        {selectedReport.title}
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        {getStatusBadge(selectedReport.status)}
                                        <span className={`meta-priority priority-${selectedReport.priority}`}>
                                            {selectedReport.priority} Priority
                                        </span>
                                        <span className="meta-type">{selectedReport.type}</span>
                                    </div>
                                </div>
                                <div className="user-row" style={{ borderTop: 'none', padding: '16px 0', borderBottom: '1px solid #f1f5f9', margin: '0 0 24px 0' }}>
                                    <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                                        {selectedReport.submittedBy?.fullName?.charAt(0)}
                                    </div>
                                    <div className="user-details">
                                        <span className="user-name" style={{ fontSize: '16px' }}>{selectedReport.submittedBy?.fullName}</span>
                                        <span className="user-role">{selectedReport.submittedBy?.role} • Submitted on {new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h3>Description</h3>
                                <div className="report-description">
                                    {selectedReport.description}
                                </div>
                            </div>

                            <div className="admin-response-section">
                                <h3><MessageSquare size={18} /> Admin Response & Resolution</h3>
                                <p style={{ fontSize: '13px', color: '#92400e', marginBottom: '16px' }}>
                                    Notes entered here will be visible to the staff member who submitted the report.
                                </p>
                                <textarea 
                                    className="admin-textarea"
                                    placeholder="Enter your response or resolution details here..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                />
                                <div className="action-buttons">
                                    {selectedReport.status !== 'Pending' && (
                                        <button 
                                            className="btn-status btn-pending"
                                            onClick={() => handleUpdateStatus(selectedReport._id, 'Pending')}
                                            disabled={isUpdating}
                                        >
                                            Mark Pending
                                        </button>
                                    )}
                                    {selectedReport.status !== 'In Progress' && (
                                        <button 
                                            className="btn-status btn-progress"
                                            onClick={() => handleUpdateStatus(selectedReport._id, 'In Progress')}
                                            disabled={isUpdating}
                                        >
                                            Mark In Progress
                                        </button>
                                    )}
                                    {selectedReport.status !== 'Resolved' && (
                                        <button 
                                            className="btn-status btn-resolve"
                                            onClick={() => handleUpdateStatus(selectedReport._id, 'Resolved')}
                                            disabled={isUpdating}
                                        >
                                            <CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
                                            Mark Resolved
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStaffReports;
