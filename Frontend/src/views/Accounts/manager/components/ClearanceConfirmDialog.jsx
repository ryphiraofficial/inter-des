import React, { useState, useEffect } from 'react';

const ClearanceConfirmDialog = ({ isOpen, confirmData = {}, handleConfirmClose, handleConfirmSubmit }) => {
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Bank Transfer');
    const [reference, setReference] = useState('');

    useEffect(() => {
        if (isOpen && confirmData) {
            setAmount(confirmData.defaultAmount || 0);
            setPaymentMode(confirmData.defaultMode || 'Bank Transfer');
            setReference(confirmData.defaultRef || '');
        }
    }, [isOpen, confirmData]);

    if (!isOpen) return null;

    const inputStyle = {
        width: '100%',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid #cbd5e1',
        fontSize: '0.875rem',
        color: '#334155',
        boxSizing: 'border-box'
    };

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                        {confirmData.isVerified ? 'Verify & Release Project' : 'Clear Payment & Release'}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        {confirmData.isVerified 
                            ? 'Please review the collection details below before releasing the project for the next phase.'
                            : 'Specify the amount paid by the client to clear the payment and release the project.'}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.25rem' }}>Amount Paid (₹)</label>
                        <input 
                            type="number" 
                            style={inputStyle} 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.25rem' }}>Payment Method</label>
                        <select 
                            style={{ ...inputStyle, backgroundColor: '#fff' }} 
                            value={paymentMode} 
                            onChange={(e) => setPaymentMode(e.target.value)}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                            <option value="UPI">UPI</option>
                            <option value="Card">Card</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.25rem' }}>Reference / Transaction ID</label>
                        <input 
                            type="text" 
                            style={inputStyle} 
                            value={reference} 
                            placeholder="Optional"
                            onChange={(e) => setReference(e.target.value)} 
                        />
                    </div>
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
                        onClick={() => handleConfirmSubmit({ amount, paymentMode, referenceNumber: reference })}
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
                        {confirmData.isVerified ? 'Verify Payment' : 'Clear Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClearanceConfirmDialog;
