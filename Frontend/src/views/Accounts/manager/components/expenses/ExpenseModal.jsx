import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, UploadCloud } from 'lucide-react';

const CustomSelect = ({ value, options, onChange, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                className="form-control"
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', height: 'auto',
                    color: value ? '#0f172a' : '#94a3b8',
                    cursor: 'pointer', textAlign: 'left',
                    backgroundColor: 'white'
                }}
            >
                {value || placeholder}
                <ChevronDown size={16} style={{ color: '#64748b', opacity: 0.7 }} />
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 50, maxHeight: '220px', overflowY: 'auto', padding: '4px',
                    display: 'flex', flexDirection: 'column', gap: '2px'
                }}>
                    {options.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => { onChange(opt); setOpen(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                width: '100%', padding: '10px 12px', background: 'transparent',
                                border: 'none', borderRadius: '6px', fontSize: '0.95rem',
                                color: '#0f172a', cursor: 'pointer', textAlign: 'left',
                                backgroundColor: value === opt ? '#f1f5f9' : 'transparent',
                                fontFamily: 'inherit'
                            }}
                            onMouseEnter={e => { if (value !== opt) e.currentTarget.style.backgroundColor = '#f8fafc' }}
                            onMouseLeave={e => { if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                            {opt}
                            {value === opt && <Check size={16} style={{ color: '#4f46e5' }} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const ExpenseModal = ({ show, onClose, form, setForm, submitting, onSubmit, editingId }) => {
    if (!show) return null;

    const CATEGORIES = ['Materials', 'Labour', 'Transport', 'Tools & Equipment', 'Office', 'Utilities', 'Food', 'Stationery', 'Fuel', 'Travel', 'Company Overhead', 'Miscellaneous'];
    const STATUSES = ['Paid', 'Pending', 'Overdue'];

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
                    <button className="action-btn" onClick={onClose} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: '50%' }}>
                        <X size={18} />
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="form-group">
                        <label>DESCRIPTION *</label>
                        <input type="text" className="form-control" placeholder="What was this expense for?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>AMOUNT (₹) *</label>
                            <input type="number" className="form-control" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>DATE</label>
                            <input type="date" className="form-control" value={form.expenseDate} onChange={e => setForm(p => ({ ...p, expenseDate: e.target.value }))} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>CATEGORY</label>
                            <CustomSelect 
                                value={form.category} 
                                options={CATEGORIES} 
                                onChange={v => setForm(p => ({ ...p, category: v }))} 
                                placeholder="Select Category"
                            />
                        </div>
                        <div className="form-group">
                            <label>STATUS</label>
                            <CustomSelect 
                                value={form.status} 
                                options={STATUSES} 
                                onChange={v => setForm(p => ({ ...p, status: v }))} 
                                placeholder="Select Status"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>VENDOR / SUPPLIER</label>
                        <input type="text" className="form-control" placeholder="Who did you pay?" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
                    </div>

                    <div className="form-group">
                        <label>UPLOAD RECEIPT / BILL</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="file" 
                                accept="image/*,.pdf" 
                                id="receipt-upload"
                                style={{ display: 'none' }}
                                onChange={e => setForm(p => ({ ...p, receiptFile: e.target.files[0] }))} 
                            />
                            <label 
                                htmlFor="receipt-upload"
                                className="form-control"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    color: form.receiptFile ? '#0f172a' : '#94a3b8', cursor: 'pointer',
                                    border: '1px dashed #cbd5e1', background: '#f8fafc',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}
                            >
                                <UploadCloud size={16} style={{ color: '#64748b', flexShrink: 0 }} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {form.receiptFile ? form.receiptFile.name : 'Click to select a file...'}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '12px' }}>
                    <button 
                        className="btn-secondary"
                        onClick={onClose} 
                        style={{ flex: '1 1 120px', justifyContent: 'center' }}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={onSubmit} 
                        disabled={submitting}
                        style={{ flex: '1 1 120px', justifyContent: 'center', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                    >
                        {submitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Save Expense')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseModal;
