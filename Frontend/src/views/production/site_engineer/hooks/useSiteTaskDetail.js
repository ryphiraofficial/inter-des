import { useState, useEffect, useRef } from 'react';
import { useUploadImageMutation } from '../../../../store/api/sharedApi';
import { 
    useGetSupervisorsQuery, 
    useUpdateEngineerTaskStatusMutation, 
    useAssignEngineerTaskMutation, 
    useAddEngineerTaskCommentMutation,
    useLazyGetEngineerTaskByIdQuery
} from '../../../../store/api/productionApi';

export const useSiteTaskDetail = (task, user, onUpdate) => {
    const [localTask, setLocalTask] = useState(task);
    const [comment, setComment] = useState('');
    const [note, setNote] = useState('');
    const [showNote, setShowNote] = useState(false);
    
    // UI loading/status states
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadingReviewFile, setUploadingReviewFile] = useState(false);
    const [toast, setToast] = useState(null);

    // Completion modal states
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completionNote, setCompletionNote] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [qaChecked, setQaChecked] = useState(false);

    // Review states (Site Engineer)
    const [reviewNote, setReviewNote] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    
    const { data: supervisorsRes } = useGetSupervisorsQuery(undefined, { skip: user?.role !== 'Site Engineer' });
    const supervisors = supervisorsRes?.success ? supervisorsRes.data : [];

    const [updateStatus, { isLoading: statusSaving }] = useUpdateEngineerTaskStatusMutation();
    const [assignTask, { isLoading: reassigning }] = useAssignEngineerTaskMutation();
    const [addComment, { isLoading: saving }] = useAddEngineerTaskCommentMutation();
    const [getTaskById] = useLazyGetEngineerTaskByIdQuery();
    const [uploadImageMutation] = useUploadImageMutation();

    const toastTimerRef = useRef(null);

    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    };

    const handleStatus = async (status) => {
        if (status === 'Completed' && user?.role === 'Site Supervisor') {
            // Pre-fill completion modal if previously submitted
            const existingSubmit = localTask.updates?.slice().reverse().find(u => u.note && !u.note.includes('Approved by') && !u.note.includes('Rejected by'));
            if (existingSubmit) {
                setCompletionNote(existingSubmit.note);
                setSelectedImages(existingSubmit.images || []);
            } else {
                setCompletionNote('');
                setSelectedImages([]);
            }
            setShowCompletionModal(true);
            return;
        }
        
        try {
            const res = await updateStatus({ id: localTask._id, status, note: note || undefined }).unwrap();
            setLocalTask(res || { ...localTask, status }); // ensure local update
            setNote('');
            setShowNote(false);
            showToast(`Status → "${status}"`);
            if (onUpdate) onUpdate();
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    const submitCompletion = async () => {
        try {
            const res = await updateStatus({ id: localTask._id, status: 'Completed', note: completionNote || undefined, images: selectedImages }).unwrap();
            setLocalTask(res);
            setShowCompletionModal(false);
            setCompletionNote('');
            setSelectedImages([]);
            setQaChecked(false);
            showToast('Task submitted for Site Engineer review!');
            if (onUpdate) onUpdate();
        } catch {
            showToast('Failed to submit completion', 'error');
        }
    };

    const handleReassign = async (newAssigneeId) => {
        try {
            await assignTask({ taskId: localTask._id, assignedTo: newAssigneeId }).unwrap();
            showToast('Task reassigned successfully!');
            const res = await getTaskById(localTask._id).unwrap();
            setLocalTask(res);
            if (onUpdate) onUpdate();
        } catch (e) {
            showToast('Failed to reassign', 'error');
        }
    };

    const handleReviewAction = async (nextStatus, actionType) => {
        try {
            const noteText = reviewNote ? `${actionType} by Site Engineer: ${reviewNote}` : `${actionType} by Site Engineer`;
            const res = await updateStatus({ id: localTask._id, status: nextStatus, note: noteText, images: reviewImages }).unwrap();
            setLocalTask(res);
            setReviewNote('');
            setReviewImages([]);
            showToast(actionType === 'Approved' ? 'Task elevated to Project Engineer!' : 'Task sent back to Supervisor!');
            if (onUpdate) onUpdate();
        } catch {
            showToast('Review action failed', 'error');
        }
    };

    const handleComment = async (e) => {
        if (e) e.preventDefault();
        if (!comment.trim()) return;
        try {
            const res = await addComment({ id: localTask._id, text: comment }).unwrap();
            setLocalTask(p => ({ ...p, comments: res }));
            setComment('');
            showToast('Comment added');
        } catch {
            showToast('Failed to add comment', 'error');
        }
    };

    const uploadImage = async (file, isReview = false) => {
        if (!file) return;
        
        const setUploading = isReview ? setUploadingReviewFile : setUploadingFile;
        setUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await uploadImageMutation(formData).unwrap();
            
            if (res.success) {
                if (isReview) {
                    setReviewImages(p => [...p, res.url]);
                    showToast('Review photo uploaded successfully!');
                } else {
                    setSelectedImages(p => [...p, res.url]);
                    showToast('Image uploaded successfully!');
                }
            } else {
                showToast(res.message || 'Upload failed', 'error');
            }
        } catch (err) {
            showToast('Failed to upload image', 'error');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (url, isReview = false) => {
        if (isReview) {
            setReviewImages(p => p.filter(u => u !== url));
        } else {
            setSelectedImages(p => p.filter(u => u !== url));
        }
    };

    return {
        localTask,
        comment, setComment,
        note, setNote,
        showNote, setShowNote,
        saving, statusSaving, reassigning,
        uploadingFile, uploadingReviewFile,
        toast,
        showCompletionModal, setShowCompletionModal,
        completionNote, setCompletionNote,
        selectedImages, qaChecked, setQaChecked,
        reviewNote, setReviewNote,
        reviewImages,
        supervisors,
        handleStatus, submitCompletion, handleReassign, handleReviewAction, handleComment,
        uploadImage, removeImage
    };
};
