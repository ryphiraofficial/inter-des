import React from 'react';
import '../css/StaffDashboard.css';
import StaffOverview from './StaffOverview';
import SourcingHub from './SourcingHub';
import StaffTasks from './StaffTasks';
import StaffHistory from './StaffHistory';
import StaffVendors from './StaffVendors';
import ProcurementSkeleton from '../manager/ProcurementSkeleton';

// Custom Hooks & Sub-Components
import { useProcurementStaffLogic } from '../hooks/useProcurementStaffLogic';
import TaskDetailsModal from '../components/TaskDetailsModal';
import TimeExtensionModal from '../components/TimeExtensionModal';
import MeetingsPage from '../../common/MeetingsPage';
import StaffReports from '../../common/StaffReports';
import EdgeBandProcurementQueue from '../../design/manager/components/EdgeBandProcurementQueue';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ProcurementStaffDashboard = ({ onLogout }) => {
    const user = useAppSelector(selectUser);
    const {
        activeTab,
        setActiveTab,
        projects,
        vendors,
        purchaseHistory,
        loading,
        searchQuery,
        setSearchQuery,
        vendorSearch,
        setVendorSearch,
        selectedSourcingProject,
        setSelectedSourcingProject,
        sourcingBucket,
        setSourcingBucket,
        savedSourcing,
        sourcingSearch,
        setSourcingSearch,
        dailyUpdate,
        setDailyUpdate,
        showTaskDetailsModal,
        setShowTaskDetailsModal,
        showTimeExtension,
        setShowTimeExtension,
        selectedTask,
        setSelectedTask,
        setSelectedVendor,
        itemsToBuy,
        extensionReason,
        setExtensionReason,
        extensionDate,
        setExtensionDate,
        handleSaveSourcing,
        handleAddToBucket,
        handleRemoveFromBucket,
        handleDeleteSaved,
        handleSearch,
        handleComparePrices,
        handleRequestTimeExtension,
        handleCompleteTask,
        formatCurrency,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        vendorPurchaseCounts,
        vendorStats,
        fetchPurchaseHistory
    } = useProcurementStaffLogic(user);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <StaffOverview 
                        pendingTasks={pendingTasks}
                        inProgressTasks={inProgressTasks}
                        completedTasks={completedTasks}
                        purchaseHistory={purchaseHistory}
                        formatCurrency={formatCurrency}
                        setActiveTab={setActiveTab}
                        loading={loading}
                    />
                );

            case 'sourcing':
                return (
                    <SourcingHub 
                        sourcingSearch={sourcingSearch}
                        setSourcingSearch={setSourcingSearch}
                        selectedSourcingProject={selectedSourcingProject}
                        setSelectedSourcingProject={setSelectedSourcingProject}
                        projects={projects}
                        vendors={vendors}
                        sourcingBucket={sourcingBucket}
                        setSourcingBucket={setSourcingBucket}
                        dailyUpdate={dailyUpdate}
                        setDailyUpdate={setDailyUpdate}
                        savedSourcing={savedSourcing}
                        handleSaveSourcing={handleSaveSourcing}
                        handleAddToBucket={handleAddToBucket}
                        handleRemoveFromBucket={handleRemoveFromBucket}
                        handleDeleteSaved={handleDeleteSaved}
                        loading={loading}
                    />
                );

            case 'tasks':
                return (
                    <StaffTasks 
                        pendingTasks={pendingTasks}
                        inProgressTasks={inProgressTasks}
                        setSelectedTask={setSelectedTask}
                        setShowTaskDetailsModal={setShowTaskDetailsModal}
                        setShowTimeExtension={setShowTimeExtension}
                        loading={loading}
                    />
                );

            case 'history':
                return (
                    <StaffHistory 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearch={handleSearch}
                        vendorStats={vendorStats}
                        formatCurrency={formatCurrency}
                        handleComparePrices={handleComparePrices}
                        itemsToBuy={itemsToBuy}
                        loading={loading}
                    />
                );

            case 'vendors':
                return (
                    <StaffVendors 
                        vendors={vendors}
                        vendorSearch={vendorSearch}
                        setVendorSearch={setVendorSearch}
                        setSelectedVendor={setSelectedVendor}
                        fetchPurchaseHistory={fetchPurchaseHistory}
                        vendorPurchaseCounts={vendorPurchaseCounts}
                        loading={loading}
                    />
                );

            case 'meetings':
                return <MeetingsPage user={user} />;

            case 'reports':
                return <StaffReports />;

            case 'eb_procurement':
                return <EdgeBandProcurementQueue userRole="staff" />;

            default:
                return null;
        }
    };

    return (
        <div className="role-dashboard fade-in">
            <main style={{ flex: 1 }}>
                {renderContent()}
            </main>

            <TaskDetailsModal 
                isOpen={showTaskDetailsModal} 
                onClose={() => setShowTaskDetailsModal(false)} 
                selectedTask={selectedTask} 
                onComplete={handleCompleteTask} 
            />

            <TimeExtensionModal 
                isOpen={showTimeExtension} 
                onClose={() => setShowTimeExtension(false)} 
                extensionDate={extensionDate} 
                setExtensionDate={setExtensionDate} 
                extensionReason={extensionReason} 
                setExtensionReason={setExtensionReason} 
                onSubmit={handleRequestTimeExtension} 
            />
        </div>
    );
};

export default ProcurementStaffDashboard;