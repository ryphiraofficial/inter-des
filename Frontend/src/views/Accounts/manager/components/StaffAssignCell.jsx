import React from 'react';
import { UserPlus } from 'lucide-react';
import { CustomSelect } from '../../components/UI/Inputs';

const StaffAssignCell = ({ project, staffList, assigningId, setAssigningId, selectedStaff, setSelectedStaff, handleAssign, getAssignedStaffName }) => {
    const hasStaff = project.assignedAccountsStaff && project.paymentCollectionStatus !== 'Pending Assignment';

    const AssignSelector = ({ projectId }) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: '220px' }}>
            <CustomSelect
                value={selectedStaff}
                onChange={setSelectedStaff}
                options={staffList.map(s => ({ value: s._id, label: s.fullName || s.name }))}
                placeholder="Select Staff"
            />
            <button onClick={() => handleAssign(projectId)} className="btn-primary-sm" style={{ flexShrink: 0 }}>Save</button>
            <button onClick={() => setAssigningId(null)} className="btn-outline-sm" style={{ flexShrink: 0, padding: '4px 8px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
    );

    if (hasStaff) {
        if (assigningId === project._id) return <AssignSelector projectId={project._id} />;
        const staffName = getAssignedStaffName(project.assignedAccountsStaff);
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '13px', fontWeight: 600 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                        {staffName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <span>{staffName}</span>
                </div>
                <button
                    onClick={() => {
                        const staffId = typeof project.assignedAccountsStaff === 'string' ? project.assignedAccountsStaff : project.assignedAccountsStaff._id;
                        setSelectedStaff(staffId);
                        setAssigningId(project._id);
                    }}
                    className="btn-outline-sm"
                    style={{ padding: '6px 8px', fontSize: '11px', height: '32px' }}
                    title="Reassign Staff"
                >
                    Change
                </button>
            </div>
        );
    }

    if (assigningId === project._id) return <AssignSelector projectId={project._id} />;
    return (
        <button onClick={() => { setSelectedStaff(''); setAssigningId(project._id); }} className="btn-outline-sm">
            <UserPlus size={14} /> Assign Staff
        </button>
    );
};

export default StaffAssignCell;
