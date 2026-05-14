import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import Skeleton from './Skeleton';

const SalesRecentQuotations = ({ recentQuotations, loading, navigate }) => {
    return (
        <div className="activity-card" style={{ marginTop: '1.5rem' }}>
            <div className="section-header" style={{ marginBottom: '1rem' }}>
                <h2 className="section-title">Recent Quotations</h2>
                {!loading && (
                    <button onClick={() => navigate('/staff/quotations')} className="view-all">
                        See All <ArrowRight size={14} />
                    </button>
                )}
            </div>
            <div className="tasks-list">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="task-item">
                            <Skeleton width="40px" height="40px" borderRadius="10px" />
                            <div className="task-info">
                                <Skeleton width="100px" height="14px" />
                                <div style={{ height: '6px' }} />
                                <Skeleton width="60px" height="10px" />
                            </div>
                        </div>
                    ))
                ) : recentQuotations.length > 0 ? (
                    recentQuotations.map((quote) => (
                        <div key={quote._id} className="task-item" onClick={() => navigate('/staff/quotations')} style={{ gap: '16px' }}>
                            <div style={{
                                background: quote.status === 'Approved' ? '#d1fae5' : quote.status === 'Draft' ? '#f1f5f9' : '#fef3c7',
                                color: quote.status === 'Approved' ? '#059669' : quote.status === 'Draft' ? '#475569' : '#d97706',
                                padding: '8px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FileText size={20} />
                            </div>
                            <div className="task-info">
                                <h4 title={quote.projectName}>{quote.projectName || 'Unnamed Quote'}</h4>
                                <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{quote.client?.name || 'No Client'}</span>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                        ₹{quote.totalAmount?.toLocaleString('en-IN') || 0}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                        <FileText size={24} color="#cbd5e1" />
                        <p>No recent quotations!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesRecentQuotations;
