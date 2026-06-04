import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', cancelLabel = 'Cancel' }) => {
    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="cd-overlay" onClick={onCancel}>
            <div className="cd-dialog" onClick={e => e.stopPropagation()} role="alertdialog" aria-modal="true">
                {/* Icon */}
                <div className="cd-icon-wrap">
                    <AlertTriangle size={22} strokeWidth={2} />
                </div>

                {/* Close button */}
                <button className="cd-close" onClick={onCancel} aria-label="Close">
                    <X size={16} />
                </button>

                {/* Content */}
                <div className="cd-body">
                    <h4 className="cd-title">{title}</h4>
                    <p className="cd-message">{message}</p>
                </div>

                {/* Actions */}
                <div className="cd-actions">
                    <button className="cd-btn cd-btn-cancel" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button className="cd-btn cd-btn-confirm" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
