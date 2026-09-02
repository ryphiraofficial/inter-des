import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, Package, Users, TrendingUp, DollarSign, 
    ShoppingCart, RefreshCw, Calendar, ShieldCheck
} from 'lucide-react';

import { useDashboardState } from './dashboard/hooks/useDashboardState';
import { useDashboardData } from './dashboard/hooks/useDashboardData';

import KPICard from './dashboard/components/KPICard';
import RevenueCard from './dashboard/components/RevenueCard';
import { GraphicalAnalysis, TrendCharts } from './dashboard/components/DashboardCharts';
import ApprovalAlert from './dashboard/components/ApprovalAlert';
import { StatsSkeleton } from './components/Skeleton';

import './css/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const state = useDashboardState();
    
    const { fetchDashboardData } = useDashboardData({
        setStats: state.setStats,
        setRevenueData: state.setRevenueData,
        setQuotationData: state.setQuotationData,
        setPoStats: state.setPoStats,
        setLoading: state.setLoading,
        setError: state.setError
    });

    const sparkData = [20, 35, 25, 45, 30, 55, 40, 60, 50, 75];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const financialPieData = state.stats ? [
        { name: 'Collected (Realized)', value: state.stats.revenue.approved || 0, color: '#10b981' },
        { name: 'Pending Collection', value: state.stats.revenue.pending || 0, color: '#f59e0b' }
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
            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Executive Clean Header Bar */}
                <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Executive Control Panel
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ShieldCheck size={14} color="#10b981" /> System Operational
                            </span>
                        </div>
                        <h1 style={{ margin: '6px 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                            Business Performance & Operations Overview
                        </h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#6366f1" /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <button
                            onClick={fetchDashboardData}
                            style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s' }}
                        >
                            <RefreshCw size={13} className={state.loading ? 'spin' : ''} /> Sync Data
                        </button>
                    </div>
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
