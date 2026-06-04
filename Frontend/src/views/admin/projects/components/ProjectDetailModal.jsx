import React from 'react';
import { Calendar, User, CreditCard, Tag, FileText, Info, CheckCircle2, MoreHorizontal, ExternalLink, Edit3 } from 'lucide-react';
import TeamPopover from './TeamPopover';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { getStageColor, formatCurrency, formatDate } from '../../../../utils/projectUtils';

const ProjectDetailModal = ({ selectedProject, handleClose, onUpdate }) => {
    const {
        popover,
        setPopover,
        isEditingDeadline,
        setIsEditingDeadline,
        deadlineValue,
        setDeadlineValue,
        isSavingDeadline,
        handleSaveDeadline,
        handleManagerClick
    } = useProjectDetail(selectedProject, onUpdate);

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
                            
                            <div className="info-row">
                                <label>Target End</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isEditingDeadline ? (
                                        <>
                                            <input 
                                                type="date" 
                                                value={deadlineValue} 
                                                onChange={e => setDeadlineValue(e.target.value)} 
                                                className="form-input" 
                                                style={{ padding: '4px 8px', width: 'auto', fontSize: '0.85rem' }} 
                                                disabled={isSavingDeadline}
                                            />
                                            <button 
                                                className="btn-icon approve" 
                                                onClick={handleSaveDeadline} 
                                                disabled={isSavingDeadline}
                                                style={{ padding: '2px', color: '#10b981', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                title="Save Deadline"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span>{formatDate(selectedProject.targetEndDate)}</span>
                                            <button 
                                                className="btn-icon" 
                                                onClick={() => setIsEditingDeadline(true)}
                                                style={{ padding: '2px', color: '#64748b', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                title="Edit Deadline"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="info-row"><label>Progress</label><span>{selectedProject.progress}%</span></div>
                        </div>

                        <div className="detail-group">
                            <h4 className="section-title"><User size={16} /> Stakeholders</h4>
                            <div className="info-row"><label>Client</label><span>{selectedProject.client?.name || 'N/A'}</span></div>
                            
                            <div className="info-row clickable" onClick={() => handleManagerClick('Design', selectedProject.assignedDesignManager)}>
                                <label>Design Mgr</label>
                                <div className="manager-cell">
                                    <span>{selectedProject.assignedDesignManager?.name || 'Unassigned'}</span>
                                    <MoreHorizontal size={14} className="hover-icon" />
                                </div>
                                {popover?.type === 'Design' && (
                                    <TeamPopover 
                                        managerType={popover.type}
                                        manager={popover.manager}
                                        staff={popover.staff}
                                        loading={popover.loading}
                                        onClose={(e) => { e.stopPropagation(); setPopover(null); }}
                                    />
                                )}
                            </div>

                            <div className="info-row clickable" onClick={() => handleManagerClick('Procurement', selectedProject.assignedProcurementManager)}>
                                <label>Procurement Mgr</label>
                                <div className="manager-cell">
                                    <span>{selectedProject.assignedProcurementManager?.name || 'Unassigned'}</span>
                                    <MoreHorizontal size={14} className="hover-icon" />
                                </div>
                                {popover?.type === 'Procurement' && (
                                    <TeamPopover 
                                        managerType={popover.type}
                                        manager={popover.manager}
                                        staff={popover.staff}
                                        loading={popover.loading}
                                        onClose={(e) => { e.stopPropagation(); setPopover(null); }}
                                    />
                                )}
                            </div>
                            
                            <div className="info-row clickable" onClick={() => handleManagerClick('Production', selectedProject.assignedProductionManager)}>
                                <label>Production Mgr</label>
                                <div className="manager-cell">
                                    <span>{selectedProject.assignedProductionManager?.name || 'Unassigned'}</span>
                                    <MoreHorizontal size={14} className="hover-icon" />
                                </div>
                                {popover?.type === 'Production' && (
                                    <TeamPopover 
                                        managerType={popover.type}
                                        manager={popover.manager}
                                        staff={popover.staff}
                                        loading={popover.loading}
                                        onClose={(e) => { e.stopPropagation(); setPopover(null); }}
                                    />
                                )}
                            </div>
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
