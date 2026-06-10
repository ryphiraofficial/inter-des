import React from 'react';
import { X, Briefcase, FileText, Users, Calendar, AlignLeft, Info } from 'lucide-react';
import './ProjectDetailsDrawer.css';

const ProjectDetailsDrawer = ({ project, onClose }) => {
    if (!project) return null;

    // Helper to render staff names
    const getAssignedStaff = () => {
        if (!project.projectTasks || project.projectTasks.length === 0) return 'Unassigned';
        const staff = project.projectTasks
            .flatMap(t => t.assignedTo || [])
            .map(s => s.name || s.fullName)
            .filter((v, i, a) => v && a.indexOf(v) === i);
        return staff.length > 0 ? staff.join(', ') : 'Unassigned';
    };

    return (
        <div className="dm-drawer-overlay" onClick={onClose}>
            <div className="dm-drawer-content" onClick={e => e.stopPropagation()}>
                <div className="dm-drawer-header">
                    <div>
                        <h2>{project.name}</h2>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{project.projectNumber}</span>
                    </div>
                    <button className="dm-drawer-close" onClick={onClose}><X size={20} /></button>
                </div>
                
                <div className="dm-drawer-body">
                    {/* Media Preview */}
                    {project.previewImage && (
                        <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', height: '200px' }}>
                            <img 
                                src={project.previewImage} 
                                alt={project.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    {/* Status & General Info */}
                    <div className="dm-detail-section">
                        <h3><Info size={16} /> Overview</h3>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Status</span>
                            <span className="dm-detail-value">
                                <span className={`dm-status-badge ${project.statusClass}`}>
                                    {project.displayStatus}
                                </span>
                            </span>
                        </div>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Stage</span>
                            <span className="dm-detail-value">{project.stage || 'N/A'}</span>
                        </div>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Priority</span>
                            <span className="dm-detail-value" style={{ 
                                color: project.priority === 'High' || project.priority === 'Critical' ? '#ef4444' : '#f59e0b'
                            }}>
                                {project.priority || 'Medium'}
                            </span>
                        </div>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Design Progress</span>
                            <span className="dm-detail-value">
                                {project.designStatus || 
                                (project.designComplete || ['Procurement', 'Production', 'Completed'].includes(project.stage) 
                                    ? 'Design Complete' 
                                    : 'Pending')}
                            </span>
                        </div>
                    </div>

                    {/* Client Details */}
                    <div className="dm-detail-section">
                        <h3><Briefcase size={16} /> Client Details</h3>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Client Name</span>
                            <span className="dm-detail-value">{project.client?.name || 'Private Client'}</span>
                        </div>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Phone</span>
                            <span className="dm-detail-value">{project.client?.phone || 'N/A'}</span>
                        </div>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Email</span>
                            <span className="dm-detail-value">{project.client?.email || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Team & Timeline */}
                    <div className="dm-detail-section">
                        <h3><Users size={16} /> Team & Timeline</h3>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Assigned Staff</span>
                            <span className="dm-detail-value">{getAssignedStaff()}</span>
                        </div>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Total Tasks</span>
                            <span className="dm-detail-value">{project.projectTasks?.length || 0}</span>
                        </div>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Created On</span>
                            <span className="dm-detail-value">
                                {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div className="dm-detail-row">
                            <span className="dm-detail-label">Deadline</span>
                            <span className="dm-detail-value" style={{ color: '#ef4444' }}>
                                {project.statusDueDate ? new Date(project.statusDueDate).toLocaleDateString() : 'TBD'}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                        <div className="dm-detail-section">
                            <h3><AlignLeft size={16} /> Description</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                                {project.description}
                            </p>
                        </div>
                    )}
                </div>

                <div className="dm-drawer-footer">
                    <button 
                        className="action-btn-primary" 
                        onClick={onClose}
                        style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsDrawer;
