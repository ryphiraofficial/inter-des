import React from 'react';
import { Save } from 'lucide-react';

const NotificationSettings = ({ settings, updateSettingsField, saveSettings, saving }) => {
    return (
        <>
            <h3 className="settings-section-title">Notification Preferences</h3>
            <p className="settings-section-desc">Control how and when notifications are triggered.</p>
            <hr className="settings-divider" />

            <div className="settings-form-grid">
                <div className="settings-form-group">
                    <label>Task Deadline Reminder (Hours Before)</label>
                    <input
                        className="settings-input"
                        type="number"
                        min="1"
                        value={settings?.notifications?.taskDeadlineHours ?? 24}
                        onChange={(e) => updateSettingsField('notifications', 'taskDeadlineHours', Number(e.target.value))}
                    />
                </div>
                <div className="settings-form-group">
                    <label>Low Stock Alert Threshold</label>
                    <input
                        className="settings-input"
                        type="number"
                        min="1"
                        value={settings?.notifications?.lowStockThreshold ?? 10}
                        onChange={(e) => updateSettingsField('notifications', 'lowStockThreshold', Number(e.target.value))}
                    />
                </div>
                <div className="settings-form-group">
                    <label>Quotation Expiry Warning (Days Before)</label>
                    <input
                        className="settings-input"
                        type="number"
                        min="1"
                        value={settings?.notifications?.quotationExpiryDays ?? 7}
                        onChange={(e) => updateSettingsField('notifications', 'quotationExpiryDays', Number(e.target.value))}
                    />
                </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <div className="settings-toggle-row">
                    <div className="toggle-label-group">
                        <span className="toggle-title">Email Notifications</span>
                        <span className="toggle-desc">Send email alerts for important events (coming soon)</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings?.notifications?.emailNotifications || false}
                            onChange={(e) => updateSettingsField('notifications', 'emailNotifications', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div className="settings-save-row">
                <button className="btn-settings-save" onClick={() => saveSettings('notifications')} disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </>
    );
};

export default NotificationSettings;
