import React from 'react';
import { X, CheckCircle, Printer, SaveAll, Loader, AlertTriangle, Save, Trash2, Plus } from 'lucide-react';

export const BillPreviewModal = ({ 
    show, 
    setShow, 
    formData, 
    clients, 
    lineItems, 
    subtotal, 
    includeDiscount, 
    discount, 
    discountAmount, 
    offerPrice, 
    includeTax, 
    taxRate, 
    taxAmount, 
    total,
    handleFinalSave,
    isSaving
}) => {
    if (!show) return null;
    const selectedClient = clients.find(c => c._id === formData.client);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 4000, animation: 'fadeIn 0.3s ease-out'
        }}>
            <div className="premium-receipt-card" style={{
                background: 'rgba(255, 255, 255, 0.95)', padding: '1.5rem', borderRadius: '24px',
                maxWidth: '450px', width: '95%', maxHeight: '88vh', overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(20px)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                    <div style={{
                        width: '56px', height: '56px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 0.75rem', boxShadow: '0 8px 12px -3px rgba(16, 185, 129, 0.3)'
                    }}>
                        <CheckCircle size={28} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Review Details</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Quotation NO: <strong>{formData.quoteNumber}</strong></p>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Client</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{selectedClient?.name || 'Walk-in'}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Type</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{formData.documentType}</span>
                        </div>
                        <div style={{ gridColumn: 'span 2', marginTop: '2px' }}>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Project</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb' }}>{formData.projectName}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid #e2e8f0' }}>Itemized Summary</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                        {lineItems.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.quantity} {item.unit} x ₹{item.rate.toLocaleString()}</div>
                                </div>
                                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>₹{item.amount?.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '16px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#475569' }}>
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {includeDiscount && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#ef4444' }}>
                            <span>Discount ({discount}%)</span>
                            <span>- ₹{discountAmount.toLocaleString()}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        <span>Offer Price</span>
                        <span>₹{offerPrice.toLocaleString()}</span>
                    </div>
                    {includeTax && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#475569' }}>
                            <span>GST ({taxRate}%)</span>
                            <span>+ ₹{taxAmount.toLocaleString()}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Grand Total</span>
                        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#2563eb' }}>₹{total.toLocaleString()}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <button onClick={() => setShow(false)} style={{ padding: '0.7rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                            Back
                        </button>
                        <button onClick={() => { window.print(); handleFinalSave(); }} style={{ padding: '0.7rem', background: '#ffffff', color: '#1e293b', border: '2px solid #1e293b', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}>
                            <Printer size={16} /> Print
                        </button>
                    </div>
                    <button onClick={handleFinalSave} style={{
                        padding: '0.85rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800,
                        cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', fontSize: '0.9rem', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
                    }} disabled={isSaving}>
                        {isSaving ? <Loader size={18} className="spinner" /> : <SaveAll size={18} />} Confirm & Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export const QuickAddClientModal = ({ show, setShow, quickAddData, setQuickAddData, confirmQuickAddClient, isSubmitting }) => {
    if (!show) return null;
    return (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div className="modal-content" style={{ maxWidth: '450px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Quick Add New Client</h3>
                    <button onClick={() => setShow(false)} className="btn-icon-delete"><X size={20} /></button>
                </div>
                <form onSubmit={confirmQuickAddClient}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label>Client Name</label>
                            <input type="text" className="input-styled" value={quickAddData.name} onChange={(e) => setQuickAddData({ ...quickAddData, name: e.target.value })} required placeholder="Enter client's full name" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" className="input-styled" value={quickAddData.email} onChange={(e) => setQuickAddData({ ...quickAddData, email: e.target.value })} required placeholder="e.g., example@gmail.com" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" className="input-styled" value={quickAddData.phone} onChange={(e) => setQuickAddData({ ...quickAddData, phone: e.target.value })} required placeholder="e.g., +91 98765 43210" />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn-save-draft" style={{ flex: 1 }} onClick={() => setShow(false)}>Cancel</button>
                            <button type="submit" className="btn-send-quote" style={{ flex: 2 }} disabled={isSubmitting}>
                                {isSubmitting ? <Loader size={18} className="spinner" /> : <Plus size={18} />} Create Client
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ExitConfirmationDialog = ({ show, setShow, handleSaveDraft, isSaving, onDiscard }) => {
    if (!show) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '420px', maxWidth: '90vw', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideDown 0.2s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <AlertTriangle size={24} color="#f59e0b" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Unsaved Changes</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#64748b' }}>You have unsaved work. What would you like to do?</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button onClick={handleSaveDraft} disabled={isSaving} style={{
                        width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
                    }}>
                        {isSaving ? <Loader size={18} className="spinner" /> : <Save size={18} />} Save as Draft & Exit
                    </button>
                    <button onClick={onDiscard} style={{
                        width: '100%', padding: '0.875rem', background: '#fee2e2', color: '#ef4444',
                        border: '1px solid #fecaca', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}>
                        <Trash2 size={18} /> Discard & Exit
                    </button>
                    <button onClick={() => setShow(false)} style={{
                        width: '100%', padding: '0.75rem', background: 'transparent', color: '#64748b',
                        border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
                    }}>Continue Editing</button>
                </div>
            </div>
        </div>
    );
};
