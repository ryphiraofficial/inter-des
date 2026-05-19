import React from 'react';
import { DollarSign, X, AlertTriangle, CheckCircle } from 'lucide-react';
import DatePicker from '../../../common/DatePicker';
import CustomSelect from '../../../common/CustomSelect';

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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="payment-modal-card" style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                
                {/* Header */}
                <div className="payment-modal-header" style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <DollarSign size={20} style={{ color: '#4f46e5' }} />
                            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>Approve & Set Payment Collection</h2>
                        </div>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>Configure advance payment before releasing to Accounts Manager</p>
                    </div>
                    <button 
                        onClick={() => setShowPaymentModal(false)} 
                        style={{ background: 'none', border: 'none', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.15s' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="payment-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Project & Client summary cards */}
                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 12px' }}>
                            <div>
                                <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</p>
                                <p style={{ margin: 0, fontWeight: 500, color: '#0f172a', fontSize: '13px' }}>{paymentTask.title}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client</p>
                                <p style={{ margin: 0, fontWeight: 500, color: '#0f172a', fontSize: '13px' }}>{paymentTask.client?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quotation Total</p>
                                <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>₹{quotTotal.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Advance to Collect</p>
                                <p style={{ margin: 0, fontWeight: 700, color: '#10b981', fontSize: '14px' }}>₹{calcAmt.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Advance Percentage */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0f172a', marginBottom: '8px' }}>Advance Percentage (Locked for Accounts Manager)</label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {ADVANCE_OPTIONS.map(pct => (
                                <button 
                                    key={pct} 
                                    onClick={() => setAdvancePct(pct)} 
                                    style={{ 
                                        padding: '6px 14px', 
                                        borderRadius: '6px', 
                                        border: `1px solid ${advancePct === pct ? '#0f172a' : '#e2e8f0'}`, 
                                        background: advancePct === pct ? '#0f172a' : 'white', 
                                        color: advancePct === pct ? 'white' : '#475569', 
                                        fontWeight: 500, 
                                        fontSize: '13px', 
                                        cursor: 'pointer', 
                                        transition: 'all 0.15s' 
                                    }}
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>
                        <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
                            This percentage will be locked for the Accounts department
                        </p>
                    </div>

                    {/* Assign Procurement Manager */}
                    <div>
                        <CustomSelect
                            label="Assign Procurement Manager"
                            required
                            options={procurementManagers.map(m => ({ value: m._id, label: `${m.fullName} (${m.email})` }))}
                            value={selectedProcurementManagerId}
                            onChange={(e) => setSelectedProcurementManagerId(e.target.value)}
                            placeholder="Select a Procurement Manager"
                        />
                    </div>

                    {/* Payment Due Date */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>
                            Payment Due Date <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <DatePicker
                            value={paymentDueDate}
                            onChange={(dateStr) => setPaymentDueDate(dateStr)}
                            placeholder="Pick a date"
                            minDate={new Date()}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>
                            Notes for Accounts Manager <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea 
                            value={paymentNotes} 
                            onChange={e => setPaymentNotes(e.target.value)} 
                            placeholder="e.g. Client agreed to 30% advance via NEFT. Contact: Rahul — 9876543210"
                            rows={3} 
                            style={{ 
                                width: '100%', 
                                padding: '8px 12px', 
                                borderRadius: '6px', 
                                border: '1px solid #e2e8f0', 
                                fontSize: '13px', 
                                color: '#0f172a', 
                                resize: 'none', 
                                outline: 'none', 
                                boxSizing: 'border-box', 
                                fontFamily: 'inherit',
                                transition: 'all 0.15s'
                            }} 
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(148, 163, 184, 0.15)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                        <button 
                            onClick={() => setShowPaymentModal(false)} 
                            style={{ 
                                flex: 1, 
                                padding: '9px', 
                                borderRadius: '6px', 
                                border: '1px solid #e2e8f0', 
                                background: 'white', 
                                fontWeight: 500, 
                                fontSize: '13px', 
                                cursor: 'pointer', 
                                color: '#374151',
                                transition: 'all 0.15s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => submitApproval({ paymentTask, advancePct, paymentDueDate, paymentNotes, procurementManagerId: selectedProcurementManagerId })} 
                            disabled={submittingApproval || !paymentDueDate || !selectedProcurementManagerId}
                            style={{ 
                                flex: 2, 
                                padding: '9px', 
                                borderRadius: '6px', 
                                border: 'none', 
                                background: submittingApproval || !paymentDueDate || !selectedProcurementManagerId ? '#94a3b8' : '#0f172a', 
                                color: 'white', 
                                fontWeight: 500, 
                                fontSize: '13px', 
                                cursor: submittingApproval || !paymentDueDate || !selectedProcurementManagerId ? 'not-allowed' : 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '6px', 
                                transition: 'all 0.15s' 
                            }}
                            onMouseOver={(e) => { if (!submittingApproval && paymentDueDate && selectedProcurementManagerId) e.currentTarget.style.backgroundColor = '#1e293b'; }}
                            onMouseOut={(e) => { if (!submittingApproval && paymentDueDate && selectedProcurementManagerId) e.currentTarget.style.backgroundColor = '#0f172a'; }}
                        >
                            {submittingApproval ? 'Approving...' : <><CheckCircle size={15} /> Approve & Pushed to Procurement</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCollectionModal;

