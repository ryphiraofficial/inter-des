import React from 'react';
import { Save } from 'lucide-react';

const SecuritySettings = ({ settings, updateSettingsField, saveSettings, saving }) => {
    return (
        <>
            <h3 className="settings-section-title">Security Settings</h3>
            <p className="settings-section-desc">Manage access policies and security preferences.</p>
            <hr className="settings-divider" />

            <div className="settings-form-grid">
                <div className="settings-form-group">
                    <label>Default Role for New Users</label>
                    <select
                        className="settings-select"
                        value={settings?.security?.defaultRole || 'User'}
                        onChange={(e) => updateSettingsField('security', 'defaultRole', e.target.value)}
                    >
                        <option value="User">User</option>
                        <option value="Staff">Staff</option>
                        <option value="Designer">Designer</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div className="settings-form-group">
                    <label>Minimum Password Length</label>
                    <input
                        className="settings-input"
                        type="number"
                        min="4" max="32"
                        value={settings?.security?.minPasswordLength ?? 6}
                        onChange={(e) => updateSettingsField('security', 'minPasswordLength', Number(e.target.value))}
                    />
                </div>
                <div className="settings-form-group">
                    <label>Session Timeout</label>
                    <select
                        className="settings-select"
                        value={settings?.security?.sessionTimeout || '30d'}
                        onChange={(e) => updateSettingsField('security', 'sessionTimeout', e.target.value)}
                    >
                        <option value="1d">1 Day</option>
                        <option value="7d">7 Days</option>
                        <option value="14d">14 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="90d">90 Days</option>
                    </select>
                </div>
            </div>

            <div className="settings-save-row">
                <button className="btn-settings-save" onClick={() => saveSettings('security')} disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </>
    );
};

export default SecuritySettings;
