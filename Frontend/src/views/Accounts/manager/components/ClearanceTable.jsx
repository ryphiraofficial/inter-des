import React from 'react';
import { Shield, UserPlus, CheckCircle } from 'lucide-react';
import { TableSkeleton } from '../../components/UI/Skeleton';
import { CustomSelect } from '../../components/UI/Inputs';

const ClearanceTable = ({ 
    loading, filtered, staffList, assigningId, setAssigningId, 
    selectedStaff, setSelectedStaff, handleAssign, handleClear 
}) => {
    const getStatusColor = (status, collectionStatus) => {
        if (collectionStatus === 'Collected') return { bg: '#dbeafe', text: '#1d4ed8' };
        if (collectionStatus === 'Verified') return { bg: '#dcfce3', text: '#16a34a' };
        switch(status) {
            case 'Pending Advance': return { bg: '#fef3c7', text: '#d97706' };
            case 'Invoice Sent': return { bg: '#e0e7ff', text: '#4f46e5' };
            case 'Partial Payment': return { bg: '#fce7f3', text: '#db2777' };
            case 'Cleared': return { bg: '#dcfce3', text: '#16a34a' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
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
        <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                    <tr style={{ background: '#f8fafc' }}>
                        {['Project', 'Client', 'Total Budget', 'Advance (50%)', 'Status', 'Assigned Staff', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '14px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(p => {
                        const colors = getStatusColor(p.paymentStatus, p.paymentCollectionStatus);
                        return (
                            <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 24px', fontWeight: 600, color: '#0f172a' }}>
                                    {p.name}
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>{p.projectNumber}</div>
                                </td>
                                <td style={{ padding: '16px 24px', color: '#475569' }}>{p.client?.name || '—'}</td>
                                <td style={{ padding: '16px 24px', color: '#475569' }}>₹{(p.budget || 0).toLocaleString('en-IN')}</td>
                                <td style={{ padding: '16px 24px', fontWeight: 700, color: '#0f172a' }}>₹{(p.advanceAmount || 0).toLocaleString('en-IN')}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{ background: colors.bg, color: colors.text, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                        {p.paymentCollectionStatus === 'Collected' ? 'Collected' : (p.paymentStatus || 'Pending Advance')}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    {p.assignedAccountsStaff ? (
                                        assigningId === p._id ? (
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: '220px' }}>
                                                <CustomSelect
                                                    value={selectedStaff}
                                                    onChange={setSelectedStaff}
                                                    options={staffList.map(s => ({ value: s._id, label: s.fullName || s.name }))}
                                                    placeholder="Select Staff"
                                                />
                                                <button onClick={() => handleAssign(p._id)} className="btn-primary-sm" style={{ flexShrink: 0 }}>Save</button>
                                                <button onClick={() => setAssigningId(null)} className="btn-outline-sm" style={{ flexShrink: 0, padding: '4px 8px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px', 
                                                    background: '#f8fafc', 
                                                    padding: '6px 12px', 
                                                    borderRadius: '8px', 
                                                    border: '1px solid #e2e8f0',
                                                    color: '#334155',
                                                    fontSize: '13px',
                                                    fontWeight: 600
                                                }}>
                                                    <div style={{ 
                                                        width: '24px', 
                                                        height: '24px', 
                                                        borderRadius: '50%', 
                                                        background: '#6366f1', 
                                                        color: '#fff', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        fontSize: '11px',
                                                        fontWeight: 700
                                                    }}>
                                                        {getAssignedStaffName(p.assignedAccountsStaff).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </div>
                                                    <span>{getAssignedStaffName(p.assignedAccountsStaff)}</span>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const staffId = typeof p.assignedAccountsStaff === 'string' ? p.assignedAccountsStaff : p.assignedAccountsStaff._id;
                                                        setSelectedStaff(staffId);
                                                        setAssigningId(p._id);
                                                    }} 
                                                    className="btn-outline-sm" 
                                                    style={{ padding: '6px 8px', fontSize: '11px', height: '32px' }}
                                                    title="Reassign Staff"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        assigningId === p._id ? (
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: '220px' }}>
                                                <CustomSelect
                                                    value={selectedStaff}
                                                    onChange={setSelectedStaff}
                                                    options={staffList.map(s => ({ value: s._id, label: s.fullName || s.name }))}
                                                    placeholder="Select Staff"
                                                />
                                                <button onClick={() => handleAssign(p._id)} className="btn-primary-sm" style={{ flexShrink: 0 }}>Save</button>
                                                <button onClick={() => setAssigningId(null)} className="btn-outline-sm" style={{ flexShrink: 0, padding: '4px 8px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => {
                                                setSelectedStaff('');
                                                setAssigningId(p._id);
                                            }} className="btn-outline-sm">
                                                <UserPlus size={14} /> Assign Staff
                                            </button>
                                        )
                                    )}
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    {p.paymentCollectionStatus === 'Collected' ? (
                                        <button 
                                            onClick={() => handleClear(p._id, true)} 
                                            className="btn-primary-sm" 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '6px', 
                                                background: '#2563eb', 
                                                color: '#fff', 
                                                border: 'none', 
                                                padding: '6px 12px', 
                                                borderRadius: '6px', 
                                                fontSize: '13px', 
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Shield size={14} /> Verify & Release
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleClear(p._id, false)} 
                                            disabled={p.paymentStatus === 'Cleared'} 
                                            className="btn-success-sm"
                                        >
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
    );
};

export default ClearanceTable;
