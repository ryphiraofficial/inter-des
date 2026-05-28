import { useState, useEffect } from 'react';
import { clientAPI, taskAPI, uploadAPI, siteVisitAPI } from '../../../models/api';

export const useSiteVisitForm = (showToast, navigate) => {
    const [images, setImages] = useState([]);
    const [clients, setClients] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [visitData, setVisitData] = useState({
        client: '',
        task: '',
        location: '',
        notes: '',
        visitDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await clientAPI.getAll();
                if (res.success) setClients(res.data);
            } catch (err) {
                console.error('Error fetching clients:', err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!visitData.client) {
                setTasks([]);
                return;
            }
            try {
                const res = await taskAPI.getAll();
                if (res.success) {
                    const clientTasks = res.data.filter(t => t.client?._id === visitData.client || t.client === visitData.client);
                    setTasks(clientTasks);
                }
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        };
        fetchTasks();
    }, [visitData.client]);

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
                    
                    const res = await uploadAPI.image(formData);
                    
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

            await siteVisitAPI.create({
                ...visitData,
                images: uploadedUrls
            });

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
