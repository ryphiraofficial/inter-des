import React from 'react';
import { ClipboardCheck } from 'lucide-react';

const Assignments = ({ assignedRequests, pendingReviews, handleApproveToAdmin }) => {
    return (
        <div className="procurement-assignments fade-in">
            {pendingReviews && pendingReviews.length > 0 && (
                <div className="section-card urgent-review">
                    <div className="section-header">
                        <h3><ClipboardCheck size={18} /> Needs Your Review</h3>
                    </div>
                    <div className="assigned-list">
                        {pendingReviews.map(request => (
                            <div key={request._id} className="assigned-item-premium review-required">
                                <div className="item-header">
                                    <div className="title-group">
                                        <span className="req-number">{request.requestNumber || request.title}</span>
                                        <span className="proj-name">{request.project?.name}</span>
                                    </div>
                                    <span className="status-pill pending-manager-review">Pending Review</span>
                                </div>
                                <div className="item-footer">
                                    <div className="staff-info">
                                        <div className="staff-avatar">
                                            {request.assignedTo?.fullName?.charAt(0) || '?'}
                                        </div>
                                        <div className="staff-details">
                                            <span className="label">Sourced by:</span> <strong>{request.assignedTo?.fullName || 'Staff'}</strong>
                                        </div>
                                    </div>
                                    <div className="action-group">
                                        <button 
                                            className="btn-approve"
                                            onClick={() => handleApproveToAdmin(request)}
                                        >
                                            Approve & Send to Admin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="section-card">
                <div className="section-header">
                    <h3><ClipboardCheck size={18} /> Active Assignments</h3>
                </div>
                <div className="assigned-list">
                    {assignedRequests.length > 0 ? assignedRequests.map(request => (
                        <div key={request._id} className="assigned-item-premium">
                            <div className="item-header">
                                <div className="title-group">
                                    <span className="req-number">{request.requestNumber || request.title}</span>
                                    <span className="proj-name">{request.project?.name}</span>
                                </div>
                                <span className={`status-pill ${request.status?.toLowerCase().replace(/ /g, '-')}`}>{request.status}</span>
                            </div>
                            <div className="item-footer">
                                <div className="staff-info">
                                    <div className="staff-avatar">
                                        {request.assignedTo?.fullName?.charAt(0)}
                                    </div>
                                    <div className="staff-details">
                                        <span className="label">Assigned to:</span> <strong>{request.assignedTo?.fullName}</strong>
                                    </div>
                                </div>
                                <div className="meta-info">
                                    {request.items?.length || 0} items in pipeline
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="empty-state">No active assignments found</div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Assignments;
