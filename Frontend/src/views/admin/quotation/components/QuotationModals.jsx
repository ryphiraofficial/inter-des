import React from 'react';
import { X, Send, Save, AlertTriangle, Loader, CheckCircle, User, Printer, SaveAll } from 'lucide-react';

export const BillPreviewModal = ({ 
    show, setShow, formData, clients, lineItems, subtotal, discount, 
    discountAmount, offerPrice, taxRate, taxAmount, total, grandTotal, 
    handleFinalSave, isSaving, includeDiscount, includeTax 
}) => {
    const finalTotal = grandTotal ?? total;
    if (!show) return null;
    const clientData = clients.find(c => c._id === formData.client);

    return (
        <div className="preview-overlay">
            <div className="preview-modal">
                <div className="preview-header">
                    <h3>Document Preview</h3>
                    <button onClick={() => setShow(false)}><X size={20} /></button>
                </div>
                <div className="preview-content">
                    <div className="doc-preview-paper">
                        <div className="preview-paper-header">
                            <div className="company-logo-section">
                                <h1 style={{ color: '#1e293b', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>RYPHIRA</h1>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>INTERIOR & DESIGN SOLUTIONS</p>
                            </div>
                            <div className="doc-meta-section">
                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#6366f1' }}>{formData.documentType.toUpperCase()}</h2>
                                <p>No: {formData.quoteNumber}</p>
                                <p>Date: {new Date(formData.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="preview-parties">
                            <div className="party-box">
                                <label>PREPARED FOR</label>
                                <strong>{clientData?.name || 'Unknown Client'}</strong>
                                <p>{clientData?.email}</p>
                                <p>{clientData?.phone}</p>
                            </div>
                            <div className="party-box">
                                <label>PROJECT NAME</label>
                                <strong>{formData.projectName}</strong>
                                <p>Duration: {new Date(formData.projectStart).toLocaleDateString()} - {new Date(formData.projectEnd).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <table className="preview-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ITEM & DESCRIPTION</th>
                                    <th>QTY</th>
                                    <th>RATE</th>
                                    <th>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((item, idx) => (
                                    <tr key={item.id || idx}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.description}</div>
                                        </td>
                                        <td>{item.quantity} {item.unit}</td>
                                        <td>₹{item.rate?.toLocaleString()}</td>
                                        <td>₹{item.amount?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="preview-summary-area">
                            <div className="preview-summary-col">
                                <div className="summary-row"><span>Subtotal</span><span>₹{(subtotal || 0).toLocaleString()}</span></div>
                                {includeDiscount && <div className="summary-row"><span>Discount ({discount}%)</span><span>- ₹{(discountAmount || 0).toLocaleString()}</span></div>}
                                <div className="summary-row highlight"><span>Offer Price</span><span>₹{(offerPrice || 0).toLocaleString()}</span></div>
                                {includeTax && <div className="summary-row"><span>GST ({taxRate}%)</span><span>₹{(taxAmount || 0).toLocaleString()}</span></div>}
                                <div className="summary-row grand-total"><span>Grand Total</span><span>₹{(finalTotal || 0).toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="preview-footer">
                    <button className="btn-back" type="button" onClick={() => setShow(false)}>Edit Form</button>
                    <button className="btn-print" type="button" onClick={() => { window.print(); handleFinalSave(); }}>
                        <Printer size={18} /> Print & Save
                    </button>
                    <button className="btn-confirm" type="button" onClick={handleFinalSave} disabled={isSaving}>
                        {isSaving ? <Loader size={18} className="spinner" /> : <><SaveAll size={18} /> Confirm & Save</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const QuickAddClientModal = ({ show, setShow, quickAddData, setQuickAddData, confirmQuickAddClient, isSubmitting }) => {
    if (!show) return null;
    return (
        <div className="preview-overlay" style={{ zIndex: 1100 }}>
            <div className="quick-add-modal" onClick={e => e.stopPropagation()}>
                <div className="preview-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} color="#6366f1" />
                        <h3>Quick Add Client</h3>
                    </div>
                    <button onClick={() => setShow(false)}><X size={20} /></button>
                </div>
                <form onSubmit={confirmQuickAddClient}>
                    <div className="form-group" style={{ padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label>Client Name</label>
                            <input type="text" className="input-styled" value={quickAddData.name} onChange={e => setQuickAddData({...quickAddData, name: e.target.value})} required />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label>Email Address</label>
                            <input type="email" className="input-styled" value={quickAddData.email} onChange={e => setQuickAddData({...quickAddData, email: e.target.value})} required />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label>Phone Number</label>
                            <input type="text" className="input-styled" value={quickAddData.phone} onChange={e => setQuickAddData({...quickAddData, phone: e.target.value})} />
                        </div>
                    </div>
                    <div className="preview-footer">
                        <button type="button" className="btn-back" onClick={() => setShow(false)}>Cancel</button>
                        <button type="submit" className="btn-confirm" disabled={isSubmitting}>
                            {isSubmitting ? <Loader size={18} className="spinner" /> : 'Create Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ExitConfirmationDialog = ({ show, setShow, handleSaveDraft, onDiscard, isSaving }) => {
    if (!show) return null;
    return (
        <div className="preview-overlay" style={{ zIndex: 1200 }}>
            <div className="exit-dialog">
                <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                <h3>Unsaved Changes</h3>
                <p>You have unsaved changes in this quotation. Would you like to save a draft before exiting?</p>
                <div className="dialog-actions">
                    <button className="btn-save-draft-dialog" onClick={handleSaveDraft} disabled={isSaving}>
                        {isSaving ? <Loader size={16} className="spinner" /> : <><Save size={16} /> Save as Draft</>}
                    </button>
                    <button className="btn-discard" onClick={onDiscard}>Discard Changes</button>
                    <button className="btn-stay" onClick={() => setShow(false)}>Keep Editing</button>
                </div>
            </div>
        </div>
    );
};
