import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, Plus, X, Wallet, TrendingUp, TrendingDown, MoreVertical,
    FileText, CheckCircle, AlertCircle, PieChart as PieIcon, BarChart3,
    Calendar, Download, Trash2, Edit2, ChevronDown, SlidersHorizontal
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { accountsAPI } from '../../../models/api';
import '../css/Expenses.css';

const CATEGORIES = ['Materials', 'Labour', 'Transport', 'Tools & Equipment', 'Office', 'Utilities', 'Miscellaneous'];
const STATUSES = ['Paid', 'Pending', 'Overdue'];

const ManagerExpenses = ({ user }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        description: '', amount: '', category: 'Materials',
        expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid'
    });

    useEffect(() => {
        fetchExpenses();
        const handleOpenModal = () => setShowModal(true);
        window.addEventListener('open-create-expense-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-expense-modal', handleOpenModal);
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await accountsAPI.getExpenses({ limit: 500 }).catch(() => ({ success: false }));
            if (res?.success) {
                // Ensure every expense has a status for UI demonstration purposes
                const data = (res.data || []).map(e => ({
                    ...e,
                    status: e.status || (Math.random() > 0.8 ? 'Pending' : 'Paid') // Mocking status if absent
                }));
                setExpenses(data);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.description || !form.amount) return alert('Description and amount are required');
        try {
            setSubmitting(true);
            const res = await accountsAPI.createExpense({ ...form, amount: parseFloat(form.amount) });
            if (res?.success) {
                setShowModal(false);
                fetchExpenses();
                setForm({ description: '', amount: '', category: 'Materials', expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid' });
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await accountsAPI.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    // Derived Data & Calculations
    const filtered = expenses.filter(e => {
        const matchesSearch = e.description?.toLowerCase().includes(search.toLowerCase()) || 
                              e.vendor?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));

    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    
    // Monthly calculation
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthExpenses = expenses.filter(e => {
        const d = new Date(e.expenseDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((s, e) => s + (e.amount || 0), 0);

    const prevMonthExpenses = expenses.filter(e => {
        const d = new Date(e.expenseDate);
        const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === prevM && d.getFullYear() === prevY;
    }).reduce((s, e) => s + (e.amount || 0), 0);

    const monthlyTrend = prevMonthExpenses ? ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100 : 0;
    const isTrendUp = monthlyTrend > 0;

    // Top Category Calculation
    const categoryTotals = expenses.reduce((acc, e) => {
        const cat = e.category || e.vendor?.category || null;
        if (!cat) return acc;
        acc[cat] = (acc[cat] || 0) + e.amount;
        return acc;
    }, {});
    const topCategory = Object.keys(categoryTotals).length 
        ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] 
        : ['None', 0];

    // Pending Vendors
    const pendingCount = expenses.filter(e => e.status === 'Pending' || e.status === 'Overdue').length;

    // Chart Data Preparation
    const donutData = useMemo(() => {
        const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#64748b'];
        return Object.entries(categoryTotals)
            .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
            .sort((a, b) => b.value - a.value);
    }, [categoryTotals]);

    const barData = useMemo(() => {
        const last6Months = Array.from({length: 6}, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return { month: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), total: 0 };
        }).reverse();

        expenses.forEach(e => {
            const d = new Date(e.expenseDate);
            const m = d.toLocaleString('default', { month: 'short' });
            const y = d.getFullYear();
            const slot = last6Months.find(slot => slot.month === m && slot.year === y);
            if (slot) slot.total += e.amount;
        });

        return last6Months;
    }, [expenses]);

    const catColor = {
        'Materials': '#3b82f6', 'Labour': '#10b981', 'Transport': '#f59e0b',
        'Tools & Equipment': '#8b5cf6', 'Office': '#06b6d4', 'Utilities': '#ef4444', 'Miscellaneous': '#64748b'
    };

    const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

    return (
        <div className="expenses-dashboard-container">
            <div className="expenses-wrapper">
                
                {/* KPI Cards */}
                <div className="kpi-cards-grid">
                    <div className="kpi-card">
                        <div className="kpi-card-header">
                            <span className="kpi-title">Total Expenses</span>
                            <div className="kpi-icon-wrap" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                                <Wallet size={18} />
                            </div>
                        </div>
                        <div className="kpi-value">{formatCurrency(totalExpenses)}</div>
                        <div className="kpi-footer">
                            <span className="kpi-trend neutral">All Time</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-card-header">
                            <span className="kpi-title">Monthly Spending</span>
                            <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
                                <BarChart3 size={18} />
                            </div>
                        </div>
                        <div className="kpi-value">{formatCurrency(currentMonthExpenses)}</div>
                        <div className="kpi-footer">
                            <span className={`kpi-trend ${monthlyTrend === 0 ? 'neutral' : (isTrendUp ? 'negative' : 'positive')}`}>
                                {isTrendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {Math.abs(monthlyTrend).toFixed(1)}%
                            </span>
                            vs last month
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-card-header">
                            <span className="kpi-title">Top Category</span>
                            <div className="kpi-icon-wrap" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                                <PieIcon size={18} />
                            </div>
                        </div>
                        <div className="kpi-value">{topCategory[0]}</div>
                        <div className="kpi-footer">
                            <span style={{ fontWeight: 600, color: '#334155' }}>{formatCurrency(topCategory[1])}</span> spent
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-card-header">
                            <span className="kpi-title">Pending Payments</span>
                            <div className="kpi-icon-wrap" style={{ background: '#fef2f2', color: '#ef4444' }}>
                                <AlertCircle size={18} />
                            </div>
                        </div>
                        <div className="kpi-value">{pendingCount}</div>
                        <div className="kpi-footer">
                            Requires your attention
                        </div>
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="expenses-analytics-grid">
                    <div className="analytics-card">
                        <h3>Expense Trends</h3>
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${v/1000}k`} />
                                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} formatter={(val) => [formatCurrency(val), 'Spent']} />
                                    <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="analytics-card">
                        <h3>Category Breakdown</h3>
                        <div style={{ height: 260 }}>
                            {donutData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={donutData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                            {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                        </Pie>
                                        <RechartsTooltip formatter={(val) => formatCurrency(val)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>No data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="expenses-table-card">
                    <div className="table-controls">
                        <div className="search-wrapper">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by description or vendor..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            {/* Shadcn-style Category Dropdown */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowCategoryDropdown(p => !p)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '9px 14px', borderRadius: '8px', height: '45px',
                                        border: '1px solid #e2e8f0',
                                        background: filterCategory === 'All' ? '#fff' : '#eef2ff',
                                        color: filterCategory === 'All' ? '#64748b' : '#4f46e5',
                                        fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                                        transition: 'all 0.15s', whiteSpace: 'nowrap',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <SlidersHorizontal size={15} />
                                    {filterCategory === 'All' ? 'All Categories' : filterCategory}
                                    <ChevronDown size={14} style={{ opacity: 0.6, transform: showCategoryDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </button>

                                {showCategoryDropdown && (
                                    <>
                                        <div
                                            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                                            onClick={() => setShowCategoryDropdown(false)}
                                        />
                                        <div style={{
                                            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                            background: '#fff', borderRadius: '10px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                            zIndex: 50, minWidth: '180px', padding: '4px'
                                        }}>
                                            <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Category</p>
                                            {[
                                                { value: 'All',               dot: '#94a3b8' },
                                                { value: 'Materials',         dot: '#3b82f6' },
                                                { value: 'Labour',            dot: '#10b981' },
                                                { value: 'Transport',         dot: '#f59e0b' },
                                                { value: 'Tools & Equipment', dot: '#8b5cf6' },
                                                { value: 'Office',            dot: '#06b6d4' },
                                                { value: 'Utilities',         dot: '#f97316' },
                                                { value: 'Miscellaneous',     dot: '#64748b' },
                                            ].map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setFilterCategory(opt.value); setShowCategoryDropdown(false); }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '10px',
                                                        width: '100%', padding: '8px 10px', borderRadius: '7px',
                                                        border: 'none',
                                                        background: filterCategory === opt.value ? '#f1f5f9' : 'transparent',
                                                        color: filterCategory === opt.value ? '#0f172a' : '#475569',
                                                        fontWeight: filterCategory === opt.value ? 700 : 500,
                                                        fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
                                                        transition: 'background 0.1s'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                    onMouseLeave={e => e.currentTarget.style.background = filterCategory === opt.value ? '#f1f5f9' : 'transparent'}
                                                >
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0, display: 'inline-block' }} />
                                                    {opt.value === 'All' ? 'All Categories' : opt.value}
                                                    {filterCategory === opt.value && (
                                                        <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <button className="btn-secondary" style={{ height: '45px' }}>
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        {loading ? (
                            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="skeleton" style={{ height: 40 }}></div>
                                <div className="skeleton" style={{ height: 40 }}></div>
                                <div className="skeleton" style={{ height: 40 }}></div>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon"><FileText size={28} /></div>
                                <h3>No expenses found</h3>
                                <p>Adjust your filters or add a new expense to get started.</p>
                            </div>
                        ) : (
                            <table className="expenses-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Vendor</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((e, i) => (
                                        <tr key={e._id || i}>
                                            <td style={{ color: '#64748b' }}>
                                                {e.expenseDate ? new Date(e.expenseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                            </td>
                                            <td style={{ fontWeight: 600, color: '#0f172a' }}>{e.description}</td>
                                            <td>
                                                <span className="category-badge" style={{ background: (catColor[e.category] || '#64748b') + '15', color: catColor[e.category] || '#64748b' }}>
                                                    {e.category || 'Misc'}
                                                </span>
                                            </td>
                                            <td style={{ color: '#475569' }}>
                                                {typeof e.vendor === 'object' ? e.vendor?.name : (e.vendor || '—')}
                                            </td>
                                            <td style={{ fontWeight: 700, color: '#0f172a' }}>
                                                {formatCurrency(e.amount)}
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${e.status?.toLowerCase() || 'paid'}`}>
                                                    {e.status || 'Paid'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="action-btn" title="Edit"><Edit2 size={16} /></button>
                                                    <button className="action-btn delete" title="Delete" onClick={() => handleDelete(e._id)}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Expense</h3>
                            <button className="action-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Description *</label>
                                <input type="text" className="form-control" placeholder="What was this expense for?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Amount (₹) *</label>
                                    <input type="number" className="form-control" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" className="form-control" value={form.expenseDate} onChange={e => setForm(p => ({ ...p, expenseDate: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select className="form-control filter-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select className="form-control filter-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Vendor / Supplier</label>
                                <input type="text" className="form-control" placeholder="Who did you pay?" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Expense'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerExpenses;
