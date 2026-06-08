import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileSignature, X, ChevronRight, FileText } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import { selectToken } from '../../../store/slices/authSlice';
import { useToast } from '../../../models/context/ToastContext';
import './ClientQuotations.css';

const ClientQuotations = () => {
    const token = useAppSelector(selectToken);
    const { showToast } = useToast();
    
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuotation, setSelectedQuotation] = useState(null);

    const selectedProjectId = useAppSelector(state => state.clientPortal.selectedProjectId);

    useEffect(() => {
        const fetchQuotations = async () => {
            if (!selectedProjectId) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/client/quotations?projectId=${selectedProjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setQuotations(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching quotations:", error);
                showToast('Failed to load quotations', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchQuotations();
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
        if (s.includes('approved')) return 'approved';
        if (s.includes('draft') || s.includes('review')) return 'under-review';
        if (s.includes('reject')) return 'rejected';
        return 'default';
    };

    const handleCardClick = (quotation) => {
        setSelectedQuotation(quotation);
    };

    const closeModal = () => {
        setSelectedQuotation(null);
    };

    if (loading) {
        return (
            <div className="client-quotations-page">
                <div className="client-page-header">
                    <h1 className="client-page-title">Quotations</h1>
                    <p className="client-page-subtitle">Loading your quotations...</p>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="client-skeleton-box client-quotation-card" style={{ height: '140px' }}></div>
                ))}
            </div>
        );
    }

    return (
        <div className="client-quotations-page">
            <div className="client-page-header">
                <h1 className="client-page-title">Quotations</h1>
                <p className="client-page-subtitle">Review your project estimates and material costs</p>
            </div>

            {quotations.length === 0 ? (
                <div className="client-empty-state">
                    <div className="client-empty-icon">
                        <FileSignature size={32} />
                    </div>
                    <h3 className="client-empty-title">No Quotations Yet</h3>
                    <p className="client-empty-desc">Your customized project quotations will appear here once prepared by our team.</p>
                </div>
            ) : (
                <div className="client-quotations-list">
                    {quotations.map(quotation => (
                        <div 
                            key={quotation._id} 
                            className="client-quotation-card"
                            onClick={() => handleCardClick(quotation)}
                        >
                            <div className="client-quotation-card-header">
                                <div>
                                    <div className="client-quotation-number">{quotation.quotationNumber}</div>
                                    <div className="client-quotation-date">{formatDate(quotation.createdAt)}</div>
                                </div>
                                <span className={`client-quotation-status ${getStatusClass(quotation.status)}`}>
                                    {quotation.status}
                                </span>
                            </div>
                            
                            <div className="client-quotation-project">
                                {quotation.projectName}
                            </div>

                            <div className="client-quotation-footer">
                                <div>
                                    <span className="client-quotation-amount-label">Total Amount</span>
                                    <span className="client-quotation-amount">{formatCurrency(quotation.totalAmount)}</span>
                                </div>
                                <button className="client-quotation-view-btn">
                                    Details <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quotation Details Modal */}
            {selectedQuotation && (
                <div className="client-quotation-modal-overlay" onClick={closeModal}>
                    <div className="client-quotation-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="client-quotation-modal-header">
                            <div>
                                <h3 className="client-quotation-modal-title">{selectedQuotation.quotationNumber}</h3>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedQuotation.projectName}</div>
                            </div>
                            <button className="client-quotation-modal-close" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="client-quotation-modal-body">
                            {selectedQuotation.items && selectedQuotation.items.length > 0 ? (
                                selectedQuotation.items.map((item, index) => (
                                    <div key={index} className="client-quotation-item">
                                        <div className="client-quotation-item-header">
                                            <span className="client-quotation-item-name">{item.itemName}</span>
                                            <span className="client-quotation-item-amount">{formatCurrency(item.amount)}</span>
                                        </div>
                                        {item.description && (
                                            <div className="client-quotation-item-desc">{item.description}</div>
                                        )}
                                        <div className="client-quotation-item-meta">
                                            <span>Qty: {item.quantity} {item.unit}</span>
                                            <span>Rate: {formatCurrency(item.rate)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                                    <FileText size={48} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                    <p>No item details available.</p>
                                </div>
                            )}
                        </div>

                        <div className="client-quotation-modal-footer">
                            <div className="client-quotation-summary-row">
                                <span>Subtotal</span>
                                <span>{formatCurrency(selectedQuotation.subtotal)}</span>
                            </div>
                            {selectedQuotation.taxAmount > 0 && (
                                <div className="client-quotation-summary-row">
                                    <span>Tax ({selectedQuotation.taxRate}%)</span>
                                    <span>{formatCurrency(selectedQuotation.taxAmount)}</span>
                                </div>
                            )}
                            <div className="client-quotation-summary-total">
                                <span>Total Amount</span>
                                <span>{formatCurrency(selectedQuotation.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientQuotations;
