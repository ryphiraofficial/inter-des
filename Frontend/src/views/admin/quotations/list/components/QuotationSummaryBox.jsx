import React from 'react';

const QuotationSummaryBox = ({ quotation }) => (
    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: '10px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Quotation Number</p>
            <p style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{quotation.quotationNumber}</p>
        </div>
        <div style={{ marginBottom: '10px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Project / Client</p>
            <p style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                {quotation.projectName} ({quotation.client?.name || 'Walk-in Client'})
            </p>
        </div>
        <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Total Budget (to Design stage)</p>
            <p style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 700, color: '#10b981' }}>
                ₹{(quotation.totalAmount || 0).toLocaleString('en-IN')}
            </p>
        </div>
    </div>
);

export default QuotationSummaryBox;
