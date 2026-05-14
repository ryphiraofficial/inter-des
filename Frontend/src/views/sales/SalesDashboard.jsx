import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SalesDashboard.css';

import { useSalesDashboardData } from './hooks/useSalesDashboardData';
import SalesStatsGrid from './components/SalesStatsGrid';
import SalesApprovalsCard from './components/SalesApprovalsCard';
import DesignPreviewModal from './components/DesignPreviewModal';
import SalesVisitsGallery from './components/SalesVisitsGallery';
import SalesUrgentTasks from './components/SalesUrgentTasks';
import SalesActivityFeed from './components/SalesActivityFeed';
import SalesRecentQuotations from './components/SalesRecentQuotations';
import SalesMonthlyTarget from './components/SalesMonthlyTarget';
import SalesQuickActions from './components/SalesQuickActions';

const SalesDashboard = ({ user }) => {
    const navigate = useNavigate();
    
    // Custom Hook to handle all data fetching and state
    const {
        stats,
        urgentTasks,
        pendingReviews,
        recentVisits,
        recentQuotations,
        loading
    } = useSalesDashboardData(user);

    const [selectedTask, setSelectedTask] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const handlePreviewTask = (task) => {
        setSelectedTask(task);
        setShowViewModal(true);
    };

    return (
        <div className="staff-dashboard">

            {/* ── Top Stats Grid ── */}
            <SalesStatsGrid 
                stats={stats} 
                pendingReviews={pendingReviews} 
                loading={loading} 
            />

            {/* ── Bento Grid Layout ── */}
            <div className="dashboard-bento">
                {/* Left Column (Main Content) */}
                <div className="bento-col">
                    
                    {user?.role === 'Sales' && (
                        <SalesApprovalsCard 
                            pendingReviews={pendingReviews}
                            loading={loading}
                            navigate={navigate}
                            onPreviewTask={handlePreviewTask}
                        />
                    )}

                    <SalesMonthlyTarget loading={loading} />

                    <SalesVisitsGallery 
                        recentVisits={recentVisits} 
                        loading={loading} 
                        navigate={navigate} 
                    />

                    <SalesQuickActions navigate={navigate} />

                </div>

                {/* Right Column (Side Content) */}
                <div className="bento-col">
                    
                    <SalesUrgentTasks 
                        urgentTasks={urgentTasks} 
                        loading={loading} 
                        navigate={navigate} 
                    />

                    <SalesActivityFeed 
                        recentVisits={recentVisits} 
                        urgentTasks={urgentTasks} 
                        loading={loading} 
                    />

                    <SalesRecentQuotations 
                        recentQuotations={recentQuotations} 
                        loading={loading} 
                        navigate={navigate} 
                    />

                </div>
            </div>

            {/* ── DESIGN PREVIEW MODAL ── */}
            {showViewModal && selectedTask && (
                <DesignPreviewModal 
                    selectedTask={selectedTask}
                    onClose={() => setShowViewModal(false)}
                />
            )}
        </div>
    );
};

export default SalesDashboard;
