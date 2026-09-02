import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Building, DollarSign, RefreshCw, X, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../../config/constants';

const AccountsListView = ({ user }) => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [name, setName] = useState('');
    const [type, setType] = useState('Bank');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [branchName, setBranchName] = useState('');
    const [initialBalance, setInitialBalance] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/accounts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAccounts(data.accounts || []);
            }
        } catch (err) {
            console.error('Failed to fetch accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setError('Account name is required'); return; }
        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name,
                    type,
                    bankDetails: { accountNumber, ifscCode, branchName },
                    currentBalance: Number(initialBalance) || 0
                })
            });
            const data = await res.json();
            if (data.success) {
                setIsCreateOpen(false);
                setName('');
                setAccountNumber('');
                setIfscCode('');
                setBranchName('');
                setInitialBalance('');
                fetchAccounts();
            } else {
                setError(data.message || 'Failed to create account');
            }
        } catch (err) {
            setError(err.message || 'Server error');
        } finally {
            setSubmitting(false);
        }
    };

    const totalLiquidity = accounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header & Total */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={24} />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Bank & Cash Liquidity</span>
                        <h2 style={{ margin: '2px 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>₹{totalLiquidity.toLocaleString('en-IN')}</h2>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={fetchAccounts}
                        style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
                    </button>

                    <button
                        onClick={() => setIsCreateOpen(!isCreateOpen)}
                        style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Plus size={16} /> Add Bank / Cash Account
                    </button>
                </div>
            </div>

            {/* Create Drawer */}
            {isCreateOpen && (
                <form onSubmit={handleCreateAccount} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Register New Bank / Cash Account</h4>
                    {error && <div style={{ color: '#dc2626', fontSize: '0.8rem' }}>{error}</div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Account Name (e.g. HDFC Main) *"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        >
                            <option value="Bank">Bank</option>
                            <option value="Cash">Cash</option>
                            <option value="Overdraft">Overdraft</option>
                            <option value="Company">Company</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Initial Balance (₹)"
                            value={initialBalance}
                            onChange={e => setInitialBalance(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                    </div>
                    {type === 'Bank' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Bank Account Number"
                                value={accountNumber}
                                onChange={e => setAccountNumber(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            />
                            <input
                                type="text"
                                placeholder="IFSC Code"
                                value={ifscCode}
                                onChange={e => setIfscCode(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            />
                            <input
                                type="text"
                                placeholder="Branch Name"
                                value={branchName}
                                onChange={e => setBranchName(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            />
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={() => setIsCreateOpen(false)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.8rem' }}>Cancel</button>
                        <button type="submit" disabled={submitting} style={{ padding: '6px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>Save Account</button>
                    </div>
                </form>
            )}

            {/* Accounts Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {loading ? (
                    <div style={{ padding: '2rem', color: '#64748b' }}>Loading accounts...</div>
                ) : accounts.length === 0 ? (
                    <div style={{ padding: '2rem', color: '#94a3b8', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>No bank or cash accounts found. Click "+ Add Bank / Cash Account" to add one.</div>
                ) : (
                    accounts.map(a => (
                        <div key={a._id} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', color: '#64748b' }}>{a.accountNumber}</span>
                                    <span style={{ background: a.type === 'Bank' ? '#eff6ff' : '#f0fdf4', color: a.type === 'Bank' ? '#1d4ed8' : '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {a.type}
                                    </span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{a.name}</h3>
                                {a.bankDetails?.accountNumber && (
                                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>Acc: {a.bankDetails.accountNumber} | IFSC: {a.bankDetails.ifscCode || 'N/A'}</p>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Current Balance</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>₹{(a.currentBalance || 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AccountsListView;
