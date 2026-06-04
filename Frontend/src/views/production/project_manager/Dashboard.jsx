import React from 'react';
import { Target, Wallet, PieChart as PieChartIcon, GanttChart } from 'lucide-react';
import '../css/ProductionManagement.css';
import '../css/PMAnalytics.css';
import PMCharts from './PMCharts';
import KPIDashboard from './KPIDashboard';
import BudgetTracker from './BudgetTracker';
import GanttView from './GanttView';
import { useDashboard } from './hooks/useDashboard';
import DashboardTabs from './components/Dashboard/DashboardTabs';
import StatCards from './components/Dashboard/StatCards';
import ProjectProgress from './components/Dashboard/ProjectProgress';
import RecentActivity from './components/Dashboard/RecentActivity';
import TeamWorkload from './components/Dashboard/TeamWorkload';
import UpcomingDeadlines from './components/Dashboard/UpcomingDeadlines';
import BudgetOverview from './components/Dashboard/BudgetOverview';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: PieChartIcon },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'gantt', label: 'Gantt Chart', icon: GanttChart },
];

const Dashboard = () => {
    const {
        loading,
        activeTab, setActiveTab,
        data,
        teamWorkload,
        deadlines,
        budgetData,
        budgetPercent,
        chartData,
        kpiData,
        budgetAnalytics,
        ganttData
    } = useDashboard();

    if (loading) {
        return (
            <div className="production-management pm-dashboard">
                <div className="pm-skeleton-block" style={{ height: '54px', marginBottom: '1rem' }} />
                <div className="pm-stats-grid">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div className="pm-stat-card-v2" key={idx}>
                            <div className="pm-stat-card-header"><div className="pm-skeleton-circle" /></div>
                            <div className="pm-skeleton-line" style={{ width: '45%', height: '28px', marginBottom: '10px' }} />
                            <div className="pm-skeleton-line" style={{ width: '72%' }} />
                        </div>
                    ))}
                </div>
                <div className="pm-main-grid">
                    <div className="pm-skeleton-block" style={{ height: '320px' }} />
                    <div className="pm-skeleton-block" style={{ height: '320px' }} />
                </div>
                <div className="pm-bottom-grid">
                    <div className="pm-skeleton-block" style={{ height: '260px' }} />
                    <div className="pm-skeleton-block" style={{ height: '260px' }} />
                    <div className="pm-skeleton-block" style={{ height: '260px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="production-management pm-dashboard">
            <DashboardTabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} chartData={chartData} />

            {activeTab === 'overview' && (
                <>
                    <StatCards data={data} teamWorkload={teamWorkload} budgetPercent={budgetPercent} />
                    <div className="pm-main-grid">
                        <ProjectProgress projects={data.projects} />
                        <RecentActivity recentActivity={data.recentActivity} />
                    </div>
                    <div className="pm-bottom-grid">
                        <TeamWorkload teamWorkload={teamWorkload} />
                        <UpcomingDeadlines deadlines={deadlines} />
                        <BudgetOverview budgetData={budgetData} budgetPercent={budgetPercent} />
                    </div>
                </>
            )}

            {activeTab === 'analytics' && (
                <>
                    <KPIDashboard kpiData={kpiData} />
                    <PMCharts chartData={chartData} />
                </>
            )}

            {activeTab === 'budget' && (
                <BudgetTracker budgetData={budgetAnalytics} />
            )}

            {activeTab === 'gantt' && (
                <GanttView ganttData={ganttData} projects={data.projects} />
            )}
        </div>
    );
};

export default Dashboard;
