import React from 'react';
import { X, Users, Calendar, AlertCircle, CheckSquare, Clock } from 'lucide-react';

const StaffTasksModal = ({ show, onClose, staffMember, tasks = [] }) => {
    if (!show || !staffMember) return null;

    // Filter tasks assigned to this staff member
    const activeTasks = tasks.filter(t => 
        t.assignedTo?.some(s => s._id === staffMember._id)
    );

    const getPriorityStyle = (priority) => {
        const p = priority?.toLowerCase();
        if (p === 'critical' || p === 'high') {
            return { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' };
        }
        if (p === 'medium') {
            return { background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' };
        }
        return { background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' };
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'revision required' || s === 'revision') {
            return { background: '#fef2f2', color: '#ef4444' };
        }
        if (s === 'in progress') {
            return { background: '#e0e7ff', color: '#4f46e5' };
        }
        if (s === 'completed' || s === 'approved') {
            return { background: '#dcfce7', color: '#16a34a' };
        }
        if (s?.includes('review') || s?.includes('pending')) {
            return { background: '#fef3c7', color: '#d97706' };
        }
        return { background: '#f1f5f9', color: '#475569' };
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-styled" style={{ maxWidth: '600px', width: '90%' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '12px', color: '#4f46e5' }}>
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>{staffMember.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
                                {staffMember.role} • <span style={{ fontWeight: 600, color: '#4f46e5' }}>{activeTasks.length} Assigned Task{activeTasks.length !== 1 ? 's' : ''}</span>
                            </p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {activeTasks.length > 0 ? (
                            activeTasks.map((task) => (
                                <div 
                                    key={task._id} 
                                    style={{
                                        background: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '16px',
                                        padding: '1.25rem',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{task.title}</h4>
                                            {task.project && (
                                                <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 600 }}>
                                                    💼 {task.project.projectName || task.project.name}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <span 
                                                style={{ 
                                                    padding: '3px 8px', 
                                                    borderRadius: '6px', 
                                                    fontSize: '0.65rem', 
                                                    fontWeight: 700,
                                                    ...getPriorityStyle(task.priority) 
                                                }}
                                            >
                                                {task.priority?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                                            <Calendar size={13} color="#94a3b8" />
                                            <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}</span>
                                        </div>
                                        <span 
                                            style={{ 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.7rem', 
                                                fontWeight: 700,
                                                ...getStatusStyle(task.status)
                                            }}
                                        >
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                <CheckSquare size={36} color="#10b981" style={{ marginBottom: '12px', display: 'inline-block' }} />
                                <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontWeight: 700 }}>Fully Available</h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, padding: '0 1.5rem' }}>
                                    This team member has no active design tasks and is available for new project assignments.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer" style={{ padding: '1.25rem', background: '#f8fafc', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-primary" style={{ background: '#6366f1', border: 'none', padding: '10px 24px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'white', cursor: 'pointer' }} onClick={onClose}>Close View</button>
                </div>
            </div>
        </div>
    );
};

export default StaffTasksModal;
