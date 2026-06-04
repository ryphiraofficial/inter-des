import React from 'react';
import { AlertTriangle } from 'lucide-react';

const PaymentWarningDialog = ({ item, onCancel, onProceed }) => {
    if (!item) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '50%', color: '#dc2626' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>Payment Pending Warning</h3>
                </div>
                <div style={{ padding: '20px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 10px 0' }}>The advance payment for <strong>{item.project?.name || 'this project'}</strong> has not been fully cleared.</p>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: '#64748b' }}>Advance Required:</span>
                            <span style={{ fontWeight: 600 }}>₹{(item.project?.advanceAmount || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Amount Collected:</span>
                            <span style={{ fontWeight: 600, color: '#dc2626' }}>₹{(item.project?.collectedAmount || 0).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <p style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>Are you sure you want to proceed to the final approval step?</p>
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
                        onClick={onProceed}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                        onMouseOut={(e) => e.target.style.background = '#dc2626'}
                    >
                        Proceed Anyway
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentWarningDialog;
