import React from 'react';
import { Tag, Percent } from 'lucide-react';

const QuotationSummary = ({ 
    subtotal, discount, setDiscount, includeDiscount, setIncludeDiscount,
    discountAmount, offerPrice, taxRate, setTaxRate, includeTax, setIncludeTax,
    taxAmount, total 
}) => {
    return (
        <div className="quotation-summary-grid" style={{ marginTop: '2rem' }}>
            <div className="summary-left-notes">
                <div className="discount-control-card">
                    <div className="control-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Tag size={16} color="#6366f1" />
                            <span style={{ fontWeight: 600 }}>Discount Policy</span>
                        </div>
                        <label className="switch-toggle">
                            <input type="checkbox" checked={includeDiscount} onChange={e => setIncludeDiscount(e.target.checked)} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    {includeDiscount && (
                        <div className="control-body">
                            <div className="input-with-label">
                                <label>Percentage (%)</label>
                                <div className="percent-input-wrapper">
                                    <input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} min="0" max="100" />
                                    <Percent size={14} />
                                </div>
                            </div>
                            <div className="discount-impact">
                                <span>Saving for client:</span>
                                <strong style={{ color: '#10b981' }}>- ₹{discountAmount.toLocaleString()}</strong>
                            </div>
                        </div>
                    )}
                </div>

                <div className="tax-control-card" style={{ marginTop: '1rem' }}>
                    <div className="control-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Percent size={16} color="#6366f1" />
                            <span style={{ fontWeight: 600 }}>Tax Configuration</span>
                        </div>
                        <label className="switch-toggle">
                            <input type="checkbox" checked={includeTax} onChange={e => setIncludeTax(e.target.checked)} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    {includeTax && (
                        <div className="control-body">
                            <div className="input-with-label">
                                <label>GST Rate (%)</label>
                                <select value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="select-styled-small">
                                    <option value="5">5% GST</option>
                                    <option value="12">12% GST</option>
                                    <option value="18">18% GST</option>
                                    <option value="28">28% GST</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="summary-right-calc">
                <div className="calc-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {includeDiscount && (
                    <div className="calc-row discount-row">
                        <span>Discount ({discount}%)</span>
                        <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                )}
                <div className="calc-row offer-price-row">
                    <span>Offer Price</span>
                    <span>₹{offerPrice.toLocaleString()}</span>
                </div>
                {includeTax && (
                    <div className="calc-row">
                        <span>GST ({taxRate}%)</span>
                        <span>₹{taxAmount.toLocaleString()}</span>
                    </div>
                )}
                <div className="calc-row grand-total-row">
                    <span>Grand Total</span>
                    <strong>₹{total.toLocaleString()}</strong>
                </div>
            </div>
        </div>
    );
};

export default QuotationSummary;
