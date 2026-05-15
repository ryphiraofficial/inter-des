import { useEffect } from 'react';
import { settingsAPI, authAPI, uploadAPI } from '../../../../models/api';

export const useSettingsData = ({ 
    setSettings, setProfile, setLoading, setSaving, showToast, updateSettingsField 
}) => {
    
    const fetchData = async () => {
        try {
            setLoading(true);
            const [settingsRes, profileRes] = await Promise.all([
                settingsAPI.get(),
                authAPI.getCurrentUser()
            ]);
            if (settingsRes.success) setSettings(settingsRes.data);
            if (profileRes.success) setProfile(profileRes.data);
        } catch (err) {
            showToast('error', 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setSaving(true);
            const res = await uploadAPI.image(formData);
            if (res.success) {
                const url = res.data.url || res.data.path;
                if (type === 'logo') {
                    updateSettingsField('company', 'companyLogo', url);
                } else if (type === 'avatar') {
                    setProfile(prev => ({ ...prev, avatar: url }));
                }
                showToast('success', 'Image uploaded successfully!');
            }
        } catch (err) {
            showToast('error', 'Failed to upload image');
        } finally {
            setSaving(false);
        }
    };

    return { fetchData, handleFileUpload };
};
