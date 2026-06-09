import React, { forwardRef } from 'react';

const InvoiceDocument = forwardRef(({ invoice }, ref) => {
    if (!invoice) return null;

    return (
        <div style={{ backgroundColor: '#fff', padding: '40px', color: '#000', fontFamily: 'sans-serif' }} ref={ref}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: 'bold' }}>WOODAURA</h1>
                    <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '14px' }}>Interior Design Studio</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px' }}>INVOICE</h2>
                    <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '14px' }}>#{invoice.invoiceNumber}</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div>
                    <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Bill To</h3>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{invoice.client?.name || 'Client Name'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginRight: '10px' }}>Date</span>
                        <span style={{ fontWeight: 'bold' }}>{new Date(invoice.invoiceDate || invoice.createdAt || invoice.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginRight: '10px' }}>Due Date</span>
                        <span style={{ fontWeight: 'bold' }}>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Description</th>
                        <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Qty</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Rate</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {(invoice.items || []).map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px', fontSize: '14px' }}>{item.description}</td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>₹{Number(item.rate || 0).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>₹{Number(item.amount || 0).toLocaleString('en-IN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <div style={{ width: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#64748b' }}>
                        <span>Subtotal</span>
                        <span>₹{Number(invoice.subTotal || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#64748b' }}>
                        <span>Tax</span>
                        <span>₹{Number(invoice.tax || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #e2e8f0', fontWeight: 'bold', fontSize: '18px', color: '#0f172a' }}>
                        <span>Total</span>
                        <span>₹{Number(invoice.grandTotal || invoice.totalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div>
                    <h3 style={{ margin: '0 0 5px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Notes</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{invoice.notes}</p>
                </div>
            )}
        </div>
    );
});

export default InvoiceDocument;
