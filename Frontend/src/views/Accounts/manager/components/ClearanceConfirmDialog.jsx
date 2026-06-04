import React from 'react';

const ClearanceConfirmDialog = ({ isOpen, handleConfirmClose, handleConfirmSubmit }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '512px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Are you absolutely sure?</h2>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        This action cannot be undone. This will clear the payment status and release the project for the next phase.
                    </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <button 
                        onClick={handleConfirmClose}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#0f172a',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmSubmit}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClearanceConfirmDialog;
