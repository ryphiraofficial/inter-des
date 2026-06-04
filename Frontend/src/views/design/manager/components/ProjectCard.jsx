import React from 'react';
import { Briefcase, Users, Clock, ArrowRight, Package } from 'lucide-react';

const ProjectCard = ({ project, onHandoffInitiate, onReviewRequest, onAssignStaff }) => {
    return (
        <div className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="card-media">
                <img src={project.previewImage} alt={project.name} />
                <div className={`status-tag ${project.statusClass}`}>{project.displayStatus}</div>
            </div>
            
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div className="card-header-main">
                    <h3 className="project-name">{project.name}</h3>
                    <span className="project-num">{project.projectNumber}</span>
                </div>

                <div className="card-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem', flex: 1 }}>
                    <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                        <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '8px' }}><Briefcase size={12} /></div>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.client?.name || 'Private Client'}</span>
                    </div>
                    <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                        <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '8px' }}><Users size={12} color="#2563eb" /></div>
                        <span style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {project.projectTasks?.length > 0 
                                ? project.projectTasks.flatMap(t => t.assignedTo || []).map(s => s.name || s.fullName).filter((v, i, a) => v && a.indexOf(v) === i).join(', ') || 'Unassigned' 
                                : 'Pending'}
                        </span>
                    </div>
                    <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', gridColumn: 'span 2' }}>
                        <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '8px' }}><Clock size={12} color="#ef4444" /></div>
                        <span>
                            <strong style={{ color: '#ef4444' }}>{project.displayStatus === 'Assigned' ? 'Due: ' : 'Deadline: '}</strong>
                            {project.statusDueDate ? new Date(project.statusDueDate).toLocaleDateString() : 'TBD'}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    {/* Handoff to Procurement Button */}
                    {project.displayStatus === 'Approved' && !['Procurement', 'Production', 'Completed'].includes(project.stage) && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onHandoffInitiate(project); }}
                            className="action-btn-primary"
                            style={{
                                flex: 1,
                                minWidth: '120px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.15s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
                        >
                            Handoff to Procurement <ArrowRight size={14} />
                        </button>
                    )}

                    {/* Material Review Button */}
                    {project.pendingMaterials?.length > 0 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onReviewRequest(project._id); }}
                            className="action-btn-secondary"
                            style={{
                                flex: 1,
                                minWidth: '120px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: '#fef2f2',
                                color: '#ef4444',
                                border: '1px solid #fee2e2',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.15s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#fde2e2'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                        >
                            Review {project.pendingMaterials.length} Materials <Package size={14} />
                        </button>
                    )}

                    {/* Assign Staff Button */}
                    {project.stage === 'Design' && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onAssignStaff(project); }}
                            style={{
                                flex: 1,
                                minWidth: '120px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: project.projectTasks?.length === 0 ? '#2563eb' : '#f1f5f9',
                                color: project.projectTasks?.length === 0 ? '#ffffff' : '#475569',
                                border: project.projectTasks?.length === 0 ? 'none' : '1px solid #e2e8f0',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.15s'
                            }}
                            onMouseOver={(e) => {
                                if (project.projectTasks?.length === 0) {
                                    e.currentTarget.style.background = '#1d4ed8';
                                } else {
                                    e.currentTarget.style.background = '#e2e8f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (project.projectTasks?.length === 0) {
                                    e.currentTarget.style.background = '#2563eb';
                                } else {
                                    e.currentTarget.style.background = '#f1f5f9';
                                }
                            }}
                        >
                            <Users size={14} />
                            {project.projectTasks?.length === 0 ? 'Assign Staff' : 'Assign More'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
