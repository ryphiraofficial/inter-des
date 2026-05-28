import React from 'react';

const DocSummary = ({
    subtotal, discount, discountAmount, offerPrice, taxRate, taxAmount, grandTotal, depositPercent, notes, termsAndConditions
}) => {
    return (
        <section className="summary-section">
            <div className="notes-col">
                {notes && (
                    <div className="doc-note-box">
                        <h4>Notes</h4>
                        <p>{notes}</p>
                    </div>
                )}
                {termsAndConditions && (
                    <div className="doc-note-box">
                        <h4>Terms & Conditions</h4>
                        <p>{termsAndConditions}</p>
                    </div>
                )}
            </div>
            <div className="totals-col">
                <div className="total-row">
                    <label>Subtotal</label>
                    <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                    <div className="total-row discount">
                        <label>Discount ({discount}%)</label>
                        <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                )}
                <div className="total-row offer">
                    <label>Offer Price</label>
                    <span>₹{offerPrice.toLocaleString()}</span>
                </div>
                <div className="total-row">
                    <label>GST ({taxRate}%)</label>
                    <span>+ ₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="total-row grand-total">
                    <label>Grand Total</label>
                    <span>₹{grandTotal.toLocaleString()}</span>
                </div>
                <div className="deposit-box">
                    <label>Advance Required ({depositPercent}%)</label>
                    <span>₹{((grandTotal * depositPercent) / 100).toLocaleString()}</span>
                </div>
            </div>
        </section>
    );
};

export default DocSummary;
