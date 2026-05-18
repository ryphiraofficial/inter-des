import React from 'react';
import { X, Loader } from 'lucide-react';

const TaskAssignModal = ({
    show, onClose,
    editingTaskId, taskFormData, setTaskFormData,
    staffList, quotations,
    onSubmit, submittingTask
}) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-styled">
                <div className="modal-header">
                    <h3>{editingTaskId ? 'Edit Design Task' : 'Assign / Split Design Task'}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={onSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Task Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Living Room 3D Render"
                            value={taskFormData.title}
                            onChange={e => setTaskFormData({ ...taskFormData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Provide details..."
                            value={taskFormData.description}
                            onChange={e => setTaskFormData({ ...taskFormData, description: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Assign To Staff (Hold Ctrl/Cmd to select multiple)</label>
                        <select
                            multiple
                            className="multi-select"
                            value={taskFormData.assignedTo}
                            onChange={e => {
                                const values = Array.from(e.target.selectedOptions, o => o.value);
                                setTaskFormData({ ...taskFormData, assignedTo: values });
                            }}
                            required
                            style={{ height: '100px' }}
                        >
                            {staffList.map(s => (
                                <option key={s._id} value={s._id}>{s.name} — {s.role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Creative Requirements / Client Specifications</label>
                        <textarea
                            value={taskFormData.creativeRequirements}
                            onChange={e => setTaskFormData({ ...taskFormData, creativeRequirements: e.target.value })}
                            placeholder="Enter specific creative requirements for the designer..."
                            rows="3"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select value={taskFormData.priority} onChange={e => setTaskFormData({ ...taskFormData, priority: e.target.value })}>
                                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={taskFormData.dueDate}
                                onChange={e => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Assign to Project</label>
                        <select
                            value={taskFormData.project}
                            onChange={e => setTaskFormData({ ...taskFormData, project: e.target.value })}
                            required
                        >
                            <option value="">Select Project</option>
                            {quotations.map(q => (
                                <option key={q._id} value={q._id}>{q.projectName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="action-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="action-btn primary" disabled={submittingTask}>
                            {submittingTask ? <><Loader size={16} className="spinner" /> Assigning...</> : 'Assign Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskAssignModal;
