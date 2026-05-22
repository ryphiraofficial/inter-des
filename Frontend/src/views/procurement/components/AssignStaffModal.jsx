import React from 'react';

const AssignStaffModal = ({ isOpen, onClose, selectedRequest, staff, onAssign }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Assign Procurement Task</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Request Detail</div>
                        <div style={{ fontWeight: 700 }}>{selectedRequest?.requestNumber}</div>
                        <div style={{ fontSize: '0.9rem', color: '#475569' }}>Project: {selectedRequest?.project?.name}</div>
                    </div>
                    
                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Select Procurement Staff</h4>
                    <div className="staff-list" style={{ display: 'grid', gap: '0.75rem' }}>
                        {staff.map(member => (
                            <div 
                                key={member._id} 
                                className="staff-option"
                                onClick={() => onAssign(member._id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', flexWrap: 'wrap' }}
                            >
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0f3ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                                    {member.fullName?.charAt(0)}
                                </div>
                                <div style={{ flex: '1 1 150px', minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{member.fullName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>{member.email}</div>
                                </div>
                                <button className="btn-select-staff" style={{ padding: '6px 12px', borderRadius: '8px', background: '#f0f3ff', color: '#4f46e5', border: 'none', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>Select</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignStaffModal;
