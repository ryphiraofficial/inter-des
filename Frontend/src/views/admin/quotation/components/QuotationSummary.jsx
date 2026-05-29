import React from 'react';
import { Tag, Percent } from 'lucide-react';

const QuotationSummary = ({ 
    subtotal, discount, setDiscount, includeDiscount, setIncludeDiscount,
    discountAmount, offerPrice, taxRate, setTaxRate, includeTax, setIncludeTax,
    taxAmount, total, totalCost, totalProfit, profitMargin
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

                <div className="profit-control-card" style={{ marginTop: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.2rem' }}>
                    <div className="control-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <span style={{ fontWeight: 600, color: '#166534' }}>Internal Profit Analysis</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600, background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>ADMIN ONLY</span>
                    </div>
                    <div className="control-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <span style={{ color: '#15803d', fontSize: '0.85rem' }}>Total Cost</span>
                            <span style={{ fontWeight: 600, color: '#166534' }}>₹{totalCost.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <span style={{ color: '#15803d', fontSize: '0.85rem' }}>Total Profit</span>
                            <span style={{ fontWeight: 600, color: '#166534' }}>₹{totalProfit.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: '8px', borderTop: '1px dashed #bbf7d0' }}>
                            <span style={{ color: '#15803d', fontSize: '0.85rem', fontWeight: 600 }}>Profit Margin</span>
                            <span style={{ fontWeight: 700, color: profitMargin > 20 ? '#16a34a' : profitMargin > 10 ? '#ca8a04' : '#dc2626' }}>
                                {profitMargin.toFixed(1)}%
                            </span>
                        </div>
                    </div>
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
