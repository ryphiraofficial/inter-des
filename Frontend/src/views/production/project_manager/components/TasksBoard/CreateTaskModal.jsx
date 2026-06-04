import React from 'react';
import { X } from 'lucide-react';

const CreateTaskModal = ({ isModalOpen, setIsModalOpen, newTask, setNewTask, handleCreateTask, projects, staff }) => {
    if (!isModalOpen) return null;

    return (
        <div className="pm-modal-overlay">
            <div className="pm-modal">
                <div className="pm-modal-header">
                    <h2>Create New Task</h2>
                    <button onClick={() => setIsModalOpen(false)} className="pm-modal-close"><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateTask} className="pm-modal-form">
                    <div className="pm-form-group">
                        <label>Title *</label>
                        <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Task title" />
                    </div>
                    <div className="pm-form-group">
                        <label>Project *</label>
                        <select required value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})}>
                            <option value="">-- Select Project --</option>
                            {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                        </select>
                    </div>
                    <div className="pm-form-group">
                        <label>Stage / Category</label>
                        <select value={newTask.stage} onChange={e => setNewTask({...newTask, stage: e.target.value})}>
                            <option value="PE">Project Engineer (PE)</option>
                            <option value="SE">Site Engineer (SE)</option>
                            <option value="SS">Site Supervisor (SS)</option>
                            <option value="PM">Project Manager (PM)</option>
                        </select>
                    </div>
                    <div className="pm-form-group">
                        <label>Assigned To</label>
                        <select value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                            <option value="">-- Select Assignee --</option>
                            {staff.map(s => <option key={s._id} value={s._id}>{s.fullName} ({s.role})</option>)}
                        </select>
                    </div>
                    <div className="pm-form-group">
                        <label>Priority</label>
                        <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                    <div className="pm-form-group">
                        <label>Due Date</label>
                        <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                    </div>
                    <button type="submit" className="pm-modal-submit-btn">
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
