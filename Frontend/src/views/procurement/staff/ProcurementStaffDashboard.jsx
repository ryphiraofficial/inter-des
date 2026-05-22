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

const ProcurementStaffDashboard = ({ user, onLogout }) => {
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
        fetchPurchaseHistory
    } = useProcurementStaffLogic(user);

    if (loading) {
        return (
            <div className="role-dashboard fade-in">
                <main style={{ flex: 1 }}>
                    <ProcurementSkeleton role="staff" />
                </main>
            </div>
        );
    }

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
                    />
                );

            case 'history':
                return (
                    <StaffHistory 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearch={handleSearch}
                        vendorStats={[]} // Render list or stats
                        formatCurrency={formatCurrency}
                        handleComparePrices={handleComparePrices}
                        itemsToBuy={itemsToBuy}
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
                    />
                );

            case 'meetings':
                return <MeetingsPage user={user} />;

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