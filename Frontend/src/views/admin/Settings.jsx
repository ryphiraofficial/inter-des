import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../config/constants';

// Hooks
import { useSettingsState } from './settings/hooks/useSettingsState';
import { useSettingsData } from './settings/hooks/useSettingsData';
import { useSettingsActions } from './settings/hooks/useSettingsActions';

// Components
import SettingsTabs from './settings/components/SettingsTabs';
import CompanyProfile from './settings/components/CompanyProfile';
import DocumentDefaults from './settings/components/DocumentDefaults';
import NotificationSettings from './settings/components/NotificationSettings';
import SecuritySettings from './settings/components/SecuritySettings';
import UserProfile from './settings/components/UserProfile';
import ApplicationSettings from './settings/components/ApplicationSettings';
import QuotationTemplates from './settings/components/QuotationTemplates';
import DataBackup from './settings/components/DataBackup';

import './css/Settings.css';

const Settings = () => {
    const state = useSettingsState();
    
    const data = useSettingsData({
        setSettings: state.setSettings, setProfile: state.setProfile,
        setLoading: state.setLoading, setSaving: state.setSaving,
        showToast: state.showToast, updateSettingsField: state.updateSettingsField
    });

    const actions = useSettingsActions({
        settings: state.settings, profile: state.profile, setProfile: state.setProfile,
        passwords: state.passwords, setPasswords: state.setPasswords,
        setSaving: state.setSaving, showToast: state.showToast
    });

    const { setToast } = state;

    useEffect(() => {
        if (state.toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [state.toast, setToast]);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const renderTabContent = () => {
        const props = {
            settings: state.settings,
            updateSettingsField: state.updateSettingsField,
            saveSettings: actions.saveSettings,
            saving: state.saving,
            showToast: state.showToast
        };

        switch (state.activeTab) {
            case 'company': 
                return <CompanyProfile {...props} logoInputRef={state.logoInputRef} handleFileUpload={data.handleFileUpload} getImageUrl={getImageUrl} />;
            case 'documents': 
                return <DocumentDefaults {...props} />;
            case 'notifications': 
                return <NotificationSettings {...props} />;
            case 'security': 
                return <SecuritySettings {...props} />;
            case 'profile': 
                return (
                    <UserProfile 
                        {...props}
                        profile={state.profile} setProfile={state.setProfile}
                        avatarInputRef={state.avatarInputRef} handleFileUpload={data.handleFileUpload}
                        getImageUrl={getImageUrl} saveProfile={actions.saveProfile}
                        passwords={state.passwords} setPasswords={state.setPasswords}
                        showPasswords={state.showPasswords} setShowPasswords={state.setShowPasswords}
                        changePassword={actions.changePassword}
                    />
                );
            case 'application': 
                return <ApplicationSettings {...props} />;
            case 'templates':
                return <QuotationTemplates {...props} getImageUrl={getImageUrl} />;
            case 'data': 
                return <DataBackup showToast={state.showToast} />;
            default: 
                return null;
        }
    };

    if (state.loading) {
        return (
            <div className="settings-container">
                <div className="settings-wrapper">
                    <div className="settings-layout">
                        <div className="settings-tabs">
                            {[...Array(7)].map((_, i) => <div key={i} className="skeleton" style={{ height: '48px', marginBottom: '8px', borderRadius: '12px' }} />)}
                        </div>
                        <div className="settings-content"><div className="skeleton" style={{ height: '600px', borderRadius: '24px' }} /></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div className="settings-wrapper">
                <div className="settings-layout">
                    <SettingsTabs activeTab={state.activeTab} setActiveTab={state.setActiveTab} />
                    <div className="settings-content">
                        <div className="settings-section-card">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>

            {state.toast && (
                <div className={`settings-toast ${state.toast.type}`}>
                    {state.toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    {state.toast.message}
                </div>
            )}
        </div>
    );
};

export default Settings;
