import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Send, Clock, Loader2, ChevronRight, Target } from 'lucide-react';
import { engineerAPI, uploadAPI, BASE_IMAGE_URL } from '../../../models/api';
import './Site.css';

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
const STATUS_FILTERS = ['All','Pending','In Progress','Completed','Approved'];
const PRIORITY_FILTERS = ['All','Low','Medium','High','Urgent'];

const getPriorityStyle = (p) => ({ Low:{color:'#64748b',bg:'#f1f5f9'}, Medium:{color:'#2563eb',bg:'#dbeafe'}, High:{color:'#d97706',bg:'#fef3c7'}, Urgent:{color:'#dc2626',bg:'#fee2e2'} }[p]||{color:'#64748b',bg:'#f1f5f9'});
const getStatusStyle   = (s) => ({ 'Pending':{label:'#92400e',bg:'#fef3c7',dot:'#f59e0b'}, 'In Progress':{label:'#1e40af',bg:'#dbeafe',dot:'#3b82f6'}, 'Completed':{label:'#065f46',bg:'#d1fae5',dot:'#10b981'}, 'Approved':{label:'#5b21b6',bg:'#ede9fe',dot:'#8b5cf6'} }[s]||{label:'#374151',bg:'#f3f4f6',dot:'#9ca3af'});

const PRESET_IMAGES = [
    { name: 'Modern Living Room', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kitchen Remodel', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Completed Bedroom', url: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80' }
];

/* ── Task Detail Panel ── */
const SiteTaskDetail = ({ task, user, onBack, onUpdate }) => {
    const [comment, setComment] = useState('');
    const [note, setNote]       = useState('');
    const [showNote, setShowNote] = useState(false);
    const [saving, setSaving]   = useState(false);
    const [statusSaving, setStatusSaving] = useState(false);
    const [toast, setToast]     = useState(null);
    const [localTask, setLocalTask] = useState(task);

    // Dynamic Promoting States
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completionNote, setCompletionNote] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [customImageUrl, setCustomImageUrl] = useState('');
    const [reviewNote, setReviewNote] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);
    const [reviewImages, setReviewImages] = useState([]);
    const [uploadingReviewFile, setUploadingReviewFile] = useState(false);

    // Reassignment States
    const [supervisors, setSupervisors] = useState([]);
    const [reassigning, setReassigning] = useState(false);

    useEffect(() => {
        if (user?.role === 'Site Engineer') {
            engineerAPI.getSupervisors().then(res => {
                if (res.success) setSupervisors(res.data);
            });
        }
    }, [user?.role]);

    const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

    const handleStatus = async (status) => {
        if (status === 'Completed' && user?.role === 'Site Supervisor') {
            // Find existing supervisor completion details if any
            const existingSubmit = localTask.updates?.slice().reverse().find(u => u.note && !u.note.includes('Approved by') && !u.note.includes('Rejected by'));
            if (existingSubmit) {
                setCompletionNote(existingSubmit.note);
                setSelectedImages(existingSubmit.images || []);
            } else {
                setCompletionNote('');
                setSelectedImages([]);
            }
            setShowCompletionModal(true);
            return;
        }
        
        setStatusSaving(true);
        try {
            const res = await engineerAPI.updateStatus(localTask._id, status, note||undefined);
            if (res.success) { 
                setLocalTask(res.data || { ...localTask, status }); 
                setNote(''); 
                setShowNote(false); 
                showToast(`Status → "${status}"`); 
                onUpdate(); 
            }
        } catch { showToast('Failed','error'); }
        finally { setStatusSaving(false); }
    };

    const submitCompletion = async () => {
        setStatusSaving(true);
        try {
            const res = await engineerAPI.updateStatus(localTask._id, 'Completed', completionNote || undefined, selectedImages);
            if (res.success) {
                setLocalTask(res.data);
                setShowCompletionModal(false);
                setCompletionNote('');
                setSelectedImages([]);
                showToast('Task submitted for Site Engineer review!');
                onUpdate();
            }
        } catch {
            showToast('Failed to submit completion', 'error');
        } finally {
            setStatusSaving(false);
        }
    };

    const handleReassign = async (newAssigneeId) => {
        setReassigning(true);
        try {
            const res = await engineerAPI.assignTask(localTask._id, newAssigneeId);
            if (res.success) {
                showToast('Task reassigned successfully!');
                const taskRes = await engineerAPI.getTaskById(localTask._id);
                if (taskRes.success) setLocalTask(taskRes.data);
                onUpdate();
            } else {
                showToast(res.message || 'Failed to reassign', 'error');
            }
        } catch (e) {
            showToast('Failed to reassign', 'error');
        } finally {
            setReassigning(false);
        }
    };

    const handleReviewAction = async (nextStatus, actionType) => {
        setStatusSaving(true);
        try {
            const noteText = reviewNote ? `${actionType} by Site Engineer: ${reviewNote}` : `${actionType} by Site Engineer`;
            const res = await engineerAPI.updateStatus(localTask._id, nextStatus, noteText, reviewImages);
            if (res.success) {
                setLocalTask(res.data);
                setReviewNote('');
                setReviewImages([]);
                showToast(actionType === 'Approved' ? 'Task elevated to Project Engineer!' : 'Task sent back to Supervisor!');
                onUpdate();
            }
        } catch {
            showToast('Review action failed', 'error');
        } finally {
            setStatusSaving(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSaving(true);
        try {
            const res = await engineerAPI.addComment(localTask._id, comment);
            if (res.success) { setLocalTask(p=>({...p,comments:res.data})); setComment(''); showToast('Comment added'); }
        } catch { showToast('Failed','error'); }
        finally { setSaving(false); }
    };

    const pr = getPriorityStyle(localTask.priority);
    const st = getStatusStyle(localTask.status);
    const isMine = localTask.assignedTo?._id === user?._id || localTask.assignedTo === user?._id;
    const isOverdue = localTask.dueDate && new Date(localTask.dueDate) < new Date() && !['Completed','Approved'].includes(localTask.status);

    return (
        <div>
            {toast && <div className="site-toast" style={{background:toast.type==='success'?'#10b981':'#ef4444'}}>{toast.msg}</div>}
            <button className="site-back-btn" onClick={onBack}><ArrowLeft size={15}/>Back to Tasks</button>
            <div className="site-detail-grid">
                <div>
                    {/* Site Engineer Review Banner */}
                    {user?.role === 'Site Engineer' && localTask.status === 'Completed' && localTask.stage === 'SE' && (
                        <div className="site-review-card" style={{borderLeft: '4px solid #10b981', marginBottom: 20}}>
                            <div className="site-card-header" style={{background: '#d1fae5', color: '#065f46', borderBottom: '1px solid #a7f3d0'}}>
                                <div className="site-card-title">🛡 Site Engineer Review Portal</div>
                            </div>
                            <div style={{padding: 20}}>
                                <p style={{margin: '0 0 16px', fontSize: 13.5, color: '#374151', lineHeight: 1.5}}>
                                    <strong>Site Supervisor</strong> has submitted this task as completed. Please review the completion note, comments, and uploaded photos below. Select to Approve and promote to Project Engineer review, or Send Back with feedback.
                                </p>
                                
                                {/* Supervisor Submission Details */}
                                <div style={{ 
                                    background: '#f0fdf4', 
                                    border: '1px dashed #6ee7b7', 
                                    borderRadius: '10px', 
                                    padding: '16px', 
                                    marginBottom: '20px' 
                                }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                        📋 Supervisor Completion Details
                                    </div>
                                    
                                    {/* Completion Note */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Completion Note:</span>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', fontStyle: 'italic', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                            "{localTask.updates?.slice().reverse().find(u => !u.note?.includes('by Site Engineer') && !u.note?.includes('by Project Engineer') && !u.note?.includes('by Project Manager'))?.note || 'No completion note provided.'}"
                                        </p>
                                    </div>

                                    {/* Completion Photos */}
                                    {localTask.updates?.some(up => up.images?.length > 0 && !up.note?.includes('by Site Engineer')) ? (
                                        <div>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Attached Completion Photos:</span>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {localTask.updates.flatMap((up) => 
                                                    (!up.note?.includes('by Site Engineer') ? (up.images || []) : []).map((img, imgIdx) => (
                                                        <div key={imgIdx} style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', background: '#fff' }}>
                                                            <img src={getImageUrl(img)} alt="Supervisor completion snap" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(getImageUrl(img), '_blank')} title="Click to view full size" />
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '12.5px', color: '#6b7280', fontStyle: 'italic' }}>
                                            No photos uploaded by the Site Supervisor.
                                        </div>
                                    )}
                                </div>
                                
                                <div className="site-form-group" style={{marginBottom: 16}}>
                                    <label className="site-label" style={{fontWeight: 600, color: '#475569', fontSize: 12}}>FEEDBACK / REVIEW NOTE</label>
                                    <textarea 
                                        className="site-input" 
                                        rows={2} 
                                        value={reviewNote} 
                                        onChange={e => setReviewNote(e.target.value)}
                                        placeholder="Add approval comments or feedback for rejection..."
                                    />
                                </div>
                                
                                <div className="site-form-group" style={{marginBottom: 16}}>
                                    <label className="site-label" style={{fontWeight: 600, color: '#475569', fontSize: 12}}>ADD REVIEW / INSPECTION PHOTOS</label>
                                    <div style={{display:'flex', gap:8, alignItems:'center', marginTop: 4}}>
                                        <input 
                                            id="se-review-image-upload" 
                                            type="file" 
                                            accept="image/*" 
                                            style={{display: 'none'}}
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setUploadingReviewFile(true);
                                                    try {
                                                        const formData = new FormData();
                                                        formData.append('image', file);
                                                        const res = await uploadAPI.image(formData);
                                                        if (res.success) {
                                                            setReviewImages(p => [...p, res.url]);
                                                            showToast('Review photo uploaded successfully!');
                                                        } else {
                                                            showToast(res.message || 'Upload failed', 'error');
                                                        }
                                                    } catch (err) {
                                                        showToast('Failed to upload review image file', 'error');
                                                    } finally {
                                                        setUploadingReviewFile(false);
                                                    }
                                                }
                                            }}
                                        />
                                        <label 
                                            htmlFor="se-review-image-upload"
                                            className="site-btn-secondary"
                                            style={{
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                fontSize: '12.5px',
                                                fontWeight: 600,
                                                border: '1.5px solid #cbd5e1',
                                                borderRadius: '8px',
                                                background: '#f8fafc',
                                                color: '#475569',
                                                transition: 'all 0.15s'
                                            }}
                                        >
                                            {uploadingReviewFile ? <Loader2 size={13} className="site-spin" /> : '📁 Select inspection Photo File'}
                                        </label>
                                    </div>
                                    
                                    {reviewImages.length > 0 && (
                                        <div style={{marginTop: 12}}>
                                            <div style={{fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6}}>Selected review photos ({reviewImages.length}):</div>
                                            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                                                {reviewImages.map((url, idx) => (
                                                    <div key={idx} style={{position:'relative', width:50, height:50, borderRadius:6, overflow:'hidden', border:'1px solid #e2e8f0'}}>
                                                        <img src={getImageUrl(url)} alt="Attached review" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setReviewImages(p => p.filter(u => u !== url))}
                                                            style={{
                                                                position: 'absolute',
                                                                top: 1,
                                                                right: 1,
                                                                background: 'rgba(239, 68, 68, 0.95)',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '50%',
                                                                width: 14,
                                                                height: 14,
                                                                fontSize: 8,
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div style={{display: 'flex', gap: 10}}>
                                    <button 
                                        className="site-btn-primary" 
                                        disabled={statusSaving}
                                        onClick={() => handleReviewAction('Completed', 'Approved')}
                                    >
                                        ✔ Approve & Elevate to PE
                                    </button>
                                    <button 
                                        className="site-btn-danger" 
                                        disabled={statusSaving}
                                        onClick={() => handleReviewAction('In Progress', 'Rejected')}
                                    >
                                        ✘ Send Back to Supervisor
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="site-card" style={{marginBottom:20}}>
                        <div style={{padding:24}}>
                            <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'flex-start'}}>
                                <div style={{flex:1}}>
                                    {localTask.isSubtask && <div style={{fontSize:12,color:'#94a3b8',marginBottom:6}}>↳ Subtask</div>}
                                    <h2 style={{fontSize:20,fontWeight:700,color:'#0f172a',margin:'0 0 8px'}}>{localTask.title}</h2>
                                    {localTask.description && <p style={{fontSize:14,color:'#64748b',margin:0,lineHeight:1.6}}>{localTask.description}</p>}
                                </div>
                                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                                    <span className="site-badge" style={{color:pr.color,background:pr.bg}}>{localTask.priority}</span>
                                    <span className="site-badge" style={{color:st.label,background:st.bg}}>{localTask.status}</span>
                                    {isOverdue && <span className="site-badge" style={{color:'#dc2626',background:'#fee2e2'}}>⚠ Overdue</span>}
                                </div>
                            </div>
                            <div className="site-pipeline">
                                {PIPELINE.map((s,i)=>(
                                    <React.Fragment key={s}>
                                        <div className={`site-pipe-step${s===localTask.stage?' active':''}`}>
                                            <div className="site-pipe-dot"/><span>{STAGE_LABELS[s]}</span>
                                        </div>
                                        {i<PIPELINE.length-1 && <div className="site-pipe-line"/>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Completion Images Gallery Card */}
                    {localTask.updates?.some(up => up.images?.length > 0) && (
                        <div className="site-card" style={{marginBottom: 20}}>
                            <div className="site-card-header">
                                <div className="site-card-title">📸 Completed Work Photos</div>
                            </div>
                            <div style={{padding: 20}}>
                                <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                                    {localTask.updates.flatMap((up, uIdx) => 
                                        (up.images || []).map((img, imgIdx) => (
                                            <div key={`${uIdx}-${imgIdx}`} style={{width: 140, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)'}}>
                                                <img src={getImageUrl(img)} alt="Completed Site Photo" style={{width: '100%', height: 100, objectFit: 'cover'}}/>
                                                <div style={{padding: '6px 10px', fontSize: 10.5, background: '#f8fafc', color: '#64748b', borderTop: '1px solid #f1f5f9'}}>
                                                    {up.note || 'Site Photo'}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {isMine && localTask.status !== 'Approved' && (
                        <div className="site-card" style={{marginBottom:20}}>
                            <div className="site-card-header"><div className="site-card-title"><CheckSquare size={15}/>Update Status</div></div>
                            <div className="site-status-row">
                                {STATUS_OPTIONS.map(s=>(
                                    <button key={s} 
                                        className={localTask.status===s ? 'site-btn-primary' : 'site-btn-secondary'}
                                        onClick={() => {
                                            if (s !== localTask.status || (s === 'Completed' && user?.role === 'Site Supervisor')) {
                                                handleStatus(s);
                                            }
                                        }}
                                        disabled={statusSaving || (localTask.status === s && (s !== 'Completed' || user?.role !== 'Site Supervisor'))}
                                    >
                                        {s === 'Completed' && localTask.status === 'Completed' && user?.role === 'Site Supervisor' ? '✏ Edit Completion Info' : s}
                                    </button>
                                ))}
                                <button type="button" 
                                    className="site-btn-secondary" 
                                    onClick={()=>setShowNote(!showNote)} 
                                    style={{marginLeft:'auto'}}
                                >
                                    {showNote ? 'Hide Note' : '+ Note'}
                                </button>
                            </div>
                            {showNote && <div style={{padding:'0 24px 14px'}}><textarea className="site-input" rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="Note…"/></div>}
                        </div>
                    )}

                    <div className="site-card">
                        <div className="site-card-header">
                            <div className="site-card-title"><Send size={15}/>Comments</div>
                            <span className="site-count">{localTask.comments?.length||0}</span>
                        </div>
                        <div className="site-comments">
                            {!localTask.comments?.length ? (
                                <div style={{padding:'18px 24px',fontSize:13,color:'#94a3b8'}}>No comments yet.</div>
                            ) : localTask.comments.map((c,i)=>(
                                <div key={i} className="site-comment">
                                    <div className="site-comment-avatar">{c.postedBy?.fullName?.charAt(0)||'?'}</div>
                                    <div className="site-comment-body">
                                        <div>
                                            <span className="site-comment-name">{c.postedBy?.fullName}</span>
                                            <span className="site-comment-role">{c.postedBy?.role}</span>
                                            <span className="site-comment-time">{new Date(c.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span>
                                        </div>
                                        <p className="site-comment-text">{c.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleComment} className="site-comment-form">
                            <input className="site-input" placeholder="Add a comment…" value={comment} onChange={e=>setComment(e.target.value)}/>
                            <button type="submit" className="site-btn-primary" disabled={saving||!comment.trim()}>
                                {saving?<Loader2 size={14} className="site-spin"/>:<Send size={14}/>} Post
                            </button>
                        </form>
                    </div>
                </div>

                <div>
                    <div className="site-card">
                        <div className="site-card-header"><div className="site-card-title">Details</div></div>
                        <div className="site-info-rows">
                            {[
                                ['Project',localTask.projectId?.projectName||'—'],
                                ['Assigned By',localTask.assignedBy?.fullName||'—'],
                                ['Assigned To', 'dropdown'],
                                ['Stage',STAGE_LABELS[localTask.stage]||localTask.stage],
                                ['Priority',localTask.priority],
                                ['Status',localTask.status],
                                ['Due',localTask.dueDate?new Date(localTask.dueDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—']
                            ].map(([k,v])=>(
                                <div key={k} className="site-info-row">
                                    <span className="site-info-label">{k}</span>
                                    {v === 'dropdown' ? (
                                        user?.role === 'Site Engineer' ? (
                                            <select 
                                                className="site-input" 
                                                value={localTask.assignedTo?._id || localTask.assignedTo || ''}
                                                onChange={(e) => handleReassign(e.target.value)}
                                                disabled={reassigning}
                                                style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', width: 'auto', flex: 1, marginLeft: '10px' }}
                                            >
                                                <option value="">Unassigned</option>
                                                {supervisors.map(m => (
                                                    <option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="site-info-value">{localTask.assignedTo?.fullName||'Unassigned'}</span>
                                        )
                                    ) : (
                                        <span className="site-info-value">{v}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion & Picture Upload Overlay Modal */}
            {showCompletionModal && (
                <div className="site-modal-overlay">
                    <div className="site-modal">
                        <div className="site-modal-header">
                            <h3>Submit Task Completion & Photos</h3>
                            <button className="site-modal-close" onClick={() => setShowCompletionModal(false)}>×</button>
                        </div>
                        <div className="site-modal-body">
                            <div className="site-form-group" style={{marginBottom: 14}}>
                                <label className="site-label" style={{fontWeight: 600, color: '#374151', fontSize: 13}}>Completion Notes</label>
                                <textarea 
                                    className="site-input" 
                                    rows={3} 
                                    value={completionNote} 
                                    onChange={e => setCompletionNote(e.target.value)} 
                                    placeholder="Describe the final status of this task for the Site Engineer's review..."
                                />
                            </div>
                            
                            <div className="site-form-group" style={{marginBottom: 14}}>
                                <label className="site-label" style={{fontWeight: 600, color: '#374151', fontSize: 13, marginBottom: 8}}>Select Completed Site Photos (Click to Toggle)</label>
                                <div style={{display:'flex', gap:10, marginBottom:15}}>
                                    {PRESET_IMAGES.map((img, idx) => {
                                        const isSelected = selectedImages.includes(img.url);
                                        return (
                                            <div 
                                                key={idx} 
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedImages(p => p.filter(u => u !== img.url));
                                                    } else {
                                                        setSelectedImages(p => [...p, img.url]);
                                                    }
                                                }}
                                                style={{
                                                    flex: 1,
                                                    position: 'relative',
                                                    borderRadius: 8,
                                                    overflow: 'hidden',
                                                    border: isSelected ? '3px solid #10b981' : '1px solid #e2e8f0',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    transform: isSelected ? 'scale(0.98)' : 'none'
                                                }}
                                            >
                                                <img src={img.url} alt={img.name} style={{width:'100%', height:65, objectFit:'cover'}}/>
                                                <div style={{
                                                    fontSize: 9.5,
                                                    padding: '3px 4px',
                                                    background: isSelected ? '#10b981' : '#0f172a',
                                                    color: '#fff',
                                                    textAlign: 'center',
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {img.name}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="site-form-group" style={{marginBottom: 14}}>
                                <label className="site-label" style={{fontWeight: 600, color: '#374151', fontSize: 13, marginBottom: 6, display: 'block'}}>Or Upload Local Photo File</label>
                                <div style={{display:'flex', gap:8, alignItems: 'center'}}>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        style={{display: 'none'}}
                                        id="local-image-upload"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setUploadingFile(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append('image', file);
                                                    const res = await uploadAPI.image(formData);
                                                    if (res.success) {
                                                        setSelectedImages(p => [...p, res.url]);
                                                        showToast('Image uploaded successfully!');
                                                    } else {
                                                        showToast(res.message || 'Upload failed', 'error');
                                                    }
                                                } catch (err) {
                                                    showToast('Failed to upload image file', 'error');
                                                } finally {
                                                    setUploadingFile(false);
                                                }
                                            }
                                        }}
                                    />
                                    <label 
                                        htmlFor="local-image-upload"
                                        className="site-btn-secondary"
                                        style={{
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 16px',
                                            fontSize: '12.5px',
                                            fontWeight: 600,
                                            border: '1.5px solid #cbd5e1',
                                            borderRadius: '8px',
                                            background: '#f8fafc',
                                            color: '#475569',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        {uploadingFile ? <Loader2 size={13} className="site-spin" /> : '📁 Select Local Image File'}
                                    </label>
                                </div>
                            </div>

                            <div className="site-form-group" style={{marginBottom: 14}}>
                                <label className="site-label" style={{fontWeight: 600, color: '#374151', fontSize: 13}}>Or Paste Custom Photo URL</label>
                                <div style={{display:'flex', gap:8}}>
                                    <input 
                                        className="site-input" 
                                        type="text" 
                                        value={customImageUrl} 
                                        onChange={e => setCustomImageUrl(e.target.value)} 
                                        placeholder="https://example.com/custom-photo.jpg"
                                    />
                                    <button 
                                        type="button" 
                                        className="site-btn-secondary"
                                        onClick={() => {
                                            if (customImageUrl.trim()) {
                                                setSelectedImages(p => [...p, customImageUrl.trim()]);
                                                setCustomImageUrl('');
                                            }
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                            
                            {selectedImages.length > 0 && (
                                <div style={{marginTop: 15}}>
                                    <div style={{fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8}}>Attached Photos ({selectedImages.length}):</div>
                                    <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                                        {selectedImages.map((url, idx) => (
                                            <div key={idx} style={{position:'relative', width:54, height:54, borderRadius:6, overflow:'hidden', border:'1px solid #e2e8f0'}}>
                                                <img src={getImageUrl(url)} alt="Attached" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                                                <button 
                                                    type="button"
                                                    onClick={() => setSelectedImages(p => p.filter(u => u !== url))}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 1,
                                                        right: 1,
                                                        background: 'rgba(239, 68, 68, 0.95)',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: 15,
                                                        height: 15,
                                                        fontSize: 9,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        padding: 0
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="site-modal-footer">
                            <button className="site-btn-secondary" onClick={() => setShowCompletionModal(false)}>Cancel</button>
                            <button 
                                className="site-btn-primary" 
                                onClick={submitCompletion}
                                disabled={statusSaving || selectedImages.length === 0}
                            >
                                {statusSaving ? 'Submitting...' : 'Submit Completion'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Tasks List ── */
const SiteTasks = ({ user }) => {
    const [tasks,    setTasks]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [filters,  setFilters]  = useState({ status:'All', priority:'All' });
    const [showFilters, setShowFilters] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(()=>{ load(); },[]);

    const load = async () => {
        try { const res = await engineerAPI.getMyTasks(); if(res.success) setTasks(res.data); }
        catch(e){ console.error(e); } finally { setLoading(false); }
    };

    const openTask = async (task) => {
        try { const res = await engineerAPI.getTaskById(task._id); if(res.success) setSelected(res.data); }
        catch { setSelected(task); }
    };

    const setFilter = (k,v) => setFilters(p=>({...p,[k]:v}));

    const activeFilterCount = (filters.status !== 'All' ? 1 : 0) + (filters.priority !== 'All' ? 1 : 0);

    const filtered = tasks.filter(t=>{
        if(filters.status!=='All' && t.status!==filters.status) return false;
        if(filters.priority!=='All' && t.priority!==filters.priority) return false;
        return true;
    });

    if(selected) return (
        <div className="site-page">
            <SiteTaskDetail task={selected} user={user} onBack={()=>setSelected(null)} onUpdate={()=>{ setSelected(null); load(); }}/>
        </div>
    );

    return (
        <div className="site-page">
            <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',marginBottom:24,flexWrap:'wrap',gap:12}}>
                <button 
                    className={`site-filter-toggle ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Target size={16} /> 
                    Filters
                    {activeFilterCount > 0 && <span className="site-filter-badge">{activeFilterCount}</span>}
                </button>
            </div>

            {showFilters && (
                <div className="site-filters-panel">
                    <div className="site-filter-group">
                        <span className="site-filter-label">Status</span>
                        <div className="site-filter-options">
                            {STATUS_FILTERS.map(o=>(
                                <button 
                                    key={o} 
                                    className={`site-filter-chip ${filters.status===o?'active':''}`} 
                                    onClick={()=>setFilter('status',o)}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="site-filter-group">
                        <span className="site-filter-label">Priority</span>
                        <div className="site-filter-options">
                            {PRIORITY_FILTERS.map(o=>(
                                <button 
                                    key={o} 
                                    className={`site-filter-chip ${filters.priority===o?'active':''}`} 
                                    onClick={()=>setFilter('priority',o)}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {loading ? <div className="site-loading">Loading…</div> :
             filtered.length===0 ? (
                <div className="site-card"><div className="site-empty" style={{padding:52}}><Target size={40}/><p>No tasks found</p></div></div>
             ) : (
                <div className="site-task-cards">
                    {filtered.map(task=>{
                        const pr=getPriorityStyle(task.priority), st=getStatusStyle(task.status);
                        const overdue=task.dueDate&&new Date(task.dueDate)<new Date()&&!['Completed','Approved'].includes(task.status);
                        return (
                            <div key={task._id} className="site-task-card" onClick={()=>openTask(task)}>
                                <div className="site-task-card-top">
                                    <span className="site-badge" style={{color:pr.color,background:pr.bg}}>{task.priority}</span>
                                    <span className="site-badge" style={{color:st.label,background:st.bg}}>{task.status}</span>
                                    {overdue&&<span className="site-badge" style={{color:'#dc2626',background:'#fee2e2'}}>Overdue</span>}
                                </div>
                                <h3 className="site-task-card-title">{task.title}</h3>
                                {task.description&&<p className="site-task-card-desc">{task.description}</p>}
                                <div className="site-task-card-meta">
                                    <span>{task.projectId?.projectName||'—'}</span>
                                    <span style={{fontSize:11,color:'#94a3b8'}}>{STAGE_LABELS[task.stage]||task.stage}</span>
                                </div>
                                <div className="site-task-card-footer">
                                    <span style={{fontSize:12,color:'#94a3b8'}}>By: {task.assignedBy?.fullName||'—'}</span>
                                    {task.dueDate&&<span style={{fontSize:12,color:overdue?'#ef4444':'#94a3b8',marginLeft:'auto'}}>{new Date(task.dueDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</span>}
                                    <ChevronRight size={13} style={{color:'#94a3b8'}}/>
                                </div>
                            </div>
                        );
                    })}
                </div>
             )}
        </div>
    );
};

export default SiteTasks;
