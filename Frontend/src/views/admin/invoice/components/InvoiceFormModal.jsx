import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const InvoiceFormModal = ({ 
    showCreateModal, setShowCreateModal, formData, setFormData, clients, submitting, handleCreateInvoice 
}) => {
    if (!showCreateModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-invoice" data-lenis-prevent>
                <div className="modal-header">
                    <h3>Create New Invoice</h3>
                    <button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="inv-form-grid">
                        <div className="inv-field">
                            <label>Client *</label>
                            <select
                                className="inv-input"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            >
                                <option value="">Select Client</option>
                                {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="inv-form-grid">
                            <div className="inv-field">
                                <label>Invoice Date</label>
                                <input
                                    type="date"
                                    className="inv-input"
                                    value={formData.invoiceDate}
                                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                                />
                            </div>
                            <div className="inv-field">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    className="inv-input"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700 }}>Items</span>
                        <button
                            className="btn-add-item"
                            onClick={() => setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, rate: 0, tax: 18 }] })}
                        >
                            <Plus size={16} /> Add Item
                        </button>
                    </div>

                    <table className="inv-items-table" style={{ width: '100%', marginTop: '1rem' }}>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Tax (%)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            className="inv-input"
                                            value={item.description}
                                            onChange={(e) => {
                                                const newItems = [...formData.items];
                                                newItems[idx].description = e.target.value;
                                                setFormData({ ...formData, items: newItems });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="inv-input"
                                            style={{ width: '60px' }}
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newItems = [...formData.items];
                                                newItems[idx].quantity = parseInt(e.target.value) || 0;
                                                setFormData({ ...formData, items: newItems });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="inv-input"
                                            style={{ width: '100px' }}
                                            value={item.rate}
                                            onChange={(e) => {
                                                const newItems = [...formData.items];
                                                newItems[idx].rate = parseInt(e.target.value) || 0;
                                                setFormData({ ...formData, items: newItems });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="inv-input"
                                            style={{ width: '60px' }}
                                            value={item.tax}
                                            onChange={(e) => {
                                                const newItems = [...formData.items];
                                                newItems[idx].tax = parseInt(e.target.value) || 0;
                                                setFormData({ ...formData, items: newItems });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => {
                                            const newItems = formData.items.filter((_, i) => i !== idx);
                                            setFormData({ ...formData, items: newItems });
                                        }} style={{ color: '#ef4444', border: 'none', background: 'none' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                    <button className="btn-save-inv" onClick={() => handleCreateInvoice(formData)} disabled={submitting}>
                        {submitting ? 'Generating...' : 'Generate Invoice'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceFormModal;
