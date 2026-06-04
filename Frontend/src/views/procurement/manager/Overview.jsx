import React from 'react';
import OverviewStats from './components/OverviewStats';
import OverviewCharts from './components/OverviewCharts';
import OverviewLists from './components/OverviewLists';
import '../css/ProcurementPremium.css';

const Overview = ({ pendingRequests, pendingReviews = [], designHandoffs, assignedRequests, completedRequests, extensionRequests, materialRequests, navigate }) => {
    const chartData = [
        { name: 'Pending', value: pendingRequests.length + designHandoffs.length, color: '#1c1917' },
        { name: 'Active', value: assignedRequests.length, color: '#78716c' },
        { name: 'Completed', value: completedRequests.length, color: '#e7e5e4' }
    ];

    const performanceData = [
        { day: 'Mon', count: 4 },
        { day: 'Tue', count: 7 },
        { day: 'Wed', count: 5 },
        { day: 'Thu', count: 9 },
        { day: 'Fri', count: 12 },
        { day: 'Sat', count: 6 },
        { day: 'Sun', count: 3 }
    ];

    return (
        <div className="procurement-premium-wrapper fade-in">
            <OverviewStats 
                pendingReviews={pendingReviews}
                assignedRequests={assignedRequests}
                completedRequests={completedRequests}
                extensionRequests={extensionRequests}
                performanceData={performanceData}
            />

            <OverviewCharts 
                performanceData={performanceData}
                chartData={chartData}
                materialRequests={materialRequests}
            />

            <OverviewLists 
                pendingReviews={pendingReviews}
                designHandoffs={designHandoffs}
                pendingRequests={pendingRequests}
                navigate={navigate}
            />
        </div>
    );
};

export default Overview;
