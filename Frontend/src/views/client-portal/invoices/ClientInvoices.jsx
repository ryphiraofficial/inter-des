import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Receipt, X, ChevronRight, FileText } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import { selectToken } from '../../../store/slices/authSlice';
import { useToast } from '../../../models/context/ToastContext';
import './ClientInvoices.css';

const ClientInvoices = () => {
    const token = useAppSelector(selectToken);
    const { showToast } = useToast();
    
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const selectedProjectId = useAppSelector(state => state.clientPortal.selectedProjectId);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!selectedProjectId) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/client/invoices?projectId=${selectedProjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setInvoices(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching invoices:", error);
                showToast('Failed to load invoices', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [token, showToast, selectedProjectId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', { 
            year: 'numeric', month: 'short', day: 'numeric' 
        });
    };

    const getStatusClass = (status) => {
        const s = status.toLowerCase();
        if (s === 'paid') return 'paid';
        if (s === 'unpaid' || s === 'sent' || s === 'draft') return 'unpaid';
        if (s === 'overdue') return 'overdue';
        if (s.includes('partial')) return 'partially';
        return 'default';
    };

    const handleCardClick = (invoice) => {
        setSelectedInvoice(invoice);
    };

    const closeModal = () => {
        setSelectedInvoice(null);
    };

    const getBalanceDue = (invoice) => {
        return Math.max(0, invoice.grandTotal - (invoice.amountPaid || 0));
    };

    if (loading) {
        return (
            <div className="client-invoices-page">
                <div className="client-page-header">
                    <h1 className="client-page-title">Invoices</h1>
                    <p className="client-page-subtitle">Loading your ledger...</p>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="client-skeleton-box client-invoice-card" style={{ height: '140px' }}></div>
                ))}
            </div>
        );
    }

    return (
        <div className="client-invoices-page">
            <div className="client-page-header">
                <h1 className="client-page-title">Invoices</h1>
                <p className="client-page-subtitle">Review your payment history and pending dues</p>
            </div>

            {invoices.length === 0 ? (
                <div className="client-empty-state">
                    <div className="client-empty-icon">
                        <Receipt size={32} />
                    </div>
                    <h3 className="client-empty-title">No Invoices Yet</h3>
                    <p className="client-empty-desc">Your invoices will appear here once they are generated for your project.</p>
                </div>
            ) : (
                <div className="client-invoices-list">
                    {invoices.map(invoice => (
                        <div 
                            key={invoice._id} 
                            className="client-invoice-card"
                            onClick={() => handleCardClick(invoice)}
                        >
                            <div className="client-invoice-card-header">
                                <div>
                                    <div className="client-invoice-number">{invoice.invoiceNumber}</div>
                                    <div className="client-invoice-date">Due: {formatDate(invoice.dueDate)}</div>
                                </div>
                                <span className={`client-invoice-status ${getStatusClass(invoice.status)}`}>
                                    {invoice.status}
                                </span>
                            </div>
                            
                            <div className="client-invoice-project">
                                {invoice.project?.name || 'Project Invoice'}
                            </div>

                            <div className="client-invoice-footer">
                                <div>
                                    <span className="client-invoice-amount-label">Grand Total</span>
                                    <span className="client-invoice-amount">{formatCurrency(invoice.grandTotal)}</span>
                                </div>
                                <button className="client-invoice-view-btn">
                                    Ledger <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invoice Details Modal */}
            {selectedInvoice && (
                <div className="client-invoice-modal-overlay" onClick={closeModal}>
                    <div className="client-invoice-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="client-invoice-modal-header">
                            <div>
                                <h3 className="client-invoice-modal-title">{selectedInvoice.invoiceNumber}</h3>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    Generated: {formatDate(selectedInvoice.invoiceDate)}
                                </div>
                            </div>
                            <button className="client-invoice-modal-close" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="client-invoice-modal-body">
                            {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                                selectedInvoice.items.map((item, index) => (
                                    <div key={index} className="client-invoice-item">
                                        <div className="client-invoice-item-header">
                                            <span className="client-invoice-item-name">{item.description}</span>
                                            <span className="client-invoice-item-amount">{formatCurrency(item.amount)}</span>
                                        </div>
                                        <div className="client-invoice-item-meta">
                                            <span>Qty: {item.quantity}</span>
                                            <span>Rate: {formatCurrency(item.rate)}</span>
                                            <span>Tax: {item.tax}%</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                                    <FileText size={48} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                    <p>No line items found.</p>
                                </div>
                            )}
                        </div>

                        <div className="client-invoice-modal-footer">
                            <div className="client-invoice-summary-row">
                                <span>Subtotal</span>
                                <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                            </div>
                            <div className="client-invoice-summary-row">
                                <span>Total Tax</span>
                                <span>{formatCurrency(selectedInvoice.totalTax)}</span>
                            </div>
                            
                            <div className="client-invoice-summary-total">
                                <span>Grand Total</span>
                                <span>{formatCurrency(selectedInvoice.grandTotal)}</span>
                            </div>

                            {selectedInvoice.amountPaid > 0 && (
                                <div className="client-invoice-summary-paid">
                                    <span>Amount Paid</span>
                                    <span>- {formatCurrency(selectedInvoice.amountPaid)}</span>
                                </div>
                            )}

                            {getBalanceDue(selectedInvoice) > 0 && (
                                <div className="client-invoice-summary-row" style={{ marginTop: '12px', color: '#b91c1c', fontWeight: '700' }}>
                                    <span>Balance Due</span>
                                    <span>{formatCurrency(getBalanceDue(selectedInvoice))}</span>
                                </div>
                            )}

                            {/* Disabled Pay Now button as requested */}
                            {getBalanceDue(selectedInvoice) > 0 && (
                                <button className="client-invoice-pay-btn" disabled>
                                    Pay Now (Coming Soon)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientInvoices;
