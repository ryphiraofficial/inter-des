import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Send, Plus, Loader2, X, Clock } from 'lucide-react';
import { engineerAPI, BASE_IMAGE_URL } from '../../../models/api';
import './Engineer.css';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const STAGE_LABELS = { PM:'Project Manager', PE:'Project Engineer', SE:'Site Engineer', SS:'Site Supervisor' };
const PIPELINE = ['PM','PE','SE','SS'];
const STATUS_OPTIONS = ['Pending','In Progress','Completed'];

const getPriorityStyle = (p) => ({ Low:{color:'#64748b',bg:'#f1f5f9'}, Medium:{color:'#2563eb',bg:'#dbeafe'}, High:{color:'#d97706',bg:'#fef3c7'}, Urgent:{color:'#dc2626',bg:'#fee2e2'} }[p]||{color:'#64748b',bg:'#f1f5f9'});
const getStatusStyle   = (s) => ({ 'Pending':{label:'#92400e',bg:'#fef3c7',dot:'#f59e0b'}, 'In Progress':{label:'#1e40af',bg:'#dbeafe',dot:'#3b82f6'}, 'Completed':{label:'#065f46',bg:'#d1fae5',dot:'#10b981'}, 'Approved':{label:'#5b21b6',bg:'#ede9fe',dot:'#8b5cf6'} }[s]||{label:'#374151',bg:'#f3f4f6',dot:'#9ca3af'});

const TaskDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task,       setTask]       = useState(null);
    const [loading,    setLoading]    = useState(true);
    const [comment,    setComment]    = useState('');
    const [saving,     setSaving]     = useState(false);
    const [statusSaving, setStatusSaving] = useState(false);
    const [toast,      setToast]      = useState(null);
    const [showNote,   setShowNote]   = useState(false);
    const [note,       setNote]       = useState('');
    const [reviewNote, setReviewNote] = useState('');
    
    // Subtask states
    const [showSubtaskModal, setShowSubtaskModal] = useState(false);
    const [subtaskSaving, setSubtaskSaving] = useState(false);
    const [siteTeam, setSiteTeam] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [subform, setSubform] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });

    useEffect(() => { 
        load(); 
        if (user?.role === 'Project Engineer') {
            engineerAPI.getSiteTeam().then(res => { if (res.success) setSiteTeam(res.data); });
        } else if (user?.role === 'Site Engineer') {
            engineerAPI.getSupervisors().then(res => { if (res.success) setSupervisors(res.data); });
        }
    }, [id, user?.role]);

    const load = async () => {
        try {
            const res = await engineerAPI.getTaskById(id);
            if (res.success) setTask(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

    const handleCreateSubtask = async (e) => {
        e.preventDefault();
        setSubtaskSaving(true);
        try {
            const res = await engineerAPI.createSubtask({ ...subform, parentTaskId: id, projectId: task.projectId?._id || task.projectId });
            if (res.success) {
                setTask(prev => ({ ...prev, subtasks: [...(prev.subtasks || []), res.data] }));
                setShowSubtaskModal(false);
                setSubform({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
                showToast('Subtask created successfully');
            }
        } catch (e) { showToast('Failed to create subtask', 'error'); }
        finally { setSubtaskSaving(false); }
    };

    const handleStatusChange = async (newStatus) => {
        setStatusSaving(true);
        try {
            const res = await engineerAPI.updateStatus(id, newStatus, note||undefined);
            if (res.success) {
                setTask(prev => ({ ...prev, status: newStatus }));
                setNote(''); setShowNote(false);
                showToast(`Status updated to "${newStatus}"`);
            }
        } catch(e) { showToast('Failed to update status','error'); }
        finally { setStatusSaving(false); }
    };

    const handlePEReviewAction = async (nextStatus, actionType) => {
        setStatusSaving(true);
        try {
            const noteText = reviewNote ? `${actionType} by Project Engineer: ${reviewNote}` : `${actionType} by Project Engineer`;
            const res = await engineerAPI.updateStatus(id, nextStatus, noteText);
            if (res.success) {
                setTask(res.data);
                setReviewNote('');
                showToast(actionType === 'Approved' ? 'Task elevated to Project Manager!' : 'Task sent back to Site Engineer!');
            }
        } catch {
            showToast('Review action failed', 'error');
        } finally {
            setStatusSaving(false);
        }
    };

    const handleReassignTask = async (newAssigneeId) => {
        setSaving(true);
        try {
            const res = await engineerAPI.assignTask(id, newAssigneeId);
            if (res.success) {
                showToast('Task reassigned successfully!');
                load(); // Reload task to get updated assignee details
            } else {
                showToast(res.message || 'Failed to reassign task', 'error');
            }
        } catch (e) {
            showToast('Failed to reassign task', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSaving(true);
        try {
            const res = await engineerAPI.addComment(id, comment);
            if (res.success) {
                setTask(prev => ({ ...prev, comments: res.data }));
                setComment('');
                showToast('Comment added');
            }
        } catch(e) { showToast('Failed to add comment','error'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="eng-dashboard"><div className="eng-loading">Loading task…</div></div>;
    if (!task)   return <div className="eng-dashboard"><div className="eng-empty"><p>Task not found</p></div></div>;

    const pr = getPriorityStyle(task.priority);
    const st = getStatusStyle(task.status);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !['Completed','Approved'].includes(task.status);
    const isMine = task.assignedTo?._id === user?._id || task.assignedTo === user?._id;
    const currentPipelineStage = task.stage;

    return (
        <div className="eng-tasks-page">
            {toast && <div className="eng-toast" style={{ background: toast.type==='success'?'#10b981':'#ef4444' }}>{toast.msg}</div>}

            {/* Back */}
            <button className="eng-back-btn" style={{ marginBottom:16 }} onClick={() => navigate(-1)}>
                <ArrowLeft size={16}/> Back
            </button>

            <div className="eng-detail-grid">
                {/* Main Column */}
                <div className="eng-detail-main">
                    {/* Project Engineer Review Portal */}
                    {user?.role === 'Project Engineer' && task.status === 'Completed' && task.stage === 'PE' && (
                        <div className="eng-section-card" style={{ borderLeft: '4px solid #10b981', marginBottom: 20 }}>
                            <div className="eng-section-header" style={{ background: '#d1fae5', color: '#065f46', borderBottom: '1px solid #a7f3d0' }}>
                                <div className="eng-section-title">🛡 Project Engineer Review Portal</div>
                            </div>
                            <div style={{ padding: 20 }}>
                                <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}>
                                    <strong>Site Engineer</strong> has reviewed and approved this task's completion. Please inspect the completion note, update logs, and attached photo gallery, then choose to elevate to Project Manager for final sign-off, or reject back to the Site Engineer.
                                </p>
                                
                                {/* Submission Verification Details for PE */}
                                <div style={{ 
                                    background: '#f0fdf4', 
                                    border: '1px dashed #10b981', 
                                    borderRadius: '10px', 
                                    padding: '16px', 
                                    marginBottom: '20px' 
                                }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                                        📋 Review & Submission Trail
                                    </div>
                                    
                                    {/* Site Supervisor Completion details */}
                                    <div style={{ marginBottom: '12px', borderBottom: '1px solid #d1fae5', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Site Supervisor Note:</span>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#4b5563', fontStyle: 'italic', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                            "{task.updates?.slice().reverse().find(u => u.note && !u.note.includes('Approved by') && !u.note.includes('Rejected by'))?.note || 'No completion note provided.'}"
                                        </p>
                                    </div>

                                    {/* Site Engineer Review details */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Site Engineer Feedback:</span>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#4b5563', fontStyle: 'italic', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                            "{task.updates?.slice().reverse().find(u => u.note && u.note.includes('Approved by Site Engineer'))?.note || 'No site engineer notes provided.'}"
                                        </p>
                                    </div>

                                    {/* All Submission & Review Gallery */}
                                    {task.updates?.some(up => up.images?.length > 0) ? (
                                        <div>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>All Verification Photos:</span>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {task.updates.flatMap((up) => 
                                                    (up.images || []).map((img, imgIdx) => (
                                                        <div key={imgIdx} style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', background: '#fff' }}>
                                                            <img src={getImageUrl(img)} alt="Verification snap" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(getImageUrl(img), '_blank')} title="Click to view full size" />
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '12.5px', color: '#6b7280', fontStyle: 'italic' }}>
                                            No photos uploaded.
                                        </div>
                                    )}
                                </div>
                                
                                <div className="eng-form-group" style={{ marginBottom: 16 }}>
                                    <label className="eng-label" style={{ fontWeight: 600, color: '#475569', fontSize: 12, display: 'block', marginBottom: 6 }}>PE REVIEW COMMENTS / FEEDBACK</label>
                                    <textarea 
                                        className="eng-input" 
                                        rows={2} 
                                        value={reviewNote} 
                                        onChange={e => setReviewNote(e.target.value)}
                                        placeholder="Provide PE feedback or approval notes..."
                                    />
                                </div>
                                
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button 
                                        className="eng-btn-primary" 
                                        disabled={statusSaving}
                                        onClick={() => handlePEReviewAction('Completed', 'Approved')}
                                    >
                                        {statusSaving ? 'Processing...' : '✔ Approve & Elevate to PM'}
                                    </button>
                                    <button 
                                        className="eng-btn-danger" 
                                        disabled={statusSaving}
                                        onClick={() => handlePEReviewAction('In Progress', 'Rejected')}
                                    >
                                        {statusSaving ? 'Processing...' : '✘ Send Back to Site Engineer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                    <div className="eng-section-card" style={{ marginBottom:20 }}>
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

                    {/* Update Status (only assigned user) */}
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

                {/* Sidebar Column */}
                <div className="eng-detail-side">
                    <div className="eng-section-card">
                        <div className="eng-section-header">
                            <div className="eng-section-title">Details</div>
                        </div>
                        <div className="eng-info-rows">
                            {[
                                ['Project',     task.projectId?.projectName||'—'],
                                ['Assigned By', task.assignedBy?.fullName||'—'],
                                ['Assigned To', 'dropdown'], // Marker for custom render
                                ['Stage',       STAGE_LABELS[task.stage]||task.stage],
                                ['Priority',    task.priority],
                                ['Status',      task.status],
                                ['Due Date',    task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'],
                                ['Created',     new Date(task.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})],
                            ].map(([k,v])=>(
                                <div key={k} className="eng-info-row">
                                    <span className="eng-info-label">{k}</span>
                                    {v === 'dropdown' ? (
                                        ['Project Engineer', 'Site Engineer'].includes(user?.role) ? (
                                            <select 
                                                className="eng-input" 
                                                value={task.assignedTo?._id || task.assignedTo || ''}
                                                onChange={(e) => handleReassignTask(e.target.value)}
                                                disabled={saving}
                                                style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', width: 'auto', flex: 1, marginLeft: '10px' }}
                                            >
                                                <option value="">Unassigned</option>
                                                {(user?.role === 'Site Engineer' ? supervisors : siteTeam).map(m => (
                                                    <option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="eng-info-value">{task.assignedTo?.fullName||'Unassigned'}</span>
                                        )
                                    ) : (
                                        <span className="eng-info-value">{v}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity / Updates */}
                    {task.updates?.length > 0 && (
                        <div className="eng-section-card" style={{ marginTop:16 }}>
                            <div className="eng-section-header">
                                <div className="eng-section-title"><Clock size={16}/>Update Log</div>
                            </div>
                            <div className="eng-activity-list" style={{ padding:'8px 0' }}>
                                {task.updates.slice(-5).reverse().map((u,i)=>(
                                    <div key={i} className="eng-activity-item">
                                        <div className="eng-activity-dot"/>
                                        <div className="eng-activity-body">
                                            {u.note && <span className="eng-activity-msg">{u.note}</span>}
                                            <span className="eng-activity-meta">
                                                {u.updatedBy?.fullName} · {new Date(u.timestamp).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Subtask Modal */}
            {showSubtaskModal && (
                <div className="eng-modal-overlay">
                    <div className="eng-modal">
                        <div className="eng-modal-header">
                            <h3>Add Subtask</h3>
                            <button onClick={()=>setShowSubtaskModal(false)} className="eng-modal-close"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleCreateSubtask} className="eng-modal-form">
                            <div className="eng-form-group">
                                <label>Title</label>
                                <input className="eng-input" required value={subform.title} onChange={e=>setSubform({...subform,title:e.target.value})} placeholder="E.g. Install false ceiling in Lobby"/>
                            </div>
                            <div className="eng-form-group">
                                <label>Description</label>
                                <textarea className="eng-input" rows={3} value={subform.description} onChange={e=>setSubform({...subform,description:e.target.value})} placeholder="Details..."/>
                            </div>
                            <div className="eng-form-row">
                                <div className="eng-form-group">
                                    <label>Assign To *{user?.role === 'Site Engineer' ? ' (Site Supervisor)' : ''}</label>
                                    <select className="eng-input" value={subform.assignedTo} onChange={e=>setSubform({...subform,assignedTo:e.target.value})} required>
                                        <option value="">Select {user?.role === 'Site Engineer' ? 'supervisor' : 'engineer'}…</option>
                                        {(user?.role === 'Site Engineer' ? supervisors : siteTeam).map(m=><option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>)}
                                    </select>
                                </div>
                                <div className="eng-form-group">
                                    <label>Priority</label>
                                    <select className="eng-input" value={subform.priority} onChange={e=>setSubform({...subform,priority:e.target.value})}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="eng-form-group">
                                <label>Due Date</label>
                                <input type="date" className="eng-input" required value={subform.dueDate} onChange={e=>setSubform({...subform,dueDate:e.target.value})} />
                            </div>
                            <div className="eng-modal-footer">
                                <button type="button" className="eng-btn-ghost" onClick={()=>setShowSubtaskModal(false)}>Cancel</button>
                                <button type="submit" className="eng-btn-primary" disabled={subtaskSaving}>
                                    {subtaskSaving ? <Loader2 size={16} className="eng-spin"/> : null} Add Subtask
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetail;
