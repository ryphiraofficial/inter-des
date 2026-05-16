import React from 'react';
import { Shield, UserPlus, CheckCircle } from 'lucide-react';
import { TableSkeleton } from '../../components/UI/Skeleton';

const ClearanceTable = ({ 
    loading, filtered, staffList, assigningId, setAssigningId, 
    selectedStaff, setSelectedStaff, handleAssign, handleClear 
}) => {
    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending Advance': return { bg: '#fef3c7', text: '#d97706' };
            case 'Invoice Sent': return { bg: '#e0e7ff', text: '#4f46e5' };
            case 'Partial Payment': return { bg: '#fce7f3', text: '#db2777' };
            case 'Cleared': return { bg: '#dcfce3', text: '#16a34a' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
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
                        const colors = getStatusColor(p.paymentStatus);
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
                                        {p.paymentStatus || 'Pending Advance'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    {p.assignedAccountsStaff ? (
                                        <span style={{ color: '#475569', fontSize: '14px', fontWeight: 500 }}>{p.assignedAccountsStaff.fullName}</span>
                                    ) : (
                                        assigningId === p._id ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} className="form-control-sm">
                                                    <option value="">Select Staff</option>
                                                    {staffList.map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                                                </select>
                                                <button onClick={() => handleAssign(p._id)} className="btn-primary-sm">Save</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setAssigningId(p._id)} className="btn-outline-sm">
                                                <UserPlus size={14} /> Assign Staff
                                            </button>
                                        )
                                    )}
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <button onClick={() => handleClear(p._id)} disabled={p.paymentStatus === 'Cleared'} className="btn-success-sm">
                                        <CheckCircle size={16} /> Clear & Release
                                    </button>
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
