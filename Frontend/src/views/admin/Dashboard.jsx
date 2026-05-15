import React from 'react';
import { TrendingUp, DollarSign, FileText, Package, ShoppingCart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useDashboardState } from './dashboard/hooks/useDashboardState';
import { useDashboardData } from './dashboard/hooks/useDashboardData';

// Components
import KPICard from './dashboard/components/KPICard';
import RevenueCard from './dashboard/components/RevenueCard';
import ApprovalAlert from './dashboard/components/ApprovalAlert';
import { GraphicalAnalysis, TrendCharts } from './dashboard/components/DashboardCharts';
import Skeleton from './components/Skeleton';

import './css/Dashboard.css';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const state = useDashboardState();
    
    useDashboardData({
        setStats: state.setStats, setPoStats: state.setPoStats,
        setRevenueData: state.setRevenueData, setQuotationData: state.setQuotationData,
        setLoading: state.setLoading, setError: state.setError
    });

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const sparkData = [
        { value: 40 }, { value: 35 }, { value: 55 }, { value: 45 }, { value: 60 }, { value: 50 }, { value: 75 }
    ];

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
        return `₹${amount.toLocaleString()}`;
    };

    // Prepare Pie Data
    const financialPieData = state.stats ? [
        { name: 'Generated (Approved)', value: state.stats.revenue.approved || 0, color: '#10b981' },
        { name: 'Pending (Potential)', value: state.stats.revenue.potential || 0, color: '#3b82f6' }
    ] : [];

    const quotationPieData = state.stats ? [
        { name: 'Approved', value: state.stats.quotations.approved || 0, color: '#10b981' },
        { name: 'Under Review', value: state.stats.quotations.pending || 0, color: '#f59e0b' }
    ] : [];

    const inventoryPieData = state.stats ? [
        { name: 'In Stock', value: state.stats.inventory.inStock || 0, color: '#10b981' },
        { name: 'Low Stock', value: state.stats.inventory.lowStock || 0, color: '#f59e0b' },
        { name: 'Out of Stock', value: state.stats.inventory.outOfStock || 0, color: '#ef4444' }
    ] : [];

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-content">
                <div className="dashboard-greeting">
                    {state.loading ? (
                        <>
                            <Skeleton width="280px" height="32px" />
                            <div style={{ marginTop: '8px' }}><Skeleton width="340px" height="16px" /></div>
                        </>
                    ) : (
                        <>
                            <h1>{getGreeting()}, {user?.fullName?.split(' ')[0] || 'Admin'} 👋</h1>
                            <p>Here's your comprehensive business overview.</p>
                        </>
                    )}
                </div>

                {state.error && <div className="error-banner"><span>Failed to load data: {state.error}</span></div>}

                <ApprovalAlert 
                    count={state.stats?.tasks?.pendingAdmin} 
                    loading={state.loading} 
                    onClick={() => navigate('/approvals')} 
                />

                <div className="stats-grid">
                    <KPICard title="Total Quotations" value={state.stats?.quotations?.total || 0} icon={FileText} color="#3b82f6" bgColor="#eff6ff" loading={state.loading} trend={{ type: 'positive', value: '12%' }} sparkData={sparkData} details={[{ label: 'Under Review', value: state.stats?.quotations?.pending || 0, color: '#f59e0b' }, { label: 'Approved', value: state.stats?.quotations?.approved || 0, color: '#10b981' }]} />
                    <KPICard title="Inventory Items" value={state.stats?.inventory?.totalCount || 0} icon={Package} color="#8b5cf6" bgColor="#f5f3ff" loading={state.loading} trend={{ type: 'neutral', value: '0%' }} sparkData={sparkData} details={[{ label: 'Low Stock', value: state.stats?.inventory?.lowStock || 0, color: '#f59e0b' }, { label: 'Out of Stock', value: state.stats?.inventory?.outOfStock || 0, color: '#ef4444' }]} />
                    <KPICard title="Purchase Orders" value={state.poStats.total} icon={ShoppingCart} color="#ec4899" bgColor="#fdf2f8" loading={state.loading} trend={{ type: 'negative', value: '3%' }} sparkData={sparkData} details={[{ label: 'Pending', value: state.poStats.pending, color: '#f59e0b' }, { label: 'Received', value: state.poStats.received, color: '#10b981' }]} />
                    <KPICard title="Active Clients" value={state.stats?.clients?.total || 0} icon={Users} color="#0ea5e9" bgColor="#f0f9ff" loading={state.loading} trend={{ type: 'positive', value: '8%' }} sparkData={sparkData} details={[{ label: 'Active', value: state.stats?.clients?.active || 0, color: '#10b981' }, { label: 'New', value: state.stats?.clients?.new || 0, color: '#0ea5e9' }]} />
                </div>

                <div className="graphical-analysis-grid">
                    {[1, 2, 3].map(i => (
                        <GraphicalAnalysis key={i} i={i} stats={state.stats} financialPieData={financialPieData} quotationPieData={quotationPieData} inventoryPieData={inventoryPieData} formatCurrency={formatCurrency} loading={state.loading} />
                    ))}
                </div>

                <TrendCharts revenueData={state.revenueData} quotationData={state.quotationData} loading={state.loading} />

                <div className="revenue-full-row">
                    <RevenueCard label="Total Earned (Approved)" value={formatCurrency(state.stats?.revenue?.approved || 0)} variant="green" icon={TrendingUp} loading={state.loading} />
                    <RevenueCard label="Potential Revenue" value={formatCurrency(state.stats?.revenue?.potential || 0)} variant="blue" icon={DollarSign} loading={state.loading} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
