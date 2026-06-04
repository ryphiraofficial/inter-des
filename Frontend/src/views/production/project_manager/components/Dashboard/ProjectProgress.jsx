import React from 'react';
import { BarChart3, ArrowRight, Calendar } from 'lucide-react';

const getStatusClass = (status) => {
    const map = { 'Active': 'active', 'On Hold': 'on-hold', 'Planning': 'planning', 'Completed': 'completed' };
    return map[status] || 'default';
};

const ProjectProgress = ({ projects }) => {
    return (
        <div className="pm-card pm-project-progress-card">
            <div className="pm-card-header">
                <h3><BarChart3 size={18} /> Project Progress</h3>
                <button className="pm-view-all-btn">View All <ArrowRight size={14} /></button>
            </div>
            <div className="pm-project-progress-list">
                {projects.map(project => (
                    <div className="pm-project-row" key={project._id}>
                        <div className="pm-project-row-info">
                            <div className="pm-project-row-top">
                                <span className="pm-project-name">{project.projectName}</span>
                                <span className={`pm-status-badge ${getStatusClass(project.status)}`}>{project.status}</span>
                            </div>
                            <div className="pm-project-row-meta">
                                {project.endDate && <span><Calendar size={13} /> {new Date(project.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                            </div>
                        </div>
                        <div className="pm-project-row-progress">
                            <div className="pm-progress-bar-v2">
                                <div
                                    className="pm-progress-fill-v2"
                                    style={{ width: `${project.progress || 0}%` }}
                                    data-progress={`${project.progress || 0}%`}
                                ></div>
                            </div>
                            <span className="pm-progress-text">{project.progress || 0}%</span>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && <p className="pm-empty-text" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No projects found.</p>}
            </div>
        </div>
    );
};

export default ProjectProgress;
