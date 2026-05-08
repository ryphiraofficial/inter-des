import React from 'react';
import { Package, UserPlus } from 'lucide-react';

const MaterialRequests = ({ pendingRequests, setSelectedRequest, setShowAssignModal }) => {
    return (
        <div className="fade-in">
            <div className="section-card">
                <div className="section-header">
                    <h3><Package size={18} /> Requests from Design Team</h3>
                    <span className="badge">New</span>
                </div>
                <div className="requests-list">
                    {pendingRequests.length > 0 ? pendingRequests.map(request => (
                        <div key={request._id} className="request-item-premium standard-request">
                            <div className="request-info">
                                <span className="request-id">{request.requestNumber}</span>
                                <div className="request-project-info">
                                    Project: <strong>{request.project?.name}</strong> • {request.items?.length || 0} items
                                </div>
                                <div className="request-meta">
                                    <span className={`priority-badge ${request.priority?.toLowerCase()}`}>{request.priority} Priority</span>
                                    <span className="badge-outline">{request.project?.stage} Stage</span>
                                </div>
                            </div>
                            <div className="request-actions-col">
                                <button 
                                    className="btn-assign-primary"
                                    onClick={() => {
                                        setSelectedRequest(request);
                                        setShowAssignModal(true);
                                    }}
                                >
                                    <UserPlus size={18} /> Assign Staff
                                </button>
                            </div>
                        </div>
                    )) : (

                        <div className="empty-state">No requests currently pending assignment</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaterialRequests;
