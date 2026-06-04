import React from 'react';
import { Target, MapPin, Users, ArrowRight } from 'lucide-react';
import Skeleton from '../../../common/Skeleton';

const ProjectsGrid = ({ loading, projects, setSelectedSourcingProject }) => {
    return (
        <div className="sourcing-projects-grid">
            {loading ? (
                [1, 2, 3].map(idx => (
                    <div key={idx} className="sourcing-project-card project-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-header-row">
                            <div className="title-grp" style={{ width: '70%' }}>
                                <Skeleton width="80%" height="18px" style={{ marginBottom: '8px' }} />
                                <Skeleton width="50%" height="12px" />
                            </div>
                            <Skeleton width="40px" height="40px" borderRadius="12px" />
                        </div>
                        <div className="project-details-mini" style={{ flex: 1, marginTop: '20px' }}>
                            <Skeleton width="60%" height="12px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="75%" height="12px" />
                        </div>
                        <div className="card-footer-action" style={{ justifyContent: 'flex-start' }}>
                            <Skeleton width="120px" height="14px" />
                        </div>
                    </div>
                ))
            ) : projects.length === 0 ? (
                <div className="sourcing-empty-state">
                    <Target size={48} />
                    <h4>No Procurement Projects</h4>
                    <p>There are currently no active projects in the procurement stage.</p>
                </div>
            ) : (
                projects.map(project => (
                    <div 
                        key={project._id} 
                        onClick={() => setSelectedSourcingProject(project)}
                        className="sourcing-project-card project-card-hover"
                    >
                        <div className="card-header-row">
                            <div className="title-grp">
                                <h4>{project.name}</h4>
                                <span className="project-id">{project.projectNumber}</span>
                            </div>
                            <div className="icon-badge">
                                <Target size={20} />
                            </div>
                        </div>
                        
                        <div className="project-details-mini">
                            <div className="detail-item">
                                <MapPin size={14} /> {project.location || 'Location not specified'}
                            </div>
                            <div className="detail-item">
                                <Users size={14} /> Client: {project.client?.name || 'N/A'}
                            </div>
                        </div>

                        <div className="card-footer-action">
                            <span>Start Sourcing</span>
                            <ArrowRight size={16} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProjectsGrid;
