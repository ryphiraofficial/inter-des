import React from 'react';
import { X, Scissors } from 'lucide-react';

const SplitTaskModal = ({ show, onClose, selectedTask, splitTaskData, setSplitTaskData, staffList, onConfirm }) => {
    if (!show || !selectedTask) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content-styled" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Scissors size={20} color="#6366f1" /> Split Task Assignment</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Create a sub-assignment from: {selectedTask.title}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Sub-Task Title</label>
                        <input
                            type="text"
                            className="premium-input"
                            value={splitTaskData.title}
                            onChange={e => setSplitTaskData({ ...splitTaskData, title: e.target.value })}
                            placeholder="Enter Title for the new task..."
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px', display: 'block' }}>Assign To Staff</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', maxHeight: '200px', overflowY: 'auto', padding: '5px' }}>
                            {staffList.map(staff => {
                                const isSelected = splitTaskData.assignedTo.includes(staff._id);
                                return (
                                    <div key={staff._id}
                                        onClick={() => {
                                            setSplitTaskData({
                                                ...splitTaskData,
                                                assignedTo: isSelected
                                                    ? splitTaskData.assignedTo.filter(id => id !== staff._id)
                                                    : [...splitTaskData.assignedTo, staff._id]
                                            });
                                        }}
                                        style={{ padding: '10px', borderRadius: '10px', border: `2px solid ${isSelected ? '#6366f1' : '#f1f5f9'}`, background: isSelected ? '#eef2ff' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: isSelected ? '#4338ca' : '#1e293b' }}>{staff.name}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{staff.role}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="modal-footer" style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                    <button className="btn-primary" style={{ flex: 2, background: '#4f46e5' }} onClick={onConfirm}>Confirm Split</button>
                </div>
            </div>
        </div>
    );
};

export default SplitTaskModal;
