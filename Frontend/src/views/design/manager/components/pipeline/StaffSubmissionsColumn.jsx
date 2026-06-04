import React from 'react';
import { CheckSquare, Clock, Shield, Briefcase, Users } from 'lucide-react';

const StaffSubmissionsColumn = ({ submissions, CardPreview, onReviewTask }) => {
    return (
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
    );
};

export default StaffSubmissionsColumn;
