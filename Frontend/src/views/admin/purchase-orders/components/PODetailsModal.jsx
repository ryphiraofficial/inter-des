import React from 'react';
import { X, FileText, Calendar, Building, Phone, Mail, MapPin, CheckCircle2, AlertCircle, Printer } from 'lucide-react';

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'ordered': return 'status-ordered';
        case 'received': return 'status-received';
        case 'approved': return 'status-approved';
        case 'pending': return 'status-pending';
        default: return '';
    }
};

const PODetailsModal = ({ showModal, setShowModal, po, handleMarkReceived }) => {
    if (!showModal || !po) return null;

    const calculateSubtotal = () => {
        if (!po.items || !Array.isArray(po.items)) return po.totalAmount || 0;
        return po.items.reduce((sum, item) => sum + ((item.quantity || 1) * (item.unitPrice || 0)), 0);
    };

    const subtotal = calculateSubtotal();
    const taxRate = po.taxRate || 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = po.totalAmount || (subtotal + taxAmount);

    return (
        <div className="po-drawer-overlay" onClick={() => setShowModal(false)}>
            <div className="po-drawer-content" data-lenis-prevent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '90%' }}>
                {/* Header */}
                <div className="po-drawer-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={22} style={{ color: '#2563eb' }} />
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{po.poNumber || 'Purchase Order'}</h3>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Created on {po.orderDate ? new Date(po.orderDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`status-badge ${getStatusClass(po.status)}`} style={{ padding: '0.35rem 0.85rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem' }}>
                            {po.status}
                        </span>
                        <button className="modal-close" onClick={() => setShowModal(false)}><X size={22} /></button>
                    </div>
                </div>

                {/* Body */}
                <div className="po-drawer-body" style={{ padding: '1.25rem' }}>
                    {/* Supplier & Delivery Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Supplier Information</h4>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                                <Building size={14} style={{ display: 'inline', marginRight: '6px', color: '#3b82f6' }} />
                                {po.supplier || 'N/A'}
                            </div>
                            {po.supplierContact && (
                                <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.2rem' }}>
                                    <Phone size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                    {po.supplierContact}
                                </div>
                            )}
                            {po.supplierEmail && (
                                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                                    <Mail size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                    {po.supplierEmail}
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Details</h4>
                            <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                                <Calendar size={14} style={{ display: 'inline', marginRight: '6px', color: '#3b82f6' }} />
                                Expected Delivery: <strong>{po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString() : 'TBD'}</strong>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                                Payment Terms: <strong>{po.paymentTerms || 'Net 30 days'}</strong>
                            </div>
                            {po.deliveryAddress && (
                                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.35rem' }}>
                                    <MapPin size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                    {po.deliveryAddress}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>Order Items ({po.items?.length || 0})</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textTransform: 'uppercase', fontSize: '0.75rem', color: '#475569' }}>
                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>#</th>
                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Item Description</th>
                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Qty</th>
                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Unit Price</th>
                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {po.items && po.items.length > 0 ? (
                                    po.items.map((item, idx) => {
                                        const itemQty = item.quantity || 1;
                                        const itemPrice = item.unitPrice || 0;
                                        const itemTotal = itemQty * itemPrice;
                                        return (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '0.6rem 0.75rem', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>
                                                    {item.itemName || item.name || 'Item'}
                                                    {item.description && <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>{item.description}</div>}
                                                </td>
                                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{itemQty}</td>
                                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>₹{itemPrice.toLocaleString()}</td>
                                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>₹{itemTotal.toLocaleString()}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>No items recorded for this purchase order</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Calculations */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <div style={{ width: '260px', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#475569' }}>
                                <span>Subtotal:</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#475569' }}>
                                <span>GST ({taxRate}%):</span>
                                <span>₹{taxAmount.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #cbd5e1', fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                                <span>Total Amount:</span>
                                <span>₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {po.notes && (
                        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.82rem', color: '#b45309' }}>
                            <strong>Notes:</strong> {po.notes}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="po-drawer-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="btn-cancel" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Printer size={16} /> Print PO
                    </button>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {po.status === 'Ordered' && handleMarkReceived && (
                            <button
                                className="btn-primary"
                                style={{ background: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}
                                onClick={() => {
                                    handleMarkReceived(po._id);
                                    setShowModal(false);
                                }}
                            >
                                <CheckCircle2 size={16} /> Mark Received
                            </button>
                        )}
                        <button className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PODetailsModal;
