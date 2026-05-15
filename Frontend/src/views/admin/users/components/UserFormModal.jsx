import React from 'react';
import { X, Loader } from 'lucide-react';

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
                        <select name="role" className="user-input" value={formData.role} onChange={handleInputChange}>
                            <optgroup label="Core Admin">
                                <option value="Super Admin">Super Admin</option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">General Manager</option>
                            </optgroup>
                            <optgroup label="Design Department">
                                <option value="Design Manager">Design Manager</option>
                                <option value="Design Staff">Design Staff</option>
                            </optgroup>
                            <optgroup label="Procurement Department">
                                <option value="Procurement Manager">Procurement Manager</option>
                                <option value="Procurement Staff">Procurement Staff</option>
                            </optgroup>
                            <optgroup label="Production Department">
                                <option value="Project Manager">Project Manager</option>
                                <option value="Production Staff">Production Staff</option>
                            </optgroup>
                            <optgroup label="Sales Department">
                                <option value="Sales">Sales Executive</option>
                            </optgroup>
                            <optgroup label="Accounts Department">
                                <option value="Accounts Manager">Accounts Manager</option>
                                <option value="Accounts Staff">Accounts Staff</option>
                            </optgroup>
                        </select>
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
