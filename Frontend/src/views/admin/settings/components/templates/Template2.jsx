import React from 'react';
import '../../../css/Template2.css';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const Template2 = ({ quotation, calc, settings }) => {
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

    return (
        <div className="invoice-container template2-container">
            {/* Top Row: Logo & Invoice Header Title */}
            <div className="invoice-header">
                <div className="brand-section">
                    <div className="logo-box">
                        {company.companyLogo ? (
                            <img src={getImageUrl(company.companyLogo)} alt="Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        ) : (
                            <span style={{ color: 'white', fontWeight: 800, fontSize: '18px' }}>R</span>
                        )}
                    </div>
                    <div>
                        <div className="company-title">{company.companyName || 'Jhon Company'}</div>
                        {company.motto && company.motto.toLowerCase() !== 'admin dashboard' && (
                            <div className="company-slogan">{company.motto}</div>
                        )}
                    </div>
                </div>
                
                <div className="title-block">
                    <div className="invoice-title">{q.documentType || 'Invoice'}</div>
                    <div className="invoice-meta-date">
                        DATE: {q.createdAt ? new Date(q.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }) : ''}
                    </div>
                </div>
            </div>

            {/* Double-Column Card Addresses Block */}
            <div className="address-card">
                <div>
                    <div className="address-block-title">Invoice To</div>
                    <div className="client-name">{q.client?.name || 'N/A'}</div>
                    {(q.client?.address || q.client?.siteAddress || q.client?.billingAddress) && (
                        <div className="address-details" style={{ whiteSpace: 'pre-line' }}>
                            {q.client?.address || q.client?.siteAddress || q.client?.billingAddress}
                        </div>
                    )}
                    {q.client?.phone && <div className="address-phone">{q.client.phone}</div>}
                </div>
                
                <div>
                    <div className="address-block-title">From Office</div>
                    <div className="client-name" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                        {company.companyName || 'N/A'}
                    </div>
                    <div className="address-details" style={{ whiteSpace: 'pre-line' }}>
                        {company.address || 'N/A'}
                    </div>
                    {company.phone && <div className="address-phone">{company.phone}</div>}
                </div>
            </div>

            {/* Metadata Horizontal Strip */}
            <div className="meta-row">
                <div className="meta-item">Date: <span>{q.createdAt ? new Date(q.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span></div>
                <div className="meta-item">No: <span style={{ fontWeight: 700 }}>{q.quotationNumber || 'N/A'}</span></div>
            </div>

            {/* Line Items Table */}
            <div style={{ overflowX: 'auto', width: '100%', marginBottom: '40px' }}>
                <table className="items-table">
                    <thead className="table-header">
                        <tr>
                            <th>No</th>
                            <th>Item Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
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
                                <tr key={`cat-${sectionName}`} style={{ background: '#1a1a2e' }}>
                                    <td colSpan="5" style={{ padding: '7px 14px', color: '#ffffff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', lineHeight: '1.5' }}>
                                        {sectionName}
                                    </td>
                                </tr>,
                                ...sectionItems.map((item, itemIdx) => {
                                    const idx = itemIdx + 1;
                                    return (
                                        <tr className="t2-item-row" key={item._id || idx}>
                                            <td>{String(idx).padStart(2, '0')}.</td>
                                            <td>
                                                <div className="item-name">{item.itemName || 'N/A'}</div>
                                                <div className="item-desc">{item.description || ''}</div>
                                                {(() => {
                                                    const dimStr = item.measurements || ((item.cmL || item.cmH) ? `${item.cmL || 0} × ${item.cmD || 0} × ${item.cmH || 0} cm ${item.size ? `(${item.size})` : ''}` : (item.size || ''));
                                                    return dimStr ? (
                                                        <div className="item-dim" style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, marginTop: '3px' }}>
                                                            Dim: {dimStr}
                                                        </div>
                                                    ) : null;
                                                })()}
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
                                            <td className="item-price">
                                                {docs.currencySymbol || '₹'} {item.rate?.toLocaleString() || 0}
                                            </td>
                                            <td className="item-qty">{item.quantity || 0}</td>
                                            <td className="item-total">
                                                {docs.currencySymbol || '₹'} {item.amount?.toLocaleString() || 0}
                                            </td>
                                        </tr>
                                    );
                                })
                            ]);
                        })()}
                    </tbody>
                </table>
            </div>

            {/* Calculation Outputs & Left Block Banner */}
            <div className="summary-section">
                <div className="summary-left">
                    <div className="total-due-card">
                        <div className="total-due-label">Total Due</div>
                        <div className="total-due-amount" id="highlightTotalVal">
                            {docs.currencySymbol || '₹'} {c.grandTotal?.toLocaleString() || 0}
                        </div>
                    </div>
                </div>
                
                <div className="summary-right">
                    <div className="calc-line">
                        <span className="label">Subtotal:</span>
                        <span className="value" id="subtotalVal">
                            {docs.currencySymbol || '₹'} {c.subtotal?.toLocaleString() || 0}
                        </span>
                    </div>
                    {q.discount > 0 && (
                        <div className="calc-line">
                            <span className="label">Discount ({q.discount}%):</span>
                            <span className="value">
                                -{docs.currencySymbol || '₹'} {c.discountAmount?.toLocaleString() || 0}
                            </span>
                        </div>
                    )}
                    <div className="calc-line">
                        <span className="label">Tax ({q.taxRate || 0}%):</span>
                        <span className="value" id="taxVal">
                            {docs.currencySymbol || '₹'} {c.taxAmount?.toLocaleString() || 0}
                        </span>
                    </div>
                    <div className="calc-line grand-total-line">
                        <span className="label">Grand Total:</span>
                        <span className="value" id="grandTotalVal">
                            {docs.currencySymbol || '₹'} {c.grandTotal?.toLocaleString() || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Extra Details Column Row */}
            <div className="details-row">
                <div>
                    <div className="details-title">Payment Info:</div>
                    <div className="details-content">
                        <div className="payment-info-line">
                            <span className="label">GSTIN</span>
                            <span>: {company.gstin || 'N/A'}</span>
                        </div>
                        <div className="payment-info-line">
                            <span className="label">A/C Name</span>
                            <span>: {company.companyName || 'N/A'}</span>
                        </div>
                        <div className="payment-info-line">
                            <span className="label">Bank details</span>
                            <span>: {company.bankDetails || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                
                {/* Signature Hand-Written Mock Block */}
                <div className="signature-container">
                    <div className="details-title">Account Manager</div>
                    <div className="signature-font">
                        {company.companyName?.split(' ')[0] || 'Manager'}
                    </div>
                    <div className="signature-line"></div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dark)' }}>
                        Authorized Signatory
                    </div>
                </div>
            </div>

            {/* Direct Help Box */}
            <div className="questions-box">
                <div className="questions-title">Notes / Questions?</div>
                <div className="questions-content" style={{ whiteSpace: 'pre-line' }}>
                    {q.notes || 'N/A'}
                </div>
            </div>

            {/* Terms and Conditions (Full Width, Centered) */}
            <div className="full-width-terms">
                <div className="details-title terms-centered-title">Terms & Conditions</div>
                <div className="details-content terms-centered-text">
                    {q.termsAndConditions || docs.defaultTerms || 'N/A'}
                </div>
            </div>

            {/* Tiny Legal Bottom String */}
            <div className="footer-line">
                <span>{company.address ? company.address.replace(/\n/g, ' • ') : ''}</span>
                <div className="footer-socials">
                    {company.website && (
                        <div className="social-item">
                            <span>{company.website}</span>
                        </div>
                    )}
                    {company.email && (
                        <div className="social-item">
                            <div className="social-dot"></div>
                            <span>{company.email}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Template2;
