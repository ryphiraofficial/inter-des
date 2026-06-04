import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import DesignPreviewModal from './components/DesignPreviewModal';
import CustomSelect from './components/CustomSelect';
import Skeleton from './components/Skeleton';
import './css/SalesTasks.css';
import './css/SalesApprovals.css';
import { useSalesApprovals } from './hooks/useSalesApprovals';
import ApprovalTaskCard from './components/ApprovalTaskCard';
import DecisionModal from './components/DecisionModal';

const SalesApprovals = ({}) => {
    const {
        loading,
        filteredTasks,
        pendingCount,
        criticalCount,
        approvedCount,
        revisionCount,
        priorityFilter,
        setPriorityFilter,
        actionTask,
        setActionTask,
        actionType,
        setActionType,
        salesNotes,
        setSalesNotes,
        submittingAction,
        previewTask,
        setPreviewTask,
        triggerAction,
        handleActionSubmit
    } = useSalesApprovals();

    return (
        <div className="st-tasks-container">
            <div className="st-tasks-wrapper">
                
                {/* ── Statistics Summary Grid (Same layout as other pages) ── */}
                <div className="st-stats-grid">
                    <div className="st-stat-card">
                        <div className="st-stat-info">
                            <span className="st-stat-label">Pending Review</span>
                            <span className="st-stat-value">
                                {loading ? <Skeleton width="40px" height="32px" /> : pendingCount}
                            </span>
                        </div>
                    </div>
                    <div className="st-stat-card">
                        <div className="st-stat-info">
                            <span className="st-stat-label">High Priority</span>
                            <span className="st-stat-value">
                                {loading ? <Skeleton width="40px" height="32px" /> : criticalCount}
                            </span>
                        </div>
                    </div>
                    <div className="st-stat-card">
                        <div className="st-stat-info">
                            <span className="st-stat-label">Sales Approved</span>
                            <span className="st-stat-value">
                                {loading ? <Skeleton width="40px" height="32px" /> : approvedCount}
                            </span>
                        </div>
                    </div>
                    <div className="st-stat-card">
                        <div className="st-stat-info">
                            <span className="st-stat-label">Revisions Needed</span>
                            <span className="st-stat-value">
                                {loading ? <Skeleton width="40px" height="32px" /> : revisionCount}
                            </span>
                        </div>
                    </div>
                    <div className="st-stat-card">
                        <div className="st-stat-info">
                            <span className="st-stat-label">Action Required</span>
                            <span className="st-stat-value">
                                {loading ? <Skeleton width="40px" height="32px" /> : filteredTasks.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Filter Controls (Same theme & structure) ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <CustomSelect
                        variant="filter"
                        options={[
                            { value: '', label: 'All Priorities' },
                            { value: 'Critical', label: 'Critical' },
                            { value: 'High', label: 'High' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'Low', label: 'Low' }
                        ]}
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        placeholder="All Priorities"
                        name="priority"
                        searchable={false}
                    />
                </div>

                {/* ── Client Approvals Grid ── */}
                {loading ? (
                    <div className="st-tasks-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="st-task-card loading" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '260px' }}>
                                <div className="st-task-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Skeleton width="60%" height="24px" borderRadius="6px" />
                                    <Skeleton width="20%" height="20px" borderRadius="4px" />
                                </div>
                                
                                <div className="st-task-card-meta" style={{ display: 'flex', gap: '1.25rem' }}>
                                    <Skeleton width="40%" height="16px" />
                                    <Skeleton width="40%" height="16px" />
                                </div>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#f8fafc', padding: '12px', borderRadius: '12px', marginTop: '4px' }}>
                                    <Skeleton width="100%" height="32px" borderRadius="6px" />
                                </div>

                                <div className="designer-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto' }}>
                                    <Skeleton width="32px" height="32px" borderRadius="50%" />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                        <Skeleton width="40px" height="10px" />
                                        <Skeleton width="100px" height="16px" />
                                    </div>
                                </div>

                                <div className="st-task-card-footer" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                    <Skeleton width="33%" height="36px" borderRadius="8px" />
                                    <Skeleton width="33%" height="36px" borderRadius="8px" />
                                    <Skeleton width="33%" height="36px" borderRadius="8px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredTasks.length > 0 ? (
                    <div className="st-tasks-grid">
                        {filteredTasks.map(task => (
                            <ApprovalTaskCard 
                                key={task._id} 
                                task={task} 
                                setPreviewTask={setPreviewTask}
                                triggerAction={triggerAction}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="approvals-empty">
                        <div className="approvals-empty-icon">
                            <ClipboardCheck size={40} />
                        </div>
                        <h3>No Client Approvals Found</h3>
                        <p>All submitted designs have been reviewed or matched no filters. Check back later when designers upload new concepts.</p>
                    </div>
                )}

            </div>

            {/* ── CUSTOM DECISION POPUP/MODAL ── */}
            {actionTask && actionType && (
                <DecisionModal
                    actionTask={actionTask}
                    actionType={actionType}
                    setActionTask={setActionTask}
                    setActionType={setActionType}
                    salesNotes={salesNotes}
                    setSalesNotes={setSalesNotes}
                    submittingAction={submittingAction}
                    handleActionSubmit={handleActionSubmit}
                />
            )}

            {/* ── DESIGN PREVIEW MODAL ── */}
            {previewTask && (
                <DesignPreviewModal 
                    selectedTask={previewTask}
                    onClose={() => setPreviewTask(null)}
                />
            )}

        </div>
    );
};

export default SalesApprovals;
