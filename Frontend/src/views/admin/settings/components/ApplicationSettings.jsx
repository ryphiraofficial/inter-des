import React from 'react';
import { Save } from 'lucide-react';

const ApplicationSettings = ({ settings, updateSettingsField, saveSettings, saving }) => {
    return (
        <>
            <h3 className="settings-section-title">Application Settings</h3>
            <p className="settings-section-desc">General app-level configuration and branding.</p>
            <hr className="settings-divider" />

            <div className="settings-form-grid">
                <div className="settings-form-group">
                    <label>Brand Name</label>
                    <input className="settings-input" value={settings?.application?.brandName || ''} onChange={(e) => updateSettingsField('application', 'brandName', e.target.value)} />
                </div>
                <div className="settings-form-group">
                    <label>Brand Subtitle</label>
                    <input className="settings-input" value={settings?.application?.brandSubtitle || ''} onChange={(e) => updateSettingsField('application', 'brandSubtitle', e.target.value)} />
                </div>
                <div className="settings-form-group">
                    <label>Accent Color</label>
                    <div className="color-picker-row">
                        <input type="color" className="color-picker-input" value={settings?.application?.accentColor || '#2563eb'} onChange={(e) => updateSettingsField('application', 'accentColor', e.target.value)} />
                        <span className="color-picker-hex">{settings?.application?.accentColor || '#2563eb'}</span>
                    </div>
                </div>
                <div className="settings-form-group">
                    <label>Date Format</label>
                    <select className="settings-select" value={settings?.application?.dateFormat || 'DD/MM/YYYY'} onChange={(e) => updateSettingsField('application', 'dateFormat', e.target.value)}>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
                <div className="settings-form-group">
                    <label>Timezone</label>
                    <select className="settings-select" value={settings?.application?.timezone || 'Asia/Kolkata'} onChange={(e) => updateSettingsField('application', 'timezone', e.target.value)}>
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    </select>
                </div>
            </div>

            <div className="settings-save-row">
                <button className="btn-settings-save" onClick={() => saveSettings('application')} disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </>
    );
};

export default ApplicationSettings;
