import { useUpdateSettingsMutation } from '../../../../store/api/adminApi';
import { useUpdateProfileMutation, useUpdatePasswordMutation } from '../../../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { updateUser, updateToken } from '../../../../store/slices/authSlice';

export const useSettingsActions = ({ 
    settings, profile, setProfile, passwords, setPasswords, 
    setSaving, showToast 
}) => {
    const [updateSettings] = useUpdateSettingsMutation();
    const [updateProfile] = useUpdateProfileMutation();
    const [updatePassword] = useUpdatePasswordMutation();
    const dispatch = useDispatch();

    const saveSettings = async (section) => {
        try {
            setSaving(true);
            const res = await updateSettings({ [section]: settings[section] }).unwrap();
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
            const res = await updateProfile({
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone,
                avatar: profile.avatar
            }).unwrap();
            if (res.success) {
                setProfile(res.data);
                dispatch(updateUser(res.data));
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
            const res = await updatePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }).unwrap();
            if (res.success) {
                if (res.token) dispatch(updateToken(res.token));
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
