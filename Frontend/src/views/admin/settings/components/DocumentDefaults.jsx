import React from 'react';
import { Save } from 'lucide-react';

const DocumentDefaults = ({ settings, updateSettingsField, saveSettings, saving }) => {
    return (
        <>
            <h3 className="settings-section-title">Document Defaults</h3>
            <p className="settings-section-desc">Default values used when creating new quotations and invoices.</p>
            <hr className="settings-divider" />

            <div className="settings-form-grid">
                <div className="settings-form-group">
                    <label>Default Tax Rate (%)</label>
                    <input
                        className="settings-input"
                        type="number"
                        min="0" max="100"
                        value={settings?.documents?.defaultTaxRate ?? 18}
                        onChange={(e) => updateSettingsField('documents', 'defaultTaxRate', Number(e.target.value))}
                    />
                </div>
                <div className="settings-form-group">
                    <label>Currency Symbol</label>
                    <input
                        className="settings-input"
                        value={settings?.documents?.currencySymbol || '₹'}
                        onChange={(e) => updateSettingsField('documents', 'currencySymbol', e.target.value)}
                        placeholder="₹"
                    />
                </div>
                <div className="settings-form-group">
                    <label>Quotation Prefix</label>
                    <input
                        className="settings-input"
                        value={settings?.documents?.quotationPrefix || 'QT-'}
                        onChange={(e) => updateSettingsField('documents', 'quotationPrefix', e.target.value)}
                    />
                </div>
                <div className="settings-form-group">
                    <label>Invoice Prefix</label>
                    <input
                        className="settings-input"
                        value={settings?.documents?.invoicePrefix || 'INV-'}
                        onChange={(e) => updateSettingsField('documents', 'invoicePrefix', e.target.value)}
                    />
                </div>
                <div className="settings-form-group">
                    <label>Quotation Validity (Days)</label>
                    <input
                        className="settings-input"
                        type="number"
                        min="1"
                        value={settings?.documents?.quotationValidity ?? 30}
                        onChange={(e) => updateSettingsField('documents', 'quotationValidity', Number(e.target.value))}
                    />
                </div>
                <div className="settings-form-group full-width">
                    <label>Default Terms & Conditions</label>
                    <textarea
                        className="settings-textarea"
                        value={settings?.documents?.defaultTerms || ''}
                        onChange={(e) => updateSettingsField('documents', 'defaultTerms', e.target.value)}
                        rows={4}
                    />
                </div>
                <div className="settings-form-group full-width">
                    <label>Default Notes</label>
                    <textarea
                        className="settings-textarea"
                        value={settings?.documents?.defaultNotes || ''}
                        onChange={(e) => updateSettingsField('documents', 'defaultNotes', e.target.value)}
                        rows={3}
                    />
                </div>
            </div>

            <div className="settings-save-row">
                <button className="btn-settings-save" onClick={() => saveSettings('documents')} disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </>
    );
};

export default DocumentDefaults;
