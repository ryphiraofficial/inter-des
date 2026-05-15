import { siteVisitAPI } from '../../../../models/api';

export const useTasksDetails = ({ 
    setSelectedTask, setShowDetailsModal, setVisitsLoading, setTaskVisits, document 
}) => {
    
    const handleViewDetails = async (task) => {
        setSelectedTask(task);
        setShowDetailsModal(true);
        setVisitsLoading(true);
        document.body.style.overflow = 'hidden';
        try {
            const res = await siteVisitAPI.getByTask(task._id);
            if (res.success) {
                setTaskVisits(res.data);
            }
        } catch (err) {
            console.error('Error fetching task site visits:', err);
        } finally {
            setVisitsLoading(false);
        }
    };

    return { handleViewDetails };
};
