import React from 'react';
import '../../../css/Template3.css';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const Template3 = ({ quotation, calc, settings }) => {
    const q = quotation || {};
    const c = calc || { subtotal: 0, taxAmount: 0, discountAmount: 0, grandTotal: 0 };
    const s = settings || {};

    const company = s.company || {};
    const docs = s.documents || {};

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
        return `${BASE_IMAGE_URL}${path}`;
    };

    // Format Date safely
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="template3-container">
            {/* Top thin red bar */}
            <div className="top-accent-strip"></div>

            <div className="invoice-content">
                {/* Logo center block */}
                <div className="logo-container">
                    <div className="logo-text">
                        {company.companyLogo ? (
                            <img 
                                src={getImageUrl(company.companyLogo)} 
                                alt={company.companyName || 'Logo'} 
                                style={{ maxHeight: '60px', maxWidth: '240px', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
                            />
                        ) : (
                            company.companyName || 'Yourlogo'
                        )}
                    </div>
                </div>

                {/* Billing and metadata layout */}
                <div className="billing-grid">
                    <div className="bill-to-section">
                        <div className="bill-to-title">Bill To</div>
                        <div className="client-name">{q.client?.name || 'N/A'}</div>
                        
                        {q.client?.phone && (
                            <div className="contact-item">
                                <span className="contact-icon">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </span>
                                <span>{q.client.phone}</span>
                            </div>
                        )}

                        {q.client?.email && (
                            <div className="contact-item">
                                <span className="contact-icon">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </span>
                                <span>{q.client.email}</span>
                            </div>
                        )}

                        {(q.client?.address || q.client?.siteAddress || q.client?.billingAddress) && (
                            <div className="contact-item">
                                <span className="contact-icon">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </span>
                                <span>{q.client.address || q.client.siteAddress || q.client.billingAddress}</span>
                            </div>
                        )}

                        {q.client?.website && (
                            <div className="contact-item">
                                <span className="contact-icon">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="2" y1="12" x2="22" y2="12"/>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                    </svg>
                                </span>
                                <span>{q.client.website}</span>
                            </div>
                        )}
                    </div>

                    <div className="meta-section">
                        <table class="meta-table">
                            <tbody>
                                <tr>
                                    <td className="label">Quotation No</td>
                                    <td className="value">{q.quotationNumber || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Date</td>
                                    <td className="value">{formatDate(q.createdAt) || 'N/A'}</td>
                                </tr>
                                {q.validUntil && (
                                    <tr>
                                        <td className="label">Valid Until</td>
                                        <td className="value">{formatDate(q.validUntil) || 'N/A'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="invoice-title">{q.documentType || 'Quotation'}</div>
                    </div>
                </div>

                {/* Line Items Table */}
                <table className="items-table">
                    <thead className="table-header">
                        <tr>
                            <th>No</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody id="invoiceItems">
                        {(() => {
                            const items = q.items || [];
                            const grouped = items.reduce((acc, item) => {
                                const key = item.section || 'General';
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(item);
                                return acc;
                            }, {});
                            let globalIdx = 0;
                            return Object.entries(grouped).flatMap(([sectionName, sectionItems]) => [
                                <tr key={`cat-${sectionName}`} style={{ background: '#2C3E50' }}>
                                    <td colSpan="5" style={{ padding: '7px 14px', color: '#ffffff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', lineHeight: '1.5' }}>
                                        {sectionName}
                                    </td>
                                </tr>,
                                ...sectionItems.map((item, itemIdx) => {
                                    const idx = itemIdx + 1;
                                    return (
                                        <tr className="t3-item-row" key={item._id || idx}>
                                            <td>{String(idx).padStart(2, '0')}</td>
                                            <td>
                                                <div className="item-name">{item.itemName || 'N/A'}</div>
                                                <div className="item-desc">{item.description || ''}</div>
                                                {item.image && (
                                                    <div className="item-image" style={{ marginTop: '8px' }}>
                                                        <img
                                                            src={getImageUrl(item.image)}
                                                            alt="Preview"
                                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E0E0E0' }}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td>{item.quantity || 0}</td>
                                            <td>{docs.currencySymbol || '₹'} {item.rate?.toLocaleString() || 0}</td>
                                            <td>{docs.currencySymbol || '₹'} {item.amount?.toLocaleString() || 0}</td>
                                        </tr>
                                    );
                                })
                            ]);
                        })()}
                    </tbody>
                </table>

                {/* Bottom Terms & Summary Section */}
                <div className="bottom-grid">
                    <div className="terms-box">
                        {q.notes && (
                            <div style={{ marginBottom: '25px' }}>
                                <div className="terms-title">Notes</div>
                                <div className="terms-content" style={{ whiteSpace: 'pre-line' }}>{q.notes}</div>
                            </div>
                        )}
                    </div>
                    
                    <div className="summary-box">
                        <div className="summary-line">
                            <span className="label">Sub Total</span>
                            <span className="value">{docs.currencySymbol || '₹'} {c.subtotal?.toLocaleString() || 0}</span>
                        </div>
                        {q.discount > 0 && (
                            <div className="summary-line">
                                <span className="label">Discount ({q.discount}%)</span>
                                <span className="value">-{docs.currencySymbol || '₹'} {c.discountAmount?.toLocaleString() || 0}</span>
                            </div>
                        )}
                        {c.taxAmount > 0 && (
                            <div className="summary-line">
                                <span className="label">Tax ({q.taxRate || 0}%)</span>
                                <span className="value">+{docs.currencySymbol || '₹'} {c.taxAmount?.toLocaleString() || 0}</span>
                            </div>
                        )}
                        <div className="total-row">
                            <span className="label">Total</span>
                            <span className="value">{docs.currencySymbol || '₹'} {c.grandTotal?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions (Full Width, Centered) */}
                <div className="full-width-terms">
                    <div className="terms-title terms-centered-title">Terms & Conditions</div>
                    <div className="terms-content terms-centered-text">
                        {q.termsAndConditions || docs.defaultTerms || 'N/A'}
                    </div>
                </div>

                {/* Payment methods strip */}
                {(company.bankDetails || company.gstin) && (
                    <div className="payment-methods-strip">
                        {company.bankDetails && <span>Bank details: {company.bankDetails}</span>}
                        {company.gstin && <span>GSTIN: {company.gstin}</span>}
                    </div>
                )}

                {/* Thanks banner segment */}
                <div className="thanks-banner">
                    <div className="thanks-text">Thanks for your Business!</div>
                </div>
            </div>

            {/* Red Full-Width Footer Block */}
            <div className="footer-bar">
                <div className="footer-left" style={{ whiteSpace: 'pre-line' }}>
                    {company.address || 'N/A'}
                </div>
                
                {company.phone && (
                    <div className="footer-center">
                        <span className="footer-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                                <line x1="12" y1="18" x2="12.01" y2="18"/>
                            </svg>
                        </span>
                        <span>{company.phone}</span>
                    </div>
                )}

                {company.email && (
                    <div className="footer-right">
                        <span className="footer-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </span>
                        <span>{company.email}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Template3;
