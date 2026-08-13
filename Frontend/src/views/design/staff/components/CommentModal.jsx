import React from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const CommentModal = ({
    selectedTask,
    handleCloseComments,
    loadingComments,
    comments,
    commentText,
    setCommentText,
    handleSubmitComment,
    submittingComment
}) => {
    if (!selectedTask) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-styled" style={{ maxWidth: '600px', borderRadius: '32px' }}>
                <div className="modal-header" style={{ padding: '2rem 2.5rem', background: '#fcfdfe', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 900 }}><MessageSquare size={24} color="#6366f1" /> Task Communication</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Internal collaboration log for: <strong>{selectedTask.title}</strong></p>
                    </div>
                    <button className="close-btn" onClick={handleCloseComments}>
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
                                            padding: '1.25rem', borderRadius: '12px',
                                            border: '1px solid #e2e8f0'
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
    );
};

export default CommentModal;
