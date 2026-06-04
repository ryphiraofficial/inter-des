import React from 'react';
import { X } from 'lucide-react';

const CreateApprovalModal = ({ setIsModalOpen, handleCreateRequest, newRequest, setNewRequest }) => {
    return (
        <div className="pm-modal-overlay">
            <div className="pm-modal">
                <div className="pm-modal-header">
                    <h2>Create Approval Request</h2>
                    <button onClick={() => setIsModalOpen(false)} className="pm-modal-close"><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateRequest} className="pm-modal-form">
                    <div className="pm-form-group">
                        <label>Request Title *</label>
                        <input required type="text" value={newRequest.requestTitle} onChange={e => setNewRequest({...newRequest, requestTitle: e.target.value})} />
                    </div>
                    <div className="pm-form-group">
                        <label>Project Name *</label>
                        <input required type="text" value={newRequest.projectName} onChange={e => setNewRequest({...newRequest, projectName: e.target.value})} />
                    </div>
                    <div className="pm-form-group">
                        <label>Submitted By *</label>
                        <input required type="text" value={newRequest.submittedBy} onChange={e => setNewRequest({...newRequest, submittedBy: e.target.value})} />
                    </div>
                    <div className="pm-form-group">
                        <label>Request Type</label>
                        <select value={newRequest.requestType} onChange={e => setNewRequest({...newRequest, requestType: e.target.value})} style={{ background: 'white' }}>
                            <option value="Material">Material</option>
                            <option value="Milestone">Milestone</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Design">Design</option>
                        </select>
                    </div>
                    <div className="pm-form-group">
                        <label>Value / Amount (Optional)</label>
                        <input type="number" min="0" value={newRequest.value} onChange={e => setNewRequest({...newRequest, value: e.target.value})} />
                    </div>
                    
                    <button type="submit" className="pm-modal-submit-btn">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateApprovalModal;
