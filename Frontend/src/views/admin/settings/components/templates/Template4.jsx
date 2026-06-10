import React from 'react';
import '../../../css/Template4.css';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const Template4 = ({ quotation, calc, settings }) => {
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
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="template4-container">
            {/* Top Geometric Slanted Banner Area */}
            <div className="header-graphics-container">
                <div className="green-accent-slant"></div>
                <div className="navy-brand-slant">
                    <div className="brand-content">
                        {company.companyLogo ? (
                            <img 
                                src={getImageUrl(company.companyLogo)} 
                                alt={company.companyName || 'Logo'} 
                                style={{ maxHeight: '55px', maxWidth: '180px', objectFit: 'contain' }} 
                            />
                        ) : (
                            <div className="brand-logo">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                                    <path d="M7 12H17" stroke-linecap="round"/>
                                    <path d="M12 7V17" stroke-linecap="round"/>
                                </svg>
                            </div>
                        )}
                        <div className="brand-titles">
                            <div className="brand-name">{company.companyName || 'Company'}</div>
                            {company.tagline && <div className="brand-tagline">{company.tagline}</div>}
                        </div>
                    </div>
                </div>

                {/* Top Right Header Meta Block */}
                <div className="top-right-meta">
                    <div className="invoice-title">{q.documentType || 'Quotation'}</div>
                    <table className="header-meta-table">
                        <tbody>
                            <tr>
                                <td className="label">Quotation Number:</td>
                                <td className="value">{q.quotationNumber || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="label">Date:</td>
                                <td className="value">{formatDate(q.createdAt)}</td>
                            </tr>
                            {q.validUntil && (
                                <tr>
                                    <td className="label">Valid Until:</td>
                                    <td className="value">{formatDate(q.validUntil)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="invoice-content">
                {/* Addresses Billing Row */}
                <div className="billing-grid">
                    <div className="address-col">
                        <div className="address-header">Quotation To:</div>
                        <div className="address-name">{q.client?.name || 'N/A'}</div>
                        <div className="address-details">
                            {q.client?.address && <>{q.client.address}<br/></>}
                            {q.client?.phone && <>Phone: {q.client.phone}<br/></>}
                            {q.client?.email && <>Email: {q.client.email}</>}
                            {!q.client?.address && !q.client?.phone && !q.client?.email && <>N/A</>}
                        </div>
                    </div>

                    <div className="address-col">
                        <div className="address-header">Quotation From:</div>
                        <div className="address-name">{company.authorizedSignatory || company.companyName || 'N/A'}</div>
                        <div className="address-details">
                            {company.address && <>{company.address}<br/></>}
                            {company.phone && <>Phone: {company.phone}<br/></>}
                            {company.email && <>Email: {company.email}</>}
                            {!company.address && !company.phone && !company.email && <>N/A</>}
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <table className="items-table">
                    <thead className="table-header">
                        <tr>
                            <th className="green-th">No.</th>
                            <th className="green-th">Product Description</th>
                            <th className="navy-th">Rate</th>
                            <th className="navy-th">Qty.</th>
                            <th className="navy-th">Total</th>
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
                                <tr key={`cat-${sectionName}`} style={{ background: '#1B4332' }}>
                                    <td colSpan="5" style={{ padding: '7px 14px', color: '#ffffff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', lineHeight: '1.5' }}>
                                        {sectionName}
                                    </td>
                                </tr>,
                                ...sectionItems.map((item) => {
                                    globalIdx += 1;
                                    const idx = globalIdx;
                                    return (
                                        <tr className="t4-item-row" key={item._id || idx}>
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
                                            <td>{docs.currencySymbol || '₹'} {item.rate?.toLocaleString() || 0}</td>
                                            <td>{item.quantity || 0}</td>
                                            <td>{docs.currencySymbol || '₹'} {item.amount?.toLocaleString() || 0}</td>
                                        </tr>
                                    );
                                })
                            ]);
                        })()}
                    </tbody>
                </table>

                {/* Bottom Layout Section */}
                <div className="bottom-grid">
                    {/* Stack left-hand info details */}
                    <div className="bottom-left-stack">
                        {(company.bankDetails || company.gstin) && (
                            <div>
                                <div className="section-title">Payment Method:</div>
                                <div className="payment-details">
                                    {company.bankDetails && (
                                        <div className="payment-line">
                                            <span className="label">Bank details:</span>
                                            <span className="value">{company.bankDetails}</span>
                                        </div>
                                    )}
                                    {company.gstin && (
                                        <div className="payment-line">
                                            <span className="label">GSTIN:</span>
                                            <span className="value">{company.gstin}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {q.notes && (
                            <div>
                                <div className="section-title">Notes:</div>
                                <div className="terms-text" style={{ whiteSpace: 'pre-line' }}>{q.notes}</div>
                            </div>
                        )}
                    </div>

                    {/* Authorized Signature */}
                    <div className="signature-block">
                        <div className="signature-visual">
                            {company.authorizedSignatory || company.companyName || 'N/A'}
                        </div>
                        <div className="signature-line"></div>
                        <div className="signature-label">Authorised sign</div>
                    </div>

                    {/* Subtotals / Tax calculations cards */}
                    <div className="summary-block">
                        <div className="summary-line">
                            <span className="label">Subtotal:</span>
                            <span className="value">{docs.currencySymbol || '₹'} {c.subtotal?.toLocaleString() || 0}</span>
                        </div>
                        {q.discount > 0 && (
                            <div className="summary-line">
                                <span className="label">Discount ({q.discount}%):</span>
                                <span className="value">-{docs.currencySymbol || '₹'} {c.discountAmount?.toLocaleString() || 0}</span>
                            </div>
                        )}
                        {c.taxAmount > 0 && (
                            <div className="summary-line">
                                <span className="label">Tax ({q.taxRate || 0}%):</span>
                                <span className="value">+{docs.currencySymbol || '₹'} {c.taxAmount?.toLocaleString() || 0}</span>
                            </div>
                        )}
                        
                        {/* Highlighted block */}
                        <div className="total-badge-card">
                            <span className="label">Total:</span>
                            <span className="value">{docs.currencySymbol || '₹'} {c.grandTotal?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions (Full Width, Centered) */}
                <div className="full-width-terms">
                    <div className="section-title terms-centered-title">Terms & Conditions:</div>
                    <div className="terms-text terms-centered-text">
                        {q.termsAndConditions || docs.defaultTerms || 'N/A'}
                    </div>
                </div>
            </div>

            {/* Solid Navy Footer Strip */}
            <div className="bottom-footer-strip">
                <div className="footer-left-contacts">
                    {company.phone && (
                        <div className="contact-bubble-item">
                            <span className="icon-wrapper">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                            </span>
                            <span>{company.phone}</span>
                        </div>
                    )}
                    
                    {company.email && (
                        <div className="contact-bubble-item">
                            <span className="icon-wrapper">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                            </span>
                            <span>{company.email}</span>
                        </div>
                    )}

                    {company.address && (
                        <div className="contact-bubble-item">
                            <span className="icon-wrapper">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </span>
                            <span>{company.address.split(',')[0]}</span>
                        </div>
                    )}
                </div>
                
                <div className="thanks-message">Thank You For Your Business</div>
            </div>
        </div>
    );
};

export default Template4;
