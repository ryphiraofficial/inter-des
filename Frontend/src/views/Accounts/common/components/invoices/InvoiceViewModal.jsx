import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import InvoiceDocument from './InvoiceDocument';

const InvoiceViewModal = ({ invoice, onClose, onDownload, onPrint }) => {
    if (!invoice) return null;

    const handlePrintInvoice = () => {
        if (onPrint) {
            onPrint(invoice);
        } else {
            window.print();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
                <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Invoice #{invoice.invoiceNumber}</h2>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button 
                            onClick={handlePrintInvoice}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            <Printer size={16} />
                            Print
                        </button>
                        <button 
                            onClick={() => onDownload(invoice)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            <Download size={16} />
                            Download
                        </button>
                        <button className="btn-icon" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <X size={24} />
                        </button>
                    </div>
                </div>
                
                <div className="modal-body" style={{ overflowY: 'auto', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                    <div id="printable-invoice-modal" style={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                        <InvoiceDocument invoice={invoice} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceViewModal;
