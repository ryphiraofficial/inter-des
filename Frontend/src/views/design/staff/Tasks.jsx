import React, { useState } from 'react';
import {
    List, CheckSquare, Clock, CheckCircle, Target, Briefcase,
    Plus, Play, User, Users, AlertTriangle, MessageSquare, X,
    Upload, Package, Eye, Send, RefreshCw, ChevronRight,
    TrendingUp, Calendar, AlertCircle, Palette
} from 'lucide-react';
import '../css/StaffDashboard.css';

const Tasks = ({
    myTasks,
    onUpdateTaskStatus,
    getPriorityColor,
    taskAPI,
    onOpenUpload,
    onOpenMaterial,
    onOpenQuotation,
    user
}) => {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showDailyUpdateModal, setShowDailyUpdateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [dailyUpdateData, setDailyUpdateData] = useState({ update: '', emergencies: '', requestedDate: '', reason: '' });
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [submittingUpdate, setSubmittingUpdate] = useState(false);

    const isOverdue = (task) => {
        if (task.status === 'Completed' || task.status === 'Approved') return false;
        return task.dueDate && new Date(task.dueDate) < new Date();
    };

    const isDueSoon = (task) => {
        if (task.status === 'Completed' || task.status === 'Approved') return false;
        if (!task.dueDate) return false;
        const diff = new Date(task.dueDate) - new Date();
        const days = diff / (1000 * 60 * 60 * 24);
        return days <= 3 && days >= 0;
    };

    const handleOpenComments = async (task) => {
        setSelectedTask(task);
        setShowCommentModal(true);
        setLoadingComments(true);
        try {
            if (taskAPI) {
                const res = await taskAPI.getComments(task._id);
                if (res.success) {
                    setComments(res.data || []);
                }
            }
        } catch (err) {
            console.error('Failed to load comments:', err);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !taskAPI) return;
        setSubmittingComment(true);
        try {
            const res = await taskAPI.addComment(selectedTask._id, commentText);
            if (res.success) {
                setCommentText('');
                const commentsRes = await taskAPI.getComments(selectedTask._id);
                if (commentsRes.success) {
                    setComments(commentsRes.data || []);
                }
            }
        } catch (err) {
            alert('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleSubmitDailyUpdate = async (e) => {
        e.preventDefault();
        if (!dailyUpdateData.update.trim() || !taskAPI) return;
        setSubmittingUpdate(true);
        try {
            const payload = {
                update: dailyUpdateData.update,
                emergencies: dailyUpdateData.emergencies,
                extensionRequest: dailyUpdateData.requestedDate ? {
                    requestedDate: dailyUpdateData.requestedDate,
                    reason: dailyUpdateData.reason
                } : undefined
            };
            const res = await taskAPI.addDailyUpdate(selectedTask._id, payload);
            if (res.success) {
                setShowDailyUpdateModal(false);
                setDailyUpdateData({ update: '', emergencies: '', requestedDate: '', reason: '' });
                alert('Daily update submitted successfully!');
            }
        } catch (err) {
            alert('Failed to submit update: ' + err.message);
        } finally {
            setSubmittingUpdate(false);
        }
    };

    const TaskCard = ({ task }) => {
        const overdue = isOverdue(task);
        const dueSoon = isDueSoon(task);
        const isReassigned = task.timeline?.some(t => t.action === 'reassigned');
        const isSplit = task.assignedTo?.length > 1;
        const splitWith = task.assignedTo?.filter(s => s.email !== user?.email).map(s => s.name).join(', ');
        const projectName = task.quotation?.projectName || task.project?.projectName || 'Internal Assignment';

        return (
            <div className={`premium-task-card ${overdue ? 'overdue' : ''}`}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: getPriorityColor(task.priority), borderRadius: '20px 0 0 20px' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 800 }}>{task.title}</strong>
                            {isReassigned && <span className="redo-badge">REASSIGNED</span>}
                            {isSplit && <span className="redo-badge" style={{ color: '#0ea5e9', background: '#f0f9ff', borderColor: '#bae6fd' }}>SPLIT</span>}
                            {overdue && <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ef4444', background: '#fee2e2', padding: '4px 10px', borderRadius: '8px' }}>OVERDUE</span>}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f0f3ff', padding: '4px 10px', borderRadius: '8px' }}>
                                <Briefcase size={14} /> {projectName}
                            </div>
                            {task.quotation?.quotationNumber && (
                                <div style={{ background: '#eef2ff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
                                    Quote: #{task.quotation.quotationNumber}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        <span style={{ color: task.status === 'Revision Required' ? '#ef4444' : '#64748b', background: task.status === 'Revision Required' ? '#fef2f2' : '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: task.status === 'Revision Required' ? '1px solid #fecaca' : '1px solid #e2e8f0' }}>
                            {task.status === 'Revision Required' ? 'Revision Required' : task.status}
                        </span>
                        {isSplit && splitWith && <span style={{ marginLeft: '10px', opacity: 0.8 }}><Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {splitWith}</span>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Progress */}
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${task.progress || 0}%`, height: '100%',
                        background: task.status === 'Revision Required' ? '#ef4444' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-in-out'
                    }}></div>
                </div>

                {/* Creative Brief / Requirements */}
                {task.creativeRequirements && (
                    <div style={{ background: 'linear-gradient(to right, #f8fafc, #ffffff)', borderRadius: '14px', padding: '12px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase' }}>
                            <Palette size={14} /> Design Brief
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>{task.creativeRequirements}</p>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button
                        className="btn-glass-primary"
                        style={{ background: task.status === 'To Do' ? 'linear-gradient(135deg, #1e293b, #334155)' : 'linear-gradient(135deg, #4f46e5, #6366f1)' }}
                        onClick={() => {
                            if (task.status === 'To Do') onUpdateTaskStatus(task._id, task.status);
                            onOpenUpload(task);
                        }}
                    >
                        <Upload size={16} /> {task.status === 'To Do' ? 'Start Task' : 'Upload Design'}
                    </button>
                    <button
                        className="btn-glass-secondary"
                        onClick={() => { setSelectedTask(task); setShowDailyUpdateModal(true); }}
                        title="Daily Update"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        className="btn-glass-secondary"
                        onClick={() => handleOpenComments(task)}
                        title="Discussions"
                    >
                        <MessageSquare size={16} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="tasks-board-view fade-in">
            <div className="premium-tasks-banner">
                <div>
                    <h2>My Active Tasks</h2>
                    <p>Manage your daily design assignments, track progress, and submit your deliverables.</p>
                </div>
                <Target size={150} className="premium-tasks-icon" />
            </div>

            <div className="premium-tasks-grid">
                {myTasks.length > 0 ? myTasks.map(task => (
                    <TaskCard key={task._id} task={task} />
                )) : (
                    <div className="premium-empty-state">
                        <div className="premium-empty-icon">
                            <CheckCircle size={40} />
                        </div>
                        <h3>You're All Caught Up!</h3>
                        <p>No active tasks assigned to you right now. Take a break or check back later.</p>
                    </div>
                )}
            </div>

            {/* Daily Update Modal */}
            {showDailyUpdateModal && selectedTask && (
                <div className="modal-overlay">
                    <div className="modal-content-styled" style={{ maxWidth: '550px', borderRadius: '32px' }}>
                        <div className="modal-header" style={{ padding: '2rem 2.5rem', background: '#fcfdfe' }}>
                            <div>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 900 }}><RefreshCw size={24} color="#6366f1" /> Daily Progress Update</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>Updating status for: <strong>{selectedTask.title}</strong></p>
                            </div>
                            <button className="close-btn" onClick={() => setShowDailyUpdateModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmitDailyUpdate} style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px', color: '#1e293b' }}>
                                    <TrendingUp size={16} color="#6366f1" /> Progress Summary
                                </label>
                                <textarea
                                    className="premium-textarea"
                                    value={dailyUpdateData.update}
                                    onChange={e => setDailyUpdateData({ ...dailyUpdateData, update: e.target.value })}
                                    placeholder="What was achieved today? List completed sub-tasks or milestones..."
                                    required
                                    style={{ minHeight: '120px', borderRadius: '18px', padding: '1rem', border: '1px solid #e2e8f0', width: '100%', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px', color: '#ef4444' }}>
                                    <AlertTriangle size={16} /> Blockers or Emergencies
                                </label>
                                <textarea
                                    className="premium-textarea"
                                    value={dailyUpdateData.emergencies}
                                    onChange={e => setDailyUpdateData({ ...dailyUpdateData, emergencies: e.target.value })}
                                    placeholder="Mention any issues slowing you down..."
                                    style={{ minHeight: '80px', borderRadius: '18px', padding: '1rem', border: '1px solid #fee2e2', width: '100%', fontSize: '0.9rem', background: '#fff1f2' }}
                                />
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '12px', color: '#1e293b' }}>
                                    <Clock size={16} color="#6366f1" /> Extension Request
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>REQUESTED DATE</span>
                                            <input
                                                type="date"
                                                className="premium-date-input"
                                                value={dailyUpdateData.requestedDate}
                                                onChange={e => setDailyUpdateData({ ...dailyUpdateData, requestedDate: e.target.value })}
                                                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                            />
                                        </div>
                                        <div style={{ flex: 2 }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>REASON FOR DELAY</span>
                                            <input
                                                type="text"
                                                className="premium-input-field"
                                                value={dailyUpdateData.reason}
                                                onChange={e => setDailyUpdateData({ ...dailyUpdateData, reason: e.target.value })}
                                                placeholder="Brief explanation..."
                                                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer" style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                                <button type="button" className="btn-secondary" style={{ flex: 1, height: '54px', borderRadius: '16px', fontWeight: 800 }} onClick={() => setShowDailyUpdateModal(false)}>Discard</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, height: '54px', borderRadius: '16px', background: '#1e293b', fontWeight: 800 }} disabled={submittingUpdate}>
                                    {submittingUpdate ? 'Submitting...' : 'Confirm Daily Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Comment Modal */}
            {showCommentModal && selectedTask && (
                <div className="modal-overlay">
                    <div className="modal-content-styled" style={{ maxWidth: '600px', borderRadius: '32px' }}>
                        <div className="modal-header" style={{ padding: '2rem 2.5rem', background: '#fcfdfe', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 900 }}><MessageSquare size={24} color="#6366f1" /> Task Communication</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Internal collaboration log for: <strong>{selectedTask.title}</strong></p>
                            </div>
                            <button className="close-btn" onClick={() => { setShowCommentModal(false); setSelectedTask(null); setComments([]); }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '2rem 2.5rem' }}>
                            <div className="history-timeline-premium" style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '2rem', paddingRight: '15px' }}>
                                {loadingComments ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Retrieving conversation history...</div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {/* History mix... */}
                                        {[...(selectedTask.dailyUpdates || []).map(u => ({ ...u, type: 'update' })), ...comments.map(c => ({ ...c, type: 'comment' }))]
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map((item, i) => (
                                                <div key={i} style={{
                                                    background: item.type === 'update' ? '#f8fafc' : 'white',
                                                    padding: '1.25rem', borderRadius: '20px',
                                                    border: '1px solid #f1f5f9',
                                                    borderLeft: item.type === 'update' ? '4px solid #6366f1' : '1px solid #f1f5f9'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: item.type === 'update' ? '#6366f1' : '#1e293b' }}>
                                                            {item.type === 'update' ? 'PROGRESS REPORT' : item.user?.fullName}
                                                        </span>
                                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(item.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                                                        {item.type === 'update' ? item.update : item.text}
                                                    </div>
                                                    {item.emergencies && (
                                                        <div style={{ marginTop: '10px', padding: '8px 12px', background: '#fff1f2', borderRadius: '10px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>
                                                            🚨 Blocker: {item.emergencies}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        }
                                        {selectedTask.dailyUpdates?.length === 0 && comments.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>No activity logged for this task yet.</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '8px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a message to your manager..."
                                    style={{ flex: 1, background: 'none', border: 'none', padding: '10px 15px', outline: 'none', fontSize: '0.9rem' }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                                />
                                <button
                                    style={{
                                        width: '44px', height: '44px', borderRadius: '16px', background: '#1e293b',
                                        color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                    onClick={handleSubmitComment}
                                    disabled={submittingComment || !commentText.trim()}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;

