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
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 
        }}>
            <div style={{ 
                background: '#fff', 
                width: '100%', 
                maxWidth: '480px', 
                borderRadius: '16px', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
            }}>
                {/* Modal Header */}
                <div style={{ padding: '20px 24px', background: '#6366f1', color: '#fff' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Record Payment Collection</h3>
                    <span style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px', display: 'block' }}>
                        Project: {collectingProject.name} ({collectingProject.projectNumber})
                    </span>
                </div>

                <form onSubmit={handleSubmitCollection} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Target advance info card */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f5f3ff', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                        <span style={{ fontSize: '13px', color: '#5b21b6', fontWeight: 600 }}>Target Amount ({isBal ? 'Balance' : 'Advance'}):</span>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#5b21b6' }}>
                            ₹{targetAmount.toLocaleString('en-IN')}
                        </span>
                    </div>

                    {/* Input: Collected Amount */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Amount Collected (₹) *</label>
                        <input 
                            type="number" 
                            required
                            placeholder="Enter amount"
                            value={formData.collectedAmount} 
                            onChange={e => setFormData(prev => ({ ...prev, collectedAmount: e.target.value }))}
                            style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px' }} 
                        />
                    </div>

                    {/* Input: Mode of Payment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Payment Mode *</label>
                        <select 
                            value={formData.paymentMode}
                            onChange={e => setFormData(prev => ({ ...prev, paymentMode: e.target.value }))}
                            style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#fff' }}
                        >
                            <option value="Bank Transfer">Bank Transfer / NEFT</option>
                            <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>

                    {/* Input: Reference / Txn Number */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Reference / Txn ID</label>
                        <input 
                            type="text" 
                            placeholder="e.g. UTR number, Cheque no, or Receipt ID"
                            value={formData.referenceNumber} 
                            onChange={e => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                            style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px' }} 
                        />
                    </div>

                    {/* Input: Notes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Remarks / Collection Notes</label>
                        <textarea 
                            placeholder="Add any extra notes or payment remarks..."
                            value={formData.paymentNotes} 
                            onChange={e => setFormData(prev => ({ ...prev, paymentNotes: e.target.value }))}
                            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px', minHeight: '80px', resize: 'vertical' }} 
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
                        <button 
                            type="button" 
                            onClick={() => setCollectingProject(null)}
                            disabled={submitting}
                            style={{ 
                                padding: '10px 18px', border: '1px solid #cbd5e1', borderRadius: '8px', 
                                background: '#fff', color: '#475569', fontWeight: 600, fontSize: '14px', cursor: 'pointer' 
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            style={{ 
                                padding: '10px 22px', border: 'none', borderRadius: '8px', 
                                background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            {submitting ? 'Saving...' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordPaymentModal;
