import { useState, useRef } from 'react';

export const useSettingsState = () => {
    const [activeTab, setActiveTab] = useState('company');
    const [settings, setSettings] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // Password fields
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    const logoInputRef = useRef(null);
    const avatarInputRef = useRef(null);

    const updateSettingsField = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const showToast = (type, message) => {
        setToast({ type, message });
    };

    return {
        activeTab, setActiveTab,
        settings, setSettings,
        profile, setProfile,
        loading, setLoading,
        saving, setSaving,
        toast, setToast,
        passwords, setPasswords,
        showPasswords, setShowPasswords,
        logoInputRef, avatarInputRef,
        updateSettingsField,
        showToast
    };
};
