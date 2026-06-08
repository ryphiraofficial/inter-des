import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName = 'client', isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
            <div className="modal-content-wide" style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ef4444' }}>
                    <AlertTriangle size={48} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', marginTop: 0 }}>
                    Delete {itemName}?
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
                    Are you sure you want to delete this {itemName}? This action cannot be undone.
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={onClose}
                        disabled={isDeleting}
                        style={{ flex: 1 }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        className="btn-submit" 
                        onClick={onConfirm}
                        disabled={isDeleting}
                        style={{ flex: 1, background: '#ef4444' }}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
