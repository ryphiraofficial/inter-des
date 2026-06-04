import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const CompletedHandoffs = ({ completedRequests, handleHandoff }) => (
    <div className="procurement-premium-wrapper">
        <div className="premium-banner">
            <h1 className="banner-title">Completed &amp; Handoff</h1>
            <p className="banner-subtitle">Finalize procurement and transition projects to Production phase.</p>
        </div>
        <div className="premium-list-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="list-panel">
                <div className="chart-header">
                    <h4 className="chart-title">Completed Requests ({completedRequests.length})</h4>
                </div>
                <div className="completed-list">
                    {completedRequests.map(req => (
                        <div key={req._id} className="list-item-modern">
                            <div className="item-icon-box" style={{ background: '#f0fdf4' }}>
                                <CheckCircle size={18} color="#10b981" />
                            </div>
                            <div className="item-details">
                                <div className="item-title">{req.requestNumber}</div>
                                <div className="item-subtitle">{req.project?.name} • Ready for Production</div>
                            </div>
                            <button
                                className="btn-add"
                                onClick={() => handleHandoff(req)}
                                style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#0ea5e9', color: 'white' }}
                            >
                                Handoff to Production <ArrowRight size={14} />
                            </button>
                        </div>
                    ))}
                    {completedRequests.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                            No completed requests waiting for handoff.
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default CompletedHandoffs;
