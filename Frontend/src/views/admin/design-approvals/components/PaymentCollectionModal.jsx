import React from 'react';
import { DollarSign, X, CheckCircle } from 'lucide-react';
import DatePicker from '../../../common/DatePicker';
import CustomSelect from '../../../common/CustomSelect';
import { ProjectSummaryCard, AdvancePctSelector } from './PaymentModalParts';

const PaymentCollectionModal = ({
    paymentTask, setShowPaymentModal, advancePct, setAdvancePct,
    paymentDueDate, setPaymentDueDate, paymentNotes, setPaymentNotes,
    accountsManagers, selectedAccountsManagerId, setSelectedAccountsManagerId,
    submitApproval, submittingApproval
}) => {
    const quotTotal = paymentTask.quotation?.totalAmount || 0;
    const calcAmt   = Math.round((quotTotal * advancePct) / 100);
    const canSubmit = !submittingApproval && paymentDueDate;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="payment-modal-card" style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div className="payment-modal-header" style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <DollarSign size={20} style={{ color: '#4f46e5' }} />
                            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>Approve &amp; Send to Accounts</h2>
                        </div>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>Configure advance payment before releasing to Accounts Manager</p>
                    </div>
                    <button onClick={() => setShowPaymentModal(false)}
                        style={{ background: 'none', border: 'none', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="payment-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <ProjectSummaryCard paymentTask={paymentTask} quotTotal={quotTotal} calcAmt={calcAmt} />
                    <AdvancePctSelector advancePct={advancePct} setAdvancePct={setAdvancePct} />

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>
                            Payment Due Date <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <DatePicker value={paymentDueDate} onChange={(dateStr) => setPaymentDueDate(dateStr)} placeholder="Pick a date" minDate={new Date()} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>
                            Assign Accounts Manager <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <CustomSelect
                            value={selectedAccountsManagerId || ''}
                            onChange={(e) => setSelectedAccountsManagerId(e.target.value)}
                            options={[
                                { label: 'Select Accounts Manager (Unassigned)', value: '' },
                                ...(accountsManagers || []).map(m => ({
                                    label: `${m.fullName} — Accounts Manager`,
                                    value: String(m._id)
                                }))
                            ]}
                            placeholder="Search accounts staff..."
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>
                            Notes for Accounts Manager <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)}
                            placeholder="e.g. Client agreed to 30% advance via NEFT. Contact: Rahul — 9876543210"
                            rows={3}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#0f172a', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'all 0.15s' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(148,163,184,0.15)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }} />
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                        <button onClick={() => setShowPaymentModal(false)}
                            style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 500, fontSize: '13px', cursor: 'pointer', color: '#374151', transition: 'all 0.15s' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}>
                            Cancel
                        </button>
                        <button
                            onClick={() => submitApproval({ paymentTask, advancePct, paymentDueDate, paymentNotes, accountsManagerId: selectedAccountsManagerId })}
                            disabled={!canSubmit}
                            style={{ flex: 2, padding: '9px', borderRadius: '6px', border: 'none', background: canSubmit ? '#0f172a' : '#94a3b8', color: 'white', fontWeight: 500, fontSize: '13px', cursor: canSubmit ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.15s' }}
                            onMouseOver={(e) => { if (canSubmit) e.currentTarget.style.backgroundColor = '#1e293b'; }}
                            onMouseOut={(e) => { if (canSubmit) e.currentTarget.style.backgroundColor = '#0f172a'; }}>
                            {submittingApproval ? 'Approving...' : <><CheckCircle size={15} /> Approve &amp; Send to Accounts</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCollectionModal;
