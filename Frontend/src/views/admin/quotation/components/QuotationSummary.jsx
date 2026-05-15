import React from 'react';

const QuotationSummary = ({ 
    subtotal, 
    includeDiscount, 
    setIncludeDiscount, 
    discount, 
    setDiscount, 
    discountAmount, 
    offerPrice, 
    includeTax, 
    setIncludeTax, 
    taxRate, 
    setTaxRate, 
    taxAmount, 
    total 
}) => {
    return (
        <div className="totals-summary-card">
            <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" checked={includeDiscount} onChange={(e) => setIncludeDiscount(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    <span>Discount</span>
                    {includeDiscount && (
                        <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '2px 8px', marginLeft: '4px' }}>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                style={{ width: '40px', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, fontSize: '0.9rem', textAlign: 'right' }}
                            />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>%</span>
                        </div>
                    )}
                </div>
                <span className="tax-val" style={{ color: '#ef4444' }}>- ₹{discountAmount.toLocaleString()}</span>
            </div>

            <div className="summary-row" style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Offer Price</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>₹{offerPrice.toLocaleString()}</span>
            </div>

            <div className="summary-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" checked={includeTax} onChange={(e) => setIncludeTax(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    <span>Add Tax</span>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '2px 8px', marginLeft: '4px' }}>
                        <input
                            type="number"
                            value={taxRate}
                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                            style={{ width: '40px', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, fontSize: '0.9rem', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>%</span>
                    </div>
                </div>
                <span className="tax-val">+ ₹{taxAmount.toLocaleString()}</span>
            </div>
            <div className="summary-row main-total">
                <span>Grand Total</span>
                <span>₹{total.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default QuotationSummary;
