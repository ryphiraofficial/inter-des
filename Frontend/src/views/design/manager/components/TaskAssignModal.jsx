import React from 'react';
import { X, Loader } from 'lucide-react';
import DatePicker from '../../../common/DatePicker';
import CustomSelect from '../../../common/CustomSelect';

const TaskAssignModal = ({
    show, onClose,
    editingTaskId, taskFormData, setTaskFormData,
    staffList, quotations,
    onSubmit, submittingTask
}) => {
    if (!show) return null;

    const inputStyle = {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        fontSize: '13px',
        color: '#0f172a',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.15s',
        backgroundColor: '#ffffff'
    };

    const handleFocus = (e) => {
        e.currentTarget.style.borderColor = '#94a3b8';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(148, 163, 184, 0.15)';
    };

    const handleBlur = (e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = 'none';
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="payment-modal-card" style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                
                {/* Header */}
                <div className="payment-modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>
                        {editingTaskId ? 'Edit Design Task' : 'Assign / Split Design Task'}
                    </h3>
                    <button 
                        onClick={onClose} 
                        style={{ background: 'none', border: 'none', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.15s' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={onSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Task Title */}
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>Task Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Living Room 3D Render"
                            value={taskFormData.title}
                            onChange={e => setTaskFormData({ ...taskFormData, title: e.target.value })}
                            required
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>Description</label>
                        <textarea
                            placeholder="Provide details..."
                            value={taskFormData.description}
                            onChange={e => setTaskFormData({ ...taskFormData, description: e.target.value })}
                            rows="2"
                            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    {/* Assign To Staff Checklist */}
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>
                            Assign To Staff <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={{
                            maxHeight: '120px',
                            overflowY: 'auto',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            backgroundColor: '#ffffff'
                        }}>
                            {staffList.filter(s => !s.role?.toLowerCase().includes('manager')).map(s => {
                                const isChecked = (taskFormData.assignedTo || []).includes(s._id);
                                return (
                                    <label key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer', userSelect: 'none' }}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                                const currentList = taskFormData.assignedTo || [];
                                                const newAssigned = isChecked
                                                    ? currentList.filter(id => id !== s._id)
                                                    : [...currentList, s._id];
                                                setTaskFormData({ ...taskFormData, assignedTo: newAssigned });
                                            }}
                                            style={{
                                                width: '14px',
                                                height: '14px',
                                                accentColor: '#0f172a',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span>{s.name} <span style={{ color: '#64748b', fontSize: '11px' }}>({s.role})</span></span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Creative Requirements */}
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>Creative Requirements / Client Specifications</label>
                        <textarea
                            value={taskFormData.creativeRequirements}
                            onChange={e => setTaskFormData({ ...taskFormData, creativeRequirements: e.target.value })}
                            placeholder="Enter specific creative requirements for the designer..."
                            rows="2"
                            required
                            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    {/* Row with Priority and Due Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <CustomSelect
                                label="Priority"
                                options={[
                                    { value: 'Low', label: 'Low' },
                                    { value: 'Medium', label: 'Medium' },
                                    { value: 'High', label: 'High' },
                                    { value: 'Critical', label: 'Critical' }
                                ]}
                                value={taskFormData.priority}
                                onChange={e => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>
                                Due Date <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <DatePicker
                                value={taskFormData.dueDate}
                                onChange={(dateStr) => setTaskFormData({ ...taskFormData, dueDate: dateStr })}
                                placeholder="Pick a date"
                                minDate={new Date()}
                                align="right"
                            />
                        </div>
                    </div>

                    {/* Assign to Project */}
                    <div>
                        <CustomSelect
                            label="Assign to Project"
                            required
                            options={quotations.map(q => ({ value: q._id, label: q.projectName }))}
                            value={taskFormData.project}
                            onChange={e => setTaskFormData({ ...taskFormData, project: e.target.value })}
                            placeholder="Select Project"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button 
                            type="button" 
                            onClick={onClose}
                            style={{ 
                                flex: 1, 
                                padding: '9px', 
                                borderRadius: '6px', 
                                border: '1px solid #e2e8f0', 
                                background: 'white', 
                                fontWeight: 500, 
                                fontSize: '13px', 
                                cursor: 'pointer', 
                                color: '#374151',
                                transition: 'all 0.15s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submittingTask}
                            style={{ 
                                flex: 2, 
                                padding: '9px', 
                                borderRadius: '6px', 
                                border: 'none', 
                                background: submittingTask ? '#94a3b8' : '#0f172a', 
                                color: 'white', 
                                fontWeight: 500, 
                                fontSize: '13px', 
                                cursor: submittingTask ? 'not-allowed' : 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '6px', 
                                transition: 'all 0.15s' 
                            }}
                            onMouseOver={(e) => { if (!submittingTask) e.currentTarget.style.backgroundColor = '#1e293b'; }}
                            onMouseOut={(e) => { if (!submittingTask) e.currentTarget.style.backgroundColor = '#0f172a'; }}
                        >
                            {submittingTask ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Assigning...</> : 'Assign Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskAssignModal;
