import React from 'react';
import { DollarSign, X, AlertTriangle, CheckCircle } from 'lucide-react';

const ADVANCE_OPTIONS = [10, 20, 25, 30, 40, 50];

const PaymentCollectionModal = ({ 
    paymentTask, setShowPaymentModal, advancePct, setAdvancePct, 
    paymentDueDate, setPaymentDueDate, paymentNotes, setPaymentNotes, 
    procurementManagers = [], selectedProcurementManagerId, setSelectedProcurementManagerId,
    submitApproval, submittingApproval 
}) => {
    const quotTotal = paymentTask.quotation?.totalAmount || 0;
    const calcAmt = Math.round((quotTotal * advancePct) / 100);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '28px', width: '100%', maxWidth: '560px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '28px 32px', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <DollarSign size={22} />
                                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Approve & Set Payment Collection</h2>
                            </div>
                            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>Configure advance payment before releasing to Accounts Manager</p>
                        </div>
                        <button onClick={() => setShowPaymentModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}><X size={18} /></button>
                    </div>
                </div>

                <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Project</p>
                                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{paymentTask.title}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Client</p>
                                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{paymentTask.client?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Quotation Total</p>
                                <p style={{ margin: 0, fontWeight: 800, color: '#4f46e5', fontSize: '16px' }}>₹{quotTotal.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Advance to Collect</p>
                                <p style={{ margin: 0, fontWeight: 800, color: '#10b981', fontSize: '16px' }}>₹{calcAmt.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>Advance Percentage (Locked for Accounts Manager)</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {ADVANCE_OPTIONS.map(pct => (
                                <button key={pct} onClick={() => setAdvancePct(pct)} style={{ padding: '8px 18px', borderRadius: '100px', border: `2px solid ${advancePct === pct ? '#4f46e5' : '#e2e8f0'}`, background: advancePct === pct ? '#eef2ff' : 'white', color: advancePct === pct ? '#4f46e5' : '#64748b', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s' }}>
                                    {pct}%
                                </button>
                            ))}
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>
                            <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px', color: '#f59e0b' }} />
                            This amount is locked and cannot be changed by the Accounts Manager
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Assign Procurement Manager <span style={{ color: '#ef4444' }}>*</span></label>
                        <select 
                            value={selectedProcurementManagerId} 
                            onChange={e => setSelectedProcurementManagerId(e.target.value)}
                            required
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: `1.5px solid ${selectedProcurementManagerId ? '#4f46e5' : '#e2e8f0'}`, fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none', cursor: 'pointer', boxSizing: 'border-box', backgroundColor: 'white' }}
                        >
                            <option value="">-- Choose a Procurement Manager --</option>
                            {procurementManagers.map(m => (
                                <option key={m._id} value={m._id}>{m.fullName} ({m.email})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Payment Due Date <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="date" value={paymentDueDate} onChange={e => setPaymentDueDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: `1.5px solid ${paymentDueDate ? '#4f46e5' : '#e2e8f0'}`, fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Notes for Accounts Manager <span style={{ color: '#94a3b8' }}>(optional)</span></label>
                        <textarea value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} placeholder="e.g. Client agreed to 30% advance via NEFT. Contact: Rahul — 9876543210"
                            rows={3} style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
                        <button onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', color: '#374151' }}>
                            Cancel
                        </button>
                        <button onClick={() => submitApproval({ paymentTask, advancePct, paymentDueDate, paymentNotes, procurementManagerId: selectedProcurementManagerId })} disabled={submittingApproval || !paymentDueDate || !selectedProcurementManagerId}
                            style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: submittingApproval || !paymentDueDate || !selectedProcurementManagerId ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', fontWeight: 800, fontSize: '14px', cursor: submittingApproval || !paymentDueDate || !selectedProcurementManagerId ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                            {submittingApproval ? 'Approving...' : <><CheckCircle size={17} /> Approve & Pushed to Procurement</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCollectionModal;
