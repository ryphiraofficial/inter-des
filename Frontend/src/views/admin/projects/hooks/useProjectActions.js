import { projectAPI } from '../../../../models/api';

export const useProjectActions = ({ 
    fetchProjects, setSelectedProject, navigate, urlProjectId 
}) => {
    
    const handleStageChange = async (projectId, newStage) => {
        try {
            await projectAPI.updateStage(projectId, { stage: newStage });
            fetchProjects();
        } catch (err) {
            console.error('Error updating stage:', err);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await projectAPI.delete(projectId);
            fetchProjects();
            handleClose();
        } catch (err) {
            console.error('Error deleting project:', err);
            throw err;
        }
    };

    const handleClose = () => {
        if (urlProjectId) {
            navigate(-1);
        } else {
            setSelectedProject(null);
        }
    };

    return { handleStageChange, handleDeleteProject, handleClose };
};
