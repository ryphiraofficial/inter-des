import React, { useState, useEffect } from 'react';
import { Building2, Search, CheckCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../../config/constants';

const ProgramsView = ({ user, search = '', setSearch }) => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState('');
    const [clearingId, setClearingId] = useState(null);

    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/programs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setPrograms(data.programs || []);
            }
        } catch (err) {
            console.error('Failed to fetch programs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleClearance = async (programId) => {
        if (!window.confirm('Clear this project for Procurement? This will approve procurement handoff.')) return;
        setClearingId(programId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/programs/${programId}/clear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ notes: 'Cleared from Project Programs dashboard' })
            });
            const data = await res.json();
            if (data.success) {
                fetchPrograms();
            } else {
                alert(data.message || 'Failed to clear project');
            }
        } catch (err) {
            alert('Error updating clearance status');
        } finally {
            setClearingId(null);
        }
    };

    const queryStr = (search || localSearch).toLowerCase();
    const filteredPrograms = programs.filter(p => {
        if (!queryStr) return true;
        const pNum = p.programNumber?.toLowerCase() || '';
        const projName = p.project?.name?.toLowerCase() || '';
        const clientName = p.client?.name?.toLowerCase() || '';
        return pNum.includes(queryStr) || projName.includes(queryStr) || clientName.includes(queryStr);
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header / Search */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Project Programs & Clearance</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>Track project financials & release projects to procurement</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative', width: '240px' }}>
                        <input
                            type="text"
                            placeholder="Search project or client..."
                            value={search || localSearch}
                            onChange={e => {
                                if (setSearch) setSearch(e.target.value);
                                else setLocalSearch(e.target.value);
                            }}
                            style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.825rem', outline: 'none', background: '#f8fafc' }}
                        />
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>

                    <button
                        onClick={fetchPrograms}
                        style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* Programs Table */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '12px 16px' }}>Program #</th>
                            <th style={{ padding: '12px 16px' }}>Project Name</th>
                            <th style={{ padding: '12px 16px' }}>Client</th>
                            <th style={{ padding: '12px 16px' }}>Client Paid</th>
                            <th style={{ padding: '12px 16px' }}>Project Expenses</th>
                            <th style={{ padding: '12px 16px' }}>Balance Due</th>
                            <th style={{ padding: '12px 16px' }}>Procurement Gate</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading programs...</td></tr>
                        ) : filteredPrograms.length === 0 ? (
                            <tr><td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No project programs found.</td></tr>
                        ) : (
                            filteredPrograms.map(p => {
                                const isCleared = p.clearanceStatus === 'Cleared For Procurement' || p.project?.paymentStatus === 'Cleared';
                                return (
                                    <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                                            {p.programNumber}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                                            {p.project?.name || 'Untitled Project'}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#475569' }}>
                                            {p.client?.name || '—'}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#16a34a' }}>
                                            ₹{(p.clientAmountPaid || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#dc2626' }}>
                                            ₹{(p.projectExpenses || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 800, color: (p.balanceDue || 0) > 0 ? '#2563eb' : '#16a34a' }}>
                                            ₹{Math.max(0, p.balanceDue || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                background: isCleared ? '#f0fdf4' : '#fff7ed',
                                                color: isCleared ? '#16a34a' : '#c2410c',
                                                padding: '3px 9px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                                                display: 'inline-flex', alignItems: 'center', gap: '4px'
                                            }}>
                                                {isCleared ? <ShieldCheck size={14} /> : <Clock size={14} />}
                                                {isCleared ? 'Cleared' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            {!isCleared && (
                                                <button
                                                    onClick={() => handleClearance(p._id)}
                                                    disabled={clearingId === p._id}
                                                    style={{
                                                        padding: '6px 14px', borderRadius: '8px', border: 'none',
                                                        background: '#16a34a', color: '#ffffff', fontWeight: 700,
                                                        fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                                                    }}
                                                >
                                                    <CheckCircle size={14} /> Clear for Procurement
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProgramsView;
