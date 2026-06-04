import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectState } from './projects/hooks/useProjectState';
import { useProjectData } from './projects/hooks/useProjectData';
import { useProjectActions } from './projects/hooks/useProjectActions';

import ProjectFilterBar from './projects/components/ProjectFilterBar';
import ProjectWorkflow from './projects/components/ProjectWorkflow';
import ProjectKPIs from './projects/components/ProjectKPIs';
import ProjectTabs from './projects/components/ProjectTabs';
import ProjectTable from './projects/components/ProjectTable';
import ProjectTimeline from './projects/components/ProjectTimeline';
import ProjectDetailModal from './projects/components/ProjectDetailModal';
import ProjectEditModal from './projects/components/ProjectEditModal';
import ProjectFocusedView from './projects/components/ProjectFocusedView';
import AlertDialog from './components/AlertDialog';
import { TableSkeleton, StatsSkeleton } from './components/Skeleton';

import './css/Projects.css';

const Projects = () => {
    const navigate = useNavigate();
    const { id: urlProjectId } = useParams();
    const state = useProjectState();
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const { fetchProjects } = useProjectData({
        setProjects: state.setProjects,
        setLoading: state.setLoading,
        setSelectedProject: state.setSelectedProject,
        stageFilter: state.stageFilter,
        statusFilter: state.statusFilter,
        urlProjectId,
        setSearchTerm: state.setSearchTerm
    });

    const actions = useProjectActions({
        fetchProjects,
        setSelectedProject: state.setSelectedProject,
        navigate,
        urlProjectId
    });

    const handleConfirmDeleteList = async () => {
        if (!projectToDelete) return;
        setIsDeleting(true);
        try {
            await actions.handleDeleteProject(projectToDelete._id);
            setProjectToDelete(null);
        } catch (error) {
            console.error("Failed to delete project:", error);
            alert("Failed to delete project. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const { setShowModal } = state;

    useEffect(() => {
        const handleOpenModal = () => setShowModal(true);
        window.addEventListener('open-create-project-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-project-modal', handleOpenModal);
    }, [setShowModal]);

    const filteredProjects = state.projects.filter(p => 
        p.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        p.projectNumber?.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    if (urlProjectId || state.selectedProject) {
        const projectToView = urlProjectId ? state.selectedProject : state.selectedProject;
        return (
            <ProjectFocusedView 
                project={projectToView} 
                loading={state.loading} 
                handleClose={actions.handleClose}
                handleDeleteProject={actions.handleDeleteProject}
            />
        );
    }

    if (state.loading) {
        return (
            <div className="projects-page" style={{ padding: '2rem 2.5rem', minHeight: '100vh', margin: '-24px -24px 0 -24px', maxWidth: 'none' }}>
                <StatsSkeleton count={6} />
                <div style={{ marginTop: '2rem' }}>
                    <TableSkeleton rows={8} cols={5} />
                </div>
            </div>
        );
    }

    const renderActiveView = () => {
        const activeProjects = filteredProjects.filter(p => p.stage !== 'Completed' && p.status !== 'Completed');
        const archivedProjects = filteredProjects.filter(p => p.stage === 'Completed' || p.status === 'Completed');

        switch (state.activeView) {
            case 'table':
                return <ProjectTable projects={activeProjects} onProjectClick={state.setSelectedProject} onEditClick={setProjectToEdit} onDeleteClick={setProjectToDelete} />;
            case 'timeline':
                return <ProjectTimeline projects={activeProjects} />;
            case 'archive': 
                return <ProjectTable projects={archivedProjects} onProjectClick={state.setSelectedProject} onEditClick={setProjectToEdit} onDeleteClick={setProjectToDelete} />;
            case 'kanban':
            default: 
                return (
                    <ProjectWorkflow 
                        projects={activeProjects}
                        loading={state.loading}
                        stageFilter={state.stageFilter}
                        setSelectedProject={state.setSelectedProject}
                        groupBy={state.groupBy}
                    />
                );
        }
    };

    return (
        <div className="projects-page">

            <ProjectKPIs projects={state.projects} />

            <div className="projects-controls">
                <ProjectTabs activeView={state.activeView} setActiveView={state.setActiveView} />
                
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
                    showGroupByDropdown={state.showGroupByDropdown}
                    setShowGroupByDropdown={state.setShowGroupByDropdown}
                    hideSearch={true}
                    groupBy={state.groupBy}
                    setGroupBy={state.setGroupBy}
                />
            </div>

            <div className="view-content">
                {renderActiveView()}
            </div>

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
                onUpdate={fetchProjects}
            />

            <ProjectEditModal
                project={projectToEdit}
                onClose={() => setProjectToEdit(null)}
                onUpdate={fetchProjects}
            />

            <AlertDialog 
                isOpen={!!projectToDelete}
                onClose={() => setProjectToDelete(null)}
                onConfirm={handleConfirmDeleteList}
                title="Delete Project"
                description={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone. This will permanently delete the project and all related tasks/data from the system.`}
                confirmText="Delete Project"
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default Projects;
