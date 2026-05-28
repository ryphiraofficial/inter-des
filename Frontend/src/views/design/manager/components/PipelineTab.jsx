import React from 'react';
import {
    Palette, CheckSquare, Send, Shield,
    Briefcase, Users, Clock, CheckCircle, Check, ArrowRight, Plus
} from 'lucide-react';

const PipelineTab = ({
    tasks, getImageUrl,
    onOpenAssignModal, onReviewTask, onSendToAdmin
}) => {
    const activeDesign = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress');
    const submissions = tasks.filter(t => t.status === 'Review Pending' || t.status === 'Revision Required');
    const salesReview = tasks.filter(t => t.status === 'Pending Sales Review');
    const adminApproval = tasks
        .filter(t => ['Sales Approved', 'Pending Admin Review', 'Admin Rejected', 'Pushed to Procurement', 'Admin Approved'].includes(t.status))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const getApprovalTime = (task, action) => {
        const entry = task.timeline?.find(item => item.action === action);
        return entry ? new Date(entry.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : null;
    };

    const hasPreviewImage = (task) =>
        task.submissions?.[task.submissions.length - 1]?.files?.some(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i));

    const getPreviewUrl = (task) => {
        const files = task.submissions?.[task.submissions.length - 1]?.files || [];
        const imgFile = files.find(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i));
        return imgFile ? getImageUrl(imgFile.url) : null;
    };

    const CardPreview = ({ task }) => hasPreviewImage(task) ? (
        <div style={{ margin: '10px 0', borderRadius: '12px', overflow: 'hidden', height: '100px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <img src={getPreviewUrl(task)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
    ) : null;

    return (
        <div className="design-pipeline-workflow" style={{ padding: '1rem 10px 0 10px' }}>

            <div className="pipeline-grid">

                {/* COLUMN 1: ACTIVE DESIGN */}
                <div className="pipeline-column">
                    <div className="col-header" style={{ borderLeft: '4px solid #3b82f6' }}>
                        <div className="col-title-box"><Palette size={18} /><span>Active Design</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="col-count" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{activeDesign.length}</span>
                            <button className="add-task-btn" onClick={onOpenAssignModal}
                                style={{ border: 'none', background: '#3b82f6', color: 'white', borderRadius: '6px', padding: '2px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Assign New Task">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="col-body">
                        {activeDesign.map(task => (
                            <div key={task._id} className="pipeline-card staff-card" style={{ borderLeftColor: '#3b82f6' }}>
                                <div className="card-header">
                                    <h4>{task.title}</h4>
                                    <span className="badge" style={{ background: '#eff6ff', color: '#2563eb' }}>{task.status}</span>
                                </div>
                                <div className="card-info" style={{ marginTop: '10px' }}>
                                    <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                                    <p><Users size={12} /> {task.assignedTo?.map(s => s.name).join(', ') || 'Unassigned'}</p>
                                    <p className="time-stamp" style={{ marginTop: '8px' }}><Clock size={12} /> Assigned: {new Date(task.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                        {activeDesign.length === 0 && <div className="empty-col">No designs currently in progress</div>}
                    </div>
                </div>

                {/* COLUMN 2: STAFF SUBMISSIONS */}
                <div className="pipeline-column">
                    <div className="col-header" style={{ borderLeft: '4px solid #6366f1' }}>
                        <div className="col-title-box"><CheckSquare size={18} /><span>Staff Submissions</span></div>
                        <span className="col-count">{submissions.length}</span>
                    </div>
                    <div className="col-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Pending Review */}
                        <div className="column-sub-section">
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={12} /> Pending Review
                            </p>
                            {submissions.filter(t => t.status === 'Review Pending').map(task => (
                                <div key={task._id} className="pipeline-card staff-card" style={{ marginBottom: '1rem' }}>
                                    <div className="card-header">
                                        <h4>{task.title}</h4>
                                        <span className="badge review-pending">{task.status}</span>
                                    </div>
                                    <CardPreview task={task} />
                                    <div className="card-info">
                                        <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                                        <p><Users size={12} /> {task.submissions?.[task.submissions.length - 1]?.submittedBy?.name || 'Staff'}</p>
                                        <p className="time-stamp"><Clock size={12} /> Submitted: {new Date(task.submissions?.[task.submissions.length - 1]?.submittedAt).toLocaleString()}</p>
                                    </div>
                                    <button className="card-btn primary" onClick={() => onReviewTask(task)}>Review Submission</button>
                                </div>
                            ))}
                            {submissions.filter(t => t.status === 'Review Pending').length === 0 && (
                                <div className="empty-col" style={{ padding: '10px', fontSize: '0.8rem' }}>No pending reviews</div>
                            )}
                        </div>

                        {/* Revision Required */}
                        <div className="column-sub-section" style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Shield size={12} /> Revision Required
                            </p>
                            {submissions.filter(t => t.status === 'Revision Required').map(task => (
                                <div key={task._id} className="pipeline-card staff-card" style={{ marginBottom: '1rem' }}>
                                    <div className="card-header">
                                        <h4>{task.title}</h4>
                                        <span className="badge revision-required">{task.status}</span>
                                    </div>
                                    <CardPreview task={task} />
                                    <div className="card-info">
                                        <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                                        <p><Users size={12} /> {task.assignedTo?.map(s => s.name).join(', ') || 'Staff'}</p>
                                        <p className="time-stamp"><Clock size={12} /> Waiting for staff revision</p>
                                    </div>
                                    <button className="card-btn secondary" onClick={() => onReviewTask(task)}>View Details</button>
                                </div>
                            ))}
                            {submissions.filter(t => t.status === 'Revision Required').length === 0 && (
                                <div className="empty-col" style={{ padding: '10px', fontSize: '0.8rem' }}>No revisions required</div>
                            )}
                        </div>

                        {/* Other Submissions */}
                        {submissions.filter(t => t.status !== 'Review Pending' && t.status !== 'Revision Required').length > 0 && (
                            <div className="column-sub-section" style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckSquare size={12} /> Other
                                </p>
                                {submissions.filter(t => t.status !== 'Review Pending' && t.status !== 'Revision Required').map(task => (
                                    <div key={task._id} className="pipeline-card staff-card" style={{ marginBottom: '1rem' }}>
                                        <div className="card-header">
                                            <h4>{task.title}</h4>
                                            <span className="badge">{task.status}</span>
                                        </div>
                                        <CardPreview task={task} />
                                        <div className="card-info">
                                            <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                                            <p><Users size={12} /> {task.assignedTo?.map(s => s.name).join(', ') || 'Staff'}</p>
                                        </div>
                                        <button className="card-btn secondary" onClick={() => onReviewTask(task)}>View Details</button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                {/* COLUMN 3: SALES REVIEW */}
                <div className="pipeline-column">
                    <div className="col-header" style={{ borderLeft: '4px solid #10b981' }}>
                        <div className="col-title-box"><Send size={18} /><span>Sales Review</span></div>
                        <span className="col-count" style={{ background: '#d1fae5', color: '#059669' }}>{salesReview.length}</span>
                    </div>
                    <div className="col-body">
                        {salesReview.map(task => (
                            <div key={task._id} className="pipeline-card sales-card">
                                <div className="card-header">
                                    <h4>{task.title}</h4>
                                    <div className="approval-marker mgr">
                                        <CheckCircle size={10} />
                                        <span>MGR APPROVED: {getApprovalTime(task, 'approved')}</span>
                                    </div>
                                </div>
                                <CardPreview task={task} />
                                <div className="card-info">
                                    <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                                    <p className="pending-notice"><Clock size={12} /> Waiting for Sales/Client approval...</p>
                                </div>
                                <button className="card-btn secondary" onClick={() => onReviewTask(task)}>View Design</button>
                            </div>
                        ))}
                        {salesReview.length === 0 && <div className="empty-col">No designs with Sales</div>}
                    </div>
                </div>

                {/* COLUMN 4: ADMIN APPROVAL */}
                <div className="pipeline-column">
                    <div className="col-header" style={{ borderLeft: '4px solid #8b5cf6' }}>
                        <div className="col-title-box"><Shield size={18} /><span>Admin Approval</span></div>
                        <span className="col-count" style={{ background: '#ede9fe', color: '#6d28d9' }}>{adminApproval.length}</span>
                    </div>
                    <div className="col-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Awaiting */}
                        <div className="column-sub-section">
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={12} /> Awaiting Final Review
                            </p>
                            {adminApproval.filter(t => t.status !== 'Pushed to Procurement' && t.status !== 'Admin Approved').map(task => (
                                <div key={task._id} className="pipeline-card admin-card">
                                    <div className="card-header">
                                        <h4>{task.title}</h4>
                                        <div className="approval-marker sales"><CheckCircle size={10} /><span>SALES APPROVED: {getApprovalTime(task, 'salesApproved')}</span></div>
                                    </div>
                                    <div className="card-info" style={{ marginTop: '10px' }}>
                                        <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                                        {task.status === 'Pending Admin Review' && <div style={{ marginTop: '10px', padding: '8px', background: '#f5f3ff', color: '#6d28d9', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', border: '1px solid #ede9fe' }}>Under Review</div>}
                                        {task.status === 'Admin Rejected' && <div style={{ marginTop: '10px', padding: '8px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', border: '1px solid #fee2e2' }}>Admin Requested Revision</div>}
                                    </div>
                                    {task.status === 'Sales Approved' && (
                                        <div className="card-actions" style={{ marginTop: '15px' }}>
                                            <button className="card-btn admin-push" onClick={() => onSendToAdmin(task._id)}
                                                style={{ width: '100%', background: '#8b5cf6', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <ArrowRight size={14} /> Push to Admin
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {adminApproval.filter(t => t.status !== 'Pushed to Procurement' && t.status !== 'Admin Approved').length === 0 && (
                                <div className="empty-col" style={{ padding: '15px', fontSize: '0.8rem' }}>No designs pending admin</div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            
            {/* FULL WIDTH FINALIZED SECTION */}
            <div style={{ marginTop: '2rem', padding: '2rem', background: '#f0fdf4', borderRadius: '24px', border: '1px solid #bbf7d0', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                    <CheckCircle size={24} color="#15803d" />
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#15803d', fontWeight: 800 }}>Approved & Finalized Designs</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {adminApproval.filter(t => t.status === 'Pushed to Procurement' || t.status === 'Admin Approved').map(task => (
                        <div key={task._id} className="pipeline-card completed" style={{ background: '#ffffff', border: '1px solid #dcfce7', boxShadow: '0 4px 15px -5px rgba(0, 0, 0, 0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                            <div className="card-header" style={{ marginBottom: '1rem' }}>
                                <h4 style={{ color: '#064e3b', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{task.title}</h4>
                                <div className="success-pill" style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Check size={14} /> PUSHED
                                </div>
                            </div>
                            <div className="card-info" style={{ marginTop: '12px' }}>
                                <p style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '8px' }}><Briefcase size={16} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                                <p className="time-stamp" style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><Clock size={16} /> Finalized: {new Date(task.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                    {adminApproval.filter(t => t.status === 'Pushed to Procurement' || t.status === 'Admin Approved').length === 0 && (
                        <div className="empty-col" style={{ gridColumn: '1 / -1', padding: '20px', fontSize: '1rem', background: 'transparent', border: '2px dashed #86efac', color: '#15803d', borderRadius: '12px' }}>No finalized designs yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PipelineTab;
