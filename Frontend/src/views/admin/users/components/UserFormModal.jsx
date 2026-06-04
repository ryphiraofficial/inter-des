import React from 'react';
import { X, Loader } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const UserFormModal = ({ 
    showModal, editingUser, formData, handleInputChange, submitting, handleSubmit, setShowModal 
}) => {
    if (!showModal) return null;

    const onFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formData, editingUser);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-user" data-lenis-prevent>
                <div className="modal-header">
                    <h3>{editingUser ? 'Edit Team Member' : 'Add Team Member'}</h3>
                    <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                </div>
                <form onSubmit={onFormSubmit}>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input name="fullName" className="user-input" value={formData.fullName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address *</label>
                        <input name="email" type="email" className="user-input" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input name="phone" className="user-input" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <CustomSelect
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            options={[
                                { value: '', label: '— Core Admin —', disabled: true },
                                { value: 'Super Admin', label: 'Super Admin' },
                                { value: 'Admin', label: 'Admin' },
                                { value: 'Manager', label: 'General Manager' },
                                { value: '', label: '— Design —', disabled: true },
                                { value: 'Design Manager', label: 'Design Manager' },
                                { value: 'Design Staff', label: 'Design Staff' },
                                { value: '', label: '— Procurement —', disabled: true },
                                { value: 'Procurement Manager', label: 'Procurement Manager' },
                                { value: 'Procurement Staff', label: 'Procurement Staff' },
                                { value: '', label: '— Production —', disabled: true },
                                { value: 'Project Manager', label: 'Project Manager' },
                                { value: 'Project Engineer', label: 'Project Engineer' },
                                { value: 'Site Engineer', label: 'Site Engineer' },
                                { value: 'Site Supervisor', label: 'Site Supervisor' },
                                { value: '', label: '— Sales —', disabled: true },
                                { value: 'Sales', label: 'Sales Executive' },
                                { value: '', label: '— Accounts —', disabled: true },
                                { value: 'Accounts Manager', label: 'Accounts Manager' },
                                { value: 'Accounts Staff', label: 'Accounts Staff' },
                            ]}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password {editingUser ? '(Leave blank to keep current)' : '*'}</label>
                        <input name="password" type="password" className="user-input" value={formData.password} onChange={handleInputChange} required={!editingUser} />
                    </div>
                    <div className="modal-footer" style={{ marginTop: '2rem' }}>
                        <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={submitting}>
                            {submitting ? <Loader className="spinner" size={16} /> : (editingUser ? 'Update Account' : 'Create Account')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
