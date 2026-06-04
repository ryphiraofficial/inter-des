import { useState } from 'react';
import { useGetTaskCommentsQuery, useAddTaskCommentMutation, useAddTaskDailyUpdateMutation } from '../../../../store/api/adminApi';

export const useStaffTasks = () => {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showDailyUpdateModal, setShowDailyUpdateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [dailyUpdateData, setDailyUpdateData] = useState({ update: '', emergencies: '', requestedDate: '', reason: '' });

    const { data: commentsRes, isFetching: loadingComments } = useGetTaskCommentsQuery(selectedTask?._id, { skip: !selectedTask?._id });
    const comments = commentsRes?.success ? commentsRes.data : [];

    const [addComment, { isLoading: submittingComment }] = useAddTaskCommentMutation();
    const [addDailyUpdate, { isLoading: submittingUpdate }] = useAddTaskDailyUpdateMutation();

    const handleOpenComments = (task) => {
        setSelectedTask(task);
        setShowCommentModal(true);
    };

    const handleCloseComments = () => {
        setShowCommentModal(false);
        setSelectedTask(null);
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !selectedTask) return;
        try {
            await addComment({ id: selectedTask._id, content: commentText }).unwrap();
            setCommentText('');
        } catch (err) {
            alert('Failed to add comment');
        }
    };

    const handleSubmitDailyUpdate = async (e) => {
        e.preventDefault();
        if (!dailyUpdateData.update.trim() || !selectedTask) return;
        try {
            const payload = {
                update: dailyUpdateData.update,
                emergencies: dailyUpdateData.emergencies,
                extensionRequest: dailyUpdateData.requestedDate ? {
                    requestedDate: dailyUpdateData.requestedDate,
                    reason: dailyUpdateData.reason
                } : undefined
            };
            await addDailyUpdate({ id: selectedTask._id, payload }).unwrap();
            setShowDailyUpdateModal(false);
            setDailyUpdateData({ update: '', emergencies: '', requestedDate: '', reason: '' });
            alert('Daily update submitted successfully!');
        } catch (err) {
            alert('Failed to submit update: ' + err.message);
        }
    };

    return {
        showCommentModal,
        setShowCommentModal,
        showDailyUpdateModal,
        setShowDailyUpdateModal,
        selectedTask,
        setSelectedTask,
        commentText,
        setCommentText,
        dailyUpdateData,
        setDailyUpdateData,
        comments,
        loadingComments,
        submittingComment,
        submittingUpdate,
        handleOpenComments,
        handleCloseComments,
        handleSubmitComment,
        handleSubmitDailyUpdate
    };
};
