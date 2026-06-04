import React from 'react';
import { Plus, Loader2 } from 'lucide-react';

const CreateTaskForm = ({ 
    handleCreateTask, 
    newTaskForm, 
    setNewTaskForm, 
    creatingTask, 
    setActiveTab,
    getFilteredStaff
}) => {
    return (
        <form onSubmit={handleCreateTask} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                Add New Production Task
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Title */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Task Title *</label>
                    <input 
                        type="text" 
                        placeholder="Enter task title (e.g. Wall Plastering completion)"
                        value={newTaskForm.title}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                        required
                    />
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Description</label>
                    <textarea 
                        rows="3"
                        placeholder="Enter detailed description or requirements"
                        value={newTaskForm.description}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', resize: 'none' }}
                    />
                </div>

                {/* Stage Selector */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Stage / Staff Category</label>
                    <select 
                        value={newTaskForm.stage}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, stage: e.target.value, assignedTo: '' }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', background: 'white' }}
                    >
                        <option value="PE">Project Engineer (PE)</option>
                        <option value="SE">Site Engineer (SE)</option>
                        <option value="SS">Site Supervisor (SS)</option>
                        <option value="PM">Project Manager (PM)</option>
                    </select>
                </div>

                {/* Assign To (Depends on chosen Stage) */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Assign Staff Member</label>
                    <select 
                        value={newTaskForm.assignedTo}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', background: 'white' }}
                    >
                        <option value="">-- Select Assignee --</option>
                        {getFilteredStaff(newTaskForm.stage).map(s => (
                            <option key={s._id} value={s._id}>{s.fullName} ({s.email})</option>
                        ))}
                    </select>
                </div>

                {/* Priority */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Task Priority</label>
                    <select 
                        value={newTaskForm.priority}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', background: 'white' }}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1.5rem' }}>
                <button 
                    type="button" 
                    onClick={() => setActiveTab('tasks')}
                    style={{ padding: '10px 20px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={creatingTask}
                    style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    {creatingTask ? <Loader2 className="pm-spin" size={16} /> : <><Plus size={16} /> Assign & Create Task</>}
                </button>
            </div>
        </form>
    );
};

export default CreateTaskForm;
