import React from 'react';
import '../css/ManagerDashboard.css';
import Overview from './Overview';
import DesignHandoffs from './DesignHandoffs';
import MaterialRequests from './MaterialRequests';
import Assignments from './Assignments';
import Vendors from './Vendors';
import ProcurementSkeleton from './ProcurementSkeleton';
import MeetingsPage from '../../common/MeetingsPage';
import StaffReports from '../../common/StaffReports';

import { useProcurementManagerLogic } from '../hooks/useProcurementManagerLogic';
import AssignStaffModal from '../components/AssignStaffModal';
import AddVendorModal from '../components/AddVendorModal';
import VendorDetailsModal from '../components/VendorDetailsModal';

const ProcurementManagerDashboard = ({ onLogout }) => {
    const {
        activeTab, stats, staff, vendors, loading,
        showAssignModal, setShowAssignModal, selectedRequest, setSelectedRequest,
        selectedVendorDetail, setSelectedVendorDetail, vendorHistory,
        showAddVendorModal, setShowAddVendorModal, vendorForm, setVendorForm, vendorSaving,
        selectedReviewItem, setSelectedReviewItem,
        handleApproveToAdmin, handleHandoff, handleAssignStaff, handleAddVendor,
        handleViewVendorDetails, addProductRow, removeProductRow, updateProductRow,
        formatCurrency, pendingRequests, pendingReviews, designHandoffs,
        assignedRequests, completedRequests, extensionRequests, navigate
    } = useProcurementManagerLogic();

    if (loading) {
        return (
            <div className="role-dashboard fade-in">
                <main style={{ flex: 1 }}><ProcurementSkeleton role="manager" /></main>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':    return <Overview pendingRequests={pendingRequests} pendingReviews={pendingReviews} designHandoffs={designHandoffs} assignedRequests={assignedRequests} completedRequests={completedRequests} extensionRequests={extensionRequests} materialRequests={pendingRequests} navigate={navigate} />;
            case 'handoffs':    return <DesignHandoffs designHandoffs={designHandoffs} setSelectedRequest={setSelectedRequest} setShowAssignModal={setShowAssignModal} selectedReviewItem={selectedReviewItem} setSelectedReviewItem={setSelectedReviewItem} formatCurrency={formatCurrency} />;
            case 'requests':    return <MaterialRequests pendingRequests={pendingRequests} setSelectedRequest={setSelectedRequest} setShowAssignModal={setShowAssignModal} />;
            case 'assignments': return <Assignments assignedRequests={assignedRequests} pendingReviews={pendingReviews} handleApproveToAdmin={handleApproveToAdmin} />;
            case 'vendors':     return <Vendors vendors={vendors} setShowAddVendorModal={setShowAddVendorModal} handleViewVendorDetails={handleViewVendorDetails} />;
            case 'meetings':    return <MeetingsPage />;
            case 'reports':     return <StaffReports />;
            default:            return null;
        }
    };

    return (
        <div className="role-dashboard fade-in">
            <main style={{ flex: 1 }}>{renderContent()}</main>

            <AssignStaffModal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} selectedRequest={selectedRequest} staff={staff} onAssign={handleAssignStaff} />
            <AddVendorModal isOpen={showAddVendorModal} onClose={() => setShowAddVendorModal(false)} vendorForm={vendorForm} setVendorForm={setVendorForm} vendorSaving={vendorSaving} onSave={handleAddVendor} addProductRow={addProductRow} removeProductRow={removeProductRow} updateProductRow={updateProductRow} />
            <VendorDetailsModal isOpen={!!selectedVendorDetail} onClose={() => setSelectedVendorDetail(null)} vendor={selectedVendorDetail} purchaseHistory={vendorHistory} formatCurrency={formatCurrency} />
        </div>
    );
};

export default ProcurementManagerDashboard;