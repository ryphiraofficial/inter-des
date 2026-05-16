import React from 'react';
import { X, User, Mail, Phone, MapPin, FileText } from 'lucide-react';

const inputBase = {
    width: '100%', padding: '10px 12px 10px 38px',
    border: '1.5px solid #e2e8f0', borderRadius: '9px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    color: '#0f172a', background: '#fafafa', transition: 'all 0.15s'
};
const iconStyle = { position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', pointerEvents: 'none' };

const ClientModal = ({ show, onClose, form, setForm, submitting, onSubmit, isEdit }) => {
    if (!show) return null;

    const fields = [
        { label: 'Client Name *', key: 'name', icon: User, placeholder: 'e.g. Sharma Residences' },
        { label: 'Email', key: 'email', icon: Mail, placeholder: 'email@example.com' },
        { label: 'Phone', key: 'phone', icon: Phone, placeholder: '+91 XXXXX XXXXX' },
        { label: 'Address', key: 'address', icon: MapPin, placeholder: 'Full address' },
        { label: 'GST Number', key: 'gstNumber', icon: FileText, placeholder: 'e.g. 29ABCDE1234F1Z5' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
                <div className="modal-header">
                    <div>
                        <h3>{isEdit ? 'Edit Client' : 'Add New Client'}</h3>
                        <p className="modal-subtitle">{isEdit ? 'Update client details' : 'Fill in the details to create a new client'}</p>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={18} /></button>
                </div>
                <div className="modal-body">
                    {fields.map(f => (
                        <div key={f.key} className="form-group">
                            <label className="form-label">{f.label}</label>
                            <div style={{ position: 'relative' }}>
                                <f.icon size={15} style={iconStyle} />
                                <input 
                                    type="text" 
                                    placeholder={f.placeholder} 
                                    value={form[f.key]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    style={inputBase}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={onSubmit} disabled={submitting} className="btn-primary">
                        {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Client'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientModal;
