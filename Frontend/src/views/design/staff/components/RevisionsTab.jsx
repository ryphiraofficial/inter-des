import React from 'react';
import { Briefcase, Users, Upload, AlertCircle } from 'lucide-react';

const RevisionsTab = ({ revisionTasks, user, setSelectedTask, setShowUploadModal }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Revision Requests</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>Please review and resubmit the designs flagged for correction.</p>
                </div>
                <div style={{
                    background: '#fef2f2',
                    color: '#ef4444',
                    border: '1px solid #fee2e2',
                    padding: '6px 14px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <AlertCircle size={16} /> {revisionTasks.length} Needs Attention
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem',
                marginTop: '0.5rem'
            }}>
                {revisionTasks.map(task => {
                    const isReassigned = task.timeline?.some(t => t.action === 'reassigned');
                    const isSplit = task.assignedTo?.length > 1;
                    const splitWith = task.assignedTo?.filter(s => s.email !== user?.email).map(s => s.name).join(', ');
                    return (
                        <div key={task._id} style={{
                            position: 'relative',
                            background: 'white',
                            border: '1px solid #fee2e2',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.05), 0 4px 6px -2px rgba(239, 68, 68, 0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.2s',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#ef4444', borderRadius: '20px 0 0 20px' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                        <strong style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>{task.title}</strong>
                                        {isReassigned && <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>REASSIGNED</span>}
                                        {isSplit && <span style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #e0f2fe', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>SPLIT</span>}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f5f7ff', color: '#4f46e5', border: '1px solid #e0e7ff', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
                                            <Briefcase size={12} /> {task.project?.projectName || 'Internal Assignment'}
                                        </div>
                                    </div>
                                    {isSplit && splitWith && (
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Users size={12} /> Split with: <strong>{splitWith}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ 
                                background: '#fef2f2', 
                                border: '1px solid #fee2e2', 
                                borderRadius: '16px', 
                                padding: '12px 14px', 
                                marginBottom: '16px',
                                marginTop: '4px'
                            }}>
                                <strong style={{ display: 'block', fontSize: '0.82rem', color: '#991b1b', marginBottom: '4px', fontWeight: 700 }}>Manager Feedback:</strong>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#b91c1c', lineHeight: '1.4', fontWeight: 500 }}>
                                    {task.submissions?.[task.submissions.length - 1]?.managerFeedback || 'Redo carefully'}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
                                <button
                                    className="btn-glass-primary"
                                    style={{
                                        flex: 1,
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '10px 16px',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        fontSize: '0.88rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 10px rgba(239, 68, 68, 0.15)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onClick={() => { setSelectedTask(task); setShowUploadModal(true); }}
                                >
                                    <Upload size={16} /> Re-submit
                                </button>
                            </div>
                        </div>
                    );
                })}
                {revisionTasks.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        background: 'white',
                        padding: '4rem 2rem',
                        borderRadius: '24px',
                        border: '2px dashed #e2e8f0',
                        textAlign: 'center',
                        color: '#64748b'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>No Revisions Requested</h3>
                        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>All your submissions are either approved or pending review.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevisionsTab;
