import React from 'react';
import { Clock, FileText, Users, AlertCircle } from 'lucide-react';
import '../css/ProductionManagement.css';
import LeaveApprovals from './components/Approvals/LeaveApprovals';
import { useApprovals } from './hooks/useApprovals';
import ApprovalsToolbar from './components/Approvals/ApprovalsToolbar';
import GeneralApprovalsTable from './components/Approvals/GeneralApprovalsTable';
import StaffRequestsTable from './components/Approvals/StaffRequestsTable';
import CreateApprovalModal from './components/Approvals/CreateApprovalModal';

const Approvals = () => {
    const {
        activeTab, setActiveTab,
        loading, error,
        filterStatus, setFilterStatus,
        isModalOpen, setIsModalOpen,
        filtersOpen, setFiltersOpen,
        expandedRow, toggleRow,
        newRequest, setNewRequest,
        filteredApprovals,
        handleCreateRequest,
        handleUpdateStatus,
        handleActionStaffRequest
    } = useApprovals();

    return (
        <div className="pm-dashboard">
            <ApprovalsToolbar 
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                setIsModalOpen={setIsModalOpen}
            />

            {/* Sub-tabs */}
            <div className="pm-approvals-tabs">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`pm-approvals-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                >
                    <FileText size={18} /> <span>General Approvals</span>
                </button>
                <button 
                    onClick={() => setActiveTab('staff')}
                    className={`pm-approvals-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
                >
                    <Users size={18} /> <span>Staff Replacements</span>
                </button>
                <button 
                    onClick={() => setActiveTab('leaves')}
                    className={`pm-approvals-tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
                >
                    <Clock size={18} /> <span>Team Leaves</span>
                </button>
            </div>

            {error && <div className="pm-error-message">{error}</div>}

            <div className={activeTab !== 'leaves' ? "pm-card" : ""} style={{ padding: 0, overflow: 'hidden', border: activeTab === 'leaves' ? 'none' : undefined, background: activeTab === 'leaves' ? 'transparent' : undefined, boxShadow: activeTab === 'leaves' ? 'none' : undefined }}>
                {loading && activeTab !== 'leaves' ? (
                    <div className="pm-table-container">
                        <table className="pm-table">
                            <thead>
                                <tr>
                                    <th>Request Details</th>
                                    <th className="pm-desktop-only">Project</th>
                                    <th className="pm-desktop-only">Submitted By</th>
                                    <th className="pm-desktop-only">Stage / Value</th>
                                    <th>Status</th>
                                    <th className="pm-desktop-only" style={{ textAlign: 'right' }}>Actions</th>
                                    <th className="pm-mobile-only"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 4 }).map((_, rowIdx) => (
                                    <tr key={`skeleton-row-${rowIdx}`} className="pm-table-row">
                                        <td>
                                            <div className="pm-skeleton-line" style={{ width: '70%', height: '16px', marginBottom: '8px' }} />
                                            <div className="pm-skeleton-line" style={{ width: '40%', height: '12px' }} />
                                        </td>
                                        <td className="pm-desktop-only">
                                            <div className="pm-skeleton-line" style={{ width: '60%', height: '14px' }} />
                                        </td>
                                        <td className="pm-desktop-only">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="pm-skeleton-circle" style={{ width: '24px', height: '24px' }} />
                                                <div className="pm-skeleton-line" style={{ width: '50px', height: '14px' }} />
                                            </div>
                                        </td>
                                        <td className="pm-desktop-only">
                                            <div className="pm-skeleton-line" style={{ width: '60px', height: '20px', borderRadius: '4px', marginBottom: '8px' }} />
                                            <div className="pm-skeleton-line" style={{ width: '40px', height: '14px' }} />
                                        </td>
                                        <td>
                                            <div className="pm-skeleton-line" style={{ width: '60px', height: '24px', borderRadius: '12px' }} />
                                        </td>
                                        <td className="pm-desktop-only" style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <div className="pm-skeleton-circle" style={{ width: '28px', height: '28px' }} />
                                                <div className="pm-skeleton-circle" style={{ width: '28px', height: '28px' }} />
                                            </div>
                                        </td>
                                        <td className="pm-mobile-only">
                                            <div className="pm-skeleton-circle" style={{ width: '18px', height: '18px', marginLeft: 'auto' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'general' ? (
                    <GeneralApprovalsTable 
                        filteredApprovals={filteredApprovals}
                        expandedRow={expandedRow}
                        toggleRow={toggleRow}
                        handleUpdateStatus={handleUpdateStatus}
                    />
                ) : activeTab === 'staff' ? (
                    <StaffRequestsTable 
                        filteredApprovals={filteredApprovals}
                        expandedRow={expandedRow}
                        toggleRow={toggleRow}
                        handleActionStaffRequest={handleActionStaffRequest}
                    />
                ) : activeTab === 'leaves' ? (
                    <div style={{ padding: '0' }}>
                        <LeaveApprovals />
                    </div>
                ) : null}
                
                {activeTab !== 'leaves' && filteredApprovals.length === 0 && !loading && (
                    <div className="pm-loading-state">
                        <AlertCircle size={24} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                        <span>No requests found for this filter.</span>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CreateApprovalModal 
                    setIsModalOpen={setIsModalOpen}
                    handleCreateRequest={handleCreateRequest}
                    newRequest={newRequest}
                    setNewRequest={setNewRequest}
                />
            )}
        </div>
    );
};

export default Approvals;
