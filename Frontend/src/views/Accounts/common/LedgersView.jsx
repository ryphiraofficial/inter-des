import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, UserCheck, ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw, X, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../../config/constants';

const LedgersView = ({ user, search = '', setSearch }) => {
    const [ledgers, setLedgers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('ALL');
    const [localSearch, setLocalSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [name, setName] = useState('');
    const [type, setType] = useState('Customer');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchLedgers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/ledgers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setLedgers(data.ledgers || []);
            }
        } catch (err) {
            console.error('Failed to fetch ledgers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedgers();
    }, []);

    const handleCreateLedger = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setError('Ledger name is required'); return; }
        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/ledgers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, type, notes })
            });
            const data = await res.json();
            if (data.success) {
                setIsCreateOpen(false);
                setName('');
                setNotes('');
                fetchLedgers();
            } else {
                setError(data.message || 'Failed to create ledger');
            }
        } catch (err) {
            setError(err.message || 'Server error');
        } finally {
            setSubmitting(false);
        }
    };

    const totalReceivable = ledgers.filter(l => l.type === 'Customer').reduce((sum, l) => sum + (l.balanceDue || 0), 0);
    const totalPayable = ledgers.filter(l => l.type === 'Vendor').reduce((sum, l) => sum + (l.balanceDue || 0), 0);

    const queryStr = (search || localSearch).toLowerCase();
    const filteredLedgers = ledgers.filter(l => {
        if (filterType !== 'ALL' && l.type !== filterType) return false;
        if (!queryStr) return true;
        const lName = l.name?.toLowerCase() || '';
        const lNum = l.ledgerNumber?.toLowerCase() || '';
        const cName = l.linkedClient?.name?.toLowerCase() || '';
        const vName = l.linkedVendor?.name?.toLowerCase() || '';
        return lName.includes(queryStr) || lNum.includes(queryStr) || cName.includes(queryStr) || vName.includes(queryStr);
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowDownRight size={24} />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Accounts Receivable (Customers)</span>
                        <h2 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 800, color: totalReceivable < 0 ? '#16a34a' : '#0f172a' }}>
                            ₹{Math.abs(totalReceivable).toLocaleString('en-IN')} {totalReceivable < 0 ? '(Advance)' : ''}
                        </h2>
                    </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowUpRight size={24} />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Accounts Payable (Vendors)</span>
                        <h2 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>₹{totalPayable.toLocaleString('en-IN')}</h2>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {['ALL', 'Customer', 'Vendor', 'General'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            style={{
                                padding: '6px 14px', borderRadius: '8px', border: filterType === t ? 'none' : '1px solid #e2e8f0',
                                background: filterType === t ? '#0f172a' : '#f8fafc', color: filterType === t ? '#ffffff' : '#64748b',
                                fontWeight: filterType === t ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer'
                            }}
                        >
                            {t === 'ALL' ? 'All Ledgers' : `${t}s`}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative', width: '220px' }}>
                        <input
                            type="text"
                            placeholder="Search party or ledger..."
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
                        onClick={fetchLedgers}
                        style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
                    </button>

                    <button
                        onClick={() => setIsCreateOpen(!isCreateOpen)}
                        style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Plus size={16} /> New Ledger
                    </button>
                </div>
            </div>

            {/* Create Ledger Drawer Form */}
            {isCreateOpen && (
                <form onSubmit={handleCreateLedger} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Add New Party Ledger</h4>
                    {error && <div style={{ color: '#dc2626', fontSize: '0.8rem' }}>{error}</div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Ledger Name *"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        >
                            <option value="Customer">Customer</option>
                            <option value="Vendor">Vendor</option>
                            <option value="General">General</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Notes / Address"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={() => setIsCreateOpen(false)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.8rem' }}>Cancel</button>
                        <button type="submit" disabled={submitting} style={{ padding: '6px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>Save Ledger</button>
                    </div>
                </form>
            )}

            {/* Ledgers Table */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '12px 16px' }}>Ledger #</th>
                            <th style={{ padding: '12px 16px' }}>Name</th>
                            <th style={{ padding: '12px 16px' }}>Type</th>
                            <th style={{ padding: '12px 16px' }}>Linked Entity</th>
                            <th style={{ padding: '12px 16px' }}>Running Balance Due</th>
                            <th style={{ padding: '12px 16px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading ledgers...</td></tr>
                        ) : filteredLedgers.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No party ledgers found.</td></tr>
                        ) : (
                            filteredLedgers.map(l => (
                                <tr key={l._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                                        {l.ledgerNumber}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                                        {l.name}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            background: l.type === 'Customer' ? '#eff6ff' : l.type === 'Vendor' ? '#fff7ed' : '#f8fafc',
                                            color: l.type === 'Customer' ? '#1d4ed8' : l.type === 'Vendor' ? '#c2410c' : '#475569',
                                            padding: '3px 9px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700
                                        }}>
                                            {l.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                                        {l.linkedClient?.name || l.linkedVendor?.name || 'Manual'}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 800 }}>
                                        {l.balanceDue === 0 ? (
                                            <span style={{ color: '#16a34a' }}>₹0 Clear</span>
                                        ) : l.balanceDue > 0 ? (
                                            <span style={{ color: l.type === 'Customer' ? '#2563eb' : '#ea580c' }}>
                                                ₹{l.balanceDue.toLocaleString('en-IN')} {l.type === 'Customer' ? 'Dr' : 'Cr'}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#16a34a' }}>
                                                ₹{Math.abs(l.balanceDue).toLocaleString('en-IN')} {l.type === 'Customer' ? 'Cr (Advance)' : 'Dr (Overpaid)'}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                                            {l.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LedgersView;
