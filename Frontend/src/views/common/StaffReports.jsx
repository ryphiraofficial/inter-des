import React, { useState } from 'react';
import { 
    useGetStaffReportsQuery, 
    useSubmitStaffReportMutation 
} from '../../store/api/sharedApi';
import { FileText, Send, Clock, CheckCircle, AlertCircle, Plus, X, MessageSquare } from 'lucide-react';
import { useToast } from '../../models/context/ToastContext';
import './css/StaffReports.css';

const StaffReports = () => {
    const { showToast } = useToast();
    const { data: reportsRes, isLoading, refetch } = useGetStaffReportsQuery();
    const reports = reportsRes?.data || [];
    
    const [submitReport, { isLoading: isSubmitting }] = useSubmitStaffReportMutation();
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        type: 'Daily Update',
        priority: 'Low',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitReport(formData).unwrap();
            showToast('Report submitted successfully', 'success');
            setShowForm(false);
            setFormData({ title: '', type: 'Daily Update', priority: 'Low', description: '' });
            refetch();
        } catch (err) {
            showToast(err?.data?.message || 'Failed to submit report', 'error');
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

    return (
        <div className="staff-reports-container">
            <div className="page-header">
                <div>
                    <h1>Reports</h1>
                    <p>Submit daily updates, feedback, or report issues to administration.</p>
                </div>
                <button 
                    className={`btn-new-report ${showForm ? 'close-mode' : ''}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Close Form' : 'New Report'}
                </button>
            </div>

            {showForm && (
                <div className="report-form-card">
                    <h2><FileText size={22} className="text-indigo-500" /> Submit New Report</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid-3">
                            <div className="report-form-group">
                                <label>Title</label>
                                <input 
                                    type="text" 
                                    className="report-input"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="Enter report title..."
                                />
                            </div>
                            <div className="report-form-group">
                                <label>Type</label>
                                <select 
                                    className="report-input"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Daily Update">Daily Update</option>
                                    <option value="Issue">Issue</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="report-form-group">
                                <label>Priority</label>
                                <select 
                                    className="report-input"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>
                        <div className="report-form-group" style={{ marginBottom: '1.5rem' }}>
                            <label>Description</label>
                            <textarea 
                                className="report-input"
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Provide detailed information..."
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="submit" 
                                className="btn-submit-report"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Report</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="history-section">
                <h2>My Submission History</h2>
                
                {isLoading ? (
                    <div className="empty-state">Loading reports...</div>
                ) : reports.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={48} />
                        <p>No reports submitted yet.</p>
                    </div>
                ) : (
                    <div className="reports-list">
                        {reports.map((report) => (
                            <div key={report._id} className="report-item-card">
                                <div className="report-item-header">
                                    <div>
                                        <h3 className="report-title">{report.title}</h3>
                                        <div className="report-meta">
                                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                            <span className="meta-type">
                                                <FileText size={14}/> {report.type}
                                            </span>
                                            <span className={`meta-priority priority-${report.priority}`}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                                {report.priority} Priority
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {getStatusBadge(report.status)}
                                    </div>
                                </div>
                                <div className="report-description">
                                    {report.description}
                                </div>
                                {report.adminNotes && (
                                    <div className="admin-response">
                                        <strong><MessageSquare size={16}/> Admin Response:</strong>
                                        <span>{report.adminNotes}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffReports;
