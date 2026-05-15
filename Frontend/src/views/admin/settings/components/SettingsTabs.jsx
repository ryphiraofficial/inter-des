import React from 'react';
import { Building2, FileText, Bell, Shield, User, Palette, Database } from 'lucide-react';

export const TABS = [
    { id: 'company', label: 'Company Profile', icon: Building2 },
    { id: 'documents', label: 'Document Defaults', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'application', label: 'App Settings', icon: Palette },
    { id: 'data', label: 'Data & Backup', icon: Database },
];

const SettingsTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="settings-tabs">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <tab.icon size={18} className="tab-icon" />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default SettingsTabs;
