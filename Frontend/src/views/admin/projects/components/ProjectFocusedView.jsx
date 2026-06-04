import React, { useState } from 'react';
import { ArrowRight, Building2, Calendar, Users, Play, CheckCircle, Pause, Clock, Trash2, FileText, Clock3, Wallet } from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import AlertDialog from '../../components/AlertDialog';
import { useUpdateProjectMutation } from '../../../../store/api/adminApi';
import ProjectInfoCards from './ProjectInfoCards';

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
    const [isCollecting, setIsCollecting] = useState(false);
    const [updateProject] = useUpdateProjectMutation();

    const paidAmount = project ? Math.max(project.advanceAmount || 0, project.collectedAmount || 0) : 0;
    const remainingBalance = project ? Math.max(0, project.budget - paidAmount) : 0;

    const handleCollectBalance = async () => {
        if (!project) return;
        setIsCollecting(true);
        try {
            await updateProject({ id: project._id, 
                paymentCollectionStatus: 'Pending Assignment',
                notes: (project.notes || '') + '\n[Admin Requested Balance Payment Collection]'
            }).unwrap();
            // Optimistic update
            project.paymentCollectionStatus = 'Pending Assignment';
        } catch (error) {
            console.error("Failed to request collection:", error);
            alert("Failed to send collection request.");
        } finally {
            setIsCollecting(false);
        }
    };

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
                        <div className="stat-content" style={{ flex: 1 }}>
                            <label>Total Budget</label>
                            <h3 className="text-emerald" style={{ marginBottom: '8px' }}>{formatCurrency(project.budget)}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed rgba(16, 185, 129, 0.3)', fontSize: '0.75rem' }}>
                                <div>
                                    <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Total Paid</span>
                                    <strong style={{ color: '#10b981' }}>{formatCurrency(paidAmount)}</strong>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Balance</span>
                                    <strong style={{ color: '#f59e0b' }}>{formatCurrency(remainingBalance)}</strong>
                                    {remainingBalance > 0 && (
                                        <button 
                                            onClick={handleCollectBalance}
                                            disabled={isCollecting || project.paymentCollectionStatus === 'Pending Assignment'}
                                            style={{ 
                                                marginTop: '6px', 
                                                padding: '4px 10px', 
                                                fontSize: '0.65rem', 
                                                background: project.paymentCollectionStatus === 'Pending Assignment' ? '#f1f5f9' : '#e0e7ff', 
                                                color: project.paymentCollectionStatus === 'Pending Assignment' ? '#94a3b8' : '#4f46e5', 
                                                border: 'none', 
                                                borderRadius: '4px', 
                                                cursor: project.paymentCollectionStatus === 'Pending Assignment' ? 'default' : 'pointer', 
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <Wallet size={12} />
                                            {isCollecting ? 'Requesting...' : (project.paymentCollectionStatus === 'Pending Assignment' ? 'Requested' : 'Collect Balance')}
                                        </button>
                                    )}
                                </div>
                            </div>
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

                <ProjectInfoCards project={project} getStageColor={getStageColor} />
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
