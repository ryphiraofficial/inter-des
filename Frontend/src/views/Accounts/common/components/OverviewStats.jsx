import React from 'react';
import { IndianRupee, Wallet, Briefcase, FileText, CreditCard, Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatsSkeleton } from '../../components/UI/Skeleton';

const StatCardV3 = ({ title, value, subValue, icon: Icon, trendValue, iconColor, iconBg, sparkData }) => {
    const isUp = trendValue > 0;
    const isNeutral = trendValue == 0 || !trendValue;
    const TrendIcon = isNeutral ? null : (isUp ? ArrowUpRight : ArrowDownRight);

    // Simple SVG sparkline generator
    const generateSparkline = (data) => {
        if (!data || data.length === 0) return null;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const height = 30;
        const width = 100;
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((d - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <div style={{ position: 'absolute', right: '16px', top: '16px', opacity: 0.8 }}>
                <svg width="80" height="30" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <polyline fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
                    <polyline fill="none" stroke={iconColor} strokeWidth="2" strokeOpacity="0.2" points={`0,30 ${points} 100,30`} />
                </svg>
            </div>
        );
    };

    return (
        <div className="stat-card-v3" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="stat-header-v3">
                <div className="stat-icon-v3" style={{ backgroundColor: iconBg, color: iconColor }}>
                    {Icon && <Icon size={18} strokeWidth={2.5} />}
                </div>
                <span className="stat-title-v3">{title}</span>
            </div>
            {generateSparkline(sparkData)}
            <div className="stat-value-v3" style={{ marginTop: '4px' }}>{value}</div>
            <div className="stat-footer-v3">
                {!isNeutral && <span className={isUp ? 'trend-up-v3' : 'trend-down-v3'}><TrendIcon size={14} /> {Math.abs(trendValue)}%</span>}
                <span className="stat-subtext-v3" style={{marginLeft: isNeutral ? 0 : '6px'}}>{subValue}</span>
            </div>
        </div>
    );
};

const OverviewStats = ({ loading, stats }) => {
    if (loading) return <StatsSkeleton count={6} />;

    const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

    const mockSparkData1 = [40, 35, 50, 45, 60, 55, 75];
    const mockSparkData2 = [60, 50, 40, 55, 45, 30, 20];
    const mockSparkData3 = [20, 30, 25, 40, 35, 50, 60];
    const mockSparkData4 = [10, 15, 12, 8, 14, 18, 20];

    const items = [
        { title: "Total Revenue", value: formatCurrency(stats?.paidAmount), subValue: "vs last month", icon: IndianRupee, trend: stats?.trends?.revenue || 12, color: "#10b981", bg: "#dcfce7", sparkData: mockSparkData1 },
        { title: "Total Expenses", value: formatCurrency(stats?.totalExpenses), subValue: "vs last month", icon: Wallet, trend: stats?.trends?.expenses || -4, color: "#467dcfff", bg: "#dbeafe", sparkData: mockSparkData2 },
        { title: "Net Profit", value: formatCurrency((stats?.paidAmount || 0) - (stats?.totalExpenses || 0)), subValue: "Net Gain", icon: Briefcase, color: "#f59e0b", bg: "#fef3c7", sparkData: mockSparkData3 },
        { title: "Outstanding", value: formatCurrency(stats?.pendingAmount), subValue: `${stats?.pendingInvoices || 0} Invoices`, icon: FileText, color: "#8b5cf6", bg: "#ede9fe", sparkData: mockSparkData4 },
        { title: "Payables", value: formatCurrency(stats?.outstandingPayablesAmount), subValue: "To Vendors", icon: CreditCard, color: "#ef4444", bg: "#fee2e2", sparkData: mockSparkData2 },
        { title: "Balance", value: formatCurrency(stats?.cashBalance), subValue: "Available Cash", icon: Building2, color: "#06b6d4", bg: "#cffafe", sparkData: mockSparkData1 },
    ];

    return (
        <div className="stats-grid-6-v2">
            {items.map((item, i) => <StatCardV3 key={i} {...item} trendValue={item.trend} iconColor={item.color} iconBg={item.bg} sparkData={item.sparkData} />)}
        </div>
    );
};

export default OverviewStats;
