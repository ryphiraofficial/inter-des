import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const MaterialRequestModal = ({
    show, onClose, selectedTask,
    materialFormData, setMaterialFormData,
    handleAddExtraItem, handleRemoveItem, handleUpdateItem,
    handleSubmitMaterialRequest, submittingMaterial
}) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-styled" style={{ maxWidth: '900px', width: '95%' }}>
                <div className="modal-header">
                    <div>
                        <h3>Material Request: {selectedTask?.title}</h3>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Create a procurement request for materials</p>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: 0, color: '#1e293b' }}>Material Items</h4>
                        <button className="btn-save-boq" style={{ background: '#10b981', border: 'none', padding: '8px 16px' }} onClick={handleAddExtraItem}>
                            <Plus size={16} /> Add Extra Item
                        </button>
                    </div>

                    <div className="material-items-table" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                                    <th style={{ padding: '12px' }}>Item Name</th>
                                    <th style={{ padding: '12px' }}>Specs/Details</th>
                                    <th style={{ padding: '12px', width: '100px' }}>Qty</th>
                                    <th style={{ padding: '12px', width: '100px' }}>Unit</th>
                                    <th style={{ padding: '12px', width: '60px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialFormData.items.map((item, idx) => (
                                    <tr key={idx} style={{ borderTop: '1px solid #f1f5f9', background: item.isExtra ? '#f0fdf4' : 'white' }}>
                                        <td style={{ padding: '8px' }}>
                                            <input type="text" value={item.itemName}
                                                onChange={e => handleUpdateItem(idx, 'itemName', e.target.value)}
                                                placeholder="Item Name" className="modal-input-mini" readOnly={!item.isExtra} />
                                            {item.isExtra && <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 700 }}>EXTRA ITEM</span>}
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                            <input type="text" value={item.specifications}
                                                onChange={e => handleUpdateItem(idx, 'specifications', e.target.value)}
                                                placeholder="Specifications" className="modal-input-mini" />
                                            {item.isExtra && (
                                                <input type="text" value={item.reasonForExtra || ''}
                                                    onChange={e => handleUpdateItem(idx, 'reasonForExtra', e.target.value)}
                                                    placeholder="Reason for extra item..." style={{ marginTop: '4px', fontSize: '0.7rem', color: '#b91c1c' }}
                                                    className="modal-input-mini" required />
                                            )}
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                            <input type="number" value={item.quantity}
                                                onChange={e => handleUpdateItem(idx, 'quantity', e.target.value)}
                                                className="modal-input-mini" />
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                            <input type="text" value={item.unit}
                                                onChange={e => handleUpdateItem(idx, 'unit', e.target.value)}
                                                className="modal-input-mini" />
                                        </td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>
                                            <button onClick={() => handleRemoveItem(idx)} style={{ color: '#ef4444', background: 'none', border: 'none' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div className="form-group">
                            <label>Priority</label>
                            <select value={materialFormData.priority} onChange={e => setMaterialFormData({ ...materialFormData, priority: e.target.value })}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Request Notes</label>
                            <textarea
                                placeholder="General notes for the procurement team..."
                                value={materialFormData.notes}
                                onChange={e => setMaterialFormData({ ...materialFormData, notes: e.target.value })}
                                style={{ minHeight: '80px' }}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="action-btn" onClick={onClose}>Cancel</button>
                    <button className="action-btn primary" onClick={handleSubmitMaterialRequest} disabled={submittingMaterial}>
                        {submittingMaterial ? 'Sending Request...' : 'Send to Procurement Hub'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaterialRequestModal;
