import React, { useState, useEffect } from 'react';
import { Calendar, User, CreditCard, Tag, FileText, Info, CheckCircle2, MoreHorizontal, ExternalLink } from 'lucide-react';
import { taskAPI } from '../../../../models/api';

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

const TeamPopover = ({ managerType, manager, staff, loading, onClose }) => {
    return (
        <div className="team-popover">
            <div className="popover-header">
                <div className="p-title">
                    <User size={14} />
                    <span>{managerType} Team</span>
                </div>
                <button className="p-close" onClick={onClose}>×</button>
            </div>
            <div className="popover-body">
                <div className="manager-info">
                    <div className="m-avatar">{manager?.name?.charAt(0) || 'U'}</div>
                    <div className="m-details">
                        <span className="m-name">{manager?.name || 'Unassigned'}</span>
                        <span className="m-role">{managerType} Manager</span>
                    </div>
                </div>
                
                <div className="staff-section">
                    <label>Staff Members ({staff.length})</label>
                    {loading ? (
                        <div className="p-loading">Loading team...</div>
                    ) : staff.length === 0 ? (
                        <div className="p-empty">No staff assigned yet</div>
                    ) : (
                        <div className="staff-list">
                            {staff.map(s => (
                                <div key={s._id} className="staff-item">
                                    <div className="s-avatar">{s.name?.charAt(0)}</div>
                                    <div className="s-info">
                                        <span className="s-name">{s.name}</span>
                                        <span className="s-role">{s.role || 'Team Member'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProjectDetailModal = ({ selectedProject, handleClose }) => {
    const [popover, setPopover] = useState(null); // { type, manager, staff, loading }
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        if (selectedProject) {
            fetchProjectTasks();
        }
    }, [selectedProject]);

    const fetchProjectTasks = async () => {
        try {
            const res = await taskAPI.getAll({ project: selectedProject._id });
            if (res.success) {
                setAllTasks(res.data);
            }
        } catch (err) {
            console.error('Error fetching project tasks:', err);
        }
    };

    const handleManagerClick = (type, manager) => {
        // Filter tasks related to this stage/manager to find staff
        // For now, let's just find unique staff from all tasks if they match the department
        const relatedTasks = allTasks.filter(t => {
            if (type === 'Design') return t.status.includes('Design') || t.title.toLowerCase().includes('design');
            if (type === 'Production') return t.status.includes('Production') || t.title.toLowerCase().includes('production');
            return true;
        });

        // Get unique staff from these tasks
        const staffMap = new Map();
        relatedTasks.forEach(t => {
            t.assignedTo?.forEach(s => {
                if (s && s._id) staffMap.set(s._id, s);
            });
        });

        setPopover({
            type,
            manager,
            staff: Array.from(staffMap.values()),
            loading: false
        });
    };

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
                            
                            <div className="info-row clickable" onClick={() => handleManagerClick('Design', selectedProject.assignedDesignManager)}>
                                <label>Design Mgr</label>
                                <div className="manager-cell">
                                    <span>{selectedProject.assignedDesignManager?.name || 'Unassigned'}</span>
                                    <MoreHorizontal size={14} className="hover-icon" />
                                </div>
                            </div>
                            
                            <div className="info-row clickable" onClick={() => handleManagerClick('Production', selectedProject.assignedProductionManager)}>
                                <label>Production Mgr</label>
                                <div className="manager-cell">
                                    <span>{selectedProject.assignedProductionManager?.name || 'Unassigned'}</span>
                                    <MoreHorizontal size={14} className="hover-icon" />
                                </div>
                            </div>

                            {popover && (
                                <TeamPopover 
                                    managerType={popover.type}
                                    manager={popover.manager}
                                    staff={popover.staff}
                                    loading={popover.loading}
                                    onClose={() => setPopover(null)}
                                />
                            )}
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
