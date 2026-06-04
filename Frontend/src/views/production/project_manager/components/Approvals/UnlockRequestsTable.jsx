import React from 'react';
import { LockOpen, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { useGetUnlockRequestsQuery, useUnlockProjectMutation, useRejectUnlockProjectMutation } from '../../../../../store/api/productionApi';

const UnlockRequestsTable = () => {
    const { data: response, isLoading, error } = useGetUnlockRequestsQuery();
    const [unlockProject, { isLoading: unlocking }] = useUnlockProjectMutation();
    const [rejectUnlock, { isLoading: rejecting }] = useRejectUnlockProjectMutation();

    const requests = response?.data || [];

    const handleApprove = async (id) => {
        try { await unlockProject(id).unwrap(); } catch {}
    };

    const handleReject = async (id) => {
        try { await rejectUnlock(id).unwrap(); } catch {}
    };

    if (isLoading) {
        return (
            <div className="pm-table-container">
                <table className="pm-table">
                    <thead><tr><th>Project</th><th>Requested By</th><th>Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}><div className="pm-skeleton-line" style={{ width: '100%', height: '20px' }}></div></td></tr>
                    </tbody>
                </table>
            </div>
        );
    }

    if (error) {
        return <div className="pm-error-message">Failed to load unlock requests.</div>;
    }

    if (requests.length === 0) {
        return (
            <div className="pm-loading-state">
                <AlertCircle size={24} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                <span>No pending unlock requests found.</span>
            </div>
        );
    }

    return (
        <div className="pm-table-container">
            <table className="pm-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Requested By</th>
                        <th>Date Requested</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((project) => (
                        <tr key={project._id} className="pm-table-row">
                            <td>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{project.projectName}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Status: {project.status}</div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                                        {project.unlockRequest?.requestedBy?.fullName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#334155' }}>{project.unlockRequest?.requestedBy?.fullName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{project.unlockRequest?.requestedBy?.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#475569' }}>
                                    <Calendar size={14} />
                                    {new Date(project.unlockRequest?.requestedAt).toLocaleDateString()}
                                </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button
                                        onClick={() => handleReject(project._id)}
                                        disabled={unlocking || rejecting}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, borderRadius: '6px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', cursor: (unlocking || rejecting) ? 'not-allowed' : 'pointer' }}
                                    >
                                        <XCircle size={14} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(project._id)}
                                        disabled={unlocking || rejecting}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, borderRadius: '6px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', cursor: (unlocking || rejecting) ? 'not-allowed' : 'pointer' }}
                                    >
                                        <LockOpen size={14} /> Approve & Unlock
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UnlockRequestsTable;
