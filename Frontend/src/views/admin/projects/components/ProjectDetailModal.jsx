import React from 'react';
import { Calendar, User, CreditCard, Tag, FileText, Info, CheckCircle2 } from 'lucide-react';

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
    if (!amount && amount !== 0) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
};

const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const ProjectDetailModal = ({ selectedProject, handleClose }) => {
    if (!selectedProject) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content project-detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <div className="header-title-group">
                        <div className="title-wrapper">
                            <h2>{selectedProject.name}</h2>
                            <span className="p-badge">{selectedProject.projectNumber}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>
                
                <div className="modal-body modern-body">
                    {selectedProject.description && (
                        <div className="detail-section full-width">
                            <h4 className="section-title"><FileText size={16} /> Description</h4>
                            <p className="description-text">{selectedProject.description}</p>
                        </div>
                    )}

                    <div className="detail-grid-modern">
                        <div className="detail-group">
                            <h4 className="section-title"><Info size={16} /> Workflow Status</h4>
                            <div className="info-row">
                                <label>Stage</label>
                                <span className="stage-pill" style={{ backgroundColor: `${getStageColor(selectedProject.stage)}15`, color: getStageColor(selectedProject.stage) }}>
                                    {selectedProject.stage}
                                </span>
                            </div>
                            <div className="info-row">
                                <label>Status</label>
                                <span className={`status-text ${selectedProject.status?.toLowerCase().replace(' ', '-')}`}>
                                    {selectedProject.status}
                                </span>
                            </div>
                            <div className="info-row">
                                <label>Priority</label>
                                <span className={`priority-tag ${selectedProject.priority?.toLowerCase()}`}>
                                    {selectedProject.priority}
                                </span>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h4 className="section-title"><CreditCard size={16} /> Financials</h4>
                            <div className="info-row"><label>Budget</label><span className="money">{formatCurrency(selectedProject.budget)}</span></div>
                            <div className="info-row"><label>Spent</label><span className="money spent">{formatCurrency(selectedProject.spent)}</span></div>
                            <div className="info-row"><label>Payment</label><span>{selectedProject.paymentStatus}</span></div>
                        </div>

                        <div className="detail-group">
                            <h4 className="section-title"><Calendar size={16} /> Timeline</h4>
                            <div className="info-row"><label>Start Date</label><span>{formatDate(selectedProject.startDate)}</span></div>
                            <div className="info-row"><label>Target End</label><span>{formatDate(selectedProject.targetEndDate)}</span></div>
                            <div className="info-row"><label>Progress</label><span>{selectedProject.progress}%</span></div>
                        </div>

                        <div className="detail-group">
                            <h4 className="section-title"><User size={16} /> Stakeholders</h4>
                            <div className="info-row"><label>Client</label><span>{selectedProject.client?.name || 'N/A'}</span></div>
                            <div className="info-row"><label>Design Mgr</label><span>{selectedProject.assignedDesignManager?.name || 'Unassigned'}</span></div>
                            <div className="info-row"><label>Production Mgr</label><span>{selectedProject.assignedProductionManager?.name || 'Unassigned'}</span></div>
                        </div>
                    </div>

                    <div className="progress-section">
                        <div className="progress-header">
                            <h4 className="section-title"><CheckCircle2 size={16} /> Overall Completion</h4>
                            <span>{selectedProject.progress}%</span>
                        </div>
                        <div className="large-progress-bar">
                            <div className="large-progress-fill" style={{ width: `${selectedProject.progress}%`, backgroundColor: getStageColor(selectedProject.stage) }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailModal;
