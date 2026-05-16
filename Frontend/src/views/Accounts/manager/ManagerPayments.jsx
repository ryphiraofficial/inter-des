import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, CreditCard, Trash2, ChevronDown, CheckCircle, Calendar, ChevronLeft, ChevronRight, User, Banknote } from 'lucide-react';
import { accountsAPI, clientAPI } from '../../../models/api';

/* ─── Mini custom DatePicker ─── */
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CustomDatePicker = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = value ? new Date(value + 'T00:00:00') : new Date();
    const [view, setView] = useState({ month: selected.getMonth(), year: selected.getFullYear() });

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const firstDay = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const prevMonth = () => setView(v => v.month === 0 ? { month: 11, year: v.year - 1 } : { month: v.month - 1, year: v.year });
    const nextMonth = () => setView(v => v.month === 11 ? { month: 0, year: v.year + 1 } : { month: v.month + 1, year: v.year });

    const selectDay = (d) => {
        const mm = String(view.month + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        onChange(`${view.year}-${mm}-${dd}`);
        setOpen(false);
    };

    const isSelected = (d) => {
        if (!value) return false;
        const s = new Date(value + 'T00:00:00');
        return s.getFullYear() === view.year && s.getMonth() === view.month && s.getDate() === d;
    };
    const isToday = (d) => {
        const t = new Date();
        return t.getFullYear() === view.year && t.getMonth() === view.month && t.getDate() === d;
    };

    const displayValue = value
        ? new Date(value + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Select date';

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px',
                    background: '#fff', fontSize: '14px', cursor: 'pointer', color: value ? '#0f172a' : '#94a3b8',
                    fontWeight: value ? 500 : 400, textAlign: 'left', boxSizing: 'border-box'
                }}
            >
                <Calendar size={15} style={{ color: '#6366f1', flexShrink: 0 }} />
                {displayValue}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                    background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15)', zIndex: 9999,
                    padding: '16px', width: '280px'
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <button type="button" onClick={prevMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', display: 'flex' }}>
                            <ChevronLeft size={16} color="#475569" />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{MONTHS[view.month]} {view.year}</span>
                        <button type="button" onClick={nextMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', display: 'flex' }}>
                            <ChevronRight size={16} color="#475569" />
                        </button>
                    </div>
                    {/* Day headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px' }}>
                        {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#94a3b8', padding: '4px 0' }}>{d}</div>)}
                    </div>
                    {/* Cells */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => selectDay(d)}
                                style={{
                                    width: '100%', aspectRatio: '1', border: 'none', borderRadius: '6px',
                                    cursor: 'pointer', fontSize: '13px', fontWeight: isSelected(d) ? 700 : 400,
                                    background: isSelected(d) ? '#6366f1' : isToday(d) ? '#eef2ff' : 'transparent',
                                    color: isSelected(d) ? '#fff' : isToday(d) ? '#6366f1' : '#334155',
                                    transition: 'all 0.1s'
                                }}
                                onMouseEnter={e => { if (!isSelected(d)) e.currentTarget.style.background = '#f1f5f9'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = isSelected(d) ? '#6366f1' : isToday(d) ? '#eef2ff' : 'transparent'; }}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                    {/* Footer */}
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <button type="button" onClick={() => { onChange(''); setOpen(false); }}
                            style={{ fontSize: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear</button>
                        <button type="button" onClick={() => {
                            const t = new Date(); const mm = String(t.getMonth()+1).padStart(2,'0'); const dd = String(t.getDate()).padStart(2,'0');
                            onChange(`${t.getFullYear()}-${mm}-${dd}`); setOpen(false);
                        }} style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Today</button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Shadcn-style Select Dropdown ─── */
const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const selected = options.find(o => (o.value ?? o) === value);
    const label = selected ? (selected.label ?? selected) : placeholder;

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px',
                    background: '#fff', fontSize: '14px', cursor: 'pointer',
                    color: value ? '#0f172a' : '#94a3b8', fontWeight: value ? 500 : 400,
                    textAlign: 'left', boxSizing: 'border-box', justifyContent: 'space-between'
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={15} style={{ color: '#6366f1', flexShrink: 0 }} />}
                    {label}
                </span>
                <ChevronDown size={14} style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            {open && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setOpen(false)} />
                    <div style={{
                        position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                        background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 9999, padding: '4px'
                    }}>
                        {options.map(opt => {
                            const v = opt.value ?? opt; const l = opt.label ?? opt;
                            const isActive = v === value;
                            return (
                                <button key={v} type="button"
                                    onClick={() => { onChange(v); setOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        width: '100%', padding: '9px 10px', borderRadius: '7px',
                                        border: 'none', background: isActive ? '#f1f5f9' : 'transparent',
                                        color: isActive ? '#0f172a' : '#475569',
                                        fontWeight: isActive ? 700 : 500, fontSize: '14px',
                                        cursor: 'pointer', textAlign: 'left'
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = isActive ? '#f1f5f9' : 'transparent'; }}
                                >
                                    {opt.dot && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />}
                                    {l}
                                    {isActive && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#6366f1' }} />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

/* ─── Main Component ─── */
const ManagerPayments = ({ user }) => {
    const [payments, setPayments] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        client: '', amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer', reference: ''
    });

    useEffect(() => {
        fetchData();
        const handleOpenModal = () => setShowModal(true);
        window.addEventListener('open-create-payment-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-payment-modal', handleOpenModal);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [payRes, clientRes] = await Promise.all([
                accountsAPI.getPayments({ limit: 50 }).catch(() => ({ success: false })),
                clientAPI.getAll().catch(() => ({ success: false }))
            ]);
            if (payRes?.success) setPayments(payRes.data || []);
            if (clientRes?.success) setClients(clientRes.data || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.client || !form.amount) return alert('Client and amount are required');
        try {
            setSubmitting(true);
            const res = await accountsAPI.createPayment({ ...form, amount: parseFloat(form.amount) });
            if (res?.success) {
                setShowModal(false);
                fetchData();
                setForm({ client: '', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'Bank Transfer', reference: '' });
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = payments.filter(p =>
        p.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.reference?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this payment record?')) return;
        try {
            const res = await accountsAPI.deletePayment(id);
            if (res?.success) setPayments(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
        }
    };

    const methodColor = { 'Cash': '#10b981', 'Bank Transfer': '#3b82f6', 'Cheque': '#8b5cf6', 'UPI': '#f59e0b', 'Card': '#ef4444' };

    const clientOptions = [
        { value: '', label: 'Select Client' },
        ...clients.map(c => ({ value: c._id, label: c.name }))
    ];
    const methodOptions = [
        { value: 'Bank Transfer', label: 'Bank Transfer', dot: '#3b82f6' },
        { value: 'Cash',          label: 'Cash',          dot: '#10b981' },
        { value: 'Cheque',        label: 'Cheque',        dot: '#8b5cf6' },
        { value: 'UPI',           label: 'UPI',           dot: '#f59e0b' },
        { value: 'Card',          label: 'Card',          dot: '#ef4444' },
    ];

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" placeholder="Search by client or reference..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', height: '45px', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                            <CreditCard size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                            <p>No payments found.</p>
                        </div>
                    ) : (
                    <div className="table-responsive-wrapper">
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    {['Date', 'Client', 'Method', 'Reference', 'Amount', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => (
                                    <tr key={p._id || i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                                            {new Date(p.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>{p.client?.name || '—'}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ background: (methodColor[p.paymentMethod] || '#6366f1') + '20', color: methodColor[p.paymentMethod] || '#6366f1', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                                                {p.paymentMethod}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{p.reference || '—'}</td>
                                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10b981' }}>₹{Number(p.amount || 0).toLocaleString('en-IN')}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <button onClick={() => handleDelete(p._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#ef4444' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}
                </div>

                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '460px', maxWidth: '95vw', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Record Payment</h3>
                                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#94a3b8' }}>Add an incoming payment record</p>
                                </div>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#64748b', display: 'flex' }}><X size={18} /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Client */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client *</label>
                                    <CustomSelect
                                        value={form.client}
                                        onChange={v => setForm(p => ({ ...p, client: v }))}
                                        options={clientOptions}
                                        placeholder="Select Client"
                                        icon={User}
                                    />
                                </div>

                                {/* Amount + Date */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount *</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1', fontWeight: 700, fontSize: '14px' }}>₹</span>
                                            <input type="number" placeholder="0.00" value={form.amount}
                                                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                                                style={{ width: '100%', padding: '10px 12px 10px 28px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                                        <CustomDatePicker
                                            value={form.paymentDate}
                                            onChange={v => setForm(p => ({ ...p, paymentDate: v }))}
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</label>
                                    <CustomSelect
                                        value={form.paymentMethod}
                                        onChange={v => setForm(p => ({ ...p, paymentMethod: v }))}
                                        options={methodOptions}
                                        icon={Banknote}
                                    />
                                </div>

                                {/* Reference */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference / UTR</label>
                                    <input type="text" placeholder="Transaction reference" value={form.reference}
                                        onChange={e => setForm(p => ({ ...p, reference: e.target.value }))}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '22px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowModal(false)}
                                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px', color: '#475569' }}>
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} disabled={submitting}
                                    style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                                    {submitting ? 'Saving...' : 'Record Payment'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerPayments;
