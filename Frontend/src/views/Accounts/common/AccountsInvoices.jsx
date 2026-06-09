import React, { useState, useRef, useEffect } from 'react';
import { useInvoiceLogic } from '../hooks/useInvoiceLogic';
import InvoiceStats from './components/invoices/InvoiceStats';
import InvoiceFilterBar from './components/invoices/InvoiceFilterBar';
import InvoiceTable from './components/invoices/InvoiceTable';
import InvoiceFormModal from './components/invoices/InvoiceFormModal';
import InvoiceViewModal from './components/invoices/InvoiceViewModal';
import InvoiceDocument from './components/invoices/InvoiceDocument';
import { StatsSkeleton } from '../components/UI/Skeleton';
import '../../admin/css/Invoice.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const AccountsInvoices = () => {
    const state = useInvoiceLogic();
    const [downloadingInvoice, setDownloadingInvoice] = useState(null);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const invoiceRef = useRef(null);

    const handleDownload = (invoice) => {
        setDownloadingInvoice(invoice);
    };

    const handleView = (invoice) => {
        setViewingInvoice(invoice);
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

    return (
        <div className="invoice-container">
            <div className="invoice-wrapper">
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
                />

                {state.error && <div className="error-banner">{state.error}</div>}

                <div className="invoice-table-card">
                    <InvoiceTable 
                        invoices={state.filtered}
                        loading={state.loading}
                        expandedRow={state.expandedRow}
                        toggleRow={state.setExpandedRow}
                        handleUpdatePayment={state.handleUpdatePayment}
                        handleDelete={state.handleDelete}
                        onDownload={handleDownload}
                        onView={handleView}
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
                handleCreateInvoice={state.handleCreateInvoice}
            />

            <InvoiceViewModal 
                invoice={viewingInvoice} 
                onClose={() => setViewingInvoice(null)} 
                onDownload={handleDownload}
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

export default AccountsInvoices;
