import React from 'react';
import { X, Plus, Save } from 'lucide-react';

const AddVendorModal = ({ 
    isOpen, 
    onClose, 
    vendorForm, 
    setVendorForm, 
    vendorSaving, 
    onSave, 
    addProductRow, 
    removeProductRow, 
    updateProductRow 
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ background: 'white', width: '640px', borderRadius: '16px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Add New Vendor</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
                </div>

                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem 0' }}>Vendor Details</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.5rem' }}>
                    {[
                        ['Vendor Name *', 'name', 'text', 'e.g. Regal Timber Co.'], 
                        ['Phone *', 'phone', 'tel', '+91 98765 43210'], 
                        ['Email', 'email', 'email', 'vendor@example.com'], 
                        ['Category', 'category', 'text', 'e.g. Wood, Fabric'], 
                        ['Address', 'address', 'text', 'City, State'], 
                        ['GSTIN', 'gstin', 'text', '22AAAAA0000A1Z5']
                    ].map(([label, field, type, placeholder]) => (
                        <div key={field}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>{label}</label>
                            <input 
                                type={type} 
                                placeholder={placeholder} 
                                value={vendorForm[field] || ''} 
                                onChange={e => setVendorForm(prev => ({ ...prev, [field]: e.target.value }))} 
                                style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} 
                            />
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Product Catalog</p>
                    <button onClick={addProductRow} style={{ background: '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={13} /> Add Item</button>
                </div>
                {(!vendorForm.products || vendorForm.products.length === 0) ? (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>No products yet — click "+ Add Item" to build the catalog.</p>
                ) : (
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr auto', gap: '0.5rem', marginBottom: '0.4rem', paddingLeft: '2px' }}>
                            {['Item Name', 'Unit Price (₹)', 'Unit', ''].map(h => <span key={h} style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{h}</span>)}
                        </div>
                        {vendorForm.products.map((p, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <input placeholder="e.g. Teak Wood" value={p.itemName} onChange={e => updateProductRow(i, 'itemName', e.target.value)} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }} />
                                <input type="number" placeholder="0.00" value={p.unitPrice} min="0" onChange={e => updateProductRow(i, 'unitPrice', e.target.value)} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                                <select value={p.unit} onChange={e => updateProductRow(i, 'unit', e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }}>
                                    {['pieces', 'kg', 'meters', 'sqft', 'liters', 'boxes', 'rolls', 'sets'].map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                                <button onClick={() => removeProductRow(i)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '11px', background: '#f1f5f9', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={onSave} disabled={vendorSaving} style={{ flex: 1, padding: '11px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Save size={16} /> {vendorSaving ? 'Saving...' : 'Save Vendor'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddVendorModal;
