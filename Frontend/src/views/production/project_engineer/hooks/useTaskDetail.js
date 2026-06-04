import { useState, useEffect } from 'react';
import { useUploadImageMutation } from '../../../../store/api/sharedApi';
import { 
    useGetEngineerTaskByIdQuery,
    useGetSiteTeamQuery,
    useGetSupervisorsQuery,
    useCreateEngineerSubtaskMutation,
    useUpdateEngineerTaskStatusMutation,
    useAssignEngineerTaskMutation,
    useAddEngineerTaskCommentMutation
} from '../../../../store/api/productionApi';

export const useTaskDetail = (id, user) => {
    const [comment, setComment] = useState('');
    const [toast, setToast] = useState(null);
    const [showNote, setShowNote] = useState(false);
    const [note, setNote] = useState('');
    const [reviewNote, setReviewNote] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    const [uploadingReviewFile, setUploadingReviewFile] = useState(false);
    
    // Subtask states
    const [showSubtaskModal, setShowSubtaskModal] = useState(false);
    const [subform, setSubform] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const { data: taskRes, isLoading: loadingTask, refetch: load } = useGetEngineerTaskByIdQuery(id, { skip: !id });
    const { data: siteTeamRes } = useGetSiteTeamQuery(undefined, { skip: user?.role !== 'Project Engineer' });
    const { data: supervisorsRes } = useGetSupervisorsQuery(undefined, { skip: user?.role !== 'Site Engineer' });

    const [createSubtask, { isLoading: subtaskSaving }] = useCreateEngineerSubtaskMutation();
    const [updateStatus, { isLoading: statusSaving }] = useUpdateEngineerTaskStatusMutation();
    const [assignTask, { isLoading: savingAssign }] = useAssignEngineerTaskMutation();
    const [addComment, { isLoading: savingComment }] = useAddEngineerTaskCommentMutation();
    const [uploadImageMutation] = useUploadImageMutation();

    const task = taskRes?.success ? taskRes.data : null;
    const loading = loadingTask;
    const siteTeam = siteTeamRes?.success ? siteTeamRes.data : [];
    const supervisors = supervisorsRes?.success ? supervisorsRes.data : [];
    const saving = savingAssign || savingComment;

    const handleCreateSubtask = async (e) => {
        e.preventDefault();
        try {
            await createSubtask({ ...subform, parentTaskId: id, projectId: task?.projectId?._id || task?.projectId }).unwrap();
            setShowSubtaskModal(false);
            setSubform({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
            showToast('Subtask created successfully');
            load(); // Refetch task to get updated subtasks
        } catch (e) {
            showToast(e.data?.message || e.message || 'Failed to create subtask', 'error');
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateStatus({ id, status: newStatus, note: note || undefined }).unwrap();
            setNote(''); setShowNote(false);
            showToast(`Status updated to "${newStatus}"`);
        } catch (e) {
            showToast(e.data?.message || e.message || 'Failed to update status', 'error');
        }
    };

    const handlePEReviewAction = async (nextStatus, actionType) => {
        try {
            const noteText = reviewNote ? `${actionType} by Project Engineer: ${reviewNote}` : `${actionType} by Project Engineer`;
            await updateStatus({ id, status: nextStatus, note: noteText, images: reviewImages }).unwrap();
            setReviewNote('');
            setReviewImages([]);
            showToast(actionType === 'Approved' ? 'Task elevated to Project Manager!' : 'Task sent back to Site Engineer!');
        } catch (e) {
            showToast(e.data?.message || e.message || 'Review action failed', 'error');
        }
    };

    const uploadImage = async (file) => {
        if (!file) return;
        setUploadingReviewFile(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await uploadImageMutation(formData).unwrap();
            if (res.success) {
                setReviewImages(p => [...p, res.url]);
                showToast('Review photo uploaded successfully!');
            } else {
                showToast(res.message || 'Upload failed', 'error');
            }
        } catch (err) {
            showToast('Failed to upload image', 'error');
        } finally {
            setUploadingReviewFile(false);
        }
    };

    const removeImage = (url) => {
        setReviewImages(p => p.filter(u => u !== url));
    };

    const handleReassignTask = async (newAssigneeId) => {
        try {
            await assignTask({ taskId: id, assignedTo: newAssigneeId }).unwrap();
            showToast('Task reassigned successfully!');
        } catch (e) {
            showToast(e.data?.message || e.message || 'Failed to reassign task', 'error');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            await addComment({ id, text: comment }).unwrap();
            setComment('');
            showToast('Comment added');
        } catch (e) {
            showToast(e.data?.message || e.message || 'Failed to add comment', 'error');
        }
    };

    return {
        task, loading, comment, setComment, saving, statusSaving, toast,
        showNote, setShowNote, note, setNote, reviewNote, setReviewNote, reviewImages, setReviewImages, uploadingReviewFile,
        uploadImage, removeImage,
        showSubtaskModal, setShowSubtaskModal, subtaskSaving, subform, setSubform,
        siteTeam, supervisors, handleCreateSubtask, handleStatusChange, handlePEReviewAction, handleReassignTask, handleComment
    };
};
