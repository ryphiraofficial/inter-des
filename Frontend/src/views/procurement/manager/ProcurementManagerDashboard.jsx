import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import '../css/ManagerDashboard.css';
import Overview from './Overview';
import DesignHandoffs from './DesignHandoffs';
import MaterialRequests from './MaterialRequests';
import Assignments from './Assignments';
import Vendors from './Vendors';
import ProcurementSkeleton from './ProcurementSkeleton';

// Custom Hooks & Sub-Components
import { useProcurementManagerLogic } from '../hooks/useProcurementManagerLogic';
import AssignStaffModal from '../components/AssignStaffModal';
import AddVendorModal from '../components/AddVendorModal';
import VendorDetailsModal from '../components/VendorDetailsModal';

const ProcurementManagerDashboard = ({ user, onLogout }) => {
    const {
        activeTab,
        stats,
        staff,
        vendors,
        loading,
        showAssignModal,
        setShowAssignModal,
        selectedRequest,
        setSelectedRequest,
        selectedVendorDetail,
        setSelectedVendorDetail,
        vendorHistory,
        showAddVendorModal,
        setShowAddVendorModal,
        vendorForm,
        setVendorForm,
        vendorSaving,
        selectedReviewItem,
        setSelectedReviewItem,
        handleApproveToAdmin,
        handleHandoff,
        handleAssignStaff,
        handleAddVendor,
        handleViewVendorDetails,
        addProductRow,
        removeProductRow,
        updateProductRow,
        formatCurrency,
        pendingRequests,
        pendingReviews,
        designHandoffs,
        assignedRequests,
        completedRequests,
        extensionRequests,
        navigate
    } = useProcurementManagerLogic();

    if (loading) {
        return (
            <div className="role-dashboard fade-in">
                <main style={{ flex: 1 }}>
                    <ProcurementSkeleton role="manager" />
                </main>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview 
                    pendingRequests={pendingRequests} 
                    pendingReviews={pendingReviews}
                    designHandoffs={designHandoffs} 
                    assignedRequests={assignedRequests} 
                    completedRequests={completedRequests} 
                    extensionRequests={extensionRequests} 
                    materialRequests={pendingRequests} // Maintain the design specs
                    navigate={navigate} 
                />;

            case 'handoffs':
                return <DesignHandoffs 
                    designHandoffs={designHandoffs} 
                    setSelectedRequest={setSelectedRequest} 
                    setShowAssignModal={setShowAssignModal} 
                    selectedReviewItem={selectedReviewItem} 
                    setSelectedReviewItem={setSelectedReviewItem} 
                    formatCurrency={formatCurrency} 
                />;

            case 'requests':
                return <MaterialRequests 
                    pendingRequests={pendingRequests} 
                    setSelectedRequest={setSelectedRequest} 
                    setShowAssignModal={setShowAssignModal} 
                />;

            case 'assignments':
                return <Assignments 
                    assignedRequests={assignedRequests} 
                    pendingReviews={pendingReviews} // Maintain assignment review lists
                    handleApproveToAdmin={handleApproveToAdmin}
                />;

            case 'vendors':
                return <Vendors 
                    vendors={vendors} 
                    setShowAddVendorModal={setShowAddVendorModal} 
                    handleViewVendorDetails={handleViewVendorDetails} 
                />;

            case 'completed':
                return (
                    <div className="procurement-premium-wrapper">
                        <div className="premium-banner">
                            <h1 className="banner-title">Completed & Handoff</h1>
                            <p className="banner-subtitle">Finalize procurement and transition projects to Production phase.</p>
                        </div>
                        <div className="premium-list-grid" style={{ gridTemplateColumns: '1fr' }}>
                            <div className="list-panel">
                                <div className="chart-header">
                                    <h4 className="chart-title">Completed Requests ({completedRequests.length})</h4>
                                </div>
                                <div className="completed-list">
                                    {completedRequests.map(req => (
                                        <div key={req._id} className="list-item-modern">
                                            <div className="item-icon-box" style={{ background: '#f0fdf4' }}>
                                                <CheckCircle size={18} color="#10b981" />
                                            </div>
                                            <div className="item-details">
                                                <div className="item-title">{req.requestNumber}</div>
                                                <div className="item-subtitle">{req.project?.name} • Ready for Production</div>
                                            </div>
                                            <button 
                                                className="btn-add" 
                                                onClick={() => handleHandoff(req)}
                                                style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#0ea5e9', color: 'white' }}
                                            >
                                                Handoff to Production <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {completedRequests.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                            No completed requests waiting for handoff.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="role-dashboard fade-in">
            <main style={{ flex: 1 }}>
                {renderContent()}
            </main>

            <AssignStaffModal 
                isOpen={showAssignModal} 
                onClose={() => setShowAssignModal(false)} 
                selectedRequest={selectedRequest} 
                staff={staff} 
                onAssign={handleAssignStaff} 
            />

            <AddVendorModal 
                isOpen={showAddVendorModal} 
                onClose={() => setShowAddVendorModal(false)} 
                vendorForm={vendorForm} 
                setVendorForm={setVendorForm} 
                vendorSaving={vendorSaving} 
                onSave={handleAddVendor} 
                addProductRow={addProductRow} 
                removeProductRow={removeProductRow} 
                updateProductRow={updateProductRow} 
            />

            <VendorDetailsModal 
                isOpen={!!selectedVendorDetail} 
                onClose={() => setSelectedVendorDetail(null)} 
                vendor={selectedVendorDetail} 
                purchaseHistory={vendorHistory} 
                formatCurrency={formatCurrency} 
            />
        </div>
    );
};

export default ProcurementManagerDashboard;