import React, { useState, useEffect } from 'react';
import { Building2, FileText, Bell, Shield, User, Palette, Database, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';

export const TABS = [
    { id: 'company', label: 'Company Profile', icon: Building2 },
    { id: 'documents', label: 'Document Defaults', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'application', label: 'App Settings', icon: Palette, hasDropdown: true },
    { id: 'data', label: 'Data & Backup', icon: Database },
];

const SettingsTabs = ({ activeTab, setActiveTab }) => {
    const [appDropdownOpen, setAppDropdownOpen] = useState(
        activeTab === 'application' || activeTab === 'templates'
    );

    useEffect(() => {
        if (activeTab === 'application' || activeTab === 'templates') {
            setAppDropdownOpen(true);
        }
    }, [activeTab]);

    const handleTabClick = (tabId) => {
        if (tabId === 'application') {
            setAppDropdownOpen(!appDropdownOpen);
            setActiveTab('application');
        } else {
            setActiveTab(tabId);
        }
    };

    return (
        <div className="settings-tabs">
            {TABS.map(tab => {
                const isAppSettingRelated = tab.id === 'application';
                const isActive = activeTab === tab.id || (isAppSettingRelated && activeTab === 'templates');

                return (
                    <div key={tab.id} className="settings-tab-group" style={{ width: '100%' }}>
                        <button
                            className={`settings-tab-btn ${isActive ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                            style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <tab.icon size={18} className="tab-icon" />
                                <span>{tab.label}</span>
                            </div>
                            {tab.hasDropdown && (
                                <span className="tab-arrow-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                    {appDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </span>
                            )}
                        </button>
                        
                        {isAppSettingRelated && appDropdownOpen && (
                            <div className="settings-sub-tabs" style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1.25rem', gap: '0.25rem', marginTop: '0.25rem', width: '100%', boxSizing: 'border-box' }}>
                                <button
                                    className={`settings-tab-btn sub-tab ${activeTab === 'application' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('application')}
                                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.82rem', gap: '0.5rem' }}
                                >
                                    <Palette size={14} className="tab-icon" />
                                    <span>General Settings</span>
                                </button>
                                <button
                                    className={`settings-tab-btn sub-tab ${activeTab === 'templates' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('templates')}
                                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.82rem', gap: '0.5rem' }}
                                >
                                    <LayoutGrid size={14} className="tab-icon" />
                                    <span>Quotation Templates</span>
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SettingsTabs;
