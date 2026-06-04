import React from 'react';
import { Wrench } from 'lucide-react';
import '../css/ManagerDashboard.css';
import { useProductionManagerDashboard } from './hooks/useProductionManagerDashboard';
import PMDashboardSkeleton from './components/ProductionManagerDashboard/PMDashboardSkeleton';
import PMStatsGrid from './components/ProductionManagerDashboard/PMStatsGrid';
import PMPipelineSection from './components/ProductionManagerDashboard/PMPipelineSection';
import PMDashboardSections from './components/ProductionManagerDashboard/PMDashboardSections';
import PMWorkflowActions from './components/ProductionManagerDashboard/PMWorkflowActions';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ProductionManagerDashboard = ({}) => {
    const user = useAppSelector(selectUser);
    const {
        stats,
        projects,
        tasks,
        loading,
        getTaskTypeColor
    } = useProductionManagerDashboard();

    if (loading) {
        return <PMDashboardSkeleton />;
    }

    return (
        <div className="role-dashboard production-manager">
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="role-icon production">
                        <Wrench size={24} />
                    </div>
                    <div>
                        <h1>Project Manager Dashboard</h1>
                        <p>Welcome back, {user?.fullName?.split(' ')[0]}</p>
                    </div>
                </div>
            </div>

            <PMStatsGrid projects={projects} stats={stats} />
            <PMPipelineSection projects={projects} />
            <PMDashboardSections tasks={tasks} getTaskTypeColor={getTaskTypeColor} />
            <PMWorkflowActions />
        </div>
    );
};

export default ProductionManagerDashboard;
