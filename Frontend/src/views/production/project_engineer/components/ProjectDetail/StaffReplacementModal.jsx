import React from 'react';
import { X, Loader2 } from 'lucide-react';

const StaffReplacementModal = ({ 
    showReplaceModal, setShowReplaceModal, 
    handleReplaceRequest, replaceData, setReplaceData, saving 
}) => {
    if (!showReplaceModal) return null;

    return (
        <div className="eng-modal-overlay">
            <div className="eng-modal">
                <div className="eng-modal-header">
                    <h3>Request Staff Replacement</h3>
                    <button className="eng-modal-close" onClick={()=>setShowReplaceModal(false)}><X size={18}/></button>
                </div>
                <p className="eng-modal-sub">Requesting replacement for <strong>{replaceData.currentStaffName}</strong> ({replaceData.staffType})</p>
                <form onSubmit={handleReplaceRequest} className="eng-modal-form">
                    <div className="eng-form-group">
                        <label>Reason for Replacement *</label>
                        <textarea 
                            className="eng-input" 
                            rows={4} 
                            placeholder="Please provide a detailed reason for the replacement request..."
                            value={replaceData.reason} 
                            onChange={e=>setReplaceData({...replaceData, reason:e.target.value})}
                            required
                        />
                    </div>
                    <div className="eng-modal-footer">
                        <button type="button" className="eng-btn-ghost" onClick={()=>setShowReplaceModal(false)}>Cancel</button>
                        <button type="submit" className="eng-btn-primary" disabled={saving} style={{ background: '#ef4444' }}>
                            {saving?<><Loader2 size={14} className="eng-spin"/> Sending…</>:'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffReplacementModal;
