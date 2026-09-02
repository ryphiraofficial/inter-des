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

    const handlePrint = (invoice) => {
        setViewingInvoice(invoice);
        setTimeout(() => {
            window.print();
        }, 200);
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
