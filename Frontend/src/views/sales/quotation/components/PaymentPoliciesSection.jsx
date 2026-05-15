import React from 'react';
import { DollarSign } from 'lucide-react';

const PaymentPoliciesSection = ({ formData, handleInputChange, depositAmount }) => {
    return (
        <div className="form-section" style={{ marginTop: '1.5rem' }}>
            <div className="section-header-row" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
                <div className="section-header-left">
                    <DollarSign className="section-icon" size={18} />
                    <h3>Payment & Policies</h3>
                </div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ color: '#166534', fontWeight: 600, margin: 0 }}>Deposit / Advance</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="number"
                        name="depositPercent"
                        style={{ width: '60px', padding: '4px 8px', border: '1px solid #bbf7d0', borderRadius: '4px' }}
                        value={formData.depositPercent}
                        onChange={handleInputChange}
                    />
                    <span style={{ color: '#166534' }}>% = ₹{depositAmount?.toLocaleString()}</span>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                    <label>Payment Terms</label>
                    <textarea name="paymentTerms" className="textarea-styled" placeholder="e.g., 50% advance, 50% on finish" value={formData.paymentTerms} onChange={handleInputChange} rows="2"></textarea>
                </div>
                <div className="form-group">
                    <label>Warranty Terms</label>
                    <textarea name="warrantyTerms" className="textarea-styled" placeholder="e.g., 1 year on materials" value={formData.warrantyTerms} onChange={handleInputChange} rows="2"></textarea>
                </div>
            </div>
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label>Cancellation Policy</label>
                <textarea name="cancellationPolicy" className="textarea-styled" placeholder="e.g., No refund after material purchase" value={formData.cancellationPolicy} onChange={handleInputChange} rows="2"></textarea>
            </div>
        </div>
    );
};

export default PaymentPoliciesSection;
