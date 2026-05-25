import React from 'react';
import { Clock, Target, CheckCircle, ArrowRight, DollarSign, Layers, Package } from 'lucide-react';
import Skeleton from '../../common/Skeleton';
import '../css/ProcurementPremium.css';

const StaffOverview = ({ pendingTasks, inProgressTasks, completedTasks, purchaseHistory, formatCurrency, setActiveTab, loading }) => {
    return (
        <div className="procurement-premium-wrapper fade-in">


            {/* Elegant Stat Cards */}
            <div className="glass-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                    { label: 'Pending Tasks', value: pendingTasks.length, icon: <Clock size={20} strokeWidth={1.5} />, color: 'icon-orange' },
                    { label: 'In Progress', value: inProgressTasks.length, icon: <Target size={20} strokeWidth={1.5} />, color: 'icon-blue' },
                    { label: 'Completed', value: completedTasks.length, icon: <CheckCircle size={20} strokeWidth={1.5} />, color: 'icon-green' }
                ].map((stat, idx) => (
                    <div key={idx} className="glass-stat-card">
                        <div className={`glass-stat-icon-wrapper ${stat.color}`}>
                            {stat.icon}
                        </div>
                        {loading ? (
                            <Skeleton width="60px" height="32px" style={{ margin: '8px 0' }} />
                        ) : (
                            <div className="glass-stat-value">{stat.value}</div>
                        )}
                        <div className="glass-stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Dual Lists */}
            <div className="premium-list-grid">
                <div className="list-panel">
                    <div className="chart-header">
                        <h4 className="chart-title">Current Assignments</h4>
                        {!loading && <span className="banner-pill" style={{ margin: 0, border: '1px solid #e7e5e4', background: 'transparent' }}>{pendingTasks.length + inProgressTasks.length} Active</span>}
                    </div>
                    <div>
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="list-item-modern" style={{ borderBottom: '1px solid #f1f5f9', padding: '1rem 0' }}>
                                    <Skeleton width="40px" height="40px" borderRadius="50%" />
                                    <div style={{ flex: 1, marginLeft: '1rem' }}>
                                        <Skeleton width="60%" height="16px" style={{ marginBottom: '6px' }} />
                                        <Skeleton width="40%" height="12px" />
                                    </div>
                                    <Skeleton width="30px" height="30px" borderRadius="50%" />
                                </div>
                            ))
                        ) : (
                            <>
                                {[...pendingTasks, ...inProgressTasks].slice(0, 5).map(task => (
                                    <div key={task._id} className="list-item-modern">
                                        <div className="item-icon-box">
                                            <Package size={18} strokeWidth={1.5} className={task.status === 'Assigned' ? 'icon-orange' : 'icon-blue'} />
                                        </div>
                                        <div className="item-details">
                                            <div className="item-title">{task.requestNumber}</div>
                                            <div className="item-subtitle">{task.project?.name} • {task.items?.length || 0} items</div>
                                        </div>
                                        <button className="btn-arrow-hover" onClick={() => setActiveTab('tasks')}>
                                            <ArrowRight size={16} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                ))}
                                {pendingTasks.length === 0 && inProgressTasks.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a8a29e', fontSize: '0.875rem' }}>No active assignments</div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="list-panel">
                    <div className="chart-header">
                        <h4 className="chart-title">Recent Purchases</h4>
                        {!loading && <span className="banner-pill" style={{ margin: 0, border: '1px solid #e7e5e4', background: 'transparent' }}>History</span>}
                    </div>
                    <div>
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="list-item-modern" style={{ borderBottom: '1px solid #f1f5f9', padding: '1rem 0' }}>
                                    <Skeleton width="40px" height="40px" borderRadius="50%" />
                                    <div style={{ flex: 1, marginLeft: '1rem' }}>
                                        <Skeleton width="60%" height="16px" style={{ marginBottom: '6px' }} />
                                        <Skeleton width="40%" height="12px" />
                                    </div>
                                    <Skeleton width="30px" height="30px" borderRadius="50%" />
                                </div>
                            ))
                        ) : (
                            <>
                                {purchaseHistory.slice(0, 5).map(purchase => (
                                    <div key={purchase._id} className="list-item-modern">
                                        <div className="item-icon-box">
                                            <DollarSign size={18} strokeWidth={1.5} className="icon-green" />
                                        </div>
                                        <div className="item-details">
                                            <div className="item-title">{purchase.vendor?.name}</div>
                                            <div className="item-subtitle">{purchase.items?.length || 0} items for {formatCurrency(purchase.finalAmount)}</div>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#a8a29e', fontWeight: 400, marginLeft: '1rem' }}>
                                            {new Date(purchase.purchaseDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                                {purchaseHistory.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a8a29e', fontSize: '0.875rem' }}>No recent purchases</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffOverview;
