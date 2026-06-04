import { useState, useEffect } from 'react';
import { useGetSalesClientsQuery, useGetSalesTasksQuery, useCreateSiteVisitMutation } from '../../../store/api/salesApi';
import { useUploadImageMutation } from '../../../store/api/sharedApi';

export const useSiteVisitForm = (showToast, navigate) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [visitData, setVisitData] = useState({
        client: '',
        task: '',
        location: '',
        notes: '',
        visitDate: new Date().toISOString().split('T')[0]
    });

    const { data: clientsRes, isLoading: clientsLoading } = useGetSalesClientsQuery();
    const { data: tasksRes, isLoading: tasksLoading } = useGetSalesTasksQuery();
    const [createVisit] = useCreateSiteVisitMutation();
    const [uploadImage] = useUploadImageMutation();

    const initialLoading = clientsLoading || tasksLoading;
    const clients = clientsRes?.success ? clientsRes.data : [];
    const allTasks = tasksRes?.success ? tasksRes.data : [];

    const tasks = visitData.client 
        ? allTasks.filter(t => t.client?._id === visitData.client || t.client === visitData.client)
        : [];

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            showToast('Maximum 5 images allowed per visit', 'warning');
            return;
        }
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (images.length === 0) {
            showToast('Please select at least one image', 'error');
            return;
        }

        setUploading(true);
        try {
            const uploadedUrls = [];
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                try {
                    const formData = new FormData();
                    formData.append('image', img.file);
                    
                    const res = await uploadImage(formData).unwrap();
                    
                    if (res.success && res.url) {
                        uploadedUrls.push(res.url);
                        showToast(`Image ${i + 1} uploaded successfully`, 'success');
                    } else {
                        showToast(`Image ${i + 1} upload failed: ${res.message || 'Unknown error'}`, 'error');
                    }
                } catch (uploadError) {
                    showToast(`Image ${i + 1} upload error: ${uploadError.message}`, 'error');
                }
            }

            if (uploadedUrls.length === 0) {
                showToast('No images were uploaded successfully', 'error');
                setUploading(false);
                return;
            }

            await createVisit({
                ...visitData,
                images: uploadedUrls
            }).unwrap();

            showToast('Site visit details and images uploaded successfully!');
            setImages([]);
            setVisitData({
                client: '',
                location: '',
                notes: '',
                visitDate: new Date().toISOString().split('T')[0]
            });
            navigate('/staff/dashboard');
        } catch (err) {
            showToast('Failed to upload visit details', 'error');
        } finally {
            setUploading(false);
        }
    };

    return {
        images,
        clients,
        tasks,
        uploading,
        initialLoading,
        visitData,
        setVisitData,
        handleImageChange,
        removeImage,
        handleUpload
    };
};
