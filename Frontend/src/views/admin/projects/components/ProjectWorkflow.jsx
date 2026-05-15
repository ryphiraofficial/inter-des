import React from 'react';
import { Users, Play, CheckCircle, Pause, Clock } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

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

const ProjectWorkflow = ({ projects, loading, stageFilter, setSelectedProject }) => {
    const stages = ['Design', 'Procurement', 'Production', 'Completed'];

    return (
        <div className="workflow-stages">
            {stages.map(stage => (
                <div 
                    key={stage} 
                    className={`stage-column ${stageFilter === stage ? 'active' : ''}`}
                >
                    <div className="stage-header" style={{ borderColor: getStageColor(stage) }}>
                        <span className="stage-name" style={{ color: getStageColor(stage) }}>{stage}</span>
                        <span className="stage-count">
                            {loading ? '...' : projects.filter(p => p.stage === stage).length}
                        </span>
                    </div>
                    <div className="stage-projects">
                        {loading ? (
                            [1, 2].map(i => (
                                <div key={i} className="project-card skeleton" style={{ background: 'white', cursor: 'default' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <Skeleton width="120px" height="18px" /><Skeleton width="80px" height="14px" />
                                    </div>
                                    <Skeleton width="100px" height="14px" />
                                    <div style={{ margin: '15px 0' }}><Skeleton width="100%" height="8px" /></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Skeleton width="60px" height="16px" /><Skeleton width="80px" height="16px" />
                                    </div>
                                </div>
                            ))
                        ) : projects
                            .filter(p => p.stage === stage)
                            .map(project => (
                                <div key={project._id} className="project-card" onClick={() => setSelectedProject(project)}>
                                    <div className="card-header">
                                        <span className="project-name">{project.name}</span>
                                        <span className="project-code">{project.projectNumber}</span>
                                    </div>
                                    <div className="card-client">
                                        <Users size={14} /><span>{project.client?.name || 'No client'}</span>
                                    </div>
                                    <div className="card-progress">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${project.progress || 0}%`, backgroundColor: getStageColor(stage) }}
                                            ></div>
                                        </div>
                                        <span>{project.progress || 0}%</span>
                                    </div>
                                    <div className="card-footer">
                                        <span className="budget">{formatCurrency(project.budget)}</span>
                                        <span className="status" style={{ color: getStageColor(stage) }}>
                                            {getStatusIcon(project.status)}{project.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectWorkflow;
