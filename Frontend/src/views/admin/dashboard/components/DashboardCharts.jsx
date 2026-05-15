import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { Landmark, FileText, Package, Activity } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

// Tooltips
export const CustomTooltip = ({ active, payload, label }) => {
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

export const BarTooltip = ({ active, payload, label }) => {
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

export const PieTooltip = ({ active, payload }) => {
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

export const GraphicalAnalysis = ({ i, stats, financialPieData, quotationPieData, inventoryPieData, formatCurrency, loading }) => {
    if (loading) {
        return (
            <div className="analysis-card">
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
            </div>
        );
    }

    const data = i === 1 ? financialPieData : i === 2 ? quotationPieData : inventoryPieData;
    const title = i === 1 ? 'Financial Health' : i === 2 ? 'Quotation Distribution' : 'Inventory Health';
    const subtitle = i === 1 ? 'Generated vs Potential' : i === 2 ? 'Success rate analysis' : 'Stock level monitoring';
    const Icon = i === 1 ? Landmark : i === 2 ? FileText : Package;
    const variant = i === 1 ? 'blue' : i === 2 ? 'green' : 'purple';

    const totalValue = i === 1 
        ? formatCurrency((stats?.revenue?.approved || 0) + (stats?.revenue?.potential || 0))
        : i === 2 ? (stats?.quotations?.total || 0) : (stats?.inventory?.totalCount || 0);

    const totalLabel = i === 1 ? 'Total Value' : i === 2 ? 'Total Quotes' : 'Total Items';

    return (
        <div className="analysis-card">
            <div className="analysis-header">
                <div className={`analysis-icon ${variant}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="analysis-title">{title}</h3>
                    <p className="analysis-subtitle">{subtitle}</p>
                </div>
            </div>
            <div className="pie-container">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={[{ value: 1 }]} innerRadius={60} outerRadius={80} fill="#f1f5f9" stroke="none" dataKey="value" isAnimationActive={false} />
                        <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="pie-center-label">
                    <span className="label">{totalLabel}</span>
                    <span className="value">{totalValue}</span>
                </div>
            </div>
            <div className="pie-legend">
                {data.map((item, index) => (
                    <div key={index} className="legend-item">
                        <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                        <span className="legend-label">{item.name}</span>
                        <span className="legend-value">{i === 1 ? formatCurrency(item.value) : item.value}</span>
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

    return (
        <div className="dashboard-main-grid">
            <div className="chart-card">
                <div className="chart-header">
                    <div><h3 className="chart-title">Revenue Trends</h3><p className="chart-subtitle">Monthly total generated revenue</p></div>
                    <div className="chart-actions"><select defaultValue="7"><option value="7">Last 7 months</option><option value="12">Last 12 months</option></select></div>
                </div>
                <div className="area-chart-wrapper" style={{ width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
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
            </div>

            <div className="chart-card">
                <div className="chart-header">
                    <div><h3 className="chart-title">Quotation Volume</h3><p className="chart-subtitle">Approved vs Pending targets</p></div>
                    <div className="chart-actions"><Activity className="chart-icon-accent" size={20} color="#8b5cf6" /></div>
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
            </div>
        </div>
    );
};
