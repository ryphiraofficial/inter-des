import React, { useState, useMemo } from 'react';
import { useOverviewLogic } from '../hooks/useOverviewLogic';

// Sub-components (Local to Accounts)
import CollectionQueue from './components/CollectionQueue';
import OverviewStats from './components/OverviewStats';
import OverviewCharts from './components/OverviewCharts';
import ActivityFeed from './components/ActivityFeed';

import '../css/ManagerDashboard.css';

const Overview = ({ user }) => {
    // Helper for date range (simplified for the main UI file)
    const calculateDateRange = (filterName) => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start: start.toISOString(), end: end.toISOString(), range: 'This Month' };
    };

    const [globalFilter] = useState(calculateDateRange('This Month'));
    const {
        loading, stats, pendingCollections, accountsStaff, selectedStaff, setSelectedStaff,
        assigningStaff, verifyingPayment, collectedAmounts, setCollectedAmounts,
        handleAssignStaff, handleVerifyPayment
    } = useOverviewLogic(globalFilter);

    // Prepare derived chart data
    const invoiceStatusData = useMemo(() => {
        if (!stats?.invoiceStatusCounts) return [];
        const COLOR_MAP = { 'Paid': '#10b981', 'Sent': '#3b82f6', 'Overdue': '#ef4444', 'Unpaid': '#f59e0b' };
        return stats.invoiceStatusCounts.map(item => ({
            name: item._id,
            value: item.count,
            color: COLOR_MAP[item._id] || '#94a3b8'
        }));
    }, [stats]);

    return (
        <div className={`accounts-overview-tab ${loading ? 'is-loading' : ''}`}>
            {/* Payment Collection Queue */}
            <CollectionQueue 
                pendingCollections={pendingCollections}
                accountsStaff={accountsStaff}
                selectedStaff={selectedStaff}
                setSelectedStaff={setSelectedStaff}
                assigningStaff={assigningStaff}
                handleAssignStaff={handleAssignStaff}
                collectedAmounts={collectedAmounts}
                setCollectedAmounts={setCollectedAmounts}
                handleVerifyPayment={handleVerifyPayment}
                verifyingPayment={verifyingPayment}
            />

            {/* Top KPI Stats */}
            <OverviewStats loading={loading} stats={stats} />

            {/* Dashboard Visualizations */}
            <OverviewCharts 
                loading={loading}
                cashFlowData={stats?.cashFlowData || []}
                invoiceStatusData={invoiceStatusData}
            />

            {/* Activity and Lists */}
            <ActivityFeed 
                loading={loading}
                activityFeed={stats?.activityFeed || []}
                upcomingDues={stats?.upcomingDues || []}
            />
        </div>
    );
};

export default Overview;
