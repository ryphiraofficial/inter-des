import React from 'react';
import { Briefcase, MapPin, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusColors = {
    'Active':    { bg: '#d1fae5', color: '#065f46' },
    'Planning':  { bg: '#dbeafe', color: '#1e40af' },
    'On Hold':   { bg: '#fef3c7', color: '#92400e' },
    'Completed': { bg: '#ede9fe', color: '#5b21b6' },
};

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();
    const sc = statusColors[project.status] || { bg: '#f1f5f9', color: '#475569' };
    return (
        <div className="site-project-card" onClick={() => navigate(`/site/projects/${project._id}`)}>
            <div className="site-project-card-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="site-project-icon">
                        <Briefcase size={16} color="white" />
                    </div>
                    <div>
                        <div className="site-project-name">{project.projectName}</div>
                        <div className="site-project-role">Your role: <span style={{ color: '#10b981', fontWeight: 600 }}>{project.myRole}</span></div>
                    </div>
                </div>
                <span className="site-badge" style={{ background: sc.bg, color: sc.color }}>
                    {project.status}
                </span>
            </div>

            {project.location && (
                <div className="site-project-location">
                    <MapPin size={12} /> {project.location}
                </div>
            )}

            {/* Progress bar */}
            <div className="site-project-progress">
                <div className="site-progress-header">
                    <span>Progress</span>
                    <span>{project.progress || 0}%</span>
                </div>
                <div className="site-progress-bar">
                    <div className="site-progress-fill" style={{ width: `${project.progress || 0}%` }} />
                </div>
            </div>

            <div className="site-project-footer">
                <div className="site-project-pm">
                    <Users size={12} />
                    {project.projectManager?.fullName && <span>PM: {project.projectManager.fullName.split(' ')[0]}</span>}
                </div>
                <div className="site-project-link">
                    View Details <ArrowRight size={12} />
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
