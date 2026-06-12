import React from 'react';
import { X, Plus } from 'lucide-react';
import AISuggestButton from '../../components/AISuggestButton';

const POFormModal = ({ 
    showCreateModal, setShowCreateModal, formData, setFormData, submitting, handleCreatePO 
}) => {
    if (!showCreateModal) return null;

    return (
        <div className="po-drawer-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="po-drawer-content" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
                <div className="po-drawer-header">
                    <h3>Create Purchase Order</h3>
                    <button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={24} /></button>
                </div>
                <div className="po-drawer-body">
                    {/* Supplier Details Section */}
                    <div className="po-form-section-title">Supplier Details</div>
                    <div className="modal-form-grid">
                        <div className="form-field">
                            <label>Supplier Name <span>*</span></label>
                            <input
                                type="text"
                                className="po-input"
                                placeholder="Supplier name"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                            />
                        </div>
                        <div className="form-field">
                            <label>Contact Phone</label>
                            <input
                                type="text"
                                className="po-input"
                                placeholder="Supplier phone number"
                                value={formData.supplierContact}
                                onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="form-field" style={{ marginBottom: '1rem' }}>
                        <label>Supplier Email</label>
                        <input
                            type="email"
                            className="po-input"
                            placeholder="Supplier email address"
                            value={formData.supplierEmail}
                            onChange={(e) => setFormData({ ...formData, supplierEmail: e.target.value })}
                        />
                    </div>

                    {/* Order Details & Terms Section */}
                    <div className="po-form-section-title">Order Details & Terms</div>
                    <div className="po-form-grid-3">
                        <div className="form-field">
                            <label>Delivery Date <span>*</span></label>
                            <input
                                type="date"
                                className="po-input"
                                value={formData.deliveryDate}
                                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            />
                        </div>
                        <div className="form-field">
                            <label>Payment Terms</label>
                            <input
                                type="text"
                                className="po-input"
                                placeholder="e.g. Net 30 days"
                                value={formData.paymentTerms}
                                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                            />
                        </div>
                        <div className="form-field">
                            <label>Tax Rate (%)</label>
                            <input
                                type="number"
                                className="po-input"
                                placeholder="18"
                                value={formData.taxRate}
                                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-field" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label>Delivery Address <span>*</span></label>
                            <AISuggestButton
                                type="PurchaseOrder"
                                field="deliveryAddress"
                                value={formData.deliveryAddress}
                                context={{ supplier: formData.supplier }}
                                onSuggest={(v) => setFormData({ ...formData, deliveryAddress: v })}
                            />
                        </div>
                        <textarea
                            className="po-input"
                            placeholder="Delivery address details"
                            value={formData.deliveryAddress}
                            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        />
                    </div>

                    <div className="form-field" style={{ marginBottom: '1rem' }}>
                        <label>Notes / Comments</label>
                        <textarea
                            className="po-input"
                            placeholder="Add any specific instructions or notes..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {/* Items Section */}
                    <div className="po-form-section-title">Order Items</div>
                    <div className="items-section-header">
                        <h4>Items List</h4>
                        <button
                            className="btn-add-item-purple"
                            onClick={() => setFormData({ ...formData, items: [...formData.items, { itemName: '', quantity: 1, rate: 0, unit: 'pcs' }] })}
                        >
                            <Plus size={18} /> Add Item
                        </button>
                    </div>
                    <div className="po-items-list" style={{ marginBottom: '1.5rem' }}>
                        {formData.items.map((item, idx) => (
                            <div key={idx} className="po-item-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    placeholder="Item name"
                                    className="po-input"
                                    style={{ flex: 3 }}
                                    value={item.itemName}
                                    onChange={(e) => {
                                        const newItems = [...formData.items];
                                        newItems[idx].itemName = e.target.value;
                                        setFormData({ ...formData, items: newItems });
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    className="po-input"
                                    style={{ flex: 1 }}
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const newItems = [...formData.items];
                                        newItems[idx].quantity = e.target.value;
                                        setFormData({ ...formData, items: newItems });
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Rate"
                                    className="po-input"
                                    style={{ flex: 1 }}
                                    value={item.rate}
                                    onChange={(e) => {
                                        const newItems = [...formData.items];
                                        newItems[idx].rate = e.target.value;
                                        setFormData({ ...formData, items: newItems });
                                    }}
                                />
                                <input
                                    placeholder="Unit"
                                    className="po-input"
                                    style={{ flex: 1 }}
                                    value={item.unit}
                                    onChange={(e) => {
                                        const newItems = [...formData.items];
                                        newItems[idx].unit = e.target.value;
                                        setFormData({ ...formData, items: newItems });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="po-drawer-footer">
                    <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                    <button
                        className="btn-create-po"
                        onClick={() => handleCreatePO(formData)}
                        disabled={submitting}
                    >
                        {submitting ? 'Creating...' : 'Create Purchase Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POFormModal;
