import React from 'react';
import { X } from 'lucide-react';

const POAddModal = ({ showAddModal, setShowAddModal, formData, setFormData, handleCreateItem, submitting }) => {
    if (!showAddModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-wide" style={{ width: '450px' }}>
                <div className="modal-header">
                    <h3>Add Inventory Item</h3>
                    <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={24} /></button>
                </div>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Item Name *</label>
                        <input
                            className="po-input"
                            style={{ width: '100%' }}
                            value={formData.itemName}
                            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>SKU/ID</label>
                        <input
                            className="po-input"
                            style={{ width: '100%' }}
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Supplier</label>
                        <input
                            className="po-input"
                            style={{ width: '100%' }}
                            value={formData.supplier}
                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Current Stock</label>
                            <input
                                type="number"
                                className="po-input"
                                style={{ width: '100%' }}
                                value={formData.currentStock}
                                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Min. Reorder</label>
                            <input
                                type="number"
                                className="po-input"
                                style={{ width: '100%' }}
                                value={formData.reorderPoint}
                                onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', background: '#f8fafc' }}>
                    <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                    <button className="btn-create-po" onClick={() => handleCreateItem(formData)} disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add to Inventory'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POAddModal;
