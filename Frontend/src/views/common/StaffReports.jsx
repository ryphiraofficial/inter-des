import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    useGetStaffReportsQuery, 
    useSubmitStaffReportMutation,
    useUploadImageMutation
} from '../../store/api/sharedApi';
import { useGetProjectsQuery } from '../../store/api/designApi';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';
import { FileText, Send, Clock, CheckCircle, AlertCircle, Plus, X, MessageSquare, Image, Loader } from 'lucide-react';
import { useToast } from '../../models/context/ToastContext';
import './css/StaffReports.css';

const StaffReports = () => {
    const { showToast } = useToast();
    const { data: reportsRes, isLoading, refetch } = useGetStaffReportsQuery();
    const reports = reportsRes?.data || [];
    const { data: projectsRes } = useGetProjectsQuery();
    const projects = projectsRes?.data || [];
    const user = useAppSelector(selectUser);

    const [submitReport, { isLoading: isSubmitting }] = useSubmitStaffReportMutation();
    const [uploadImage] = useUploadImageMutation();
    const [isUploading, setIsUploading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const showForm = searchParams.get('action') === 'new';
    
    const [formData, setFormData] = useState({
        title: '',
        type: 'Daily Update',
        priority: 'Low',
        description: '',
        project: '',
        isAssignedToMe: false,
        reportDate: new Date().toISOString().split('T')[0],
        image: '',
        images: []
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('image', file);
            const res = await uploadImage(uploadData).unwrap();
            if (res.url) {
                setFormData(prev => ({
                    ...prev,
                    image: res.url,
                    images: [...prev.images, res.url]
                }));
                showToast('Image uploaded successfully', 'success');
            }
        } catch (err) {
            showToast(err?.message || err?.data?.message || 'Image upload failed', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleProjectChange = (projectId) => {
        if (!projectId) {
            setFormData(prev => ({ ...prev, project: '', isAssignedToMe: false }));
            return;
        }
        const selectedProj = projects.find(p => p._id === projectId);
        let assigned = false;
        if (selectedProj && user?._id) {
            assigned = (
                selectedProj.assignedDesignManager === user._id ||
                selectedProj.assignedProcurementManager === user._id ||
                selectedProj.assignedProductionManager === user._id ||
                selectedProj.assignedAccountsStaff === user._id
            );
        }
        setFormData(prev => ({
            ...prev,
            project: projectId,
            isAssignedToMe: assigned
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitReport(formData).unwrap();
            showToast('Report submitted successfully', 'success');
            const p = new URLSearchParams(searchParams);
            p.delete('action');
            setSearchParams(p);
            setFormData({
                title: '',
                type: 'Daily Update',
                priority: 'Low',
                description: '',
                project: '',
                isAssignedToMe: false,
                reportDate: new Date().toISOString().split('T')[0],
                image: '',
                images: []
            });
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
                <div className="drawer-overlay" onClick={(e) => {
                    if (e.target.className === 'drawer-overlay') {
                        const p = new URLSearchParams(searchParams);
                        p.delete('action');
                        setSearchParams(p);
                    }
                }}>
                    <div className="drawer-content">
                        <div className="drawer-header">
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
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 73px)' }}>
                            <div className="drawer-body">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
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
                                        <div className="report-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#45464d', fontSize: '14px' }}>Date</label>
                                            <input 
                                                type="date" 
                                                className="report-input"
                                                required
                                                value={formData.reportDate}
                                                onChange={(e) => setFormData({...formData, reportDate: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="report-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#45464d', fontSize: '14px' }}>Project (Optional)</label>
                                            <select 
                                                className="report-input"
                                                value={formData.project}
                                                onChange={(e) => handleProjectChange(e.target.value)}
                                            >
                                                <option value="">Select a project...</option>
                                                {projects.map(p => (
                                                    <option key={p._id} value={p._id}>
                                                        {p.projectNumber} - {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="report-form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '28px' }}>
                                            {formData.project && (
                                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={formData.isAssignedToMe}
                                                        onChange={(e) => setFormData({ ...formData, isAssignedToMe: e.target.checked })}
                                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                                    />
                                                    <span style={{ fontWeight: 600, color: '#45464d', fontSize: '14px' }}>Assigned to me</span>
                                                </label>
                                            )}
                                        </div>
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
                                            style={{ minHeight: '140px' }}
                                        />
                                    </div>

                                    <div className="report-form-group">
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#45464d', fontSize: '14px' }}>Image Attachment (Optional)</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#475569', transition: 'all 0.2s' }} className="image-upload-label">
                                                <Image size={18} />
                                                Choose Image
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={handleImageUpload} 
                                                    style={{ display: 'none' }}
                                                    disabled={isUploading}
                                                />
                                            </label>
                                            {isUploading && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b' }}>
                                                    <Loader size={16} className="animate-spin" />
                                                    Uploading...
                                                </div>
                                            )}
                                        </div>
                                        {formData.image && (
                                            <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                                                <img 
                                                    src={formData.image} 
                                                    alt="Preview" 
                                                    style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '6px', border: '1px solid #cbd5e1', display: 'block' }} 
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image: '', images: [] })}
                                                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="drawer-footer">
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
            )}

            <div className="history-section">
                <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#e0f2fe', color: '#0ea5e9', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', fontWeight: 800 }}>My Submission History</strong>
                            <span style={{ display: 'block', marginTop: '2px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Track and review all your submitted reports and their status.</span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '24px' }}>
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
                                            <div className="report-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                                                <span>{new Date(report.reportDate || report.createdAt).toLocaleDateString()}</span>
                                                <span className="meta-type">
                                                    <FileText size={14}/> {report.type}
                                                </span>
                                                <span className={`meta-priority priority-${report.priority}`}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                                    {report.priority} Priority
                                                </span>
                                                {report.project && (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#4f46e5', fontWeight: 600, background: '#eef2ff', padding: '2px 8px', borderRadius: '4px' }}>
                                                        Project: {report.project.projectNumber}
                                                        {report.isAssignedToMe && (
                                                            <span style={{ fontSize: '10px', color: '#16a34a', background: '#dcfce7', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>
                                                                Assigned
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {getStatusBadge(report.status)}
                                        </div>
                                    </div>
                                    <div className="report-description">
                                        {report.description}
                                    </div>
                                    {report.image && (
                                        <div style={{ marginTop: '14px' }}>
                                            <a href={report.image} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                                                <img 
                                                    src={report.image} 
                                                    alt="Attachment" 
                                                    style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', border: '1px solid #e2e8f0', objectFit: 'cover', cursor: 'zoom-in' }} 
                                                />
                                            </a>
                                        </div>
                                    )}
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
        </div>
    );
};

export default StaffReports;
