import React from 'react';
import { X, Loader } from 'lucide-react';
import TaskFormFields from './tasks/TaskFormFields';

const TaskAssignModal = ({
    show, onClose,
    editingTaskId, taskFormData, setTaskFormData,
    staffList, quotations,
    onSubmit, submittingTask
}) => {
    if (!show) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="payment-modal-card" style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>

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

                {/* Form */}
                <form onSubmit={onSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <TaskFormFields
                        taskFormData={taskFormData}
                        setTaskFormData={setTaskFormData}
                        staffList={staffList}
                        quotations={quotations}
                    />

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button type="button" onClick={onClose}
                            style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 500, fontSize: '13px', cursor: 'pointer', color: '#374151', transition: 'all 0.15s' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={submittingTask}
                            style={{ flex: 2, padding: '9px', borderRadius: '6px', border: 'none', background: submittingTask ? '#94a3b8' : '#0f172a', color: 'white', fontWeight: 500, fontSize: '13px', cursor: submittingTask ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.15s' }}
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
