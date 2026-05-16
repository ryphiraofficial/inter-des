import React from 'react';
import { X } from 'lucide-react';

const VendorModal = ({ show, onClose, form, setForm, submitting, onSubmit, isEdit }) => {
    if (!show) return null;

    const fields = [
        { label: 'Vendor Name *', key: 'name', placeholder: 'e.g. Modi Tiles Ltd.' },
        { label: 'Category', key: 'category', placeholder: 'e.g. Tiles, Plumbing, Electricals' },
        { label: 'Email', key: 'email', placeholder: 'vendor@example.com' },
        { label: 'Phone', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
        { label: 'Address', key: 'address', placeholder: 'Vendor address' },
        { label: 'GST Number', key: 'gstNumber', placeholder: 'e.g. 29ABCDE1234F1Z5' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
                <div className="modal-header">
                    <h3>{isEdit ? 'Edit Vendor' : 'Add Vendor'}</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {fields.map(f => (
                        <div key={f.key} className="form-group">
                            <label className="form-label">{f.label}</label>
                            <input type="text" className="form-control" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                        </div>
                    ))}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={onSubmit} disabled={submitting} className="btn-primary">
                        {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Vendor'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorModal;
