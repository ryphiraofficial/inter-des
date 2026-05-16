import React from 'react';
import { Users, Play, CheckCircle, Pause, Clock, Flag, User, Calendar } from 'lucide-react';
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

const ProjectWorkflow = ({ projects, loading, stageFilter, setSelectedProject, groupBy = 'none' }) => {
    const stages = ['Design', 'Procurement', 'Production', 'Completed'];

    const getGroups = () => {
        if (loading) return [{ id: 'loading', title: null, projects: [] }];
        if (groupBy === 'none' || !groupBy) return [{ id: 'all', title: null, projects }];
        
        if (groupBy === 'priority') {
            const priorities = ['Critical', 'High', 'Medium', 'Low'];
            return priorities.map(p => ({
                id: p,
                title: `${p} Priority`,
                projects: projects.filter(proj => proj.priority === p)
            })).filter(g => g.projects.length > 0);
        }
        
        if (groupBy === 'client') {
            const clientNames = [...new Set(projects.map(p => p.client?.name || 'No Client'))];
            return clientNames.sort().map(c => ({
                id: c,
                title: c,
                projects: projects.filter(proj => (proj.client?.name || 'No Client') === c)
            }));
        }

        if (groupBy === 'deadline') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

            return [
                { id: 'overdue', title: 'Overdue', projects: projects.filter(p => p.targetEndDate && new Date(p.targetEndDate) < today && p.stage !== 'Completed') },
                { id: 'this-week', title: 'Due This Week', projects: projects.filter(p => p.targetEndDate && new Date(p.targetEndDate) >= today && new Date(p.targetEndDate) < nextWeek) },
                { id: 'later', title: 'Upcoming', projects: projects.filter(p => !p.targetEndDate || (p.targetEndDate && new Date(p.targetEndDate) >= nextWeek)) }
            ].filter(g => g.projects.length > 0);
        }

        return [{ id: 'all', title: null, projects }];
    };

    const groups = getGroups();

    const renderProjectCard = (project, stage) => (
        <div key={project._id} className="project-card" onClick={() => setSelectedProject(project)}>
            <div className="card-header">
                <span className="project-name">{project.name}</span>
                <span className="project-code">{project.projectNumber}</span>
            </div>
            <div className="card-client">
                <Users size={14} /><span>{project.client?.name || 'No client'}</span>
            </div>
            {project.priority && groupBy !== 'priority' && (
                <div className="card-client" style={{ marginTop: '-4px', marginBottom: '8px', opacity: 0.8 }}>
                    <Flag size={13} style={{ color: ['High', 'Critical'].includes(project.priority) ? '#ef4444' : '#64748b' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{project.priority} Priority</span>
                </div>
            )}
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
    );

    const renderSkeletons = () => [1, 2].map(i => (
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
    ));

    return (
        <div className={`workflow-container ${groupBy !== 'none' ? 'swimlane-view' : ''}`}>
            {groups.map((group, groupIdx) => (
                <div key={group.id} className="swimlane-section">
                    {group.title && (
                        <div className="swimlane-header-row">
                            <h3 className="swimlane-title">{group.title}</h3>
                            <span className="swimlane-count">{group.projects.length} Projects</span>
                        </div>
                    )}
                    
                    <div className="workflow-stages">
                        {stages.map(stage => {
                            const stageProjects = group.projects.filter(p => p.stage === stage);
                            const showHeader = groupBy === 'none' || groupIdx === 0;

                            return (
                                <div 
                                    key={stage} 
                                    className={`stage-column ${stageFilter === stage ? 'active' : ''}`}
                                >
                                    {showHeader && (
                                        <div className="stage-header" style={{ borderColor: getStageColor(stage) }}>
                                            <span className="stage-name" style={{ color: getStageColor(stage) }}>{stage}</span>
                                            <span className="stage-count">
                                                {loading ? '...' : projects.filter(p => p.stage === stage).length}
                                            </span>
                                        </div>
                                    )}
                                    <div className="stage-projects">
                                        {loading ? renderSkeletons() : stageProjects.map(project => renderProjectCard(project, stage))}
                                        {!loading && stageProjects.length === 0 && groupBy !== 'none' && (
                                            <div style={{ padding: '24px 12px', textAlign: 'center', opacity: 0.3, fontSize: '0.75rem', fontStyle: 'italic' }}>
                                                No projects
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectWorkflow;
