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
                <div className="reports-table-container">
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Submitted By</th>
                                <th>Type</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">No reports found.</td>
                                </tr>
                            ) : (
                                filteredReports.map(report => (
                                    <tr key={report._id}>
                                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                        <td className="fw-600">{report.title}</td>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar">
                                                    {report.submittedBy?.fullName?.charAt(0) || 'U'}
                                                </div>
                                                <div className="user-info">
                                                    <span className="user-name">{report.submittedBy?.fullName || 'Unknown'}</span>
                                                    <span className="user-role">{report.submittedBy?.role || 'Staff'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="type-badge"><FileText size={12}/> {report.type}</span></td>
                                        <td>
                                            <span className={`priority-badge priority-${report.priority}`}>
                                                {report.priority}
                                            </span>
                                        </td>
                                        <td>{getStatusBadge(report.status)}</td>
                                        <td>
                                            <button 
                                                className="btn-view"
                                                onClick={() => {
                                                    setSelectedReport(report);
                                                    setAdminNotes(report.adminNotes || '');
                                                }}
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedReport && (
                <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Review Report</h2>
                            <button className="btn-close" onClick={() => setSelectedReport(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="report-details">
                                <div className="detail-group">
                                    <label>Title</label>
                                    <p className="detail-title">{selectedReport.title}</p>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-group">
                                        <label>Submitted By</label>
                                        <p>{selectedReport.submittedBy?.fullName}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Type</label>
                                        <p>{selectedReport.type}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Priority</label>
                                        <p className={`priority-text priority-${selectedReport.priority}`}>{selectedReport.priority}</p>
                                    </div>
                                </div>
                                <div className="detail-group">
                                    <label>Description</label>
                                    <div className="description-box">
                                        {selectedReport.description}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="admin-actions">
                                <h3><MessageSquare size={18} /> Admin Response</h3>
                                <div className="form-group">
                                    <label>Add Notes/Response (Visible to Staff)</label>
                                    <textarea 
                                        className="admin-textarea"
                                        placeholder="Enter your response or resolution details here..."
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                </div>
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
