import React from 'react';
import { X } from 'lucide-react';

const ExpenseModal = ({ show, onClose, form, setForm, submitting, onSubmit }) => {
    if (!show) return null;

    const CATEGORIES = ['Materials', 'Labour', 'Transport', 'Tools & Equipment', 'Office', 'Utilities', 'Miscellaneous'];
    const STATUSES = ['Paid', 'Pending', 'Overdue'];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Expense</h3>
                    <button className="action-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Description *</label>
                        <input type="text" className="form-control" placeholder="What was this expense for?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount (₹) *</label>
                            <input type="number" className="form-control" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" className="form-control" value={form.expenseDate} onChange={e => setForm(p => ({ ...p, expenseDate: e.target.value }))} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select className="form-control filter-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="form-control filter-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Vendor / Supplier</label>
                        <input type="text" className="form-control" placeholder="Who did you pay?" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={onSubmit} disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save Expense'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseModal;
