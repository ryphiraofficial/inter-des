import React from 'react';
import { X } from 'lucide-react';

const DecisionModal = ({
    actionTask,
    actionType,
    setActionTask,
    setActionType,
    salesNotes,
    setSalesNotes,
    submittingAction,
    handleActionSubmit
}) => {
    if (!actionTask || !actionType) return null;

    return (
        <div className="local-feedback-overlay">
            <form className="local-feedback-card" onSubmit={handleActionSubmit}>
                <div className="feedback-header">
                    <h3>{actionType === 'approve' ? 'Approve Concept Design' : 'Request Design Revision'}</h3>
                    <button 
                        type="button" 
                        className="btn-close-feedback"
                        onClick={() => { setActionTask(null); setActionType(null); }}
                    >
                        <X size={18} />
                    </button>
                </div>
                
                <div className="feedback-input-group">
                    <label>
                        {actionType === 'approve' 
                            ? 'Add optional presentation or coordination notes for the Design Manager:' 
                            : 'Provide mandatory revision reasons or client feedback details:'}
                    </label>
                    <textarea
                        className="feedback-textarea"
                        placeholder={actionType === 'approve' 
                            ? 'E.g., Client approved color scheme, wants to finalise wardrobe material choice...' 
                            : 'E.g., Client rejected the current wooden layout. Please change to matte white finishes and relocate the vanity unit...'}
                        value={salesNotes}
                        onChange={(e) => setSalesNotes(e.target.value)}
                        required={actionType === 'reject'}
                    />
                </div>

                <div className="feedback-actions">
                    <button 
                        type="button" 
                        className="st-btn-action approve"
                        style={{ background: '#f1f5f9', color: '#475569', flex: 'none', width: '100px' }}
                        onClick={() => { setActionTask(null); setActionType(null); }}
                        disabled={submittingAction}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className={actionType === 'approve' ? 'st-btn-action approve' : 'st-btn-action reject'}
                        style={{ flex: 1 }}
                        disabled={submittingAction}
                    >
                        {submittingAction 
                            ? 'Submitting...' 
                            : actionType === 'approve' 
                                ? 'Approve & Submit' 
                                : 'Request Revision'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DecisionModal;
