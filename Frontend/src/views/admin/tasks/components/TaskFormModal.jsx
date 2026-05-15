import React from 'react';
import { X, Loader } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import AISuggestButton from '../../components/AISuggestButton';

const TaskFormModal = ({ 
    show, 
    closeModal, 
    editingTask, 
    handleSubmit, 
    formData, 
    handleInputChange, 
    setFormData,
    staff, 
    clients, 
    filteredQuotations, 
    submitting 
}) => {
    if (!show) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content-wide">
                <div className="modal-header">
                    <h3>{editingTask ? 'Edit Task' : 'Assign New Task'}</h3>
                    <button className="modal-close" onClick={closeModal}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-body" data-lenis-prevent>
                        <div className="form-grid">
                            <div className="form-field full-width">
                                <label>Task Title <span>*</span></label>
                                <input type="text" name="title" className="client-input" value={formData.title} onChange={handleInputChange} placeholder="e.g., Install kitchen cabinets" required />
                            </div>
                            <div className="form-field full-width">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <label>Description</label>
                                    <AISuggestButton type="Task" field="description" value={formData.description} context={{ title: formData.title }} onSuggest={(v) => setFormData(prev => ({ ...prev, description: v }))} />
                                </div>
                                <textarea name="description" className="client-input" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Detailed task description..." />
                            </div>
                            <div className="form-field">
                                <CustomSelect label="Assign to Staff Member" name="assignedTo" required options={staff.filter(s => s.status === 'Active').map(s => ({ value: s._id, label: `${s.name} - ${s.role}` }))} value={formData.assignedTo} onChange={handleInputChange} placeholder="Select Staff" />
                            </div>
                            <div className="form-field">
                                <CustomSelect label="Client" name="client" options={clients.map(c => ({ value: c._id, label: c.name }))} value={formData.client} onChange={handleInputChange} placeholder="Select Client" />
                            </div>
                            <div className="form-field">
                                <CustomSelect label="Link to Project / Quotation" name="quotation" options={filteredQuotations.map(q => ({ value: q._id, label: `${q.quotationNumber} - ${q.projectName} (${q.status})` }))} value={formData.quotation} onChange={handleInputChange} placeholder={formData.client ? (filteredQuotations.length > 0 ? "Select Project to Link" : "No Projects Found") : "Select Client First"} disabled={!formData.client} />
                            </div>
                            <div className="form-field">
                                <label>Due Date <span>*</span></label>
                                <input type="date" name="dueDate" className="client-input" value={formData.dueDate} onChange={handleInputChange} required />
                            </div>
                            <div className="form-field">
                                <label>Estimated Duration</label>
                                <input type="text" name="estimatedDuration" className="client-input" value={formData.estimatedDuration} onChange={handleInputChange} placeholder="e.g., 5 days, 2 weeks" />
                            </div>
                            <div className="form-field">
                                <CustomSelect label="Priority" name="priority" required options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' }]} value={formData.priority} onChange={handleInputChange} searchable={false} />
                            </div>
                            <div className="form-field">
                                <CustomSelect label="Status" name="status" required options={[{ value: 'To Do', label: 'To Do' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Completed', label: 'Completed' }, { value: 'Blocked', label: 'Blocked' }]} value={formData.status} onChange={handleInputChange} searchable={false} />
                            </div>
                            <div className="form-field full-width">
                                <label>Progress ({formData.progress}%)</label>
                                <input type="range" name="progress" min="0" max="100" step="5" value={formData.progress} onChange={handleInputChange} className="slider-input" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={closeModal} disabled={submitting}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? <Loader className="spinner" size={16} /> : (editingTask ? 'Update Task' : 'Assign Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormModal;
