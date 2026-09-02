import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Receipt, ArrowDownRight, ArrowUpRight, ShoppingCart, DollarSign, XCircle, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../../config/constants';
import VoucherModal from './components/VoucherModal';

const VouchersView = ({ user, search = '', setSearch }) => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState('');

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/vouchers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setVouchers(data.vouchers || []);
            }
        } catch (err) {
            console.error('Failed to fetch vouchers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleCancelVoucher = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this voucher entry?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/vouchers/${id}/cancel`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchVouchers();
            } else {
                alert(data.message || 'Failed to cancel voucher');
            }
        } catch (err) {
            alert('Error cancelling voucher');
        }
    };

    const queryStr = (search || localSearch).toLowerCase();
    const filteredVouchers = vouchers.filter(v => {
        if (typeFilter !== 'ALL' && v.type !== typeFilter) return false;
        if (!queryStr) return true;
        const vNum = v.voucherNumber?.toLowerCase() || '';
        const lName = v.ledger?.name?.toLowerCase() || '';
        const aName = v.account?.name?.toLowerCase() || '';
        const notes = v.notes?.toLowerCase() || '';
        return vNum.includes(queryStr) || lName.includes(queryStr) || aName.includes(queryStr) || notes.includes(queryStr);
    });

    const getTypeBadge = (t) => {
        switch (t) {
            case 'Receipt':
                return <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ArrowDownRight size={14} /> Receipt</span>;
            case 'Payment':
                return <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={14} /> Payment</span>;
            case 'Purchase':
                return <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ShoppingCart size={14} /> Purchase</span>;
            case 'Sale':
                return <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} /> Sale</span>;
            default:
                return <span style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{t}</span>;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Top Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {['ALL', 'Receipt', 'Payment', 'Purchase', 'Sale'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            style={{
                                padding: '6px 14px', borderRadius: '8px', border: typeFilter === t ? 'none' : '1px solid #e2e8f0',
                                background: typeFilter === t ? '#0f172a' : '#f8fafc', color: typeFilter === t ? '#ffffff' : '#64748b',
                                fontWeight: typeFilter === t ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s'
                            }}
                        >
                            {t === 'ALL' ? 'All Vouchers' : t}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative', width: '220px' }}>
                        <input
                            type="text"
                            placeholder="Search vouchers..."
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
                        onClick={fetchVouchers}
                        style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
                    >
                        <Plus size={16} /> New Voucher
                    </button>
                </div>
            </div>

            {/* Vouchers Table */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '12px 16px' }}>Date</th>
                            <th style={{ padding: '12px 16px' }}>Voucher #</th>
                            <th style={{ padding: '12px 16px' }}>Type</th>
                            <th style={{ padding: '12px 16px' }}>Party / Ledger</th>
                            <th style={{ padding: '12px 16px' }}>Account</th>
                            <th style={{ padding: '12px 16px' }}>Amount</th>
                            <th style={{ padding: '12px 16px' }}>Status</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading vouchers...</td></tr>
                        ) : filteredVouchers.length === 0 ? (
                            <tr><td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No vouchers found. Click "+ New Voucher" to log one.</td></tr>
                        ) : (
                            filteredVouchers.map(v => (
                                <tr key={v._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 500 }}>
                                        {new Date(v.date || v.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                                        {v.voucherNumber}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {getTypeBadge(v.type)}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>
                                        {v.ledger?.name || '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                                        {v.account?.name || '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 800, color: v.type === 'Receipt' ? '#16a34a' : v.type === 'Payment' ? '#dc2626' : '#0f172a' }}>
                                        ₹{v.amount?.toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            background: v.status === 'Posted' ? '#f0fdf4' : '#fef2f2',
                                            color: v.status === 'Posted' ? '#16a34a' : '#dc2626',
                                            padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700
                                        }}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        {v.status !== 'Cancelled' && (
                                            <button
                                                onClick={() => handleCancelVoucher(v._id)}
                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                title="Cancel Voucher"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <VoucherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVoucherCreated={() => fetchVouchers()}
            />
        </div>
    );
};

export default VouchersView;
