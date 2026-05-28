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
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '0 12px', height: '40px',
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px',
                    fontSize: '14px', color: value ? '#0f172a' : '#94a3b8',
                    cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s',
                    fontFamily: 'inherit'
                }}
            >
                {value || placeholder}
                <ChevronDown size={16} style={{ color: '#64748b', opacity: 0.7 }} />
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px',
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
                                width: '100%', padding: '8px 12px', background: 'transparent',
                                border: 'none', borderRadius: '4px', fontSize: '14px',
                                color: '#0f172a', cursor: 'pointer', textAlign: 'left',
                                backgroundColor: value === opt ? '#f1f5f9' : 'transparent',
                                fontFamily: 'inherit'
                            }}
                            onMouseEnter={e => { if (value !== opt) e.currentTarget.style.backgroundColor = '#f8fafc' }}
                            onMouseLeave={e => { if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                            {opt}
                            {value === opt && <Check size={14} style={{ color: '#0f172a' }} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const ExpenseModal = ({ show, onClose, form, setForm, submitting, onSubmit }) => {
    if (!show) return null;

    const CATEGORIES = ['Materials', 'Labour', 'Transport', 'Tools & Equipment', 'Office', 'Utilities', 'Food', 'Stationery', 'Fuel', 'Travel', 'Company Overhead', 'Miscellaneous'];
    const STATUSES = ['Paid', 'Pending', 'Overdue'];

    const inputStyle = {
        width: '100%', height: '40px', padding: '0 12px',
        border: '1px solid #e2e8f0', borderRadius: '6px',
        fontSize: '14px', color: '#0f172a', outline: 'none',
        background: '#fff', transition: 'border-color 0.2s',
        fontFamily: 'inherit'
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderRadius: '12px', padding: '24px', maxWidth: '500px' }}>
                <div className="modal-header" style={{ marginBottom: '20px', borderBottom: 'none', padding: 0 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Add New Expense</h3>
                    <button className="action-btn" onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', color: '#64748b' }}>
                        <X size={18} />
                    </button>
                </div>
                
                <div className="modal-body" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>DESCRIPTION *</label>
                        <input type="text" style={inputStyle} placeholder="What was this expense for?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: 0 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>AMOUNT (₹) *</label>
                            <input type="number" style={inputStyle} placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>DATE</label>
                            <input type="date" style={inputStyle} value={form.expenseDate} onChange={e => setForm(p => ({ ...p, expenseDate: e.target.value }))} />
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: 0 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>CATEGORY</label>
                            <CustomSelect 
                                value={form.category} 
                                options={CATEGORIES} 
                                onChange={v => setForm(p => ({ ...p, category: v }))} 
                                placeholder="Select Category"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>STATUS</label>
                            <CustomSelect 
                                value={form.status} 
                                options={STATUSES} 
                                onChange={v => setForm(p => ({ ...p, status: v }))} 
                                placeholder="Select Status"
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>VENDOR / SUPPLIER</label>
                        <input type="text" style={inputStyle} placeholder="Who did you pay?" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>UPLOAD RECEIPT / BILL</label>
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
                                style={{
                                    ...inputStyle,
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    color: form.receiptFile ? '#0f172a' : '#94a3b8', cursor: 'pointer',
                                    border: '1px dashed #cbd5e1', background: '#f8fafc'
                                }}
                            >
                                <UploadCloud size={16} style={{ color: '#64748b' }} />
                                {form.receiptFile ? form.receiptFile.name : 'Click to select a file...'}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="modal-footer" style={{ marginTop: '24px', padding: 0, borderTop: 'none', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            padding: '0 16px', height: '40px', background: '#fff', 
                            border: '1px solid #e2e8f0', borderRadius: '6px', 
                            color: '#475569', fontSize: '14px', fontWeight: 500, cursor: 'pointer' 
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onSubmit} 
                        disabled={submitting}
                        style={{ 
                            padding: '0 16px', height: '40px', background: '#0f172a', 
                            border: 'none', borderRadius: '6px', 
                            color: '#fff', fontSize: '14px', fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.7 : 1
                        }}
                    >
                        {submitting ? 'Saving...' : 'Save Expense'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseModal;
