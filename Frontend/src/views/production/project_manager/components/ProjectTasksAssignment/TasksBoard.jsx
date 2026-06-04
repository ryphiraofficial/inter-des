import React, { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getPriorityStyle = (priority) => {
    switch (priority) {
        case 'Urgent': return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2' };
        case 'High': return { background: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' };
        case 'Medium': return { background: '#f0f9ff', color: '#0284c7', border: '1px solid #e0f2fe' };
        default: return { background: '#f6f8fa', color: '#57606a', border: '1px solid #d0d7de' };
    }
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'Completed': return { background: '#ecfdf5', color: '#059669' };
        case 'Approved': return { background: '#f0fdf4', color: '#16a34a', fontWeight: 'bold' };
        case 'In Progress': return { background: '#eff6ff', color: '#2563eb' };
        default: return { background: '#fffbeb', color: '#d97706' }; // Pending
    }
};

const TasksBoard = ({ tasks, loadingTasks, setActiveTab, actioningTaskId, handleApproveTask, isLocked }) => {
    const [reviewTask, setReviewTask] = useState(null);

    if (loadingTasks) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0', gap: '8px', color: '#64748b' }}>
                <Loader2 className="pm-spin" size={20} /> Loading tasks...
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <AlertCircle size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ margin: 0, color: '#334155', fontSize: '0.95rem', marginBottom: '4px' }}>No Tasks Registered</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>No task has been assigned for this production project yet.</p>
                {!isLocked && (
                    <button
                        onClick={() => setActiveTab('new-task')}
                        style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                        Add First Task
                    </button>
                )}
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
            {tasks.map(t => {
                const isActioning = actioningTaskId === t._id;
                
                return (
                    <div key={t._id} style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                        {/* Priority & Stage Badges */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', ...getPriorityStyle(t.priority) }}>
                                {t.priority}
                            </span>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: '#475569', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                                    Stage: {t.stage}
                                </span>
                                <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, ...getStatusStyle(t.status) }}>
                                    {t.status}
                                </span>
                            </div>
                        </div>

                        {/* Task Detail */}
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{t.title}</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{t.description || 'No description provided.'}</p>
                            
                            {/* Display Completed Work Preview for PM if task has updates with images */}
                            {t.updates?.some(up => up.images?.length > 0) && (
                                <div style={{ marginTop: '0.75rem', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>📸 Completion Photos & Logs</span>
                                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '4px' }}>
                                        {t.updates.flatMap((up, uIdx) => 
                                            (up.images || []).map((img, imgIdx) => (
                                                <div key={`${uIdx}-${imgIdx}`} style={{ position: 'relative', width: '60px', height: '45px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, border: '1px solid #cbd5e1' }} title={up.note || 'Site image'}>
                                                    <img src={getImageUrl(img)} alt="Site" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {t.updates.slice().reverse().find(u => u.note)?.note && (
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.725rem', color: '#64748b', fontStyle: 'italic', lineHeight: 1.3 }}>
                                            "{t.updates.slice().reverse().find(u => u.note).note}"
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Assignment Dropdown & Approval */}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>ASSIGNED TO</label>
                                    <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.825rem', color: '#334155', fontWeight: 500 }}>
                                        {t.assignedTo ? t.assignedTo.fullName : '-- Unassigned --'}
                                    </div>
                                </div>

                                {/* If task status is Completed/Pending PM Approval, allow Approve action — hidden when locked */}
                                {t.status === 'Completed' && !isLocked && (
                                    <button 
                                        disabled={isActioning}
                                        onClick={() => setReviewTask(t)}
                                        style={{ width: '100%', padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                                    >
                                        {isActioning ? <Loader2 className="pm-spin" size={14} /> : <><CheckCircle size={14} /> Review & Approve</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Review Task Modal */}
            {reviewTask && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={20} color="#10b981" /> Review Task Completion
                            </h3>
                            <button onClick={() => setReviewTask(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', ...getPriorityStyle(reviewTask.priority) }}>
                                    {reviewTask.priority}
                                </span>
                                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>
                                    Stage: {reviewTask.stage}
                                </span>
                            </div>

                            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#1e293b' }}>{reviewTask.title}</h4>
                            <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                                {reviewTask.description || 'No description provided.'}
                            </p>

                            <div style={{ marginBottom: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                                <h5 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completion Updates & Photos</h5>
                                {reviewTask.updates && reviewTask.updates.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {reviewTask.updates.slice().reverse().map((up, idx) => (
                                            <div key={idx} style={{ borderBottom: idx !== reviewTask.updates.length - 1 ? '1px solid #e2e8f0' : 'none', paddingBottom: idx !== reviewTask.updates.length - 1 ? '16px' : '0' }}>
                                                {up.note && <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#334155', fontStyle: 'italic' }}>"{up.note}"</p>}
                                                {up.images && up.images.length > 0 && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                                                        {up.images.map((img, imgIdx) => (
                                                            <a key={imgIdx} href={getImageUrl(img)} target="_blank" rel="noreferrer" style={{ display: 'block', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                                                <img src={getImageUrl(img)} alt="Task Update" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No completion updates or photos found.</p>
                                )}
                            </div>

                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#166534', lineHeight: 1.5 }}>
                                    <strong>Ready to approve?</strong> By approving this task, you confirm that the work has been completed to satisfaction. The task will be marked as "Approved".
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px', position: 'sticky', bottom: 0 }}>
                            <button 
                                onClick={() => setReviewTask(null)}
                                style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                disabled={actioningTaskId === reviewTask._id}
                                onClick={() => {
                                    handleApproveTask(reviewTask._id);
                                    setReviewTask(null);
                                }}
                                style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {actioningTaskId === reviewTask._id ? <Loader2 className="pm-spin" size={16} /> : <CheckCircle size={16} />}
                                Approve Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksBoard;
