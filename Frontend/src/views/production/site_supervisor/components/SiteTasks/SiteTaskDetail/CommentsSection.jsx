import React from 'react';
import { Send, Loader2 } from 'lucide-react';

const CommentsSection = ({ localTask, comment, setComment, handleComment, saving }) => {
    return (
        <div className="site-card">
            <div className="site-card-header">
                <div className="site-card-title"><Send size={15} />Comments</div>
                <span className="site-count">{localTask.comments?.length || 0}</span>
            </div>
            <div className="site-comments">
                {!localTask.comments?.length ? (
                    <div style={{ padding: '18px 24px', fontSize: 13, color: '#94a3b8' }}>No comments yet.</div>
                ) : localTask.comments.map((c, i) => (
                    <div key={i} className="site-comment">
                        <div className="site-comment-avatar">{c.postedBy?.fullName?.charAt(0) || '?'}</div>
                        <div className="site-comment-body">
                            <div>
                                <span className="site-comment-name">{c.postedBy?.fullName}</span>
                                <span className="site-comment-role">{c.postedBy?.role}</span>
                                <span className="site-comment-time">{new Date(c.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="site-comment-text">{c.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleComment} className="site-comment-form">
                <input className="site-input" placeholder="Add a comment…" value={comment} onChange={e => setComment(e.target.value)} />
                <button type="submit" className="site-btn-primary" disabled={saving || !comment.trim()}>
                    {saving ? <Loader2 size={14} className="site-spin" /> : <Send size={14} />} Post
                </button>
            </form>
        </div>
    );
};

export default CommentsSection;
