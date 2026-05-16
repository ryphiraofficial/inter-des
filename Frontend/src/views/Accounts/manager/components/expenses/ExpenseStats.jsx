import React from 'react';
import { Wallet, BarChart3, PieChart as PieIcon, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { StatsSkeleton } from '../../../components/UI/Skeleton';

const ExpenseStats = ({ loading, expenses }) => {
    const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
    
    if (loading) return <StatsSkeleton count={4} />;

    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
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

    const categoryTotals = expenses.reduce((acc, e) => {
        const cat = e.category || 'Misc';
        acc[cat] = (acc[cat] || 0) + e.amount;
        return acc;
    }, {});
    
    const topCategory = Object.keys(categoryTotals).length 
        ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] 
        : ['None', 0];

    const pendingCount = expenses.filter(e => e.status === 'Pending' || e.status === 'Overdue').length;

    const stats = [
        { title: 'Total Expenses', value: formatCurrency(totalExpenses), icon: Wallet, bg: '#e0e7ff', color: '#4f46e5', footer: 'All Time' },
        { title: 'Monthly Spending', value: formatCurrency(currentMonthExpenses), icon: BarChart3, bg: '#ecfdf5', color: '#10b981', trend: monthlyTrend },
        { title: 'Top Category', value: topCategory[0], icon: PieIcon, bg: '#fef3c7', color: '#f59e0b', subtext: `${formatCurrency(topCategory[1])} spent` },
        { title: 'Pending Payments', value: pendingCount, icon: AlertCircle, bg: '#fef2f2', color: '#ef4444', footer: 'Requires attention' }
    ];

    return (
        <div className="kpi-cards-grid">
            {stats.map((s, i) => (
                <div key={i} className="kpi-card">
                    <div className="kpi-card-header">
                        <span className="kpi-title">{s.title}</span>
                        <div className="kpi-icon-wrap" style={{ background: s.bg, color: s.color }}>
                            <s.icon size={18} />
                        </div>
                    </div>
                    <div className="kpi-value">{s.value}</div>
                    <div className="kpi-footer">
                        {s.trend !== undefined ? (
                            <span className={`kpi-trend ${s.trend === 0 ? 'neutral' : (isTrendUp ? 'negative' : 'positive')}`}>
                                {isTrendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {Math.abs(s.trend).toFixed(1)}% vs last month
                            </span>
                        ) : s.subtext ? (
                            <><span style={{ fontWeight: 600, color: '#334155' }}>{s.subtext}</span></>
                        ) : (
                            <span className="kpi-trend neutral">{s.footer}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExpenseStats;
