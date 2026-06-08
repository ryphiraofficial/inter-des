import React from 'react';
import { getRoleDepartment } from '../../controllers/hooks/useRoleDashboard';
import { useSalesTasks } from './hooks/useSalesTasks';
import SalesTasksStats from './components/SalesTasksStats';
import SalesTasksGrid from './components/SalesTasksGrid';
import './css/SalesTasks.css';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

const SalesCompletedTasks = ({ forceTable = false }) => {
    const user = useAppSelector(selectUser);
    const department = getRoleDepartment(user?.role);

    if (department === 'Accounts' && !forceTable) {
        // Accounts might have their own completed queue if needed, but for now just show empty or nothing.
        return <div style={{ padding: '24px' }}>No completed accounts view available.</div>;
    }

    const {
        loading,
        filterStatus,
        setFilterStatus,
        updatingTaskId,
        filteredTasks,
        stats,
        handleSalesReview
    } = useSalesTasks('completed');

    return (
        <div className="st-tasks-container">
            <div className="st-tasks-wrapper">
                <SalesTasksStats 
                    loading={loading} 
                    stats={stats} 
                    filterStatus={filterStatus} 
                    setFilterStatus={setFilterStatus} 
                    isCompletedView={true}
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

export default SalesCompletedTasks;
