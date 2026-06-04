import { useEffect } from 'react';
import { useGetSettingsQuery } from '../../../../store/api/adminApi';
import { useGetCurrentUserQuery } from '../../../../store/api/authApi';
import { useUploadImageMutation } from '../../../../store/api/sharedApi';

export const useSettingsData = ({ 
    setSettings, setProfile, setLoading, setSaving, showToast, updateSettingsField 
}) => {
    
    const { data: settingsRes, isLoading: settingsLoading, error: settingsError, refetch } = useGetSettingsQuery();
    const [uploadImage] = useUploadImageMutation();

    const { data: profileRes } = useGetCurrentUserQuery();

    useEffect(() => {
        if (profileRes?.success) {
            setProfile(profileRes.data);
        }
    }, [profileRes, setProfile]);

    useEffect(() => {
        setLoading(settingsLoading);
    }, [settingsLoading, setLoading]);

    useEffect(() => {
        if (settingsError) {
            showToast('error', 'Failed to load settings');
        }
    }, [settingsError, showToast]);

    useEffect(() => {
        if (settingsRes?.success) setSettings(settingsRes.data);
    }, [settingsRes, setSettings]);

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setSaving(true);
            const res = await uploadImage(formData).unwrap();
            if (res.success) {
                const url = res.data?.url || res.data?.path || res.url || res.path || res.data;
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

    return { fetchData: refetch, handleFileUpload };
};
