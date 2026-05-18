import React from 'react';
import { X, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

const TaskUpdatesModal = ({ show, onClose, selectedTask }) => {
    if (!show || !selectedTask) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content-styled" style={{ maxWidth: '650px' }}>
                <div className="modal-header">
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><RefreshCw size={20} color="#6366f1" /> Daily Progress Review</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>Reviewing updates for: <strong>{selectedTask.title}</strong></p>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="update-timeline">
                        {selectedTask.dailyUpdates?.length > 0 ? (
                            [...selectedTask.dailyUpdates].reverse().map((upd, idx) => (
                                <div key={idx} style={{
                                    background: upd.emergencies ? '#fff1f2' : '#f8fafc',
                                    padding: '1.25rem', borderRadius: '16px', marginBottom: '1rem',
                                    border: `1px solid ${upd.emergencies ? '#fecaca' : '#e2e8f0'}`,
                                    borderLeft: `5px solid ${upd.emergencies ? '#ef4444' : '#6366f1'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{upd.staff?.name || 'Assigned Staff'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(upd.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.5, marginBottom: '10px' }}>{upd.update}</div>
                                    {upd.emergencies && (
                                        <div style={{ background: '#ef4444', color: 'white', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                            <AlertTriangle size={16} /> EMERGENCY / BLOCKER: {upd.emergencies}
                                        </div>
                                    )}
                                    {upd.extensionRequest?.requestedDate && (
                                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 14px', borderRadius: '10px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 800 }}>EXTENSION REQUESTED</div>
                                                <div style={{ fontSize: '0.85rem', color: '#92400e' }}>Until: <strong>{new Date(upd.extensionRequest.requestedDate).toLocaleDateString()}</strong></div>
                                                <div style={{ fontSize: '0.8rem', color: '#92400e', marginTop: '4px' }}>Reason: {upd.extensionRequest.reason}</div>
                                            </div>
                                            <div style={{ fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem' }}>{upd.extensionRequest.status}</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                <Clock size={40} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                                <p style={{ color: '#94a3b8' }}>No daily updates submitted for this task yet.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-footer" style={{ padding: '1.25rem', background: '#f8fafc', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                    <button className="btn-primary" style={{ width: '100%', background: '#6366f1' }} onClick={onClose}>Acknowledge & Close</button>
                </div>
            </div>
        </div>
    );
};

export default TaskUpdatesModal;
