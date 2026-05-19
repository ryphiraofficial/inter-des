import React from 'react';

const TimeExtensionModal = ({ 
    isOpen, 
    onClose, 
    extensionDate, 
    setExtensionDate, 
    extensionReason, 
    setExtensionReason, 
    onSubmit 
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
            <div className="modal-content" style={{ background: 'white', width: '450px', borderRadius: '16px', padding: '1.5rem' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Request Time Extension</h3>
                    <button style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Requested Date</label>
                        <input 
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
                            type="date" 
                            value={extensionDate}
                            onChange={(e) => setExtensionDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Reason</label>
                        <textarea 
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
                            rows="4"
                            value={extensionReason}
                            onChange={(e) => setExtensionReason(e.target.value)}
                            placeholder="Why is more time needed?"
                        ></textarea>
                    </div>
                    <button 
                        style={{ width: '100%', padding: '12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                        onClick={onSubmit}
                        disabled={!extensionDate || !extensionReason}
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeExtensionModal;
