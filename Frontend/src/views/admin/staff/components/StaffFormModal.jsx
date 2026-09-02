import React from 'react';
import { X, Loader } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const ROLE_OPTIONS = [
    // Sales
    { value: 'Sales', label: 'Sales' },
    { value: 'Sales Manager', label: 'Sales Manager' },
    { value: 'Sales Executive', label: 'Sales Executive' },
    { value: 'Sales Staff', label: 'Sales Staff' },
    
    // Design
    { value: 'Design Manager', label: 'Design Manager' },
    { value: 'Design Staff', label: 'Design Staff' },
    { value: 'Designer', label: 'Designer' },

    // Production & Site Operations
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Project Engineer', label: 'Project Engineer' },
    { value: 'Site Engineer', label: 'Site Engineer' },
    { value: 'Site Supervisor', label: 'Site Supervisor' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Carpenter', label: 'Carpenter' },
    { value: 'Worker', label: 'Worker' },

    // Procurement
    { value: 'Procurement Manager', label: 'Procurement Manager' },
    { value: 'Procurement Staff', label: 'Procurement Staff' },

    // Accounts & Finance
    { value: 'Accounts Manager', label: 'Accounts Manager' },
    { value: 'Accounts Staff', label: 'Accounts Staff' },

    // HR
    { value: 'HR Manager', label: 'HR Manager' },
    { value: 'HR Staff', label: 'HR Staff' },

    // Administration
    { value: 'Admin', label: 'Admin' },
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Staff', label: 'General Staff' }
];

const StaffFormModal = ({ 
    show, 
    closeModal, 
    editingStaff, 
    handleSubmit, 
    formData, 
    handleInputChange, 
    submitting 
}) => {
    if (!show) return null;

    // If existing staff has a custom role not in standard list, include it dynamically
    const optionsWithCurrentRole = [...ROLE_OPTIONS];
    if (formData.role && !ROLE_OPTIONS.some(opt => opt.value.toLowerCase() === formData.role.toLowerCase())) {
        optionsWithCurrentRole.unshift({ value: formData.role, label: formData.role });
    }

    return (
        <div className="staff-drawer-overlay">
            <div className="staff-drawer-content">
                <div className="staff-drawer-header">
                    <h3>{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</h3>
                    <button className="modal-close" onClick={closeModal}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                    <div className="staff-drawer-body" data-lenis-prevent>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Full Name *</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter full name" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <CustomSelect 
                                    label="Role / Job Title" 
                                    name="role" 
                                    options={optionsWithCurrentRole} 
                                    value={formData.role} 
                                    onChange={handleInputChange} 
                                    placeholder="Select role..." 
                                    searchable={true} 
                                    required={true} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number * <small>(10 digits)</small></label>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter 10-digit number" 
                                    required 
                                    maxLength={10} 
                                    pattern="[0-9]{10}" 
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Email Address *</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter email address" 
                                    required 
                                />
                            </div>
                            {editingStaff ? (
                                <div className="form-group full-width">
                                    <label>New Password <small style={{ color: '#64748b', fontWeight: 500 }}>(leave blank to keep current password)</small></label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password || ''} 
                                        onChange={handleInputChange} 
                                        placeholder="Enter new password" 
                                        minLength={6} 
                                    />
                                </div>
                            ) : (
                                <div className="form-group full-width">
                                    <label>Password * <small style={{ color: '#64748b', fontWeight: 500 }}>(min 6 characters)</small></label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password || ''} 
                                        onChange={handleInputChange} 
                                        placeholder="Set password for staff account" 
                                        required 
                                        minLength={6} 
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <CustomSelect 
                                    label="Status" 
                                    name="status" 
                                    options={[
                                        { value: 'Active', label: 'Active' }, 
                                        { value: 'On Leave', label: 'On Leave' }, 
                                        { value: 'Inactive', label: 'Inactive' }
                                    ]} 
                                    value={formData.status} 
                                    onChange={handleInputChange} 
                                    searchable={false} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Joining Date</label>
                                <input 
                                    type="date" 
                                    name="joiningDate" 
                                    value={formData.joiningDate} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input 
                                    type="date" 
                                    name="dob" 
                                    value={formData.dob} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="staff-drawer-footer">
                        <button type="button" className="btn-cancel" onClick={closeModal} disabled={submitting}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? <Loader size={16} className="spinner" /> : 'Save Staff Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffFormModal;
