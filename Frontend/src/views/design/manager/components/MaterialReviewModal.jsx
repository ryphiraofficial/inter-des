import React from 'react';
import { X, List, Check } from 'lucide-react';

const MaterialReviewModal = ({
    selectedRequest,
    isManager,
    reviewRemarks,
    setReviewRemarks,
    handleReviewRequest,
    setShowReviewModal
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content-styled" style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                    <div>
                        <h3>Material Request Review</h3>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {selectedRequest.requestNumber}</p>
                    </div>
                    <button className="close-btn" onClick={() => setShowReviewModal(false)}><X size={20} /></button>
                </div>
                <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <div className="review-items-list" style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <List size={16} /> Requested Materials
                        </h4>
                        <div className="items-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {selectedRequest.items?.map((item, idx) => (
                                <div key={idx} style={{ background: item.isExtra ? '#f0fdf4' : '#fcfcfc', border: item.isExtra ? '1px solid #bbf7d0' : '1px solid #f1f5f9', padding: '1rem', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <strong style={{ fontSize: '0.9rem' }}>{item.itemName}</strong>
                                            {item.isExtra && <span style={{ background: '#10b981', color: 'white', padding: '1px 6px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800 }}>EXTRA ITEM</span>}
                                        </div>
                                        <span style={{ background: '#4f46e5', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>× {item.quantity} {item.unit || 'pieces'}</span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}><strong>Specs:</strong> {item.specifications || 'N/A'}</p>
                                    {item.isExtra && item.reasonForExtra && (
                                        <p style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '6px', background: '#fee2e2', padding: '6px', borderRadius: '6px' }}>
                                            <strong>Reason for Extra:</strong> {item.reasonForExtra}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Remarks History or Entry */}
                    <div className="review-remarks-section" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                        {isManager ? (
                            <>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Review Feedback / Remarks</label>
                                <textarea 
                                    className="modal-textarea"
                                    value={reviewRemarks}
                                    onChange={e => setReviewRemarks(e.target.value)}
                                    placeholder="Write your approval notes or reasons for rejection..."
                                    style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </>
                        ) : (
                            selectedRequest.managerRemarks && (
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <strong style={{ fontSize: '0.85rem', color: '#64748b' }}>Manager Feedback:</strong>
                                    <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#1e293b' }}>"{selectedRequest.managerRemarks}"</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                {isManager && selectedRequest.status === 'Pending' && (
                    <div className="modal-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button 
                            className="action-btn" 
                            style={{ borderColor: '#ef4444', color: '#ef4444' }} 
                            onClick={() => handleReviewRequest('Rejected')}
                            disabled={!reviewRemarks}
                        >
                            <X size={16} /> Disapprove & Send Back
                        </button>
                        <button 
                            className="action-btn primary" 
                            onClick={() => handleReviewRequest('Approved')}
                        >
                            <Check size={16} /> Approve & Forward
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialReviewModal;
