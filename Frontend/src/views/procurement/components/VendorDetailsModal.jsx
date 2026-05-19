import React from 'react';
import { X } from 'lucide-react';

const VendorDetailsModal = ({ isOpen, onClose, vendor, purchaseHistory, formatCurrency }) => {
    if (!isOpen || !vendor) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ background: 'white', width: '700px', borderRadius: '16px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{vendor.name} Details</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#64748b' }}>Contact</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>{vendor.phone} {vendor.email ? `• ${vendor.email}` : ''}</p>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#64748b' }}>Location</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>{vendor.address || 'N/A'}</p>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#64748b' }}>Category</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>{vendor.category || vendor.categories?.[0] || 'N/A'}</p>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#64748b' }}>GSTIN</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>{vendor.gstin || 'N/A'}</p>
                    </div>
                </div>

                {vendor.products?.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#475569', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Product Catalog</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            {vendor.products.map((p, i) => (
                                <div key={i} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{p.itemName}</div>
                                    <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>₹{p.unitPrice} / {p.unit}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#475569', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Purchase History</h4>
                    {!purchaseHistory || purchaseHistory.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>No purchases recorded for this vendor.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {purchaseHistory.map(purchase => (
                                <div key={purchase._id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{purchase.purchaseNumber || 'Purchase'}</span>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                                        {purchase.items?.map(i => `${i.quantity}x ${i.itemName}`).join(', ')}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>By: {purchase.purchasedBy?.fullName || 'Staff'}</span>
                                        <span style={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(purchase.finalAmount)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorDetailsModal;
