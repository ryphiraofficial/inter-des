import React from 'react';
import { X, User, Banknote } from 'lucide-react';
import { CustomDatePicker, CustomSelect } from '../../../components/UI/Inputs';

const PaymentModal = ({ show, onClose, form, setForm, clients, submitting, onSubmit }) => {
    if (!show) return null;

    const clientOptions = [
        { value: '', label: 'Select Client' },
        ...clients.map(c => ({ value: c._id, label: c.name }))
    ];

    const methodOptions = [
        { value: 'Bank Transfer', label: 'Bank Transfer', dot: '#3b82f6' },
        { value: 'Cash',          label: 'Cash',          dot: '#10b981' },
        { value: 'Cheque',        label: 'Cheque',        dot: '#8b5cf6' },
        { value: 'UPI',           label: 'UPI',           dot: '#f59e0b' },
        { value: 'Card',          label: 'Card',          dot: '#ef4444' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '460px' }}>
                <div className="modal-header">
                    <div>
                        <h3>Record Payment</h3>
                        <p className="modal-subtitle">Add an incoming payment record</p>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={18} /></button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="form-label">Client *</label>
                        <CustomSelect value={form.client} onChange={v => setForm(p => ({ ...p, client: v }))} options={clientOptions} placeholder="Select Client" icon={User} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                            <label className="form-label">Amount *</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1', fontWeight: 700, fontSize: '14px' }}>₹</span>
                                <input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="form-control" style={{ paddingLeft: '28px' }} />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Date</label>
                            <CustomDatePicker value={form.paymentDate} onChange={v => setForm(p => ({ ...p, paymentDate: v }))} />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Payment Method</label>
                        <CustomSelect value={form.paymentMethod} onChange={v => setForm(p => ({ ...p, paymentMethod: v }))} options={methodOptions} icon={Banknote} />
                    </div>
                    <div>
                        <label className="form-label">Reference / UTR</label>
                        <input type="text" placeholder="Transaction reference" value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} className="form-control" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={onSubmit} disabled={submitting} className="btn-primary">
                        {submitting ? 'Saving...' : 'Record Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
