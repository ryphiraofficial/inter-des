import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const ConfirmApprovalDialog = ({ item, selectedPM, onCancel, onConfirm }) => {
    if (!item) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>Confirm Approval</h3>
                </div>
                <div style={{ padding: '20px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    <p style={{ margin: 0 }}>Are you sure you want to approve procurement for <strong>{item.requestNumber || item.title}</strong>?</p>
                    {!selectedPM[item._id] && (
                        <p style={{ margin: '10px 0 0', color: '#dc2626', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={14} /> Note: No Project Manager is assigned.
                        </p>
                    )}
                </div>
                <div style={{ padding: '16px 20px', background: '#f8fafc', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onCancel}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer' }}
                        onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                        onMouseOut={(e) => e.target.style.background = 'white'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onMouseOver={(e) => e.target.style.background = '#059669'}
                        onMouseOut={(e) => e.target.style.background = '#10b981'}
                    >
                        <CheckCircle size={16} /> Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmApprovalDialog;
