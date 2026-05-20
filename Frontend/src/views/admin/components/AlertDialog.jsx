import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './css/AlertDialog.css';

const AlertDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you absolutely sure?", 
    description = "This action cannot be undone. This will permanently delete the item and remove data from our servers.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isDestructive = true,
    isProcessing = false
}) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="alert-dialog-overlay fade-in">
            <div className="alert-dialog-content slide-up">
                <div className="alert-dialog-header">
                    <div className={`alert-icon-container ${isDestructive ? 'destructive' : 'primary'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="alert-dialog-title-area">
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>
                </div>
                
                <div className="alert-dialog-footer">
                    <button 
                        className="alert-btn-cancel" 
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className={`alert-btn-confirm ${isDestructive ? 'destructive' : 'primary'}`} 
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;
