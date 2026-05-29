import React from 'react';
import { createPortal } from 'react-dom';
import { X, Loader } from 'lucide-react';

const SalesClientModal = ({ showModal, closeModal, handleSubmit, formData, handleInputChange, submitting }) => {
    if (!showModal) return null;

    return createPortal(
        <div className="sc-modal-overlay">
            <div className="sc-modal-card">
                <div className="sc-modal-header">
                    <h3>Add New Client</h3>
                    <button type="button" onClick={closeModal} className="sc-modal-close">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="sc-form">
                    <div className="sc-form-section">
                        <div className="sc-form-grid">
                            <div className="sc-input-group">
                                <label>Full Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Client name" />
                            </div>
                            <div className="sc-input-group">
                                <label>Project Name</label>
                                <input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="e.g., Omega Tower Kitchen" />
                            </div>
                            <div className="sc-input-group">
                                <label>Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="email@example.com" />
                            </div>
                            <div className="sc-input-group">
                                <label>Phone *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone number" />
                            </div>
                            <div className="sc-input-group">
                                <label>Alternative Phone</label>
                                <input type="tel" name="contact1" value={formData.contact1} onChange={handleInputChange} placeholder="Secondary number" />
                            </div>
                            <div className="sc-input-group">
                                <label>WhatsApp Number</label>
                                <input type="tel" name="contact2" value={formData.contact2} onChange={handleInputChange} placeholder="Primary WhatsApp" />
                            </div>
                            <div className="sc-input-group">
                                <label>Site Address</label>
                                <input type="text" name="siteAddress" value={formData.siteAddress} onChange={handleInputChange} placeholder="Project site location" />
                            </div>
                        </div>
                    </div>
                    <div className="sc-modal-footer">
                        <button type="button" onClick={closeModal} className="sc-btn-cancel">Cancel</button>
                        <button type="submit" disabled={submitting} className="sc-btn-submit">
                            {submitting ? <Loader className="spinner" size={16} /> : 'Save Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default SalesClientModal;
