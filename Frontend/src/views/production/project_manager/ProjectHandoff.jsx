import React from 'react';
import '../css/ProductionManagement.css';
import { useProjectHandoff } from './hooks/useProjectHandoff';
import HandoffSkeleton from './components/ProjectHandoff/HandoffSkeleton';
import HandoffEmptyState from './components/ProjectHandoff/HandoffEmptyState';
import HandoffCard from './components/ProjectHandoff/HandoffCard';

const ProjectHandoff = () => {
    const {
        projects,
        loading,
        submitting,
        assignments,
        handleAssign,
        handleAcceptHandoff,
        projectEngineers,
        siteEngineers,
        siteSupervisors
    } = useProjectHandoff();

    return (
        <div className="pm-dashboard">
            {loading ? (
                <HandoffSkeleton />
            ) : projects.length === 0 ? (
                <HandoffEmptyState />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '2rem' }}>
                    {projects.map(project => (
                        <HandoffCard 
                            key={project._id}
                            project={project}
                            submitting={submitting[project._id]}
                            currAssigned={assignments[project._id] || {}}
                            handleAssign={handleAssign}
                            handleAcceptHandoff={handleAcceptHandoff}
                            projectEngineers={projectEngineers}
                            siteEngineers={siteEngineers}
                            siteSupervisors={siteSupervisors}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectHandoff;
