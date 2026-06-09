import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { TableSkeleton } from '../../components/UI/Skeleton';
import ClearanceConfirmDialog from './ClearanceConfirmDialog';
import StaffAssignCell from './StaffAssignCell';
import '../../css/ClearanceTable.css';

const ClearanceTable = ({
    loading, filtered, staffList, assigningId, setAssigningId,
    selectedStaff, setSelectedStaff, handleAssign, handleClear
}) => {
    const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, projectId: null, isVerified: false });

    const handleConfirmOpen  = (projectId, isVerified, defaultAmount, defaultMode, defaultRef) => setConfirmDialog({ isOpen: true, projectId, isVerified, defaultAmount, defaultMode, defaultRef });
    const handleConfirmClose = () => setConfirmDialog({ isOpen: false, projectId: null, isVerified: false });
    const handleConfirmSubmit = (details) => {
        if (confirmDialog.projectId) handleClear(confirmDialog.projectId, confirmDialog.isVerified, details);
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
            <div className="clearance-table-wrapper">
                <table className="clearance-table">
                    <thead>
                        <tr>
                            {['Project', 'Client', 'Total Budget', 'Target Amount', 'Status', 'Assigned Staff', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
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
                                <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                                    {/* Project — special card header cell */}
                                    <td className="clearance-td-project" style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span className="clearance-project-name" style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{p.name}</span>
                                            <span className="clearance-project-num" style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', width: 'fit-content' }}>{p.projectNumber}</span>
                                        </div>
                                    </td>

                                    <td data-label="Client" style={{ padding: '20px 24px', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
                                        {p.client?.name || '—'}
                                    </td>

                                    <td data-label="Total Budget" style={{ padding: '20px 24px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                                        ₹{(p.budget || 0).toLocaleString('en-IN')}
                                    </td>

                                    <td data-label="Target Amount" style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ color: isBalance ? '#ea580c' : '#059669', fontSize: '11px', display: 'inline-flex', alignItems: 'center', background: isBalance ? '#ffedd5' : '#d1fae5', padding: '2px 8px', borderRadius: '12px', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                                                {isBalance ? 'Balance' : 'Advance'}
                                            </span>
                                            <span style={{ fontSize: '15px' }}>₹{targetAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                    </td>

                                    <td data-label="Status" style={{ padding: '20px 24px' }}>
                                        <span style={{ background: colors.bg, color: colors.text, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', border: `1px solid ${colors.text}20` }}>
                                            {displayStatus}
                                        </span>
                                    </td>

                                    <td data-label="Assigned Staff" className="clearance-td-staff" style={{ padding: '20px 24px' }}>
                                        <div className="clearance-staff-cell-inner">
                                            <StaffAssignCell project={p} staffList={staffList} assigningId={assigningId}
                                                setAssigningId={setAssigningId} selectedStaff={selectedStaff} setSelectedStaff={setSelectedStaff}
                                                handleAssign={handleAssign} getAssignedStaffName={getAssignedStaffName} />
                                        </div>
                                    </td>

                                    <td className="clearance-td-actions" style={{ padding: '20px 24px' }}>
                                        {p.paymentCollectionStatus === 'Collected' ? (
                                            <button onClick={() => handleConfirmOpen(p._id, true, p.tempCollectionDetails?.amount || targetAmount, p.tempCollectionDetails?.paymentMode, p.tempCollectionDetails?.referenceNumber)} className="btn-primary-sm"
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)' }}>
                                                <Shield size={14} /> Verify & Release
                                            </button>
                                        ) : (
                                            <button onClick={() => handleConfirmOpen(p._id, false, targetAmount)} disabled={p.paymentStatus === 'Cleared' && !isBalance} className="btn-success-sm"
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: (p.paymentStatus === 'Cleared' && !isBalance) ? '#cbd5e1' : '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: (p.paymentStatus === 'Cleared' && !isBalance) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: (p.paymentStatus === 'Cleared' && !isBalance) ? 'none' : '0 4px 10px rgba(16, 185, 129, 0.2)' }}>
                                                <CheckCircle size={14} /> Clear & Release
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <ClearanceConfirmDialog isOpen={confirmDialog.isOpen} confirmData={confirmDialog} handleConfirmClose={handleConfirmClose} handleConfirmSubmit={handleConfirmSubmit} />
        </>
    );
};

export default ClearanceTable;
