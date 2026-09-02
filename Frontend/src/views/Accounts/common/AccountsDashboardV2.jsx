import React, { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet, DollarSign, TrendingUp, BookOpen, Building2, RefreshCw, Calendar, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../../config/constants';

const AccountsDashboardV2 = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [statsRes, vouchersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/accounts/v2/stats`, { headers }),
                fetch(`${API_BASE_URL}/accounts/v2/vouchers`, { headers })
            ]);

            const statsData = await statsRes.json();
            const vouchersData = await vouchersRes.json();

            if (statsData.success) setStats(statsData.stats || statsData.data || null);
            if (vouchersData.success) setVouchers(vouchersData.vouchers || []);
        } catch (err) {
            console.error('Failed fetching admin accounts dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const cashBalance = stats?.cashBalance || 0;
    const incoming = vouchers.filter(v => v.type === 'Receipt' && v.status === 'Posted').reduce((sum, v) => sum + (v.amount || 0), 0);
    const outgoing = vouchers.filter(v => (v.type === 'Payment' || v.type === 'Purchase') && v.status === 'Posted').reduce((sum, v) => sum + (v.amount || 0), 0);
    const netFlow = incoming - outgoing;
    const receivables = stats?.accountsReceivable || 0;
    const payables = stats?.accountsPayable || 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 80%, #3b82f6 100%)',
                borderRadius: '16px', padding: '1.5rem 1.75rem', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
                <div>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(255, 255, 255, 0.15)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block' }}>
                        Executive Financial Command Center
                    </span>
                    <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Company Cash Flow & Ledger Summary</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#e0f2fe', fontWeight: 500 }}>Real-time overview of incoming revenue, outgoing payments, and company liquidity</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.25)' }}>
                        <Calendar size={14} color="#bfdbfe" /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <button
                        onClick={fetchData}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.2)', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, backdropFilter: 'blur(4px)', transition: 'all 0.15s' }}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* 4 Major Cash Flow KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {/* 1. Cash Incoming */}
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Cash Incoming (Receipts)</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowDownRight size={20} />
                        </div>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>₹{incoming.toLocaleString('en-IN')}</h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block', fontWeight: 600 }}>Total client payments collected</span>
                </div>

                {/* 2. Cash Outgoing */}
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Cash Outgoing (Payments & Expenses)</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>₹{outgoing.toLocaleString('en-IN')}</h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block', fontWeight: 600 }}>Total vendor & operational payouts</span>
                </div>

                {/* 3. Net Cash Flow */}
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Net Cash Flow (Profit Margin)</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: netFlow >= 0 ? '#eff6ff' : '#fff7ed', color: netFlow >= 0 ? '#2563eb' : '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: netFlow >= 0 ? '#2563eb' : '#ea580c' }}>₹{netFlow.toLocaleString('en-IN')}</h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block', fontWeight: 600 }}>Net Gain (Incoming - Outgoing)</span>
                </div>

                {/* 4. Bank & Cash Liquidity */}
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Company Bank & Cash Liquidity</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wallet size={20} />
                        </div>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>₹{cashBalance.toLocaleString('en-IN')}</h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block', fontWeight: 600 }}>Total available money across all accounts</span>
                </div>
            </div>

            {/* Receivables & Payables Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Accounts Receivable (From Clients)</span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '1.3rem', fontWeight: 800, color: '#2563eb' }}>
                        ₹{Math.abs(receivables).toLocaleString('en-IN')} {receivables > 0 ? 'Dr (Owed to company)' : 'Cr (Advance collected)'}
                    </h3>
                </div>

                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Accounts Payable (To Vendors)</span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '1.3rem', fontWeight: 800, color: '#ea580c' }}>
                        ₹{Math.abs(payables).toLocaleString('en-IN')} Cr (Owed to suppliers)
                    </h3>
                </div>
            </div>

            {/* Live Cash Flow Stream (Recent Vouchers Table) */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Live Cash Flow Transactions Stream</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>Real-time feed of all incoming receipts, vendor payments, and purchases</p>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '12px 16px' }}>Date</th>
                            <th style={{ padding: '12px 16px' }}>Voucher #</th>
                            <th style={{ padding: '12px 16px' }}>Cash Movement</th>
                            <th style={{ padding: '12px 16px' }}>Party / Ledger</th>
                            <th style={{ padding: '12px 16px' }}>Bank / Account</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading transaction feed...</td></tr>
                        ) : vouchers.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No financial transactions logged yet.</td></tr>
                        ) : (
                            vouchers.slice(0, 10).map(v => (
                                <tr key={v._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 500 }}>
                                        {new Date(v.date || v.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                                        {v.voucherNumber}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {v.type === 'Receipt' ? (
                                            <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <ArrowDownRight size={14} /> INCOMING (Receipt)
                                            </span>
                                        ) : (
                                            <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '3px 9px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <ArrowUpRight size={14} /> OUTGOING ({v.type})
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                                        {v.ledger?.name || '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                                        {v.account?.name || '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: v.type === 'Receipt' ? '#16a34a' : '#dc2626' }}>
                                        ₹{v.amount?.toLocaleString('en-IN')}
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

export default AccountsDashboardV2;
