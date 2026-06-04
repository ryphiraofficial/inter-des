import React from 'react';
import { useSiteTasks } from './hooks/useSiteTasks';
import SiteTasksFilters from './components/SiteTasks/SiteTasksFilters';
import SiteTasksList from './components/SiteTasks/SiteTasksList';
import SiteTaskDetail from './components/SiteTasks/SiteTaskDetail';
import './Site.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const SiteTasks = ({ isTransferred }) => {
    const user = useAppSelector(selectUser);
    const {
        filteredTasks,
        loading,
        filters, setFilter,
        showFilters, setShowFilters,
        activeTab, setActiveTab,
        activeFilterCount,
        selected,
        openTask,
        closeTask,
        reloadTasks
    } = useSiteTasks(isTransferred);

    if (selected) {
        return (
            <div className="site-page">
                <SiteTaskDetail 
                    task={selected} 
                    user={user} 
                    onBack={closeTask} 
                    onUpdate={() => { closeTask(); reloadTasks(); }}
                />
            </div>
        );
    }

    return (
        <div className="site-page">
            <SiteTasksFilters 
                activeTab={activeTab} setActiveTab={setActiveTab}
                showFilters={showFilters} setShowFilters={setShowFilters}
                filters={filters} setFilter={setFilter}
                activeFilterCount={activeFilterCount}
            />
            
            <SiteTasksList 
                tasks={filteredTasks} 
                loading={loading} 
                openTask={openTask}
            />
        </div>
    );
};

export default SiteTasks;
