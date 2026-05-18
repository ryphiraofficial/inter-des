import { useState } from 'react';
import { uploadAPI, taskAPI, BASE_IMAGE_URL } from '../../../../models/api';

export const PREDEFINED_ITEMS = [
    "Plywood (18mm)", "Plywood (12mm)", "Plywood (6mm)", "Laminate (1mm)",
    "Adhesive (Fevicol SH)", "Hinges (Soft Close)", "Handles (6 inch)",
    "Handles (8 inch)", "Drawer Channels", "Edge Banding", "Paint (Enamel)",
    "Paint (Emulsion)", "Gypsum Board", "LED Strip (Warm White)",
    "Glass (6mm Clear)", "Mirror", "Screws (1 inch)", "Screws (1.5 inch)"
];
export const ITEM_UNITS = ["pcs", "kg", "mtr", "sq ft", "pkt", "box", "ltr", "roll"];

export const useUploadActions = (fetchData) => {
    const [uploading, setUploading] = useState(false);
    const [uploadData, setUploadData] = useState({ files: [], designItems: [], staffNotes: '' });

    const resetUploadData = () => setUploadData({ files: [], designItems: [], staffNotes: '' });

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);
        try {
            const uploadedFiles = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);
                const res = await uploadAPI.image(formData);
                if (res.success) {
                    uploadedFiles.push({ filename: file.name, url: res.url, fileType: file.type });
                }
            }
            setUploadData(prev => ({ ...prev, files: [...prev.files, ...uploadedFiles] }));
        } catch { alert('File upload failed'); }
        finally { setUploading(false); }
    };

    const handleAddDesignItem = () => {
        setUploadData(prev => ({ ...prev, designItems: [...prev.designItems, { name: '', size: '', unit: 'pcs', quantity: 1 }] }));
    };

    const handleRemoveDesignItem = (index) => {
        setUploadData(prev => ({ ...prev, designItems: prev.designItems.filter((_, i) => i !== index) }));
    };

    const handleDesignItemChange = (index, field, value) => {
        setUploadData(prev => {
            const newItems = [...prev.designItems];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, designItems: newItems };
        });
    };

    const handleRemoveFile = (index) => {
        setUploadData(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
    };

    const handleSubmitTask = async (selectedTask) => {
        if (!selectedTask) return;
        if (uploadData.files.length === 0) return alert('Please upload at least one design file');
        try {
            setUploading(true);
            const res = await taskAPI.submit(selectedTask._id, {
                files: uploadData.files,
                designItems: uploadData.designItems,
                staffNotes: uploadData.staffNotes
            });
            if (res.success) {
                alert('Task submitted successfully for review!');
                resetUploadData();
                fetchData();
                return true;
            }
        } catch (err) {
            alert('Submission failed: ' + err.message);
        } finally {
            setUploading(false);
        }
        return false;
    };

    const getFilePreviewUrl = (url) => url?.startsWith('http') ? url : `${BASE_IMAGE_URL}${url}`;

    return {
        uploading, uploadData, setUploadData, resetUploadData,
        handleFileUpload, handleAddDesignItem, handleRemoveDesignItem,
        handleDesignItemChange, handleRemoveFile, handleSubmitTask, getFilePreviewUrl
    };
};
