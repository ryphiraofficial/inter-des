import React from 'react';
import { Briefcase, Users, Upload } from 'lucide-react';

const RevisionsTab = ({ revisionTasks, user, setSelectedTask, setShowUploadModal }) => {
    return (
        <div>
            <div className="task-board-header"><h2>Revision Requests</h2></div>
            <div className="board-lists" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
                <div className="board-column">
                    <div className="col-header"><span>Needs Revision</span><span className="count">{revisionTasks.length}</span></div>
                    <div className="queue-list">
                        {revisionTasks.map(task => {
                            const isReassigned = task.timeline?.some(t => t.action === 'reassigned');
                            const isSplit = task.assignedTo?.length > 1;
                            const splitWith = task.assignedTo?.filter(s => s.email !== user?.email).map(s => s.name).join(', ');
                            return (
                                <div key={task._id} className="queue-item" style={{ borderColor: '#ef4444' }}>
                                    <div className="queue-info">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            <strong className="text-error">{task.title}</strong>
                                            {isReassigned && <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #ffedd5' }}>REASSIGNED</span>}
                                            {isSplit && <span style={{ background: '#f0f9ff', color: '#0369a1', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #e0f2fe' }}>SPLIT</span>}
                                        </div>
                                        {task.project && <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}><Briefcase size={12} /> {task.project.projectName}</div>}
                                        {isSplit && splitWith && <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}><Users size={12} /> Split with: <strong>{splitWith}</strong></div>}
                                        <div style={{ marginTop: '0.8rem', background: '#fff', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px' }}>
                                            <strong>Manager Feedback:</strong>
                                            <p style={{ margin: '4px 0 0 0' }}>{task.submissions?.[task.submissions.length - 1]?.managerFeedback || 'Redo carefully'}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                                        <button className="btn-save-boq" style={{ backgroundColor: '#ef4444', border: 'none' }} onClick={() => { setSelectedTask(task); setShowUploadModal(true); }}>
                                            <Upload size={16} /> Re-submit
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevisionsTab;
