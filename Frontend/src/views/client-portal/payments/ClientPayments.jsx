import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CreditCard, X, ChevronRight, CheckCircle2, Download } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import { selectToken } from '../../../store/slices/authSlice';
import { useToast } from '../../../models/context/ToastContext';
import './ClientPayments.css';

const ClientPayments = () => {
    const token = useAppSelector(selectToken);
    const { showToast } = useToast();
    
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const receiptRef = useRef(null);

    const selectedProjectId = useAppSelector(state => state.clientPortal.selectedProjectId);

    useEffect(() => {
        const fetchPayments = async () => {
            if (!selectedProjectId) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/client/payments?projectId=${selectedProjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setPayments(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching payments:", error);
                showToast('Failed to load payments', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [token, showToast, selectedProjectId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return '';
        const options = { 
            year: 'numeric', month: 'short', day: 'numeric' 
        };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const handleCardClick = (payment) => {
        setSelectedPayment(payment);
    };

    const closeModal = () => {
        setSelectedPayment(null);
    };

    const getPreviousAmountPaid = () => {
        if (!selectedPayment || payments.length === 0) return 0;
        // payments are sorted by paymentDate descending
        const index = payments.findIndex(p => p._id === selectedPayment._id);
        if (index === -1) return 0;
        const olderPayments = payments.slice(index + 1);
        return olderPayments.reduce((sum, p) => sum + p.amount, 0);
    };

    const handleDownloadReceipt = async () => {
        if (!receiptRef.current || !selectedPayment) return;
        
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Receipt-${selectedPayment.paymentNumber}.pdf`);
            
            showToast('Receipt downloaded successfully', 'success');
        } catch (error) {
            console.error("Error generating PDF:", error);
            showToast('Failed to download receipt', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="client-payments-page">
                <div className="client-page-header">
                    <h1 className="client-page-title">Payments</h1>
                    <p className="client-page-subtitle">Loading your transaction history...</p>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="client-skeleton-box client-payment-card" style={{ height: '140px' }}></div>
                ))}
            </div>
        );
    }

    return (
        <div className="client-payments-page">
            <div className="client-page-header">
                <h1 className="client-page-title">Payments</h1>
                <p className="client-page-subtitle">Your complete transaction history and digital receipts</p>
            </div>

            {payments.length === 0 ? (
                <div className="client-empty-state">
                    <div className="client-empty-icon">
                        <CreditCard size={32} />
                    </div>
                    <h3 className="client-empty-title">No Payments Yet</h3>
                    <p className="client-empty-desc">Any payments you make towards your invoices will appear here.</p>
                </div>
            ) : (
                <div className="client-payments-list">
                    {payments.map(payment => (
                        <div 
                            key={payment._id} 
                            className="client-payment-card"
                            onClick={() => handleCardClick(payment)}
                        >
                            <div className="client-payment-card-header">
                                <div>
                                    <div className="client-payment-number">{payment.paymentNumber}</div>
                                    <div className="client-payment-date">{formatDate(payment.paymentDate)}</div>
                                </div>
                                <div className="client-payment-amount">
                                    {formatCurrency(payment.amount)}
                                </div>
                            </div>

                            <div>
                                <span className="client-payment-method-badge">
                                    <CreditCard size={12} />
                                    {payment.paymentMethod}
                                </span>
                            </div>

                            <div className="client-payment-footer">
                                <div className="client-payment-invoice-link">
                                    Towards: <strong>{payment.invoice?.invoiceNumber || 'Project Balance'}</strong>
                                </div>
                                <button className="client-payment-view-btn">
                                    Receipt <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Details / Receipt Modal */}
            {selectedPayment && (
                <div className="client-payment-modal-overlay" onClick={closeModal}>
                    <div className="client-payment-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="client-payment-modal-header">
                            <h3 className="client-payment-modal-title">Receipt Details</h3>
                            <button className="client-payment-modal-close" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="client-payment-modal-body" style={{ padding: 0 }}>
                            <div ref={receiptRef} className="client-bill-template">
                                <div className="client-bill-header">
                                    <div>
                                        <h2 className="client-bill-company-name">WOODAURA</h2>
                                        <p className="client-bill-company-sub">Interior Design Studio</p>
                                    </div>
                                    <div>
                                        <h3 className="client-bill-title">PAYMENT RECEIPT</h3>
                                        <p className="client-bill-id">#{selectedPayment.paymentNumber}</p>
                                    </div>
                                </div>

                                <div className="client-bill-section-row">
                                    <div>
                                        <h4 className="client-bill-section-title">Project Details</h4>
                                        <p className="client-bill-text-main">{selectedPayment.project?.name || 'Project Payment'}</p>
                                        {selectedPayment.invoice && (
                                            <p className="client-bill-text-sub">Invoice: {selectedPayment.invoice.invoiceNumber}</p>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h4 className="client-bill-section-title">Payment Date</h4>
                                        <p className="client-bill-text-main">{formatDate(selectedPayment.paymentDate, true)}</p>
                                        <p className="client-bill-text-sub">Method: {selectedPayment.paymentMethod}</p>
                                    </div>
                                </div>

                                <div className="client-bill-calculation">
                                    <div className="client-bill-calc-row">
                                        <span className="client-bill-calc-label">Previous Amount Paid</span>
                                        <span className="client-bill-calc-value">{formatCurrency(getPreviousAmountPaid())}</span>
                                    </div>
                                    <div className="client-bill-calc-row current">
                                        <span className="client-bill-calc-label dark">Current Payment</span>
                                        <span className="client-bill-calc-value highlight">{formatCurrency(selectedPayment.amount)}</span>
                                    </div>
                                    <div className="client-bill-divider"></div>
                                    <div className="client-bill-calc-row total">
                                        <span className="client-bill-calc-label dark" style={{ fontWeight: 700 }}>Total Paid to Date</span>
                                        <span className="client-bill-calc-value bold">{formatCurrency(getPreviousAmountPaid() + selectedPayment.amount)}</span>
                                    </div>
                                </div>

                                {(selectedPayment.transactionId || selectedPayment.reference) && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 className="client-bill-section-title">Transaction Details</h4>
                                        <div className="client-bill-transaction-grid">
                                            {selectedPayment.transactionId && (
                                                <div>
                                                    <span className="client-bill-calc-label" style={{ display: 'block', marginBottom: '4px' }}>Transaction ID</span>
                                                    <span className="client-bill-calc-value">{selectedPayment.transactionId}</span>
                                                </div>
                                            )}
                                            {selectedPayment.reference && (
                                                <div>
                                                    <span className="client-bill-calc-label" style={{ display: 'block', marginBottom: '4px' }}>Reference</span>
                                                    <span className="client-bill-calc-value">{selectedPayment.reference}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="client-bill-footer-note">
                                    <div className="client-bill-footer-icon">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <p style={{ margin: 0 }}>Thank you for your payment.</p>
                                    <p style={{ margin: '4px 0 0' }}>This is a computer-generated receipt and does not require a physical signature.</p>
                                </div>
                            </div>
                        </div>

                        <div className="client-payment-modal-footer">
                            <button className="client-payment-download-btn" onClick={handleDownloadReceipt} disabled={isDownloading} style={{ opacity: isDownloading ? 0.7 : 1, cursor: isDownloading ? 'wait' : 'pointer' }}>
                                <Download size={18} /> {isDownloading ? 'Generating...' : 'Download Receipt'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientPayments;
