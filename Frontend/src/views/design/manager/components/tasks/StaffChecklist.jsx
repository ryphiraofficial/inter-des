import React from 'react';

const StaffChecklist = ({ staffList, assignedTo, setTaskFormData, taskFormData }) => (
    <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>
            Assign To Staff <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#ffffff' }}>
            {staffList.filter(s => !s.role?.toLowerCase().includes('manager')).map(s => {
                const isChecked = (assignedTo || []).includes(s._id);
                return (
                    <label key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                                const currentList = assignedTo || [];
                                const newAssigned = isChecked
                                    ? currentList.filter(id => id !== s._id)
                                    : [...currentList, s._id];
                                setTaskFormData({ ...taskFormData, assignedTo: newAssigned });
                            }}
                            style={{ width: '14px', height: '14px', accentColor: '#0f172a', cursor: 'pointer' }}
                        />
                        <span>{s.name} <span style={{ color: '#64748b', fontSize: '11px' }}>({s.role})</span></span>
                    </label>
                );
            })}
        </div>
    </div>
);

export default StaffChecklist;
