import React from 'react';
import { getRoleDepartment } from '../../controllers/hooks/useRoleDashboard';
import SalesCollectionQueue from './components/SalesCollectionQueue';
import { useSalesTasks } from './hooks/useSalesTasks';
import SalesTasksStats from './components/SalesTasksStats';
import SalesTasksGrid from './components/SalesTasksGrid';
import './css/SalesTasks.css';

const SalesTasks = ({ user, forceTable = false }) => {
    const department = getRoleDepartment(user?.role);

    if (department === 'Accounts' && !forceTable) {
        return <SalesCollectionQueue user={user} />;
    }

    const {
        loading,
        filterStatus,
        setFilterStatus,
        updatingTaskId,
        filteredTasks,
        stats,
        handleSalesReview
    } = useSalesTasks();

    return (
        <div className="st-tasks-container">
            <div className="st-tasks-wrapper">
                <SalesTasksStats 
                    loading={loading} 
                    stats={stats} 
                    filterStatus={filterStatus} 
                    setFilterStatus={setFilterStatus} 
                />

                <SalesTasksGrid 
                    loading={loading} 
                    filteredTasks={filteredTasks} 
                    handleSalesReview={handleSalesReview} 
                    updatingTaskId={updatingTaskId} 
                />
            </div>
        </div>
    );
};

export default SalesTasks;
