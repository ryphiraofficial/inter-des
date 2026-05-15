import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectState } from './projects/hooks/useProjectState';
import { useProjectData } from './projects/hooks/useProjectData';
import { useProjectActions } from './projects/hooks/useProjectActions';

import ProjectFilterBar from './projects/components/ProjectFilterBar';
import ProjectWorkflow from './projects/components/ProjectWorkflow';
import ProjectDetailModal from './projects/components/ProjectDetailModal';
import ProjectFocusedView from './projects/components/ProjectFocusedView';

import './css/Projects.css';

const Projects = () => {
    const navigate = useNavigate();
    const { id: urlProjectId } = useParams();
    const state = useProjectState();
    
    const { fetchProjects } = useProjectData({
        setProjects: state.setProjects,
        setLoading: state.setLoading,
        setSelectedProject: state.setSelectedProject,
        stageFilter: state.stageFilter,
        statusFilter: state.statusFilter,
        urlProjectId
    });

    const actions = useProjectActions({
        fetchProjects,
        setSelectedProject: state.setSelectedProject,
        navigate,
        urlProjectId
    });

    useEffect(() => {
        const handleOpenModal = () => state.setShowModal(true);
        window.addEventListener('open-create-project-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-project-modal', handleOpenModal);
    }, []);

    const filteredProjects = state.projects.filter(p => 
        p.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        p.projectNumber?.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    // If ID is in URL, show Focused View
    if (urlProjectId) {
        return (
            <ProjectFocusedView 
                project={state.selectedProject} 
                loading={state.loading} 
                handleClose={actions.handleClose} 
            />
        );
    }

    return (
        <div className="projects-page" style={{ padding: '2rem 2.5rem', minHeight: '100vh', margin: '-24px -24px 0 -24px', maxWidth: 'none' }}>
            <ProjectFilterBar 
                searchTerm={state.searchTerm}
                setSearchTerm={state.setSearchTerm}
                stageFilter={state.stageFilter}
                setStageFilter={state.setStageFilter}
                statusFilter={state.statusFilter}
                setStatusFilter={state.setStatusFilter}
                showStageDropdown={state.showStageDropdown}
                setShowStageDropdown={state.setShowStageDropdown}
                showStatusDropdown={state.showStatusDropdown}
                setShowStatusDropdown={state.setShowStatusDropdown}
            />

            <ProjectWorkflow 
                projects={filteredProjects}
                loading={state.loading}
                stageFilter={state.stageFilter}
                setSelectedProject={state.setSelectedProject}
            />

            {state.showModal && (
                <div className="modal-overlay" onClick={() => state.setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Project</h2>
                            <button className="close-btn" onClick={() => state.setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Project creation from approved quotations is automatic.</p>
                            <p>Quotations can be approved from the Quotations section.</p>
                        </div>
                    </div>
                </div>
            )}

            <ProjectDetailModal 
                selectedProject={state.selectedProject}
                handleClose={actions.handleClose}
                handleStageChange={actions.handleStageChange}
            />
        </div>
    );
};

export default Projects;
