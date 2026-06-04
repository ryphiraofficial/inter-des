import { adminApi } from '../../../../store/api/adminApi';
import { useDispatch } from 'react-redux';

export const useTasksDetails = ({ 
    setSelectedTask, setShowDetailsModal, setVisitsLoading, setTaskVisits, document 
}) => {
    const dispatch = useDispatch();

    const handleViewDetails = async (task) => {
        setSelectedTask(task);
        setShowDetailsModal(true);
        setVisitsLoading(true);
        document.body.style.overflow = 'hidden';
        try {
            const res = await dispatch(adminApi.endpoints.getSiteVisitsByTask.initiate(task._id)).unwrap();
            if (res.success) {
                setTaskVisits(res.data);
            } else if (res) {
                setTaskVisits(res); // in case backend returns direct array
            }
        } catch (err) {
            console.error('Error fetching task site visits:', err);
        } finally {
            setVisitsLoading(false);
        }
    };

    return { handleViewDetails };
};
