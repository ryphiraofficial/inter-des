import React, { useState } from 'react';
import { ArrowRight, Building2, Calendar, Users, Play, CheckCircle, Pause, Clock, Trash2 } from 'lucide-react';
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
                    <div className="info-block">
                        <label className="premium-label">Project Status</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 600 }}>{getStatusIcon(project.status)}{project.status}</div>
                    </div>
                    <div className="info-block">
                        <label className="premium-label">Financial Overview</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{formatCurrency(project.budget)} Budget</div>
                    </div>
                    <div className="info-block">
                        <label className="premium-label">Completion</label>
                        <div className="completion-bar-wrapper">
                            <div style={{ position: 'absolute', height: '100%', width: `${project.progress || 0}%`, background: getStageColor(project.stage), borderRadius: '4px' }}></div>
                            <span className="completion-pct">{project.progress || 0}%</span>
                        </div>
                    </div>
                </div>

                <div className="info-cards-grid">
                    <div className="info-card-premium">
                        <h4><Building2 size={18} /> Client Information</h4>
                        <div className="info-content-grid">
                            <div><span className="label">Name:</span> <strong>{project.client?.name}</strong></div>
                            <div><span className="label">Email:</span> {project.client?.email || 'N/A'}</div>
                            <div><span className="label">Phone:</span> {project.client?.phone || 'N/A'}</div>
                        </div>
                    </div>
                    <div className="info-card-premium">
                        <h4><Calendar size={18} /> Timeline</h4>
                        <div className="info-content-grid">
                            <div><span className="label">Created On:</span> {new Date(project.createdAt).toLocaleDateString()}</div>
                            <div><span className="label">Last Updated:</span> {new Date(project.updatedAt).toLocaleDateString()}</div>
                            <div><span className="label">Current Stage:</span> <strong>{project.stage}</strong></div>
                        </div>
                    </div>
                    <div className="info-card-premium">
                        <h4><Users size={18} /> Project Team</h4>
                        <div className="info-content-grid">
                            <div><span className="label">Design Mgr:</span> <strong>{project.assignedDesignManager?.fullName || 'Unassigned'}</strong></div>
                            <div><span className="label">Procurement:</span> <strong>{project.assignedProcurementManager?.fullName || 'Unassigned'}</strong></div>
                            <div><span className="label">Production:</span> <strong>{project.assignedProductionManager?.fullName || 'Unassigned'}</strong></div>
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
