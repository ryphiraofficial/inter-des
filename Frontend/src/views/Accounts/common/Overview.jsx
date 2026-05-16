import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Receipt, CreditCard, Wallet, Target, Search, Bell, Plus, ArrowRight,
    TrendingUp, CheckCircle, AlertTriangle, MoreVertical, Building2, User, ArrowUpRight, ArrowDownRight,
    PieChart as PieIcon, X, Check, Eye, Calendar, ChevronDown, Package, Briefcase, IndianRupee,
    FileText, Edit, Trash2, Activity, Clock
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { accountsAPI, invoiceAPI, staffAPI } from '../../../models/api';
import { Skeleton, StatsSkeleton, TableSkeleton } from '../../admin/components/Skeleton';
import '../css/ManagerDashboard.css';

const StatCardV3 = ({ title, value, subValue, icon: Icon, type, trendValue, onClick, iconColor, iconBg }) => {
    const isUp = trendValue > 0;
    const isNeutral = trendValue == 0 || !trendValue;
    const trendClass = isNeutral ? 'trend-neutral-v3' : (isUp ? 'trend-up-v3' : 'trend-down-v3');
    const TrendIcon = isNeutral ? null : (isUp ? ArrowUpRight : ArrowDownRight);

    return (
        <div className={`stat-card-v3 ${type}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className="stat-header-v3">
                <div className="stat-icon-v3" style={{ backgroundColor: iconBg, color: iconColor }}>
                    {Icon && <Icon size={18} strokeWidth={2.5} />}
                </div>
                <span className="stat-title-v3">{title}</span>
            </div>
            <div className="stat-value-v3">{value}</div>
            <div className="stat-footer-v3">
                {!isNeutral && <span className={trendClass}>{TrendIcon && <TrendIcon size={14} />} {Math.abs(trendValue)}%</span>}
                {isNeutral && <span style={{fontSize: '12px', color: '#94a3b8'}}>-</span>}
                <span className="stat-subtext-v3" style={{marginLeft: isNeutral ? 0 : '6px'}}>{subValue}</span>
            </div>
        </div>
    );
};

const Overview = ({ user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    
    const calculateDateRange = (filterName, monthOffset = 0) => {
        const now = new Date();
        const formatDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        let start = new Date();
        let end = new Date();
        let rangeStr = '';

        if (filterName === 'Month') {
            start = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
            start.setHours(0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 0, 23, 59, 59, 999);
            rangeStr = `${formatDate(start)} - ${formatDate(end)}`;
            return {
                active: start.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
                start: start.toISOString(),
                end: end.toISOString(),
                range: rangeStr
            };
        }

        switch (filterName) {
            case 'Today':
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
                rangeStr = formatDate(start);
                break;
            case 'Yesterday': {
                const yesterday = new Date(now);
                yesterday.setDate(now.getDate() - 1);
                start = new Date(yesterday.setHours(0, 0, 0, 0));
                end = new Date(yesterday.setHours(23, 59, 59, 999));
                rangeStr = formatDate(start);
                break;
            }
            case 'This Week':
                start = new Date(now);
                start.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                rangeStr = `${formatDate(start)} - ${formatDate(end)}`;
                break;
            case 'This Month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                start.setHours(0, 0, 0, 0);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                rangeStr = `${formatDate(start)} - ${formatDate(end)}`;
                break;
            case 'Last Month':
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                start.setHours(0, 0, 0, 0);
                end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
                rangeStr = `${formatDate(start)} - ${formatDate(end)}`;
                break;
            default:
                break;
        }

        return {
            active: filterName,
            start: start.toISOString(),
            end: end.toISOString(),
            range: rangeStr
        };
    };

    const [openDropdown, setOpenDropdown] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(calculateDateRange('This Month'));
    const [stats, setStats] = useState(null);
    const [pendingCollections, setPendingCollections] = useState([]);
    const [accountsStaff, setAccountsStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState({});  // { [projectId]: staffId }
    const [assigningStaff, setAssigningStaff] = useState({});
    const [verifyingPayment, setVerifyingPayment] = useState({});
    const [collectedAmounts, setCollectedAmounts] = useState({});
    const datePickerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const params = { startDate: globalFilter.start, endDate: globalFilter.end };
                const res = await accountsAPI.getStats(params);
                if (!isMounted) return;
                if (res?.success) {
                    setStats(res.data);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchDashboardData();

        // Fetch payment collection queue and staff list
        accountsAPI.getPendingCollections().then(res => {
            if (res?.success) {
                const pending = (res.data || []).filter(p => p.stage === 'Pending Payment');
                setPendingCollections(pending);
            }
        }).catch(() => {});

        staffAPI?.getAll?.({ role: 'Accounts Staff', status: 'Active' }).then(res => {
            setAccountsStaff(res?.data || []);
        }).catch(() => {});

        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                if (openDropdown === 'global') setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            isMounted = false;
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [globalFilter, openDropdown]);

    const formatCurrency = (amount) => {
        const num = Number(amount) || 0;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleDateSelect = (target, filterName, monthOffset = 0, rangeString) => {
        const newFilter = calculateDateRange(filterName, monthOffset);
        if (filterName === 'Custom Range') {
            if (customStartDate && customEndDate) {
                const start = new Date(customStartDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(customEndDate);
                end.setHours(23, 59, 59, 999);
                newFilter.start = start.toISOString();
                newFilter.end = end.toISOString();
                newFilter.range = rangeString;
            }
        }
        setGlobalFilter(newFilter);
        setOpenDropdown(null);
        setShowCustomRange(false);
    };

    const handleCustomApply = () => {
        if (customStartDate && customEndDate) {
            const startStr = new Date(customStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const endStr = new Date(customEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            handleDateSelect('global', 'Custom Range', 0, `${startStr} - ${endStr}`);
        }
    };

    // Prepare chart data
    const cashFlowData = useMemo(() => stats?.cashFlowData || [], [stats]);
    
    const expenseData = useMemo(() => {
        if (stats?.expensesByType?.length > 0) {
            const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            const total = stats.totalExpenses || 1;
            return stats.expensesByType.map((item, i) => ({
                name: item._id || 'General',
                value: item.total,
                color: COLORS[i % COLORS.length],
                percent: ((item.total / total) * 100).toFixed(1) + '%'
            }));
        }
        return [];
    }, [stats]);

    const invoiceStatusData = useMemo(() => {
        if (stats?.invoiceStatusCounts?.length > 0) {
            const COLOR_MAP = { 'Paid': '#10b981', 'Sent': '#3b82f6', 'Draft': '#8b5cf6', 'Overdue': '#ef4444', 'Unpaid': '#f59e0b', 'Partially Paid': '#06b6d4' };
            const total = stats.invoiceStatusCounts.reduce((acc, curr) => acc + curr.count, 0) || 1;
            return stats.invoiceStatusCounts.map(item => ({
                name: item._id,
                value: item.count,
                color: COLOR_MAP[item._id] || '#94a3b8',
                percent: ((item.count / total) * 100).toFixed(1) + '%'
            }));
        }
        return [];
    }, [stats]);

    const activityFeed = stats?.activityFeed || [];
    const upcomingDues = stats?.upcomingDues || [];
    const topClients = stats?.topClients || [];

    const getStatusClass = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('paid') || s === 'completed') return 'paid';
        if (s.includes('overdue')) return 'overdue';
        if (s.includes('unpaid') || s.includes('draft') || s === 'pending') return 'draft';
        return 'draft';
    };

    const getUrgencyClass = (dateStr) => {
        const days = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
        if (days < 0) return 'urgent';
        if (days <= 3) return 'warning';
        return 'normal';
    };

    const handleAssignStaff = async (projectId) => {
        const staffId = selectedStaff[projectId];
        if (!staffId) return;
        try {
            setAssigningStaff(prev => ({ ...prev, [projectId]: true }));
            const res = await accountsAPI.assignStaff({ projectId, staffId });
            if (res?.success) {
                setPendingCollections(prev => prev.map(p => p._id === projectId
                    ? { ...p, paymentCollectionStatus: 'Assigned', assignedAccountsStaff: accountsStaff.find(s => s._id === staffId) }
                    : p
                ));
            }
        } catch (e) { console.error(e); }
        finally { setAssigningStaff(prev => ({ ...prev, [projectId]: false })); }
    };

    const handleVerifyPayment = async (projectId) => {
        const amt = collectedAmounts[projectId];
        if (!amt) { alert('Please enter collected amount'); return; }
        try {
            setVerifyingPayment(prev => ({ ...prev, [projectId]: true }));
            const res = await accountsAPI.verifyPayment({ projectId, collectedAmount: amt });
            if (res?.success) {
                setPendingCollections(prev => prev.filter(p => p._id !== projectId));
                alert('Payment verified! Project released to Procurement.');
            }
        } catch (e) { console.error(e); }
        finally { setVerifyingPayment(prev => ({ ...prev, [projectId]: false })); }
    };

    return (
        <div className={`accounts-overview-tab ${loading ? 'is-loading' : ''}`}>

            {/* ── Payment Collection Queue ── */}
            {pendingCollections.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <AlertTriangle size={15} /> {pendingCollections.length} Pending Collection{pendingCollections.length > 1 ? 's' : ''}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Payment Collection Queue</h3>
                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Admin-approved projects awaiting advance collection before procurement starts</p>
                            </div>
                        </div>
                    </div>

                    <div className="collection-queue-grid">
                        {pendingCollections.map(proj => {
                            const isAssigned = proj.paymentCollectionStatus === 'Assigned';
                            const isDueSoon = proj.paymentDueDate && (new Date(proj.paymentDueDate) - new Date()) / 86400000 <= 3;
                            return (
                                <div key={proj._id} className={`collection-card ${isDueSoon ? 'is-due-soon' : ''}`}>
                                    {/* Header */}
                                    <div className="collection-card-header">
                                        <div>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{proj.name}</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{proj.client?.name || 'Unknown Client'}</p>
                                        </div>
                                        <span style={{ background: isAssigned ? '#dcfce7' : '#fef3c7', color: isAssigned ? '#166534' : '#92400e', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>
                                            {proj.paymentCollectionStatus || 'Pending'}
                                        </span>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="collection-card-info">
                                        <div className="info-item">
                                            <p className="info-label">Quotation Total</p>
                                            <p className="info-value primary">₹{(proj.quotation?.totalAmount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="info-item success">
                                            <p className="info-label">Advance to Collect ({proj.advancePercentage || 0}%)</p>
                                            <p className="info-value success">₹{(proj.advanceAmount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className={`info-item ${isDueSoon ? 'danger' : ''}`}>
                                            <p className="info-label">Due Date</p>
                                            <p className={`info-value ${isDueSoon ? 'danger' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {isDueSoon && <AlertTriangle size={13} />}
                                                {proj.paymentDueDate ? new Date(proj.paymentDueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set'}
                                            </p>
                                        </div>
                                        <div className="info-item">
                                            <p className="info-label">Assigned To</p>
                                            <p className="info-value">{proj.assignedAccountsStaff?.fullName || '—'}</p>
                                        </div>
                                    </div>

                                    {/* Admin Notes */}
                                    {proj.adminPaymentNotes && (
                                        <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#92400e' }}>
                                            <strong>Admin Note:</strong> {proj.adminPaymentNotes}
                                        </div>
                                    )}

                                    {/* Assign Staff */}
                                    {!isAssigned && (
                                        <div style={{ marginBottom: '12px' }}>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Assign Accounts Staff</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <select value={selectedStaff[proj._id] || ''} onChange={e => setSelectedStaff(prev => ({ ...prev, [proj._id]: e.target.value }))}
                                                    style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: 'white', outline: 'none' }}>
                                                    <option value=''>Select staff...</option>
                                                    {accountsStaff.map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                                                </select>
                                                <button onClick={() => handleAssignStaff(proj._id)} disabled={!selectedStaff[proj._id] || assigningStaff[proj._id]}
                                                    style={{ padding: '9px 16px', borderRadius: '10px', border: 'none', background: selectedStaff[proj._id] ? '#4f46e5' : '#cbd5e1', color: 'white', fontWeight: 700, fontSize: '13px', cursor: selectedStaff[proj._id] ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                                                    {assigningStaff[proj._id] ? '...' : 'Assign'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Verify Payment */}
                                    {isAssigned && (
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Amount Collected (₹)</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input type='number' placeholder={`e.g. ${proj.advanceAmount || 0}`}
                                                    value={collectedAmounts[proj._id] || ''}
                                                    onChange={e => setCollectedAmounts(prev => ({ ...prev, [proj._id]: e.target.value }))}
                                                    style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', fontWeight: 600, outline: 'none' }} />
                                                <button onClick={() => handleVerifyPayment(proj._id)} disabled={verifyingPayment[proj._id]}
                                                    style={{ padding: '9px 16px', borderRadius: '10px', border: 'none', background: '#10b981', color: 'white', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                                                    {verifyingPayment[proj._id] ? '...' : <><CheckCircle size={14} /> Verify & Release</>}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="stats-grid-6-v2">
                {loading ? (
                    <StatsSkeleton count={6} />
                ) : (
                    <>
                        <StatCardV3 title="Total Revenue" value={formatCurrency(stats?.paidAmount || 0)} subValue="vs last month" icon={IndianRupee} trendValue={stats?.trends?.revenue} iconColor="#10b981" iconBg="#dcfce7" />
                        <StatCardV3 title="Total Expenses" value={formatCurrency(stats?.totalExpenses || 0)} subValue="vs last month" icon={Wallet} trendValue={stats?.trends?.expenses} iconColor="#467dcfff" iconBg="#dbeafe" />
                        <StatCardV3 title="Net Profit" value={formatCurrency((stats?.paidAmount || 0) - (stats?.totalExpenses || 0))} subValue="Net Gain" icon={Briefcase} trendValue={0} iconColor="#f59e0b" iconBg="#fef3c7" />
                        <StatCardV3 title="Outstanding" value={formatCurrency(stats?.pendingAmount || 0)} subValue={`${stats?.pendingInvoices || 0} Invoices`} icon={FileText} trendValue={0} iconColor="#8b5cf6" iconBg="#ede9fe" />
                        <StatCardV3 title="Payables" value={formatCurrency(stats?.outstandingPayablesAmount || 0)} subValue="To Vendors" icon={CreditCard} trendValue={0} iconColor="#ef4444" iconBg="#fee2e2" />
                        <StatCardV3 title="Balance" value={formatCurrency(stats?.cashBalance || 0)} subValue="Available Cash" icon={Building2} trendValue={0} iconColor="#06b6d4" iconBg="#cffafe" />
                    </>
                )}
            </div>

            {/* Middle Section: Visualizations */}
            <div className="charts-grid-3">
                <div className="card-v3 main-chart-card">
                    <div className="card-header-v3">
                        <h3>Cash Flow Projection</h3>
                        <div style={{ position: 'relative' }} ref={datePickerRef}>
                            <button className="date-picker-btn" onMouseDown={(e) => { e.stopPropagation(); setOpenDropdown(prev => prev === 'global' ? null : 'global'); }} style={{ padding: '4px 12px', fontSize: '12px' }}>
                                <Calendar size={14} />
                                {globalFilter.range}
                                <ChevronDown size={14} />
                            </button>
                            {openDropdown === 'global' && (
                                <div className="dropdown-menu-v3" onMouseDown={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 100, padding: '8px', width: '220px' }}>
                                    {!showCustomRange ? (
                                        <>
                                            <div style={{ padding: '4px 12px', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Presets</div>
                                            {['Today', 'Yesterday', 'This Week', 'This Month', 'Last Month'].map(p => (
                                                <div key={p} className="dropdown-item-v3" style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', background: globalFilter.active === p ? '#f1f5f9' : 'transparent' }} onClick={() => handleDateSelect('global', p)}>{p}</div>
                                            ))}
                                            <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }}></div>
                                            <div className="dropdown-item-v3" style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', color: '#6366f1' }} onClick={() => setShowCustomRange(true)}>Custom Range...</div>
                                        </>
                                    ) : (
                                        <div style={{ padding: '4px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Custom Range</span>
                                                <button onClick={() => setShowCustomRange(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={14} /></button>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                                                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                                                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                                            </div>
                                            <button onClick={handleCustomApply} disabled={!customStartDate || !customEndDate} style={{ width: '100%', padding: '8px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Apply</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '220px' }}>
                        {loading ? (
                            <Skeleton width="100%" height="100%" borderRadius="12px" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cashFlowData}>
                                    <defs>
                                        <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Area type="monotone" dataKey="inflow" name="Income" stroke="#10b981" fillOpacity={1} fill="url(#colorInflow)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="outflow" name="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutflow)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="card-v3">
                    <div className="card-header-v3"><h3>Invoice Status</h3></div>
                    <div style={{ height: '220px' }}>
                        {loading ? (
                            <Skeleton width="100%" height="100%" borderRadius="12px" />
                        ) : invoiceStatusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={invoiceStatusData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                                        {invoiceStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>No data</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Activity & Lists */}
            <div className="tables-grid-3">
                {/* Recent Activity Feed */}
                <div className="card-v3">
                    <div className="card-header-v3">
                        <h3><Activity size={16} /> Recent Activity</h3>
                        <a className="view-all-link">View All</a>
                    </div>
                    <div className="activity-feed-list">
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                        <Skeleton width="32px" height="32px" borderRadius="8px" />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <Skeleton width="60%" height="12px" />
                                            <Skeleton width="40%" height="10px" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : activityFeed.length > 0 ? activityFeed.map((activity, i) => (
                            <div className="activity-item" key={activity._id || i}>
                                <div className={`activity-icon ${activity.type.toLowerCase()}`}>
                                    {activity.type === 'Invoice' && <FileText size={14} />}
                                    {activity.type === 'Payment' && <IndianRupee size={14} />}
                                    {activity.type === 'Expense' && <Wallet size={14} />}
                                </div>
                                <div className="activity-content">
                                    <h4 className="activity-title">{activity.title}</h4>
                                    <p className="activity-entity">{activity.entity || 'General'}</p>
                                    <div className="activity-meta">
                                        <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                                        <span className="activity-time">{formatDate(activity.date)}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No recent activity</div>
                        )}
                    </div>
                </div>
 
                {/* Upcoming Dues */}
                <div className="card-v3">
                    <div className="card-header-v3">
                        <h3><Clock size={16} /> Upcoming Dues</h3>
                    </div>
                    <div className="dues-list">
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <Skeleton width="120px" height="12px" />
                                            <Skeleton width="80px" height="10px" />
                                        </div>
                                        <Skeleton width="60px" height="12px" />
                                    </div>
                                ))}
                            </div>
                        ) : upcomingDues.length > 0 ? upcomingDues.map((due, i) => {
                            const urgency = getUrgencyClass(due.dueDate);
                            return (
                                <div className={`due-item ${urgency}`} key={due._id || i}>
                                    <div className="due-info">
                                        <h4>{due.title}</h4>
                                        <p>{due.entity}</p>
                                    </div>
                                    <div className="due-meta">
                                        <span className="due-amount">{formatCurrency(due.amount)}</span>
                                        <span className={`due-date-badge ${urgency}`}>{formatDate(due.dueDate)}</span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>All clear! No upcoming dues.</div>
                        )}
                    </div>
                </div>
 
                {/* Top Clients / Vendors */}
                <div className="card-v3">
                    <div className="card-header-v3">
                        <h3>Top Clients</h3>
                    </div>
                    <div className="top-entities-list">
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <Skeleton width="28px" height="28px" borderRadius="50%" />
                                            <Skeleton width="100px" height="12px" />
                                        </div>
                                        <Skeleton width="60px" height="12px" />
                                    </div>
                                ))}
                            </div>
                        ) : topClients.length > 0 ? topClients.map((client, i) => (
                            <div className="entity-row" key={client._id || i}>
                                <div className="entity-name">
                                    <div className="entity-avatar">{client.name?.charAt(0) || 'C'}</div>
                                    {client.name || 'Unknown Client'}
                                </div>
                                <div className="entity-stats">
                                    <span className="entity-total">{formatCurrency(client.totalRevenue)}</span>
                                    <span className="entity-sub">Revenue</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No client data</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
