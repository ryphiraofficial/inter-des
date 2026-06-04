import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPMProjectsQuery, useSubmitProjectCompletionMutation } from '../../../../store/api/productionApi';

export const useProjectCompletion = (id) => {
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        completionDate: new Date().toISOString().split('T')[0],
        finalRemarks: '',
        clientRating: 5,
        finalCost: '',
        photos: []
    });
    
    const [toast, setToast] = useState(null);

    const { data: res, isLoading: loading } = useGetPMProjectsQuery({ search: id });
    const [submitCompletion] = useSubmitProjectCompletionMutation();
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (res?.success && res.data) {
            const found = res.data.find(p => p._id === id);
            if (found) setProject(found);
        }
    }, [res, id]);

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    };

    const removePhoto = (index) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                completionDate: formData.completionDate,
                finalRemarks: formData.finalRemarks,
                clientRating: formData.clientRating,
                finalCost: formData.finalCost,
                photos: formData.photos.map(p => p.url) 
            };
            
            await submitCompletion({ projectId: id, ...payload }).unwrap();
            setToast({ type: 'success', msg: 'Project completed successfully!' });
            timerRef.current = setTimeout(() => {
                navigate('/production-management/projects');
            }, 2000);
        } catch (error) {
            setToast({ type: 'error', msg: error.data?.message || error.message || 'An error occurred during submission.' });
        } finally {
            setSubmitting(false);
        }
    };

    return {
        project,
        loading,
        submitting,
        formData, setFormData,
        toast,
        handlePhotoUpload,
        removePhoto,
        handleSubmit,
        navigate
    };
};
