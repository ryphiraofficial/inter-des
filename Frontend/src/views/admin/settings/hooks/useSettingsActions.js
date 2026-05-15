import { settingsAPI, authAPI } from '../../../../models/api';

export const useSettingsActions = ({ 
    settings, profile, setProfile, passwords, setPasswords, 
    setSaving, showToast 
}) => {

    const saveSettings = async (section) => {
        try {
            setSaving(true);
            const res = await settingsAPI.update({ [section]: settings[section] });
            if (res.success) {
                showToast('success', 'Settings saved successfully!');
            }
        } catch (err) {
            showToast('error', err.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const saveProfile = async () => {
        try {
            setSaving(true);
            const res = await authAPI.updateProfile({
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone,
                avatar: profile.avatar
            });
            if (res.success) {
                setProfile(res.data);
                const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...savedUser, ...res.data }));
                showToast('success', 'Profile updated successfully!');
            }
        } catch (err) {
            showToast('error', err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            showToast('error', 'Passwords do not match');
            return;
        }
        if (passwords.newPassword.length < 6) {
            showToast('error', 'Password must be at least 6 characters');
            return;
        }
        try {
            setSaving(true);
            const res = await authAPI.updatePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            if (res.success) {
                if (res.token) localStorage.setItem('token', res.token);
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                showToast('success', 'Password changed successfully!');
            }
        } catch (err) {
            showToast('error', err.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    return { saveSettings, saveProfile, changePassword };
};
