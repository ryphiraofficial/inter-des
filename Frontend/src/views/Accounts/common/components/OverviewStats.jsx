import React from 'react';
import { IndianRupee, Wallet, Briefcase, FileText, CreditCard, Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatsSkeleton } from '../../components/UI/Skeleton';

const StatCardV3 = ({ title, value, subValue, icon: Icon, trendValue, iconColor, iconBg }) => {
    const isUp = trendValue > 0;
    const isNeutral = trendValue == 0 || !trendValue;
    const TrendIcon = isNeutral ? null : (isUp ? ArrowUpRight : ArrowDownRight);

    return (
        <div className="stat-card-v3" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="stat-header-v3">
                <div className="stat-icon-v3" style={{ backgroundColor: iconBg, color: iconColor }}>
                    {Icon && <Icon size={18} strokeWidth={2.5} />}
                </div>
                <span className="stat-title-v3">{title}</span>
            </div>
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

    const items = [
        { title: "Total Revenue", value: formatCurrency(stats?.paidAmount), subValue: "vs last month", icon: IndianRupee, trend: stats?.trends?.revenue || 12, color: "#10b981", bg: "#dcfce7" },
        { title: "Total Expenses", value: formatCurrency(stats?.totalExpenses), subValue: "vs last month", icon: Wallet, trend: stats?.trends?.expenses || -4, color: "#467dcfff", bg: "#dbeafe" },
        { title: "Net Profit", value: formatCurrency((stats?.paidAmount || 0) - (stats?.totalExpenses || 0)), subValue: "Net Gain", icon: Briefcase, color: "#f59e0b", bg: "#fef3c7" },
        { title: "Outstanding", value: formatCurrency(stats?.pendingAmount), subValue: `${stats?.pendingInvoices || 0} Invoices`, icon: FileText, color: "#8b5cf6", bg: "#ede9fe" },
        { title: "Payables", value: formatCurrency(stats?.outstandingPayablesAmount), subValue: "To Vendors", icon: CreditCard, color: "#ef4444", bg: "#fee2e2" },
        { title: "Balance", value: formatCurrency(stats?.cashBalance), subValue: "Available Cash", icon: Building2, color: "#06b6d4", bg: "#cffafe" },
    ];

    return (
        <div className="stats-grid-6-v2">
            {items.map((item, i) => <StatCardV3 key={i} {...item} trendValue={item.trend} iconColor={item.color} iconBg={item.bg} />)}
        </div>
    );
};

export default OverviewStats;
