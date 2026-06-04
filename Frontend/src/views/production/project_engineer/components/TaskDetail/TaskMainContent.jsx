import React from 'react';
import { Plus, CheckSquare, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const STAGE_LABELS = { PM:'Project Manager', PE:'Project Engineer', SE:'Site Engineer', SS:'Site Supervisor' };
const PIPELINE = ['PM','PE','SE','SS'];

const getPriorityStyle = (p) => ({ Low:{color:'#64748b',bg:'#f1f5f9'}, Medium:{color:'#2563eb',bg:'#dbeafe'}, High:{color:'#d97706',bg:'#fef3c7'}, Urgent:{color:'#dc2626',bg:'#fee2e2'} }[p]||{color:'#64748b',bg:'#f1f5f9'});
const getStatusStyle   = (s) => ({ 'Pending':{label:'#92400e',bg:'#fef3c7',dot:'#f59e0b'}, 'In Progress':{label:'#1e40af',bg:'#dbeafe',dot:'#3b82f6'}, 'Completed':{label:'#065f46',bg:'#d1fae5',dot:'#10b981'}, 'Approved':{label:'#5b21b6',bg:'#ede9fe',dot:'#8b5cf6'} }[s]||{label:'#374151',bg:'#f3f4f6',dot:'#9ca3af'});
const STATUS_OPTIONS = ['Pending','In Progress','Completed'];

const TaskMainContent = ({
    task, user, isMine, isOverdue, pr, st, currentPipelineStage,
    statusSaving, handleStatusChange, showNote, setShowNote, note, setNote,
    setShowSubtaskModal,
    comment, setComment, handleComment, saving
}) => {
    const navigate = useNavigate();

    return (
        <div className="eng-detail-main">
            {/* Completion Images Gallery Card */}
            {task.updates?.some(up => up.images?.length > 0) && (
                <div className="eng-section-card" style={{ marginBottom: 20 }}>
                    <div className="eng-section-header">
                        <div className="eng-section-title">📸 Completed Work Photos</div>
                    </div>
                    <div style={{ padding: 20 }}>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {task.updates.flatMap((up, uIdx) => 
                                (up.images || []).map((img, imgIdx) => (
                                    <div key={`${uIdx}-${imgIdx}`} style={{ width: 140, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                        <img src={getImageUrl(img)} alt="Completed Site Photo" style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                                        <div style={{ padding: '6px 10px', fontSize: 10.5, background: '#f8fafc', color: '#64748b', borderTop: '1px solid #f1f5f9' }}>
                                            {up.note || 'Site Photo'}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div className="eng-section-card" style={{ marginBottom: 20 }}>
                <div className="eng-detail-header-body">
                    <div className="eng-detail-title-row">
                        <div className="eng-detail-title-main">
                            {task.isSubtask && <div className="eng-td-sub" style={{ marginBottom: 6 }}>↳ Subtask {task.parentTask?.title ? `of "${task.parentTask.title}"` : ''}</div>}
                            <h2 className="eng-detail-task-title">{task.title}</h2>
                            {task.description && <p className="eng-detail-task-desc">{task.description}</p>}
                        </div>
                        <div className="eng-task-badges">
                            <span className="eng-badge" style={{ color:pr.color, background:pr.bg }}>{task.priority}</span>
                            <span className="eng-badge" style={{ color:st.label, background:st.bg }}>{task.status}</span>
                            {isOverdue && <span className="eng-badge" style={{ color:'#dc2626', background:'#fee2e2' }}>⚠ Overdue</span>}
                        </div>
                    </div>

                    {/* Pipeline */}
                    <div className="eng-pipeline">
                        {PIPELINE.map((s,i)=>(
                            <React.Fragment key={s}>
                                <div className={`eng-pipe-step${s===currentPipelineStage?' active':''}`}>
                                    <div className="eng-pipe-dot"/>
                                    <span>{STAGE_LABELS[s]}</span>
                                </div>
                                {i < PIPELINE.length-1 && <div className="eng-pipe-line desktop-only"/>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Update Status */}
            {isMine && task.status !== 'Approved' && (
                <div className="eng-section-card" style={{ marginBottom:20 }}>
                    <div className="eng-section-header">
                        <div className="eng-section-title"><CheckSquare size={16}/>Update Status</div>
                    </div>
                    <div style={{ padding:'16px 24px', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                        {STATUS_OPTIONS.map(s => (
                            <button key={s}
                                className={`eng-status-btn${task.status===s?' active':''}`}
                                onClick={() => { if(s !== task.status) handleStatusChange(s); }}
                                disabled={statusSaving || task.status === s}>
                                {statusSaving && task.status !== s ? <Loader2 size={12} className="eng-spin"/> : null}
                                {s}
                            </button>
                        ))}
                        <button className="eng-status-btn" onClick={()=>setShowNote(!showNote)}>
                            {showNote?'Hide Note':'+ Add Note'}
                        </button>
                    </div>
                    {showNote && (
                        <div style={{ padding:'0 24px 16px' }}>
                            <textarea className="eng-input" placeholder="Add a note with your status update…" rows={2}
                                value={note} onChange={e=>setNote(e.target.value)}/>
                        </div>
                    )}
                </div>
            )}

            {/* Subtasks */}
            {(task.subtasks?.length > 0 || isMine) && (
                <div className="eng-section-card" style={{ marginBottom:20 }}>
                    <div className="eng-section-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="eng-section-title"><Plus size={16}/>Subtasks</div>
                            <span className="eng-task-count">{task.subtasks?.length||0}</span>
                        </div>
                        {isMine && user?.role === 'Project Engineer' && (
                            <button className="eng-status-btn" onClick={() => setShowSubtaskModal(true)} style={{ background: '#f8fafc', color: '#0f172a' }}>
                                + Add Subtask
                            </button>
                        )}
                    </div>
                    <div className="eng-task-list">
                        {task.subtasks?.map(st => {
                            const sst = getStatusStyle(st.status);
                            return (
                                <div key={st._id} className="eng-task-row eng-task-row-clickable"
                                    onClick={()=>navigate(`/${['Site Engineer','Site Supervisor'].includes(user?.role) ? 'site' : 'engineer'}/tasks/${st._id}`)}>
                                    <div className="eng-task-dot" style={{ background:sst.dot }}/>
                                    <div className="eng-task-info">
                                        <span className="eng-task-title">{st.title}</span>
                                        <span className="eng-task-meta">{st.assignedTo?.fullName||'Unassigned'} · {st.assignedTo?.role}</span>
                                    </div>
                                    <span className="eng-badge" style={{color:sst.label,background:sst.bg}}>{st.status}</span>
                                </div>
                            );
                        })}
                        {!task.subtasks?.length && <div style={{ padding:'20px 24px', color:'#94a3b8', fontSize:13 }}>No subtasks created.</div>}
                    </div>
                </div>
            )}

            {/* Comments */}
            <div className="eng-section-card">
                <div className="eng-section-header">
                    <div className="eng-section-title"><Send size={16}/>Comments</div>
                    <span className="eng-task-count">{task.comments?.length||0}</span>
                </div>
                <div className="eng-comments">
                    {!task.comments?.length ? (
                        <div style={{ padding:'20px 24px', color:'#94a3b8', fontSize:13 }}>No comments yet. Be the first.</div>
                    ) : task.comments.map((c,i) => (
                        <div key={i} className="eng-comment">
                            <div className="eng-comment-avatar">{c.postedBy?.fullName?.charAt(0)||'?'}</div>
                            <div className="eng-comment-body">
                                <div className="eng-comment-header">
                                    <strong>{c.postedBy?.fullName}</strong>
                                    <span className="eng-comment-role">{c.postedBy?.role}</span>
                                    <span className="eng-comment-time">{new Date(c.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span>
                                </div>
                                <p className="eng-comment-text">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleComment} className="eng-comment-form">
                    <input className="eng-input" placeholder="Add a comment…"
                        value={comment} onChange={e=>setComment(e.target.value)}/>
                    <button type="submit" className="eng-btn-primary" disabled={saving||!comment.trim()}>
                        {saving?<Loader2 size={14} className="eng-spin"/>:<Send size={14}/>}
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskMainContent;
