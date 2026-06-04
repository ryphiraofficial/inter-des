import React from 'react';
import { X, Loader2 } from 'lucide-react';

const CreateTaskModal = ({ 
    showTaskModal, setShowTaskModal, 
    handleCreateTask, 
    newTask, setNewTask, 
    user, siteTeam, supervisors, saving 
}) => {
    if (!showTaskModal) return null;

    return (
        <div className="eng-modal-overlay">
            <div className="eng-modal">
                <div className="eng-modal-header">
                    <h3>Create Task</h3>
                    <button className="eng-modal-close" onClick={()=>setShowTaskModal(false)}><X size={18}/></button>
                </div>
                <form onSubmit={handleCreateTask} className="eng-modal-form">
                    <div className="eng-form-group">
                        <label>Title *</label>
                        <input className="eng-input" value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} required/>
                    </div>
                    <div className="eng-form-group">
                        <label>Description</label>
                        <textarea className="eng-input" rows={3} value={newTask.description} onChange={e=>setNewTask({...newTask,description:e.target.value})}/>
                    </div>
                    <div className="eng-form-row">
                        <div className="eng-form-group">
                            <label>Assign To *{user?.role === 'Site Engineer' ? ' (Site Supervisor)' : ''}</label>
                            <select className="eng-input" value={newTask.assignedTo} onChange={e=>setNewTask({...newTask,assignedTo:e.target.value})} required>
                                <option value="">Select{user?.role === 'Site Engineer' ? ' supervisor' : ' engineer'}…</option>
                                {(user?.role === 'Site Engineer' ? supervisors : siteTeam).map(m=><option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>)}
                            </select>
                        </div>
                        <div className="eng-form-group">
                            <label>Priority</label>
                            <select className="eng-input" value={newTask.priority} onChange={e=>setNewTask({...newTask,priority:e.target.value})}>
                                {['Low','Medium','High','Urgent'].map(p=><option key={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="eng-form-group">
                        <label>Due Date</label>
                        <input type="date" className="eng-input" value={newTask.dueDate} onChange={e=>setNewTask({...newTask,dueDate:e.target.value})}/>
                    </div>
                    <div className="eng-modal-footer">
                        <button type="button" className="eng-btn-ghost" onClick={()=>setShowTaskModal(false)}>Cancel</button>
                        <button type="submit" className="eng-btn-primary" disabled={saving}>
                            {saving?<><Loader2 size={14} className="eng-spin"/> Saving…</>:'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
