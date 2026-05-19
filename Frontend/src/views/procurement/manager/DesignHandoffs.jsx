import React from 'react';
import { Plus, UserPlus, X, Target, FileText, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import '../css/DesignHandoffs.css';
import MaterialReviewModal from '../components/MaterialReviewModal';

const DesignHandoffs = ({ 
    designHandoffs, 
    setSelectedRequest, 
    setShowAssignModal, 
    selectedReviewItem, 
    setSelectedReviewItem, 
    formatCurrency 
}) => {
    return (
        <div className="fade-in">
            <div className="section-card">
                <div className="section-header priority-header">
                    <h3><Plus size={18} color="#6366f1" /> Pushed Designs from Design Manager</h3>
                    <span className="badge badge-priority">Priority Action</span>
                </div>
                <div className="requests-list">
                    {designHandoffs.length > 0 ? designHandoffs.map(item => (
                        <div key={item._id} className={`request-item-premium ${item.type === 'Task' ? 'request-item-task' : 'request-item-mr'}`}>
                            <div className="request-info">
                                <div className="request-title-wrapper">
                                    <span className="request-title">{item.type === 'MaterialRequest' ? item.requestNumber : item.title}</span>
                                    <span className={`request-type-badge ${item.type === 'Task' ? 'task' : 'mr'}`}>
                                        {item.type === 'Task' ? 'DESIGN PUSHED (NO MR)' : 'MATERIAL REQUEST'}
                                    </span>
                                </div>
                                <div className="request-project-info">
                                    Project: <strong>{item.project?.name}</strong> • {item.type === 'MaterialRequest' ? `${item.items?.length || 0} items` : 'Needs Material Verification'}
                                </div>
                                {item.type === 'MaterialRequest' && item.approvedBudget > 0 && (
                                    <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '6px', fontWeight: 600 }}>
                                        Approved Budget Limit: {formatCurrency(item.approvedBudget)}
                                    </div>
                                )}
                                {item.type === 'MaterialRequest' && item.assignedTo && (
                                    <div style={{ fontSize: '0.85rem', color: '#4f46e5', marginTop: '4px', fontWeight: 600 }}>
                                        Auto-Assigned To: {item.assignedTo.fullName || 'Staff'}
                                    </div>
                                )}
                                <div className="request-design-note" style={{ marginTop: '6px' }}>
                                    <strong>Design Note:</strong> {item.type === 'MaterialRequest' ? (item.notes || 'Final design approved and pushed for procurement.') : (item.description || 'Pushed from design stage. Please check drawings and create material list.')}
                                </div>
                            </div>
                            <div className="request-actions-col">
                                <button 
                                    className="btn-assign-primary"
                                    onClick={() => {
                                        setSelectedRequest(item);
                                        setShowAssignModal(true);
                                    }}
                                >
                                    <UserPlus size={18} /> {item.type === 'Task' ? 'Assign Design Review' : 'Assign Immediately'}
                                </button>
                                <button 
                                    className="btn-review-outline"
                                    onClick={() => setSelectedReviewItem(item)}
                                >
                                    Review Project Details
                                </button>
                                {item.type === 'Task' && <span style={{ fontSize: '0.7rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>Needs Material List</span>}
                            </div>
                        </div>
                    )) : (
                        <div className="empty-state">No design handoffs waiting for assignment</div>
                    )}
                </div>
            </div>

            <MaterialReviewModal 
                isOpen={!!selectedReviewItem} 
                onClose={() => setSelectedReviewItem(null)} 
                selectedReviewItem={selectedReviewItem} 
                formatCurrency={formatCurrency} 
                onAssignClick={() => {
                    setSelectedRequest(selectedReviewItem);
                    setSelectedReviewItem(null);
                    setShowAssignModal(true);
                }}
            />
        </div>
    );
};

export default DesignHandoffs;
