import { useUpdateProjectMutation, useDeleteProjectMutation } from '../../../../store/api/adminApi';

export const useProjectActions = ({ 
    fetchProjects, setSelectedProject, navigate, urlProjectId 
}) => {
    
    const [updateProject] = useUpdateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();

    const handleStageChange = async (projectId, newStage) => {
        try {
            await updateProject({ id: projectId, stage: newStage }).unwrap();
            fetchProjects();
        } catch (err) {
            console.error('Error updating stage:', err);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await deleteProject(projectId).unwrap();
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
