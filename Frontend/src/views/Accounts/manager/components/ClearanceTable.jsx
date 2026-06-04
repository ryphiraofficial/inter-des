import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { TableSkeleton } from '../../components/UI/Skeleton';
import ClearanceConfirmDialog from './ClearanceConfirmDialog';
import StaffAssignCell from './StaffAssignCell';

const ClearanceTable = ({
    loading, filtered, staffList, assigningId, setAssigningId,
    selectedStaff, setSelectedStaff, handleAssign, handleClear
}) => {
    const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, projectId: null, isVerified: false });

    const handleConfirmOpen  = (projectId, isVerified) => setConfirmDialog({ isOpen: true, projectId, isVerified });
    const handleConfirmClose = () => setConfirmDialog({ isOpen: false, projectId: null, isVerified: false });
    const handleConfirmSubmit = () => {
        if (confirmDialog.projectId) handleClear(confirmDialog.projectId, confirmDialog.isVerified);
        handleConfirmClose();
    };

    const getStatusColor = (status, collectionStatus, isBalance) => {
        if (collectionStatus === 'Collected') return { bg: '#dbeafe', text: '#1d4ed8' };
        if (collectionStatus === 'Verified')  return { bg: '#dcfce3', text: '#16a34a' };
        if (isBalance && status === 'Cleared' && collectionStatus !== 'Verified') return { bg: '#fef3c7', text: '#d97706' };
        switch (status) {
            case 'Pending Advance':  return { bg: '#fef3c7', text: '#d97706' };
            case 'Invoice Sent':     return { bg: '#e0e7ff', text: '#4f46e5' };
            case 'Partial Payment':  return { bg: '#fce7f3', text: '#db2777' };
            case 'Cleared':          return { bg: '#dcfce3', text: '#16a34a' };
            default:                 return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    const getAssignedStaffName = (staff) => {
        if (!staff) return '';
        if (typeof staff === 'string') {
            const found = staffList.find(s => s._id === staff);
            return found ? (found.fullName || found.name) : 'Assigned (ID: ' + staff.slice(-4) + ')';
        }
        return staff.fullName || staff.name || staff.email || 'Assigned Staff';
    };

    if (loading) return <TableSkeleton rows={6} cols={7} />;
    if (filtered.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <Shield size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p>No projects pending clearance.</p>
            </div>
        );
    }

    return (
        <>
            <div className="table-responsive-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            {['Project', 'Client', 'Total Budget', 'Target Amount', 'Status', 'Assigned Staff', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => {
                            const isBalance   = p.paymentStatus !== 'Pending Advance';
                            const colors      = getStatusColor(p.paymentStatus, p.paymentCollectionStatus, isBalance);
                            const targetAmount = isBalance ? (p.budget - (p.advanceAmount || p.collectedAmount || 0)) : (p.advanceAmount || 0);

                            let displayStatus = p.paymentStatus || 'Pending Advance';
                            if (p.paymentCollectionStatus === 'Collected') displayStatus = 'Collected';
                            else if (isBalance && p.paymentStatus === 'Cleared' && p.paymentCollectionStatus !== 'Verified') displayStatus = 'Pending Balance';

                            return (
                                <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#0f172a' }}>
                                        {p.name}
                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>{p.projectNumber}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#475569' }}>{p.client?.name || '—'}</td>
                                    <td style={{ padding: '16px 24px', color: '#475569' }}>₹{(p.budget || 0).toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: 700, color: '#0f172a' }}>
                                        <span style={{ color: isBalance ? '#f59e0b' : '#10b981', fontSize: '11px', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>
                                            {isBalance ? 'Balance' : 'Advance'}
                                        </span>
                                        ₹{targetAmount.toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ background: colors.bg, color: colors.text, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                            {displayStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <StaffAssignCell project={p} staffList={staffList} assigningId={assigningId}
                                            setAssigningId={setAssigningId} selectedStaff={selectedStaff} setSelectedStaff={setSelectedStaff}
                                            handleAssign={handleAssign} getAssignedStaffName={getAssignedStaffName} />
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        {p.paymentCollectionStatus === 'Collected' ? (
                                            <button onClick={() => handleConfirmOpen(p._id, true)} className="btn-primary-sm"
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                                                <Shield size={14} /> Verify & Release
                                            </button>
                                        ) : (
                                            <button onClick={() => handleConfirmOpen(p._id, false)} disabled={p.paymentStatus === 'Cleared' && !isBalance} className="btn-success-sm">
                                                <CheckCircle size={16} /> Clear & Release
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <ClearanceConfirmDialog isOpen={confirmDialog.isOpen} handleConfirmClose={handleConfirmClose} handleConfirmSubmit={handleConfirmSubmit} />
        </>
    );
};

export default ClearanceTable;
