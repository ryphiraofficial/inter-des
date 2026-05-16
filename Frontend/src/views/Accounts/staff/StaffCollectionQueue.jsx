import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { useStaffQueueLogic } from '../hooks/useStaffQueueLogic';

const StaffCollectionQueue = ({ user }) => {
    const { projects, loading, handleGenerateInvoice, handleRecordPayment } = useStaffQueueLogic(user);

    if (loading) return <div style={{ padding: '24px' }}>Loading queue...</div>;

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Advance Payment Collection</h2>
                <p style={{ color: '#64748b', margin: '4px 0 0' }}>Projects assigned to you for advance payment collection.</p>
            </div>

            {projects.length === 0 ? (
                <div className="empty-state-card">
                    <CheckCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p>No pending collections assigned to you.</p>
                </div>
            ) : (
                <div className="staff-queue-grid">
                    {projects.map(p => (
                        <div key={p._id} className="collection-card-v2">
                            <div className="card-header-flex">
                                <div>
                                    <h3>{p.name}</h3>
                                    <p>Client: {p.client?.name || '—'}</p>
                                </div>
                                <span className={`status-badge ${p.paymentStatus === 'Invoice Sent' ? 'info' : 'warning'}`}>
                                    {p.paymentStatus}
                                </span>
                            </div>

                            <div className="card-stats-box">
                                <div><p className="label">Budget</p><p className="val">₹{(p.budget || 0).toLocaleString('en-IN')}</p></div>
                                <div style={{ textAlign: 'right' }}><p className="label">Advance Due (50%)</p><p className="val-primary">₹{(p.advanceAmount || 0).toLocaleString('en-IN')}</p></div>
                            </div>

                            <div className="card-actions">
                                {p.paymentStatus === 'Pending Advance' ? (
                                    <button onClick={() => handleGenerateInvoice(p._id)} className="btn-primary-w-icon"><FileText size={16} /> Generate Invoice</button>
                                ) : (
                                    <button onClick={() => handleRecordPayment(p._id)} className="btn-success-w-icon"><CheckCircle size={16} /> Record Payment</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffCollectionQueue;
