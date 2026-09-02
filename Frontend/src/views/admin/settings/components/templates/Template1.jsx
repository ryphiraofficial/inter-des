import React from 'react';
import '../../../css/Template1.css';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const Template1 = ({ quotation, calc, settings }) => {
    const q = quotation || {};
    const c = calc || { subtotal: 0, taxAmount: 0, discountAmount: 0, grandTotal: 0 };
    const s = settings || {};

    const company = s.company || {};

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
        return `${BASE_IMAGE_URL}${path}`;
    };

    return (
        <div className="invoice-container template1-container">
            <div className="invoice-header">
                <div className="brand-section">
                    <div className="logo-container">
                        {company.companyLogo ? (
                            <img src={getImageUrl(company.companyLogo)} alt="Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        ) : (
                            <svg width="48" height="48" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 4C12.5 4 4 12.5 4 23C4 33.5 12.5 42 23 42C31.5 42 38.5 36.5 40.8 29" stroke="#4D4495" stroke-width="4.5" stroke-linecap="round" />
                                <path d="M34 19.5C34 15.5 30.5 12 26 12C21.5 12 18 15.5 18 19.5C18 24.5 24.5 24.5 24.5 28.5C24.5 31.5 21.5 33.5 18 33.5C14 33.5 11.5 31 11.5 28" stroke="#4D4495" stroke-width="4" stroke-linecap="round" />
                            </svg>
                        )}
                    </div>
                    <div className="company-name">
                        {company.companyName || 'Business Name'}
                        <span>.</span>
                    </div>
                </div>

                <div className="invoice-title-block">
                    <div className="invoice-title">{q.documentType || 'Quotation'}</div>
                    <div className="invoice-date">
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </div>
                </div>
            </div>

            <div className="address-grid">
                <div className="address-block">
                    <div className="address-title">Office Address</div>
                    <div className="address-text" style={{ whiteSpace: 'pre-line' }}>
                        {company.address || 'N/A'}
                    </div>
                    <div className="phone-text">{company.phone || 'N/A'}</div>
                </div>

                <div className="address-block" style={{ flex: '0 0 40%' }}>
                    <div className="address-title">To :</div>
                    <div className="address-text" style={{ fontWeight: 700 }}>
                        {q.client?.name || 'N/A'}
                    </div>
                    {(q.client?.address || q.client?.siteAddress || q.client?.billingAddress) && (
                        <div className="address-text" style={{ whiteSpace: 'pre-line' }}>
                            {q.client?.address || q.client?.siteAddress || q.client?.billingAddress}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ overflowX: 'auto', width: '100%', marginBottom: '30px' }}>
                <table className="t1-items-table">
                    <thead className="table-header">
                        <tr>
                            <th>Items Description</th>
                            <th>Dimensions</th>
                            <th>Unit Price</th>
                            <th>SQFT/Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
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
                                <tr key={`cat-${sectionName}`} style={{ background: '#1E1A3A' }}>
                                    <td colSpan="5" style={{ padding: '7px 14px', color: '#ffffff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', lineHeight: '1.5' }}>
                                        {sectionName}
                                    </td>
                                </tr>,
                                ...sectionItems.map((item, itemIdx) => {
                                    const idx = itemIdx + 1;
                                    const dimStr = item.measurements || ((item.cmL || item.cmH) ? `${item.cmL || 0}×${item.cmD || 0}×${item.cmH || 0} cm` : (item.size || '-'));
                                    return (
                                        <tr className="t1-item-row" key={item._id || idx}>
                                            <td>
                                                <div className="t1-item-name">{item.itemName || 'N/A'}</div>
                                                <div className="t1-item-desc">{item.description || ''}</div>
                                                {item.image && (
                                                    <div className="t1-item-image" style={{ marginTop: '8px' }}>
                                                        <img
                                                            src={getImageUrl(item.image)}
                                                            alt="Preview"
                                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E0E0E0' }}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'center', fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600 }}>
                                                {dimStr}
                                            </td>
                                            <td className="t1-item-price">
                                                {s.documents?.currencySymbol || '₹'} {item.rate?.toLocaleString() || 0}
                                            </td>
                                            <td className="t1-item-qty">{item.quantity || 0}</td>
                                            <td className="t1-item-total">
                                                {s.documents?.currencySymbol || '₹'} {item.amount?.toLocaleString() || 0}
                                            </td>
                                        </tr>
                                    );
                                })
                            ]);
                        })()}
                    </tbody>
                </table>
            </div>

            <div className="invoice-bottom">
                <div className="note-box">
                    <div className="note-title">Notes:</div>
                    <div className="note-body" style={{ whiteSpace: 'pre-line' }}>
                        {q.notes || q.projectDescription || 'N/A'}
                    </div>
                </div>

                <div className="summary-box">
                    <div className="summary-line">
                        <span className="label">Subtotal :</span>
                        <span className="value">{s.documents?.currencySymbol || '₹'} {c.subtotal?.toLocaleString() || 0}</span>
                    </div>
                    {q.discount > 0 && (
                        <div className="summary-line">
                            <span className="label">Discount ({q.discount}%) :</span>
                            <span className="value">-{s.documents?.currencySymbol || '₹'} {c.discountAmount?.toLocaleString() || 0}</span>
                        </div>
                    )}
                    <div className="summary-line">
                        <span className="label">Tax VAT ({q.taxRate || 0}%) :</span>
                        <span className="value">{s.documents?.currencySymbol || '₹'} {c.taxAmount?.toLocaleString() || 0}</span>
                    </div>

                    <div className="total-due-row">
                        <span className="label">Total Due :</span>
                        <span className="value">{s.documents?.currencySymbol || '₹'} {c.grandTotal?.toLocaleString() || 0}</span>
                    </div>
                </div>
            </div>

            <div className="thanks-message">Thank you for your Business</div>

            <hr className="footer-divider" />

            <div className="invoice-footer">
                <div>
                    <div className="footer-col-title">Questions?</div>
                    <div className="footer-col-content">
                        <div className="contact-row">
                            <span className="contact-label">Email us</span>
                            <span>: {company.email || 'N/A'}</span>
                        </div>
                        <div className="contact-row">
                            <span className="contact-label">Call us</span>
                            <span>: {company.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="footer-col-title">Payment Info :</div>
                    <div className="footer-col-content">
                        <div className="bank-row">
                            <span className="bank-label">GSTIN</span>
                            <span>: {company.gstin || 'N/A'}</span>
                        </div>
                        <div className="bank-row">
                            <span className="bank-label">Website</span>
                            <span>: {company.website || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions (Full Width, Centered) */}
            <div className="full-width-terms">
                <div className="footer-col-title terms-centered-title">Terms & Conditions:</div>
                <div className="footer-col-content terms-centered-text">
                    {q.termsAndConditions || s.documents?.defaultTerms || 'N/A'}
                </div>
            </div>
        </div>
    );
};

export default Template1;
