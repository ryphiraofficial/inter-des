import React from 'react';
import { ArrowRight, ClipboardCheck, TrendingUp, Package } from 'lucide-react';

const OverviewLists = ({ pendingReviews, designHandoffs, pendingRequests, navigate }) => {
    return (
        <div className="premium-list-grid">
            <div className="list-panel">
                <div className="chart-header">
                    <h4 className="chart-title">Pending Approvals</h4>
                    <span className="banner-pill" style={{ margin: 0, border: '1px solid #fde047', background: '#fffdf5', color: '#854d0e' }}>{pendingReviews.length} Action Required</span>
                </div>
                <div>
                    {pendingReviews.slice(0, 5).map(req => (
                        <div key={req._id} className="list-item-modern">
                            <div className="item-icon-box" style={{ background: '#fffdf5', borderColor: '#fef08a' }}>
                                <ClipboardCheck size={18} strokeWidth={1.5} color="#854d0e" />
                            </div>
                            <div className="item-details">
                                <div className="item-title">{req.requestNumber || req.title}</div>
                                <div className="item-subtitle">{req.project?.name} • By {req.assignedTo?.fullName || 'Staff'}</div>
                            </div>
                            <button className="btn-arrow-hover" onClick={() => navigate('?tab=assignments')} title="View Approvals">
                                <ArrowRight size={16} strokeWidth={1.5} />
                            </button>
                        </div>
                    ))}
                    {pendingReviews.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a8a29e', fontSize: '0.875rem' }}>No pending reviews from staff</div>
                    )}
                </div>
            </div>

            <div className="list-panel">
                <div className="chart-header">
                    <h4 className="chart-title">Design Handoff Queue</h4>
                    <span className="banner-pill" style={{ margin: 0, border: '1px solid #e7e5e4', background: 'transparent' }}>{designHandoffs.length} New</span>
                </div>
                <div>
                    {designHandoffs.slice(0, 5).map(item => (
                        <div key={item._id} className="list-item-modern">
                            <div className="item-icon-box">
                                <TrendingUp size={18} strokeWidth={1.5} className="icon-purple" />
                            </div>
                            <div className="item-details">
                                <div className="item-title">{item.type === 'MaterialRequest' ? item.requestNumber : item.title}</div>
                                <div className="item-subtitle">{item.project?.name} • {item.type === 'MaterialRequest' ? `${item.items?.length || 0} items` : 'Pending List'}</div>
                            </div>
                            <button className="btn-arrow-hover" onClick={() => navigate('?tab=handoffs')}>
                                <ArrowRight size={16} strokeWidth={1.5} />
                            </button>
                        </div>
                    ))}
                    {designHandoffs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a8a29e', fontSize: '0.875rem' }}>No recent design handoffs</div>
                    )}
                </div>
            </div>

            <div className="list-panel">
                <div className="chart-header">
                    <h4 className="chart-title">Standard Requests</h4>
                    <span className="banner-pill" style={{ margin: 0, border: '1px solid #e7e5e4', background: 'transparent' }}>{pendingRequests.length} Total</span>
                </div>
                <div>
                    {pendingRequests.slice(0, 5).map(req => (
                        <div key={req._id} className="list-item-modern">
                            <div className="item-icon-box">
                                <Package size={18} strokeWidth={1.5} color="#78716c" />
                            </div>
                            <div className="item-details">
                                <div className="item-title">{req.requestNumber}</div>
                                <div className="item-subtitle">{req.project?.name} • {req.items?.length || 0} items</div>
                            </div>
                            <button className="btn-arrow-hover" onClick={() => navigate('?tab=requests')}>
                                <ArrowRight size={16} strokeWidth={1.5} />
                            </button>
                        </div>
                    ))}
                    {pendingRequests.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a8a29e', fontSize: '0.875rem' }}>No pending standard requests</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewLists;
