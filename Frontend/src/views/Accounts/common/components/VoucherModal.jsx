import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/constants';

const VoucherModal = ({ isOpen, onClose, onVoucherCreated }) => {
    const [type, setType] = useState('Receipt');
    const [ledgerId, setLedgerId] = useState('');
    const [programId, setProgramId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Bank Transfer');
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('Material');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [ledgers, setLedgers] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        fetch(`${API_BASE_URL}/accounts/v2/ledgers`, { headers })
            .then(res => res.json())
            .then(data => { if (data.success) setLedgers(data.ledgers || []); })
            .catch(() => {});

        fetch(`${API_BASE_URL}/accounts/v2/programs`, { headers })
            .then(res => res.json())
            .then(data => { if (data.success) setPrograms(data.programs || []); })
            .catch(() => {});

        fetch(`${API_BASE_URL}/accounts/v2/accounts`, { headers })
            .then(res => res.json())
            .then(data => { if (data.success) setAccounts(data.accounts || []); })
            .catch(() => {});
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ledgerId) { setError('Please select a party ledger'); return; }
        if (!amount || Number(amount) <= 0) { setError('Please enter a valid amount'); return; }
        if ((type === 'Receipt' || type === 'Payment') && !accountId) {
            setError('Please select a bank or cash account'); return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/accounts/v2/vouchers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    type,
                    ledger: ledgerId,
                    program: programId || undefined,
                    account: (type === 'Receipt' || type === 'Payment') ? accountId : undefined,
                    amount: Number(amount),
                    paymentMode: (type === 'Receipt' || type === 'Payment') ? paymentMode : undefined,
                    reference,
                    notes,
                    expenseCategory: type === 'Purchase' ? expenseCategory : undefined,
                    date
                })
            });

            const data = await res.json();
            if (data.success) {
                if (onVoucherCreated) onVoucherCreated(data.voucher);
                onClose();
            } else {
                setError(data.message || 'Failed to create voucher');
            }
        } catch (err) {
            setError(err.message || 'Server error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', justifyContent: 'flex-end',
            background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)',
            animation: 'fadeIn 0.2s ease'
        }}>
            {/* Backdrop Click */}
            <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

            {/* Right Side Slide Panel */}
            <div style={{
                position: 'relative', zIndex: 10,
                background: '#ffffff', width: '100%', maxWidth: '480px', height: '100vh',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.15)',
                borderLeft: '1px solid #e2e8f0',
                animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <style>{`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}</style>

                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc',
                    flexShrink: 0
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Post New Voucher</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>Create a financial voucher transaction entry</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px',
                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#475569', transition: 'all 0.15s'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Form (Scrollable) */}
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {error && (
                        <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#b91c1c', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {/* Voucher Type */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Voucher Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {['Receipt', 'Payment', 'Purchase', 'Sale'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    style={{
                                        padding: '10px 4px', borderRadius: '10px',
                                        border: type === t ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                        background: type === t ? '#eff6ff' : '#ffffff', color: type === t ? '#1d4ed8' : '#475569',
                                        fontWeight: type === t ? 800 : 600, fontSize: '0.8rem', cursor: 'pointer',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Party Ledger Select */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Party Ledger *</label>
                        <select
                            value={ledgerId}
                            onChange={e => setLedgerId(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                        >
                            <option value="">-- Select Party Ledger --</option>
                            {ledgers.map(l => (
                                <option key={l._id} value={l._id}>{l.name} ({l.type})</option>
                            ))}
                        </select>
                    </div>

                    {/* Bank / Cash Account (if Receipt or Payment) */}
                    {(type === 'Receipt' || type === 'Payment') && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank / Cash Account *</label>
                            <select
                                value={accountId}
                                onChange={e => setAccountId(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                            >
                                <option value="">-- Select Bank / Cash Account --</option>
                                {accounts.map(a => (
                                    <option key={a._id} value={a._id}>{a.name} ({a.type}) - Bal: ₹{a.currentBalance?.toLocaleString('en-IN')}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Program / Project */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Linked Project Program (Optional)</label>
                        <select
                            value={programId}
                            onChange={e => setProgramId(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                        >
                            <option value="">-- None (General Voucher) --</option>
                            {programs.map(p => (
                                <option key={p._id} value={p._id}>{p.project?.name || p.programNumber} ({p.client?.name || 'No Client'})</option>
                            ))}
                        </select>
                    </div>

                    {/* Amount & Date Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount (₹) *</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                            />
                        </div>
                    </div>

                    {/* Payment Mode & Reference */}
                    {(type === 'Receipt' || type === 'Payment') && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Mode</label>
                                <select
                                    value={paymentMode}
                                    onChange={e => setPaymentMode(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                                >
                                    {['Bank Transfer', 'UPI', 'Cash', 'Cheque', 'Card', 'Other'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reference / UTR #</label>
                                <input
                                    type="text"
                                    placeholder="e.g. UTR1298491"
                                    value={reference}
                                    onChange={e => setReference(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Expense Category if Purchase */}
                    {type === 'Purchase' && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expense Category</label>
                            <select
                                value={expenseCategory}
                                onChange={e => setExpenseCategory(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                            >
                                {['Material', 'Labor', 'Transport', 'Equipment', 'Office Supplies', 'Company Overhead', 'Miscellaneous'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notes / Description</label>
                        <textarea
                            rows={3}
                            placeholder="Add transaction notes or details..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>
                </form>

                {/* Footer Action Buttons */}
                <div style={{
                    padding: '1.25rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#ffffff',
                    display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0
                }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
                    >
                        {submitting ? 'Posting...' : 'Post Voucher'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;
