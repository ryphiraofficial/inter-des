import React from 'react';
import { LockOpen, XCircle, AlertCircle, Calendar, CheckCircle, CheckCheck } from 'lucide-react';
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
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Loading unlock requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.25rem', color: '#b91c1c', fontSize: '0.875rem', fontWeight: 600 }}>
                Failed to load unlock requests.
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    <LockOpen size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                    All Caught Up!
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
                    No pending project unlock requests currently awaiting your approval.
                </p>
                <div style={{
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <CheckCheck size={14} /> Pipeline Active & Clear
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th style={{ padding: '12px 16px' }}>Project</th>
                        <th style={{ padding: '12px 16px' }}>Requested By</th>
                        <th style={{ padding: '12px 16px' }}>Date Requested</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((project) => (
                        <tr key={project._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 16px' }}>
                                <div style={{ fontWeight: 700, color: '#0f172a' }}>{project.projectName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Status: {project.status}</div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {project.unlockRequest?.requestedBy?.fullName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e293b' }}>{project.unlockRequest?.requestedBy?.fullName}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{project.unlockRequest?.requestedBy?.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: '#475569' }}>
                                    <Calendar size={14} color="#64748b" />
                                    <span>{new Date(project.unlockRequest?.requestedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button
                                        onClick={() => handleReject(project._id)}
                                        disabled={unlocking || rejecting}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '6px 12px',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            borderRadius: '6px',
                                            background: '#fef2f2',
                                            color: '#b91c1c',
                                            border: '1px solid #fecaca',
                                            cursor: (unlocking || rejecting) ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <XCircle size={14} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(project._id)}
                                        disabled={unlocking || rejecting}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '6px 14px',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            borderRadius: '6px',
                                            background: '#2563eb',
                                            color: '#ffffff',
                                            border: 'none',
                                            cursor: (unlocking || rejecting) ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                                            transition: 'all 0.15s ease'
                                        }}
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
