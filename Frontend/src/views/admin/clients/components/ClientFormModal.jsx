import React from 'react';
import { X, Loader } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const ClientFormModal = ({ 
    showNewClientModal, editingClient, formData, setFormData, submitting, handleSubmit, closeModal 
}) => {
    if (!showNewClientModal) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formData, editingClient);
    };

    return (
        <div className="c-drawer-overlay">
            <div className="c-drawer-content">
                <div className="c-drawer-header">
                    <h3>{editingClient ? 'Edit Client' : 'New Client'}</h3>
                    <button className="modal-close" onClick={closeModal}><X size={20} /></button>
                </div>
                <form onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                    <div className="c-drawer-body">
                        <div className="c-form-section">
                            <h4>Basic Information</h4>
                            <div className="c-form-grid">
                                <div className="form-field">
                                    <label>Name <span>*</span></label>
                                    <input type="text" name="name" className="c-client-input" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field">
                                    <label>Project Name</label>
                                    <input type="text" name="projectName" className="c-client-input" value={formData.projectName} onChange={handleInputChange} placeholder="e.g., Omega Tower Kitchen" />
                                </div>
                                <div className="form-field">
                                    <label>Email <span>*</span></label>
                                    <input type="email" name="email" className="c-client-input" value={formData.email} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field">
                                    <label>Phone <span>*</span></label>
                                    <input type="tel" name="phone" className="c-client-input" value={formData.phone} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field">
                                    <label>Alternative Contact</label>
                                    <input type="tel" name="contact1" className="c-client-input" value={formData.contact1} onChange={handleInputChange} placeholder="Secondary number" />
                                </div>
                                <div className="form-field">
                                    <label>WhatsApp Number</label>
                                    <input type="tel" name="contact2" className="c-client-input" value={formData.contact2} onChange={handleInputChange} placeholder="Primary WhatsApp" />
                                </div>
                                <div className="form-field">
                                    <label>Status</label>
                                    <CustomSelect
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 'Active', label: 'Active' },
                                            { value: 'Inactive', label: 'Inactive' },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="c-form-section">
                            <h4>Site Information</h4>
                            <div className="c-form-grid">
                                <div className="form-field full-width">
                                    <label>Site Address</label>
                                    <input type="text" name="siteAddress" className="c-client-input" value={formData.siteAddress} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="c-drawer-footer">
                        <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? <Loader className="spinner" size={16} /> : (editingClient ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientFormModal;
