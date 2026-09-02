import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie, ComposedChart, Line } from 'recharts';
import { Landmark, FileText, Package, Activity, TrendingUp, Target } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

// Tooltips
export const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ background: '#0f172a', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #334155' }}>
                <p className="label" style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{label} Performance</p>
                <p className="value" style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>₹{payload[0].value.toLocaleString('en-IN')}</p>
            </div>
        );
    }
    return null;
};

export const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip bar-tooltip" style={{ background: '#0f172a', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #334155' }}>
                <p className="label" style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{label} Quotations</p>
                {payload.map((entry, index) => (
                    <div key={index} className="tooltip-item" style={{ color: entry.color, fontWeight: 700, fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                        <span>{entry.name}:</span>
                        <span>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ background: '#0f172a', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #334155' }}>
                <p className="label" style={{ margin: 0, color: payload[0].payload.fill, fontWeight: 800 }}>{payload[0].name}</p>
                <p className="value" style={{ margin: '4px 0 0', fontSize: '1rem', fontWeight: 700 }}>{typeof payload[0].value === 'number' && payload[0].value > 1000 ? `₹${payload[0].value.toLocaleString('en-IN')}` : payload[0].value}</p>
            </div>
        );
    }
    return null;
};

export const GraphicalAnalysis = ({ i, stats, financialPieData, quotationPieData, inventoryPieData, formatCurrency, loading }) => {
    if (loading) {
        return (
            <div className="analysis-card" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <div className="analysis-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Skeleton width="38px" height="38px" borderRadius="10px" />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="120px" height="16px" />
                        <div style={{ marginTop: '6px' }}>
                            <Skeleton width="100px" height="12px" />
                        </div>
                    </div>
                </div>
                <div style={{ height: '180px', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Skeleton width="130px" height="130px" borderRadius="50%" />
                </div>
            </div>
        );
    }

    const data = i === 1 ? financialPieData : i === 2 ? quotationPieData : inventoryPieData;
    const title = i === 1 ? 'Financial Distribution' : i === 2 ? 'Quotation Status' : 'Inventory Health';
    const subtitle = i === 1 ? 'Approved vs Potential Revenue' : i === 2 ? 'Success rate & review pipeline' : 'Stock availability status';
    const Icon = i === 1 ? Landmark : i === 2 ? FileText : Package;
    const iconColor = i === 1 ? '#10b981' : i === 2 ? '#3b82f6' : '#8b5cf6';
    const iconBg = i === 1 ? '#f0fdf4' : i === 2 ? '#eff6ff' : '#f5f3ff';

    const totalValue = i === 1 
        ? formatCurrency((stats?.revenue?.approved || 0) + (stats?.revenue?.potential || 0))
        : i === 2 ? (stats?.quotations?.total || 0) : (stats?.inventory?.totalCount || 0);

    const totalLabel = i === 1 ? 'Total Value' : i === 2 ? 'Total Quotes' : 'Total Items';

    return (
        <div className="analysis-card" style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div className="analysis-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="analysis-icon" style={{ backgroundColor: iconBg, color: iconColor, width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} />
                </div>
                <div>
                    <h3 className="analysis-title" style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h3>
                    <p className="analysis-subtitle" style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>{subtitle}</p>
                </div>
            </div>

            {/* Donut Chart with Center Number Overlay */}
            <div style={{ position: 'relative', height: '190px', width: '100%', margin: '4px 0' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={56}
                            outerRadius={76}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Centered Total Value Inside Donut */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none'
                }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{totalLabel}</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>{totalValue}</span>
                </div>
            </div>

            {/* Clean Legend Below Donut */}
            <div className="pie-legend-custom" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                {data.map((item, index) => (
                    <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <div className="legend-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0, display: 'inline-block' }} />
                            <span className="name" style={{ color: '#475569', fontWeight: 500 }}>{item.name}</span>
                        </div>
                        <span className="val" style={{ fontWeight: 700, color: '#0f172a' }}>{typeof item.value === 'number' && item.value > 1000 ? formatCurrency(item.value) : item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TrendCharts = ({ revenueData, quotationData, loading }) => {
    if (loading) {
        return (
            <div className="dashboard-main-grid">
                {[1, 2].map(i => (
                    <div key={i} className="chart-card">
                        <div className="chart-header">
                            <div style={{ flex: 1 }}>
                                <Skeleton width="180px" height="20px" />
                                <div style={{ marginTop: '8px' }}><Skeleton width="240px" height="14px" /></div>
                            </div>
                        </div>
                        <div style={{ height: i === 1 ? '320px' : '280px', display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                            {[1, 2, 3, 4, 5, 6].map(b => (
                                <Skeleton key={b} width="100%" height={`${Math.random() * 50 + 20}%`} borderRadius="4px" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const enhancedQuotationData = quotationData.map(q => ({
        ...q,
        Total: (q.Approved || 0) + (q.Pending || 0)
    }));

    return (
        <div className="dashboard-main-grid">
            {/* 1. Composed Gradient Bar + Spline Trend Line Chart for Revenue */}
            <div className="chart-card">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <TrendingUp size={18} color="#0ea5e9" /> Revenue Trajectory
                        </h3>
                        <p className="chart-subtitle">Monthly volume bars with curved revenue growth trendline</p>
                    </div>
                    <div className="chart-actions">
                        <select defaultValue="7"><option value="7">Last 7 months</option><option value="12">Last 12 months</option></select>
                    </div>
                </div>
                <div className="area-chart-wrapper" style={{ width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <ComposedChart data={revenueData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#0284c7" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                            <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3.5} dot={{ r: 4, fill: '#ffffff', stroke: '#0ea5e9', strokeWidth: 3 }} activeDot={{ r: 7, fill: '#0ea5e9', stroke: '#ffffff', strokeWidth: 3 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Stacked Rounded Bar + Target Line Chart for Quotations */}
            <div className="chart-card">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Target size={18} color="#8b5cf6" /> Quotation Stacked Volume
                        </h3>
                        <p className="chart-subtitle">Stacked approved vs pending review with total target line</p>
                    </div>
                    <div className="chart-actions">
                        <Activity className="chart-icon-accent" size={20} color="#8b5cf6" />
                    </div>
                </div>
                <div className="bar-chart-wrapper" style={{ width: '100%', marginTop: 'auto' }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <ComposedChart data={enhancedQuotationData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip content={<BarTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '15px' }} />
                            <Bar dataKey="Approved" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={28} />
                            <Bar dataKey="Pending" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={28} />
                            <Line type="monotone" dataKey="Total" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3, fill: '#8b5cf6' }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
