import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, FileText, Package, ShoppingCart, Users, ArrowUpRight, ArrowDownRight, Minus, Activity, Landmark, Palette, PieChart as PieIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { reportAPI, purchaseOrderAPI } from '../../models/api';
import './css/Dashboard.css';
import Skeleton from '../common/Skeleton';



// Modern KPI Card with Sparkline
const KPICard = ({ title, value, icon: Icon, color, bgColor, loading, details = [], trend = null, sparkData = [] }) => {
    if (loading) {
        return (
            <div className="kpi-card loading">
                <div className="kpi-header">
                    <div className="kpi-info">
                        <Skeleton width="80px" height="14px" />
                        <div style={{ marginTop: '12px' }}>
                            <Skeleton width="120px" height="32px" />
                        </div>
                    </div>
                    <Skeleton width="36px" height="36px" borderRadius="10px" />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Skeleton width="100%" height="40px" />
                </div>
                <div className="kpi-details" style={{ borderTop: 'none', marginTop: '15px' }}>
                    <Skeleton width="45%" height="20px" />
                    <Skeleton width="45%" height="20px" />
                </div>
            </div>
        );
    }

    return (
        <div className="kpi-card">
            <div className="kpi-header">
                <div className="kpi-info">
                    <h3 className="kpi-title">{title}</h3>
                    <div className="kpi-value-row">
                        <span className="kpi-value">{value}</span>
                        {trend && (
                            <span className={`kpi-trend ${trend.type}`}>
                                {trend.type === 'positive' && <ArrowUpRight size={14} />}
                                {trend.type === 'negative' && <ArrowDownRight size={14} />}
                                {trend.type === 'neutral' && <Minus size={14} />}
                                {trend.value}
                            </span>
                        )}
                    </div>
                </div>
                <div className="kpi-icon-wrapper" style={{ backgroundColor: bgColor, color: color }}>
                    <Icon size={18} />
                </div>
            </div>

            <div className="kpi-sparkline" style={{ height: '40px', width: '100%', marginTop: '10px' }}>
                {sparkData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparkData}>
                            <defs>
                                <linearGradient id={`colorSpark-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                fill={`url(#colorSpark-${title.replace(/\s+/g, '')})`}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {details.length > 0 && (
                <div className="kpi-details">
                    {details.map((item, index) => (
                        <div key={index} className="kpi-detail-item">
                            <span className="dot" style={{ backgroundColor: item.color }}></span>
                            <span>{item.label}: {item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const RevenueCard = ({ label, value, variant, icon: Icon, loading }) => {
    if (loading) {
        return (
            <div className={`revenue-card ${variant} loading`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Skeleton width="48px" height="48px" borderRadius="12px" />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="120px" height="14px" />
                        <div style={{ marginTop: '10px' }}>
                            <Skeleton width="180px" height="36px" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`revenue-card ${variant}`}>
            <div className="revenue-icon-wrapper">
                <Icon size={24} />
            </div>
            <h3 className="revenue-label">{label}</h3>
            <p className="revenue-value">
                {value}
            </p>
        </div>
    );
};


// Custom Tooltip for Area Chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label} 2025</p>
                <p className="value">₹{payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

// Custom Tooltip for Bar Chart
const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip bar-tooltip">
                <p className="label">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="tooltip-item" style={{ color: entry.color, fontWeight: 'bold' }}>
                        <span>{entry.name}: </span>
                        <span>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// Custom Tooltip for Pie Chart
const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
                <p className="value">{payload[0].value.toLocaleString()}</p>
                {payload[0].payload.percent && (
                    <p className="label">{(payload[0].payload.percent * 100).toFixed(0)}% of total</p>
                )}
            </div>
        );
    }
    return null;
};

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [poStats, setPoStats] = useState({ total: 0, pending: 0, ordered: 0, received: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [quotationData, setQuotationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Mock Sparkline Data
    const sparkData = [
        { value: 40 }, { value: 35 }, { value: 55 }, { value: 45 }, { value: 60 }, { value: 50 }, { value: 75 }
    ];

    useEffect(() => {
        fetchDashboardData();
        // Mock data for the smooth area chart
        setRevenueData([
            { name: 'Jan', value: 46000 },
            { name: 'Feb', value: 48000 },
            { name: 'Mar', value: 55000 },
            { name: 'Apr', value: 42000 },
            { name: 'May', value: 85000 },
            { name: 'Jun', value: 68000 },
            { name: 'Jul', value: 92000 },
        ]);
        // Mock data for Quotation Volume bar chart
        setQuotationData([
            { name: 'Jan', Approved: 12, Pending: 5 },
            { name: 'Feb', Approved: 15, Pending: 8 },
            { name: 'Mar', Approved: 18, Pending: 4 },
            { name: 'Apr', Approved: 10, Pending: 12 },
            { name: 'May', Approved: 25, Pending: 6 },
            { name: 'Jun', Approved: 22, Pending: 3 },
        ]);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardRes, poStatsRes] = await Promise.all([
                reportAPI.getDashboard(),
                purchaseOrderAPI.getStats()
            ]);

            if (dashboardRes.success) setStats(dashboardRes.data);
            if (poStatsRes.success) {
                setPoStats(poStatsRes.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
        return `₹${amount.toLocaleString()}`;
    };

    // Prepare Pie Data
    const quotationPieData = stats ? [
        { name: 'Approved', value: stats.quotations.approved || 0, color: '#10b981' },
        { name: 'Under Review', value: stats.quotations.pending || 0, color: '#f59e0b' }
    ] : [];

    const financialPieData = stats ? [
        { name: 'Generated (Approved)', value: stats.revenue.approved || 0, color: '#10b981' },
        { name: 'Pending (Potential)', value: stats.revenue.potential || 0, color: '#3b82f6' }
    ] : [];

    const inventoryPieData = stats ? [
        { name: 'In Stock', value: stats.inventory.inStock || 0, color: '#10b981' },
        { name: 'Low Stock', value: stats.inventory.lowStock || 0, color: '#f59e0b' },
        { name: 'Out of Stock', value: stats.inventory.outOfStock || 0, color: '#ef4444' }
    ] : [];

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-content">
                <div className="dashboard-greeting">
                    {loading ? (
                        <>
                            <Skeleton width="280px" height="32px" />
                            <div style={{ marginTop: '8px' }}>
                                <Skeleton width="340px" height="16px" />
                            </div>
                        </>
                    ) : (
                        <>
                            <h1>{getGreeting()}, {user?.fullName?.split(' ')[0] || 'Admin'} 👋</h1>
                            <p>Here's your comprehensive business overview.</p>
                        </>
                    )}
                </div>

                {error && (
                    <div className="error-banner">
                        <span>Failed to load some dashboard data: {error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="approval-alert-card skeleton">
                        <Skeleton width="48px" height="48px" borderRadius="12px" />
                        <div style={{ flex: 1, marginLeft: '20px' }}>
                            <Skeleton width="220px" height="18px" />
                            <div style={{ marginTop: '8px' }}>
                                <Skeleton width="400px" height="14px" />
                            </div>
                        </div>
                    </div>
                ) : stats?.tasks?.pendingAdmin > 0 && (
                    <div className="approval-alert-card" onClick={() => navigate('/approvals')} style={{ cursor: 'pointer' }}>
                        <div className="alert-content">
                            <div className="alert-icon-box">
                                <Palette size={20} />
                            </div>
                            <div className="alert-text">
                                <h3>{stats.tasks.pendingAdmin} Designs Awaiting Your Approval</h3>
                                <p>Designs from the studio are ready for final sign-off and procurement push.</p>
                            </div>
                        </div>
                        <div className="alert-action">
                            <span>Review Now</span>
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                )}

                {/* KPI Cards Grid */}
                <div className="stats-grid">
                    <KPICard
                        title="Total Quotations"
                        value={stats?.quotations?.total || 0}
                        icon={FileText}
                        color="#3b82f6"
                        bgColor="#eff6ff"
                        loading={loading}
                        trend={{ type: 'positive', value: '12%' }}
                        sparkData={sparkData}
                        details={[
                            { label: 'Under Review', value: stats?.quotations?.pending || 0, color: '#f59e0b' },
                            { label: 'Approved', value: stats?.quotations?.approved || 0, color: '#10b981' }
                        ]}
                    />
                    <KPICard
                        title="Inventory Items"
                        value={stats?.inventory?.totalCount || 0}
                        icon={Package}
                        color="#8b5cf6"
                        bgColor="#f5f3ff"
                        loading={loading}
                        trend={{ type: 'neutral', value: '0%' }}
                        sparkData={sparkData}
                        details={[
                            { label: 'Low Stock', value: stats?.inventory?.lowStock || 0, color: '#f59e0b' },
                            { label: 'Out of Stock', value: stats?.inventory?.outOfStock || 0, color: '#ef4444' }
                        ]}
                    />
                    <KPICard
                        title="Purchase Orders"
                        value={poStats.total}
                        icon={ShoppingCart}
                        color="#ec4899"
                        bgColor="#fdf2f8"
                        loading={loading}
                        trend={{ type: 'negative', value: '3%' }}
                        sparkData={sparkData}
                        details={[
                            { label: 'Pending', value: poStats.pending, color: '#f59e0b' },
                            { label: 'Received', value: poStats.received, color: '#10b981' }
                        ]}
                    />
                    <KPICard
                        title="Active Clients"
                        value={stats?.clients?.total || 0}
                        icon={Users}
                        color="#0ea5e9"
                        bgColor="#f0f9ff"
                        loading={loading}
                        trend={{ type: 'positive', value: '8%' }}
                        sparkData={sparkData}
                        details={[
                            { label: 'Active', value: stats?.clients?.active || 0, color: '#10b981' },
                            { label: 'New', value: stats?.clients?.new || 0, color: '#0ea5e9' }
                        ]}
                    />
                </div>

                {/* Graphical Analysis Section */}
                <div className="graphical-analysis-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="analysis-card">
                            {loading ? (
                                <>
                                    <div className="analysis-header">
                                        <Skeleton width="40px" height="40px" borderRadius="12px" />
                                        <div style={{ flex: 1 }}>
                                            <Skeleton width="120px" height="16px" />
                                            <div style={{ marginTop: '6px' }}>
                                                <Skeleton width="100px" height="12px" />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                                        <Skeleton width="160px" height="160px" borderRadius="50%" />
                                    </div>
                                    <div style={{ marginTop: 'auto' }}>
                                        <Skeleton width="100%" height="40px" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="analysis-header">
                                        <div className={`analysis-icon ${i === 1 ? 'blue' : i === 2 ? 'green' : 'purple'}`}>
                                            {i === 1 ? <Landmark size={20} /> : i === 2 ? <FileText size={20} /> : <Package size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="analysis-title">{i === 1 ? 'Financial Health' : i === 2 ? 'Quotation Distribution' : 'Inventory Health'}</h3>
                                            <p className="analysis-subtitle">{i === 1 ? 'Generated vs Potential' : i === 2 ? 'Success rate analysis' : 'Stock level monitoring'}</p>
                                        </div>
                                    </div>
                                    <div className="pie-container">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[{ value: 1 }]}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    fill="#f1f5f9"
                                                    stroke="none"
                                                    dataKey="value"
                                                    isAnimationActive={false}
                                                />
                                                <Pie
                                                    data={i === 1 ? financialPieData : i === 2 ? quotationPieData : inventoryPieData}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {(i === 1 ? financialPieData : i === 2 ? quotationPieData : inventoryPieData).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<PieTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="pie-center-label">
                                            <span className="label">{i === 1 ? 'Total Value' : i === 2 ? 'Total Quotes' : 'Total Items'}</span>
                                            <span className="value">
                                                {i === 1 ? formatCurrency((stats?.revenue?.approved || 0) + (stats?.revenue?.potential || 0)) : 
                                                 i === 2 ? (stats?.quotations?.total || 0) : 
                                                 (stats?.inventory?.totalCount || 0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pie-legend">
                                        {(i === 1 ? financialPieData : i === 2 ? quotationPieData : inventoryPieData).map((item, index) => (
                                            <div key={index} className="legend-item">
                                                <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                                                <span className="legend-label">{item.name}</span>
                                                <span className="legend-value">{i === 1 ? formatCurrency(item.value) : item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Main Content Grid with Charts */}
                <div className="dashboard-main-grid">
                    <div className="chart-card">
                        {loading ? (
                            <>
                                <div className="chart-header">
                                    <div style={{ flex: 1 }}>
                                        <Skeleton width="180px" height="20px" />
                                        <div style={{ marginTop: '8px' }}>
                                            <Skeleton width="240px" height="14px" />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: '320px', display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                                    {[1, 2, 3, 4, 5, 6].map(b => (
                                        <Skeleton key={b} width="100%" height={`${Math.random() * 60 + 20}%`} borderRadius="4px" />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="chart-header">
                                    <div>
                                        <h3 className="chart-title">Revenue Trends</h3>
                                        <p className="chart-subtitle">Monthly total generated revenue</p>
                                    </div>
                                    <div className="chart-actions">
                                        <select defaultValue="7">
                                            <option value="7">Last 7 months</option>
                                            <option value="12">Last 12 months</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="area-chart-wrapper" style={{ width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} tickFormatter={(v) => `${v / 1000}k`} />
                                            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                            <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="chart-card">
                        {loading ? (
                            <>
                                <div className="chart-header">
                                    <div style={{ flex: 1 }}>
                                        <Skeleton width="180px" height="20px" />
                                        <div style={{ marginTop: '8px' }}>
                                            <Skeleton width="240px" height="14px" />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: '280px', display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                                    {[1, 2, 3, 4, 5, 6].map(b => (
                                        <Skeleton key={b} width="100%" height={`${Math.random() * 40 + 30}%`} borderRadius="4px" />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="chart-header">
                                    <div>
                                        <h3 className="chart-title">Quotation Volume</h3>
                                        <p className="chart-subtitle">Approved vs Pending targets</p>
                                    </div>
                                    <div className="chart-actions">
                                        <Activity className="chart-icon-accent" size={20} color="#8b5cf6" />
                                    </div>
                                </div>
                                <div className="bar-chart-wrapper" style={{ width: '100%', marginTop: 'auto' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={quotationData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                            <Tooltip content={<BarTooltip />} cursor={{ fill: '#f8fafc' }} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                                            <Bar dataKey="Approved" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                            <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Revenue Highlight Row */}
                <div className="revenue-full-row">
                    <RevenueCard
                        label="Total Earned (Approved)"
                        value={formatCurrency(stats?.revenue?.approved || 0)}
                        variant="green"
                        icon={TrendingUp}
                        loading={loading}
                    />
                    <RevenueCard
                        label="Potential Revenue"
                        value={formatCurrency(stats?.revenue?.potential || 0)}
                        variant="blue"
                        icon={DollarSign}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );

};

export default Dashboard;
