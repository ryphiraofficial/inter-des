import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const showForm = searchParams.get('action') === 'new';
    
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
            const p = new URLSearchParams(searchParams);
            p.delete('action');
            setSearchParams(p);
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

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content-styled" style={{ maxWidth: '600px', width: '90%' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                <FileText size={20} style={{ color: '#4f46e5' }} /> Submit New Report
                            </h3>
                            <button 
                                type="button"
                                onClick={() => {
                                    const p = new URLSearchParams(searchParams);
                                    p.delete('action');
                                    setSearchParams(p);
                                }}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%', transition: 'all 0.2s' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="report-form-group">
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#45464d', fontSize: '14px' }}>Title</label>
                                        <input 
                                            type="text" 
                                            className="report-input"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Enter report title..."
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="report-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#45464d', fontSize: '14px' }}>Type</label>
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
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#45464d', fontSize: '14px' }}>Priority</label>
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
                                    <div className="report-form-group">
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#45464d', fontSize: '14px' }}>Description</label>
                                        <textarea 
                                            className="report-input"
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder="Provide detailed information..."
                                            style={{ minHeight: '120px' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const p = new URLSearchParams(searchParams);
                                            p.delete('action');
                                            setSearchParams(p);
                                        }}
                                        style={{ padding: '0.75rem 1.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn-submit-report"
                                        disabled={isSubmitting}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                                    >
                                        {isSubmitting ? 'Submitting...' : <><Send size={16} /> Submit Report</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
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
