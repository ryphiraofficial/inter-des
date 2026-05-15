import React from 'react';
import { Building2, Upload, Save } from 'lucide-react';

const CompanyProfile = ({ 
    settings, updateSettingsField, logoInputRef, handleFileUpload, getImageUrl, saveSettings, saving 
}) => {
    return (
        <>
            <h3 className="settings-section-title">Company Profile</h3>
            <p className="settings-section-desc">Your business identity used across quotations, invoices, and reports.</p>
            <hr className="settings-divider" />

            <div className="settings-form-group full-width" style={{ marginBottom: '1.75rem' }}>
                <label>Company Logo</label>
                <div className="settings-upload-area" onClick={() => logoInputRef.current?.click()}>
                    <div className="settings-upload-preview">
                        {settings?.company?.companyLogo ? (
                            <img src={getImageUrl(settings.company.companyLogo)} alt="Logo" />
                        ) : (
                            <Building2 size={28} color="#94a3b8" />
                        )}
                    </div>
                    <div className="settings-upload-info">
                        <h4>Upload Company Logo</h4>
                        <p>Recommended: 200×200px, PNG or JPG</p>
                    </div>
                    <span className="settings-upload-btn"><Upload size={14} /> Upload</span>
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'logo')}
                    />
                </div>
            </div>

            <div className="settings-form-grid">
                <div className="settings-form-group">
                    <label>Company Name</label>
                    <input
                        className="settings-input"
                        value={settings?.company?.companyName || ''}
                        onChange={(e) => updateSettingsField('company', 'companyName', e.target.value)}
                        placeholder="Your company name"
                    />
                </div>
                <div className="settings-form-group">
                    <label>Email</label>
                    <input
                        className="settings-input"
                        type="email"
                        value={settings?.company?.email || ''}
                        onChange={(e) => updateSettingsField('company', 'email', e.target.value)}
                        placeholder="info@yourcompany.com"
                    />
                </div>
                <div className="settings-form-group">
                    <label>Phone</label>
                    <input
                        className="settings-input"
                        value={settings?.company?.phone || ''}
                        onChange={(e) => updateSettingsField('company', 'phone', e.target.value)}
                        placeholder="+91 9876543210"
                    />
                </div>
                <div className="settings-form-group">
                    <label>GSTIN / Tax ID</label>
                    <input
                        className="settings-input"
                        value={settings?.company?.gstin || ''}
                        onChange={(e) => updateSettingsField('company', 'gstin', e.target.value)}
                        placeholder="22AAAAA0000A1Z5"
                    />
                </div>
                <div className="settings-form-group">
                    <label>Website</label>
                    <input
                        className="settings-input"
                        value={settings?.company?.website || ''}
                        onChange={(e) => updateSettingsField('company', 'website', e.target.value)}
                        placeholder="https://yourcompany.com"
                    />
                </div>
                <div className="settings-form-group full-width">
                    <label>Address</label>
                    <textarea
                        className="settings-textarea"
                        value={settings?.company?.address || ''}
                        onChange={(e) => updateSettingsField('company', 'address', e.target.value)}
                        placeholder="Full business address"
                        rows={3}
                    />
                </div>
            </div>

            <div className="settings-save-row">
                <button className="btn-settings-save" onClick={() => saveSettings('company')} disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </>
    );
};

export default CompanyProfile;
