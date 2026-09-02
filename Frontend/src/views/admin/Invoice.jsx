import React, { useState, useRef, useEffect } from 'react';
import { useInvoiceState } from './invoice/hooks/useInvoiceState';
import { useInvoiceData } from './invoice/hooks/useInvoiceData';
import { useInvoiceActions } from './invoice/hooks/useInvoiceActions';

import InvoiceStats from './invoice/components/InvoiceStats';
import InvoiceFilterBar from './invoice/components/InvoiceFilterBar';
import InvoiceTable from './invoice/components/InvoiceTable';
import InvoiceFormModal from './invoice/components/InvoiceFormModal';
import InvoiceViewModal from '../Accounts/common/components/invoices/InvoiceViewModal';
import InvoiceDocument from '../Accounts/common/components/invoices/InvoiceDocument';
import { TableSkeleton, StatsSkeleton } from './components/Skeleton';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import './css/Invoice.css';

const Invoice = () => {
    const state = useInvoiceState();
    
    const { fetchInvoices } = useInvoiceData({
        setInvoices: state.setInvoices,
        setClients: state.setClients,
        setLoading: state.setLoading,
        setError: state.setError,
        setSearchTerm: state.setSearchTerm,
        setShowCreateModal: state.setShowCreateModal
    });

    const actions = useInvoiceActions({
        fetchInvoices,
        setSubmitting: state.setSubmitting,
        setShowCreateModal: state.setShowCreateModal,
        setFormData: state.setFormData,
        setInvoices: state.setInvoices,
        invoices: state.invoices
    });

    const [downloadingInvoice, setDownloadingInvoice] = useState(null);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const invoiceRef = useRef(null);

    const handleDownload = (invoice) => {
        setDownloadingInvoice(invoice);
    };

    const handleView = (invoice) => {
        setViewingInvoice(invoice);
    };

    const directPrintInvoice = (invoice) => {
        if (!invoice) return;
        const printWindow = window.open('', '_blank', 'width=850,height=900');
        if (!printWindow) return;

        const itemsRows = (invoice.items || []).map(item => `
            <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${item.description || item.itemName || 'Item'}</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 13px;">${item.quantity || 1}</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 13px;">₹${Number(item.rate || item.unitPrice || 0).toLocaleString('en-IN')}</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; font-size: 13px;">₹${Number(item.amount || ((item.quantity || 1) * (item.rate || item.unitPrice || 0))).toLocaleString('en-IN')}</td>
            </tr>
        `).join('');

        const subtotal = invoice.subtotal || invoice.items?.reduce((s, i) => s + ((i.quantity || 1) * (i.rate || i.unitPrice || 0)), 0) || invoice.grandTotal || 0;
        const tax = invoice.totalTax || invoice.taxAmount || 0;
        const grandTotal = invoice.grandTotal || invoice.totalAmount || (subtotal + tax);

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${invoice.invoiceNumber}</title>
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; margin: 30px; color: #0f172a; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
                    .header h1 { margin: 0; font-size: 26px; color: #0f172a; letter-spacing: -0.5px; }
                    .header h2 { margin: 0; font-size: 22px; color: #2563eb; }
                    .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .details-box { font-size: 13px; line-height: 1.6; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th { background: #f8fafc; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
                    .summary { display: flex; justify-content: flex-end; }
                    .summary-table { width: 260px; font-size: 13px; background: #f8fafc; padding: 12px; border-radius: 8px; }
                    .summary-table div { display: flex; justify-content: space-between; padding: 4px 0; color: #475569; }
                    .total-row { border-top: 1.5px solid #cbd5e1; font-weight: bold; font-size: 15px; color: #0f172a !important; margin-top: 6px; padding-top: 8px !important; }
                    @media print {
                        @page { margin: 15mm; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>WOODAURA</h1>
                        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px; font-weight: 500;">Interior Design Studio</p>
                    </div>
                    <div style="text-align: right;">
                        <h2>INVOICE</h2>
                        <p style="margin: 4px 0 0 0; font-weight: bold;">#${invoice.invoiceNumber}</p>
                    </div>
                </div>

                <div class="details">
                    <div class="details-box">
                        <span style="color: #94a3b8; text-transform: uppercase; font-size: 11px; font-weight: bold;">Bill To</span><br/>
                        <strong style="font-size: 15px; color: #0f172a;">${invoice.client?.name || 'Client Name'}</strong><br/>
                        ${invoice.client?.email ? `<span style="color: #475569;">${invoice.client.email}</span><br/>` : ''}
                        ${invoice.client?.phone ? `<span style="color: #475569;">${invoice.client.phone}</span>` : ''}
                    </div>
                    <div class="details-box" style="text-align: right;">
                        <span style="color: #94a3b8; text-transform: uppercase; font-size: 11px; font-weight: bold;">Date:</span> <strong>${new Date(invoice.invoiceDate || invoice.createdAt || Date.now()).toLocaleDateString()}</strong><br/>
                        <span style="color: #94a3b8; text-transform: uppercase; font-size: 11px; font-weight: bold;">Due Date:</span> <strong>${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</strong>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Rate</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsRows.length > 0 ? itemsRows : '<tr><td colspan="4" style="padding: 15px; text-align: center; color: #94a3b8;">Invoice details</td></tr>'}
                    </tbody>
                </table>

                <div class="summary">
                    <div class="summary-table">
                        <div><span>Subtotal:</span> <span>₹${Number(subtotal).toLocaleString('en-IN')}</span></div>
                        ${tax > 0 ? `<div><span>Tax:</span> <span>₹${Number(tax).toLocaleString('en-IN')}</span></div>` : ''}
                        <div class="total-row"><span>Total Amount:</span> <span>₹${Number(grandTotal).toLocaleString('en-IN')}</span></div>
                    </div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 350);
    };

    const handlePrint = (invoice) => {
        directPrintInvoice(invoice);
    };

    useEffect(() => {
        if (downloadingInvoice && invoiceRef.current) {
            const generatePdf = async () => {
                try {
                    const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Invoice_${downloadingInvoice.invoiceNumber}.pdf`);
                } catch (error) {
                    console.error("Error generating PDF", error);
                    alert("Failed to generate PDF");
                } finally {
                    setDownloadingInvoice(null);
                }
            };
            // Small delay to ensure render
            setTimeout(generatePdf, 100);
        }
    }, [downloadingInvoice]);

    const toggleRow = (id) => {
        state.setExpandedRow(state.expandedRow === id ? null : id);
    };

    const filteredInvoices = state.invoices.filter(inv => {
        const matchesSearch = inv.invoiceNumber?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            inv.client?.name?.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesStatus = state.statusFilter === 'All' || inv.status === state.statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        // "Unapproved"/Unpaid first logic
        const aIsUnpaid = a.status !== 'Paid';
        const bIsUnpaid = b.status !== 'Paid';
        if (aIsUnpaid && !bIsUnpaid) return -1;
        if (!aIsUnpaid && bIsUnpaid) return 1;

        // Then sort by newest first
        return new Date(b.createdAt || b.invoiceDate) - new Date(a.createdAt || a.invoiceDate);
    });

    return (
        <div className="invoice-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
            <div className="invoice-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {state.loading ? (
                    <StatsSkeleton count={4} />
                ) : (
                    <InvoiceStats invoices={state.invoices} />
                )}

                <InvoiceFilterBar 
                    statusFilter={state.statusFilter}
                    setStatusFilter={state.setStatusFilter}
                    showFilterDropdown={state.showFilterDropdown}
                    setShowFilterDropdown={state.setShowFilterDropdown}
                    onCreateInvoice={() => state.setShowCreateModal(true)}
                />

                {state.error && <div className="error-banner">{state.error}</div>}

                <div className="invoice-table-card">
                    <InvoiceTable 
                        invoices={filteredInvoices}
                        loading={state.loading}
                        expandedRow={state.expandedRow}
                        toggleRow={toggleRow}
                        handleUpdatePayment={actions.handleUpdatePayment}
                        handleDelete={actions.handleDelete}
                        onDownload={handleDownload}
                        onView={handleView}
                        onPrint={handlePrint}
                    />
                </div>
            </div>

            <InvoiceFormModal 
                showCreateModal={state.showCreateModal}
                setShowCreateModal={state.setShowCreateModal}
                formData={state.formData}
                setFormData={state.setFormData}
                clients={state.clients}
                submitting={state.submitting}
                handleCreateInvoice={actions.handleCreateInvoice}
            />

            <InvoiceViewModal 
                invoice={viewingInvoice} 
                onClose={() => setViewingInvoice(null)} 
                onDownload={handleDownload}
                onPrint={handlePrint}
            />

            {/* Hidden template for PDF generation */}
            {downloadingInvoice && (
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '800px' }}>
                    <InvoiceDocument ref={invoiceRef} invoice={downloadingInvoice} />
                </div>
            )}
        </div>
    );
};

export default Invoice;
