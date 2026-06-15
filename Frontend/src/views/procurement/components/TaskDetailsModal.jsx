import React from 'react';
import { X, Package, CheckSquare } from 'lucide-react';

const TaskDetailsModal = ({ isOpen, onClose, selectedTask, onComplete }) => {
    if (!isOpen || !selectedTask) return null;

    const isFinished = ['Completed', 'Pending Manager Review', 'Pending Admin Review', 'Pending Procurement Admin Review', 'Procurement Approved'].includes(selectedTask?.status);

    return (
        <div className="drawer-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 }} onClick={onClose}>
            <div className="drawer-content" style={{ background: 'white', width: '480px', maxWidth: '100vw', height: '100vh', padding: '2rem', overflowY: 'auto', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onClick={e => e.stopPropagation()}>
                <style>
                    {`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                    `}
                </style>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 800 }}>Task Details</h3>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{selectedTask.requestNumber || selectedTask.title}</span>
                    </div>
                    <button style={{ border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }} onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>
                <div className="modal-body">
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Project</span>
                                <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>{selectedTask.project?.name || 'N/A'}</strong>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Status</span>
                                <span className={`status-pill ${selectedTask.status?.toLowerCase().replace(' ', '-')}`} style={{ background: '#fffbeb', color: '#d97706', display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                                    {selectedTask.status || 'Assigned'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={16} color="#6366f1" /> Assigned Items ({selectedTask.items?.length || 0})
                    </h4>
                    
                    <div className="items-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {selectedTask.items?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{item.itemName}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: '#6366f1' }}>{item.quantity} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.unit}</span></div>
                                </div>
                            </div>
                        ))}
                        {(!selectedTask.items || selectedTask.items.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
                                No items listed in this task.
                            </div>
                        )}
                    </div>

                    {!isFinished && (
                        <button 
                            style={{ marginTop: '1.5rem', width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            onClick={() => onComplete(selectedTask)}
                        >
                            <CheckSquare size={18} /> Submit to Manager for Review
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
