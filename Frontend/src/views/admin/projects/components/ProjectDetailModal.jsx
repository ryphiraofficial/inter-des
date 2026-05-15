import React from 'react';

const getStageColor = (stage) => {
    const colors = {
        'Design': '#8b5cf6',
        'Procurement': '#f59e0b',
        'Production': '#3b82f6',
        'Completed': '#10b981'
    };
    return colors[stage] || '#64748b';
};

const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
};

const ProjectDetailModal = ({ selectedProject, handleClose, handleStageChange }) => {
    if (!selectedProject) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content project-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{selectedProject.name}</h2>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="detail-grid">
                        <div className="detail-item"><label>Project Number</label><span>{selectedProject.projectNumber}</span></div>
                        <div className="detail-item"><label>Client</label><span>{selectedProject.client?.name || 'N/A'}</span></div>
                        <div className="detail-item"><label>Stage</label><span style={{ color: getStageColor(selectedProject.stage) }}>{selectedProject.stage}</span></div>
                        <div className="detail-item"><label>Status</label><span>{selectedProject.status}</span></div>
                        <div className="detail-item"><label>Budget</label><span>{formatCurrency(selectedProject.budget)}</span></div>
                        <div className="detail-item"><label>Spent</label><span>{formatCurrency(selectedProject.spent)}</span></div>
                    </div>
                    <div className="stage-transition">
                        <h4>Move to Stage</h4>
                        <div className="stage-buttons">
                            {['Design', 'Procurement', 'Production', 'Completed'].map(stage => (
                                <button
                                    key={stage}
                                    className={`stage-btn ${selectedProject.stage === stage ? 'active' : ''}`}
                                    style={{ 
                                        borderColor: getStageColor(stage),
                                        backgroundColor: selectedProject.stage === stage ? getStageColor(stage) : 'transparent'
                                    }}
                                    onClick={() => handleStageChange(selectedProject._id, stage)}
                                >
                                    {stage}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailModal;
