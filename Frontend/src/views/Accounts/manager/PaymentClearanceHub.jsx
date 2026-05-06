import React, { useState, useEffect } from 'react';
import { Search, Shield, UserPlus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { accountsAPI, staffAPI } from '../../../models/api';

const PaymentClearanceHub = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [assigningId, setAssigningId] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projRes, staffRes] = await Promise.all([
                accountsAPI.getPendingAccountsProjects().catch(() => ({ success: false })),
                staffAPI.getAll().catch(() => ({ success: false }))
            ]);
            
            if (projRes?.success) setProjects(projRes.data || []);
            if (staffRes?.success) {
                // Filter to only accounts staff
                const accStaff = (staffRes.data || []).filter(s => s.role === 'Accounts Staff' || s.department === 'Accounts');
                setStaffList(accStaff);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (projectId) => {
        if (!selectedStaff) return alert('Please select a staff member');
        try {
            await accountsAPI.assignAccountsStaff({ projectId, staffId: selectedStaff });
            setAssigningId(null);
            setSelectedStaff('');
            fetchData();
        } catch (err) {
            alert('Error assigning staff: ' + err.message);
        }
    };

    const handleClear = async (projectId) => {
        if (!window.confirm('Clear payment and release this project to Design?')) return;
        try {
            await accountsAPI.clearProjectPayment({ projectId });
            fetchData();
        } catch (err) {
            alert('Error clearing project: ' + err.message);
        }
    };

    const filtered = projects.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.client?.name?.toLowerCase().includes(search.toLowerCase()));

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending Advance': return { bg: '#fef3c7', text: '#d97706' };
            case 'Invoice Sent': return { bg: '#e0e7ff', text: '#4f46e5' };
            case 'Partial Payment': return { bg: '#fce7f3', text: '#db2777' };
            case 'Cleared': return { bg: '#dcfce3', text: '#16a34a' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    return (
        <div style={{ padding: '2rem 2.5rem', minHeight: '100vh', margin: '-24px -24px 0 -24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>Payment Clearance Hub</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b' }}>Manage advance payment collections before releasing projects to Design.</p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', height: '40px', padding: '0 16px 0 36px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        <Shield size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                        <p>No projects pending clearance.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                                                        <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                                            <option value="">Select Staff</option>
                                                            {staffList.map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                                                        </select>
                                                        <button onClick={() => handleAssign(p._id)} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer' }}>Save</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setAssigningId(p._id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px dashed #cbd5e1', color: '#6366f1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                                                        <UserPlus size={14} /> Assign Staff
                                                    </button>
                                                )
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <button 
                                                onClick={() => handleClear(p._id)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', opacity: p.paymentStatus === 'Cleared' ? 0.5 : 1 }}
                                                disabled={p.paymentStatus === 'Cleared'}
                                            >
                                                <CheckCircle size={16} /> Clear & Release
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PaymentClearanceHub;
