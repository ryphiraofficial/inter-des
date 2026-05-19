import React from 'react';
import { X, Target, FileText, MessageSquare } from 'lucide-react';

const MaterialReviewModal = ({ isOpen, onClose, selectedReviewItem, formatCurrency, onAssignClick }) => {
    if (!isOpen || !selectedReviewItem) return null;

    return (
        <div className="modal-backdrop-blur" onClick={onClose}>
            <div className="modal-card-premium" onClick={e => e.stopPropagation()}>
                <button className="modal-close-round" onClick={onClose}><X size={20} /></button>
                
                <div style={{ marginBottom: '2rem' }}>
                    <div className="modal-project-badge">
                        <span className="modal-project-label">Project Review</span>
                        <span className="badge-lite" style={{ background: '#eef2ff', color: '#6366f1' }}>{selectedReviewItem.project?.projectNumber}</span>
                    </div>
                    <h2 className="modal-project-title">{selectedReviewItem.project?.name}</h2>
                    <p className="modal-project-client">Client: {selectedReviewItem.project?.client?.name}</p>
                </div>

                <div className="modal-grid-2col">
                    <div className="modal-info-box">
                        <h4 className="modal-info-title"><Target size={16} /> Status Info</h4>
                        <div className="modal-info-list">
                            <div><span className="modal-info-label">Project Stage:</span> <strong className="modal-info-val-highlight">{selectedReviewItem.project?.stage}</strong></div>
                            <div><span className="modal-info-label">Status:</span> <strong>{selectedReviewItem.project?.status}</strong></div>
                            <div><span className="modal-info-label">Budget:</span> <strong>{formatCurrency(selectedReviewItem.project?.budget)}</strong></div>
                        </div>
                    </div>
                    <div className="modal-info-box">
                        <h4 className="modal-info-title"><FileText size={16} /> Handoff Details</h4>
                        <div className="modal-info-list">
                            <div><span className="modal-info-label">Type:</span> <strong>{selectedReviewItem.type === 'Task' ? 'Design Push' : 'Material Request'}</strong></div>
                            <div><span className="modal-info-label">Items:</span> <strong>{selectedReviewItem.items?.length || 0} items listed</strong></div>
                            <div><span className="modal-info-label">Date:</span> <strong>{new Date(selectedReviewItem.createdAt).toLocaleDateString()}</strong></div>
                        </div>
                    </div>
                </div>

                <div className="modal-notes-box">
                    <h4 className="modal-notes-title"><MessageSquare size={16} /> Designer's Notes</h4>
                    <p className="modal-notes-text">
                        {selectedReviewItem.type === 'Task' 
                            ? (selectedReviewItem.description || "No specific notes provided for this design push.")
                            : (selectedReviewItem.notes || "No specific notes provided for this material request.")
                        }
                    </p>
                </div>

                <div className="modal-actions-row">
                    <button 
                        className="btn-modal-assign"
                        onClick={onAssignClick}
                    >
                        Assign Staff Now
                    </button>
                    <button 
                        className="btn-modal-close"
                        onClick={onClose}
                    >
                        Close Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaterialReviewModal;
