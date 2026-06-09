import React, { useState } from 'react';
import { Briefcase, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import '../css/DesignStudio.css';
import { useDesignProjects } from './hooks/useDesignProjects';
import ProjectCard from './components/ProjectCard';
import ProjectDetailsDrawer from './components/ProjectDetailsDrawer';

const Projects = ({
    projects = [],
    tasks = [],
    getImageUrl,
    materialRequests = [],
    onReviewRequest,
    onUpdateStatus,
    onHandoffInitiate,
    onAssignStaff,
}) => {
    const [selectedProject, setSelectedProject] = useState(null);

    const {
        activeFilter,
        setActiveFilter,
        projectsWithStatus,
        pendingCount,
        revisionCount,
        otherCount,
        filteredProjects
    } = useDesignProjects({ projects, tasks, materialRequests, getImageUrl });

    const handleViewProject = (project) => {
        setSelectedProject(project);
    };

    return (
        <div className="portfolio-modern fade-in" style={{ paddingTop: '1rem' }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveFilter('All')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: activeFilter === 'All' ? 'none' : '1px solid #e2e8f0',
                        background: activeFilter === 'All' ? '#0f172a' : '#ffffff',
                        color: activeFilter === 'All' ? '#ffffff' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                    }}
                >
                    <Briefcase size={16} /> All Projects
                    <span style={{ background: activeFilter === 'All' ? '#334155' : '#f1f5f9', color: activeFilter === 'All' ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{projectsWithStatus.length}</span>
                </button>
                <button
                    onClick={() => setActiveFilter('Pending')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: activeFilter === 'Pending' ? 'none' : '1px solid #e2e8f0',
                        background: activeFilter === 'Pending' ? '#3b82f6' : '#ffffff',
                        color: activeFilter === 'Pending' ? '#ffffff' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                    }}
                >
                    <Clock size={16} /> Pending
                    <span style={{ background: activeFilter === 'Pending' ? '#60a5fa' : '#f1f5f9', color: activeFilter === 'Pending' ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{pendingCount}</span>
                </button>
                <button
                    onClick={() => setActiveFilter('Revision Required')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: activeFilter === 'Revision Required' ? 'none' : '1px solid #e2e8f0',
                        background: activeFilter === 'Revision Required' ? '#f59e0b' : '#ffffff',
                        color: activeFilter === 'Revision Required' ? '#ffffff' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                    }}
                >
                    <AlertCircle size={16} /> Revision Required
                    <span style={{ background: activeFilter === 'Revision Required' ? '#fbbf24' : '#f1f5f9', color: activeFilter === 'Revision Required' ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{revisionCount}</span>
                </button>
                <button
                    onClick={() => setActiveFilter('Other')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: activeFilter === 'Other' ? 'none' : '1px solid #e2e8f0',
                        background: activeFilter === 'Other' ? '#64748b' : '#ffffff',
                        color: activeFilter === 'Other' ? '#ffffff' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                    }}
                >
                    <TrendingUp size={16} /> Other
                    <span style={{ background: activeFilter === 'Other' ? '#94a3b8' : '#f1f5f9', color: activeFilter === 'Other' ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{otherCount}</span>
                </button>
            </div>

            <div className="portfolio-grid">
                {filteredProjects.map(project => (
                    <ProjectCard
                        key={project._id}
                        project={project}
                        onHandoffInitiate={onHandoffInitiate}
                        onReviewRequest={onReviewRequest}
                        onAssignStaff={onAssignStaff}
                        onViewProject={handleViewProject}
                    />
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #cbd5e1', marginTop: '2rem' }}>
                    <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No projects found in this category</p>
                </div>
            )}

            {selectedProject && (
                <ProjectDetailsDrawer 
                    project={selectedProject} 
                    onClose={() => setSelectedProject(null)} 
                />
            )}
        </div>
    );
};

export default Projects;
