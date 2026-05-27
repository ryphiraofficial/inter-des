import React, { useState } from 'react';
import { ArrowRight, Building2, Calendar, Users, Play, CheckCircle, Pause, Clock, Trash2, FileText, Clock3 } from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import AlertDialog from '../../components/AlertDialog';

const getStageColor = (stage) => {
    const colors = {
        'Design': '#8b5cf6',
        'Procurement': '#f59e0b',
        'Production': '#3b82f6',
        'Completed': '#10b981'
    };
    return colors[stage] || '#64748b';
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'In Progress': return <Play size={14} />;
        case 'Completed': return <CheckCircle size={14} />;
        case 'On Hold': return <Pause size={14} />;
        case 'Not Started': return <Clock size={14} />;
        default: return <Clock size={14} />;
    }
};

const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
};

const ProjectFocusedView = ({ project, loading, handleClose, handleDeleteProject }) => {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onConfirmDelete = async () => {
        if (!handleDeleteProject) return;
        setIsDeleting(true);
        try {
            await handleDeleteProject(project._id);
            // Deletion handles navigation back, so we just let it run
        } catch (error) {
            console.error("Failed to delete project:", error);
            setIsDeleting(false);
            setShowDeleteAlert(false);
            alert("Failed to delete project. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="projects-page focused-view">
                <div className="page-header"><div className="header-title-section"><Skeleton width="40px" height="40px" borderRadius="50%" /><div><Skeleton width="240px" height="32px" /><div style={{ marginTop: '8px' }}><Skeleton width="180px" height="16px" /></div></div></div></div>
                <div className="detail-container-premium">
                    <div className="stat-grid-premium">{[1, 2, 3].map(i => (<div key={i} className="info-block"><Skeleton width="100px" height="12px" /><div style={{ marginTop: '12px' }}><Skeleton width="100%" height="32px" /></div></div>))}</div>
                    <div className="info-cards-grid">{[1, 2, 3].map(i => (<div key={i} className="info-card-premium"><Skeleton width="100%" height="160px" borderRadius="16px" /></div>))}</div>
                </div>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="projects-page focused-view">
            <div className="page-header">
                <div className="header-title-section">
                    <button className="btn-back-round" onClick={handleClose}>
                        <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <div>
                        <h1 style={{ margin: 0 }}>{project.name}</h1>
                        <p style={{ margin: 0, color: '#64748b' }}>{project.projectNumber} • {project.client?.name}</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn-danger-ghost" 
                        onClick={() => setShowDeleteAlert(true)}
                    >
                        <Trash2 size={16} /> Delete Project
                    </button>
                    <span className="badge-premium" style={{ background: getStageColor(project.stage) }}>{project.stage} Stage</span>
                </div>
            </div>

            <div className="detail-container-premium">
                <div className="stat-grid-premium">
                    <div className="stat-card-premium">
                        <div className="stat-icon-wrapper status">
                            {getStatusIcon(project.status)}
                        </div>
                        <div className="stat-content">
                            <label>Project Status</label>
                            <h3>{project.status}</h3>
                        </div>
                    </div>
                    
                    <div className="stat-card-premium highlight-green">
                        <div className="stat-icon-wrapper budget">
                            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹</span>
                        </div>
                        <div className="stat-content">
                            <label>Financial Overview</label>
                            <h3 className="text-emerald">{formatCurrency(project.budget)}</h3>
                        </div>
                    </div>

                    <div className="stat-card-premium">
                        <div className="stat-icon-wrapper progress">
                            <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{project.progress || 0}%</div>
                        </div>
                        <div className="stat-content">
                            <label>Overall Completion</label>
                            <div className="completion-bar-wrapper">
                                <div className="completion-bar-fill" style={{ width: `${project.progress || 0}%`, background: getStageColor(project.stage) }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-cards-grid">
                    <div className="info-card-premium">
                        <div className="info-card-header">
                            <div className="info-card-icon-container">
                                <Building2 size={18} strokeWidth={2.5} />
                            </div>
                            <h4>Client Information</h4>
                        </div>
                        <div className="info-content-grid">
                            <div className="info-item">
                                <span className="label">Primary Contact</span>
                                <strong className="value">{project.client?.name}</strong>
                            </div>
                            <div className="info-item">
                                <span className="label">Email Address</span>
                                <span className="value text-muted">{project.client?.email || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Phone Number</span>
                                <span className="value text-muted">{project.client?.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-card-premium">
                        <div className="info-card-header">
                            <div className="info-card-icon-container bg-indigo">
                                <Calendar size={18} strokeWidth={2.5} />
                            </div>
                            <h4>Project Timeline</h4>
                        </div>
                        <div className="info-content-grid">
                            <div className="info-item">
                                <span className="label">Date Created</span>
                                <span className="value">{new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Last Modified</span>
                                <span className="value">{new Date(project.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Current Stage</span>
                                <strong className="value" style={{ color: getStageColor(project.stage) }}>{project.stage}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="info-card-premium">
                        <div className="info-card-header">
                            <div className="info-card-icon-container bg-emerald">
                                <Users size={18} strokeWidth={2.5} />
                            </div>
                            <h4>Project Team</h4>
                        </div>
                        <div className="info-content-grid">
                            <div className="info-item">
                                <span className="label">Design Manager</span>
                                <strong className="value">{project.assignedDesignManager?.fullName || 'Unassigned'}</strong>
                            </div>
                            <div className="info-item">
                                <span className="label">Procurement Manager</span>
                                <strong className="value">{project.assignedProcurementManager?.fullName || 'Unassigned'}</strong>
                            </div>
                            <div className="info-item">
                                <span className="label">Production Manager</span>
                                <strong className="value">{project.assignedProductionManager?.fullName || 'Unassigned'}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog 
                isOpen={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={onConfirmDelete}
                title="Delete Project?"
                description={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone and all associated data will be permanently removed.`}
                confirmText="Delete Project"
                cancelText="Cancel"
                isDestructive={true}
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default ProjectFocusedView;
