import React from 'react';
import { X, Loader } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

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
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</h3>
                    <button className="modal-close" onClick={closeModal}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" data-lenis-prevent>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Full Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" required />
                            </div>
                            <div className="form-group">
                                <label>Role / Job Title *</label>
                                <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="e.g. Carpenter, Supervisor" required />
                            </div>
                            <div className="form-group">
                                <label>Phone Number * <small>(10 digits)</small></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter 10-digit number" required maxLength={10} pattern="[0-9]{10}" />
                            </div>
                            <div className="form-group full-width">
                                <label>Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email address" required />
                            </div>
                            {!editingStaff && (
                                <>
                                    <div className="form-group">
                                        <label>Password * <small>(min 6 chars)</small></label>
                                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Set password" required minLength={6} />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password *</label>
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm password" required />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <CustomSelect label="Status" name="status" options={[{ value: 'Active', label: 'Active' }, { value: 'On Leave', label: 'On Leave' }, { value: 'Inactive', label: 'Inactive' }]} value={formData.status} onChange={handleInputChange} searchable={false} />
                            </div>
                            <div className="form-group">
                                <label>Joining Date</label>
                                <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
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
