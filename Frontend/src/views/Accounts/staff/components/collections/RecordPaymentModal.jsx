import React from 'react';

const RecordPaymentModal = ({
    collectingProject,
    setCollectingProject,
    formData,
    setFormData,
    submitting,
    handleSubmitCollection
}) => {
    if (!collectingProject) return null;

    const isBal = collectingProject.paymentStatus !== 'Pending Advance';
    const targetAmount = isBal 
        ? (collectingProject.budget - (collectingProject.advanceAmount || collectingProject.collectedAmount || 0)) 
        : (collectingProject.advanceAmount || 0);

    return (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(15, 23, 42, 0.4)', 
            display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', zIndex: 99999,
            animation: 'fadeInOverlay 0.3s ease-out'
        }}>
            <style>
                {`
                @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideInRight { 
                    from { opacity: 0; transform: translateX(100%); } 
                    to { opacity: 1; transform: translateX(0); } 
                }
                .lux-input {
                    background: #f8fafc;
                    border: 1px solid transparent;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .lux-input:focus { 
                    background: #ffffff;
                    border-color: #3b82f6; 
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); 
                    outline: none;
                }
                .lux-input:hover:not(:focus) {
                    background: #f1f5f9;
                }
                .lux-btn-primary {
                    background: #0f172a;
                    color: white;
                    transition: all 0.25s ease;
                }
                .lux-btn-primary:hover {
                    background: #1e293b;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 20px -6px rgba(15, 23, 42, 0.3);
                }
                .lux-btn-secondary {
                    background: #ffffff;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }
                .lux-btn-secondary:hover {
                    background: #f8fafc;
                    color: #0f172a;
                    border-color: #cbd5e1;
                }
                `}
            </style>
            <div style={{ 
                background: 'rgba(255, 255, 255, 1)', 
                width: '100%', 
                maxWidth: '480px', 
                borderRadius: '24px 0 0 24px', 
                boxShadow: '-10px 0 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                overflowY: 'auto',
                animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Minimalist Elegant Header */}
                <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#3b82f6', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Payment Collection</span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                            {collectingProject.name}
                        </h3>
                        <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                            Project ID: <span style={{ fontWeight: 600, color: '#475569' }}>{collectingProject.projectNumber}</span>
                        </p>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setCollectingProject(null)}
                        style={{ 
                            background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            color: '#64748b', transition: 'all 0.2s', flexShrink: 0
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmitCollection} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
                    
                    {/* Target Amount Highlight Card */}
                    <div style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        padding: '24px', borderRadius: '16px', 
                        background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)', 
                        border: '1px solid rgba(0,0,0,0.03)' 
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Target {isBal ? 'Balance' : 'Advance'}
                            </span>
                            <span style={{ fontSize: '14px', color: '#94a3b8' }}>Amount to collect</span>
                        </div>
                        <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                            <span style={{ fontSize: '20px', color: '#64748b', marginRight: '4px' }}>₹</span>
                            {targetAmount.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {/* Input: Collected Amount */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Amount Collected *</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>₹</span>
                                <input 
                                    type="number" 
                                    required
                                    className="lux-input"
                                    placeholder="0.00"
                                    value={formData.collectedAmount} 
                                    onChange={e => setFormData(prev => ({ ...prev, collectedAmount: e.target.value }))}
                                    style={{ height: '48px', width: '100%', padding: '0 16px 0 36px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, color: '#0f172a', boxSizing: 'border-box' }} 
                                />
                            </div>
                        </div>

                        {/* Input: Mode of Payment */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Payment Mode *</label>
                            <select 
                                className="lux-input"
                                value={formData.paymentMode}
                                onChange={e => setFormData(prev => ({ ...prev, paymentMode: e.target.value }))}
                                style={{ height: '48px', width: '100%', padding: '0 16px', borderRadius: '12px', fontSize: '15px', fontWeight: 500, color: '#0f172a', cursor: 'pointer', appearance: 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 1.5L6 6L10.5 1.5' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, boxSizing: 'border-box' }}
                            >
                                <option value="Bank Transfer">Bank Transfer / NEFT</option>
                                <option value="UPI">UPI</option>
                                <option value="Cash">Cash</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                    </div>

                    {/* Input: Reference / Txn Number */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Transaction Reference</label>
                        <input 
                            type="text" 
                            className="lux-input"
                            placeholder="UTR, Cheque number, or Receipt ID"
                            value={formData.referenceNumber} 
                            onChange={e => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                            style={{ height: '48px', width: '100%', padding: '0 16px', borderRadius: '12px', fontSize: '15px', fontWeight: 500, color: '#0f172a', boxSizing: 'border-box' }} 
                        />
                    </div>

                    {/* Input: Notes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Remarks</label>
                        <textarea 
                            className="lux-input"
                            placeholder="Add any extra notes..."
                            value={formData.paymentNotes} 
                            onChange={e => setFormData(prev => ({ ...prev, paymentNotes: e.target.value }))}
                            style={{ padding: '16px', width: '100%', borderRadius: '12px', fontSize: '15px', fontWeight: 500, color: '#0f172a', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box' }} 
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '16px' }}>
                        <button 
                            type="button" 
                            onClick={() => setCollectingProject(null)}
                            disabled={submitting}
                            className="lux-btn-secondary"
                            style={{ 
                                flex: 1, height: '52px', borderRadius: '14px', 
                                fontWeight: 600, fontSize: '15px', cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="lux-btn-primary"
                            style={{ 
                                flex: 2, height: '52px', border: 'none', borderRadius: '14px', 
                                fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                        >
                            {submitting ? 'Processing...' : 'Confirm Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordPaymentModal;
