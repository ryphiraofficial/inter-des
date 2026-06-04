import React from 'react';
import { X, Loader2 } from 'lucide-react';

const CreateSubtaskModal = ({ 
    showSubtaskModal, setShowSubtaskModal, 
    handleCreateSubtask, selectedTask, 
    subtask, setSubtask, 
    user, siteTeam, supervisors, saving 
}) => {
    if (!showSubtaskModal) return null;

    return (
        <div className="eng-modal-overlay">
            <div className="eng-modal">
                <div className="eng-modal-header">
                    <h3>Create Subtask</h3>
                    <button className="eng-modal-close" onClick={()=>setShowSubtaskModal(false)}><X size={18}/></button>
                </div>
                <p className="eng-modal-sub">Under: <strong>{selectedTask?.title}</strong></p>
                <form onSubmit={handleCreateSubtask} className="eng-modal-form">
                    <div className="eng-form-group">
                        <label>Title *</label>
                        <input className="eng-input" value={subtask.title} onChange={e=>setSubtask({...subtask,title:e.target.value})} required/>
                    </div>
                    <div className="eng-form-group">
                        <label>Description</label>
                        <textarea className="eng-input" rows={3} value={subtask.description} onChange={e=>setSubtask({...subtask,description:e.target.value})}/>
                    </div>
                    <div className="eng-form-row">
                        <div className="eng-form-group">
                            <label>Assign To *{user?.role === 'Site Engineer' ? ' (Site Supervisor)' : ''}</label>
                            <select className="eng-input" value={subtask.assignedTo} onChange={e=>setSubtask({...subtask,assignedTo:e.target.value})} required>
                                <option value="">Select{user?.role === 'Site Engineer' ? ' supervisor' : ' engineer'}…</option>
                                {(user?.role === 'Site Engineer' ? supervisors : siteTeam).map(m=><option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>)}
                            </select>
                        </div>
                        <div className="eng-form-group">
                            <label>Priority</label>
                            <select className="eng-input" value={subtask.priority} onChange={e=>setSubtask({...subtask,priority:e.target.value})}>
                                {['Low','Medium','High','Urgent'].map(p=><option key={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="eng-form-group">
                        <label>Due Date</label>
                        <input type="date" className="eng-input" value={subtask.dueDate} onChange={e=>setSubtask({...subtask,dueDate:e.target.value})}/>
                    </div>
                    <div className="eng-modal-footer">
                        <button type="button" className="eng-btn-ghost" onClick={()=>setShowSubtaskModal(false)}>Cancel</button>
                        <button type="submit" className="eng-btn-primary" disabled={saving}>
                            {saving?<><Loader2 size={14} className="eng-spin"/> Saving…</>:'Create Subtask'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSubtaskModal;
