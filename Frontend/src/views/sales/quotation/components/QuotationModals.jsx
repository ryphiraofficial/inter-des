import React from 'react';
import { X, Send, Save, AlertTriangle, Loader, CheckCircle, Package, User, Printer } from 'lucide-react';
import QuotationTemplateWrapper from '../../../admin/settings/components/templates/QuotationTemplateWrapper';

export const BillPreviewModal = ({ 
    show, setShow, formData, clients, lineItems, subtotal, discount, 
    discountAmount, offerPrice, taxRate, taxAmount, total, grandTotal, 
    handleFinalSave, isSaving, includeDiscount, includeTax, settings 
}) => {
    const finalTotal = grandTotal ?? total;
    if (!show) return null;
    const clientData = clients.find(c => c._id === formData.client);

    const quotation = {
        documentType: formData.documentType || 'Quotation',
        quotationNumber: formData.quoteNumber,
        createdAt: formData.date || new Date(),
        client: clientData || {},
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        projectStart: formData.projectStart,
        projectEnd: formData.projectEnd,
        items: lineItems.map((item, idx) => ({
            itemName: item.name,
            description: item.description,
            measurements: item.measurements,
            quantity: item.quantity,
            unit: item.unit,
            rate: item.rate,
            amount: item.amount,
            section: item.section || 'General',
            image: item.image
        })),
        notes: formData.notes,
        termsAndConditions: formData.termsConditions,
        discount: includeDiscount ? discount : 0,
        taxRate: includeTax ? taxRate : 0,
        depositPercent: formData.depositPercent,
        depositAmount: formData.depositAmount || 0,
        subtotal: subtotal,
        discountAmount: discountAmount || 0,
        offerPrice: offerPrice || 0,
        taxAmount: taxAmount || 0,
        total: finalTotal || 0
    };

    return (
        <div className="preview-overlay">
            <div className="preview-modal" style={{ maxWidth: '1000px', width: '95vw', height: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div className="preview-header">
                    <h3>Document Preview</h3>
                    <button onClick={() => setShow(false)}><X size={20} /></button>
                </div>
                <div className="preview-content" style={{ flex: 1, padding: '2rem', background: '#f4f4f4', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ transformOrigin: 'top center', maxWidth: '100%' }}>
                        <QuotationTemplateWrapper quotation={quotation} settings={settings} />
                    </div>
                </div>
                <div className="preview-footer">
                    <button className="btn-back" type="button" onClick={() => setShow(false)}>Edit Form</button>
                    <button className="btn-print" type="button" onClick={() => { window.print(); handleFinalSave(); }}>
                        <Printer size={18} /> Print & Submit
                    </button>
                    <button className="btn-confirm" type="button" onClick={handleFinalSave} disabled={isSaving}>
                        {isSaving ? <Loader size={18} className="spinner" /> : <><Send size={18} /> Confirm & Submit</>}
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
