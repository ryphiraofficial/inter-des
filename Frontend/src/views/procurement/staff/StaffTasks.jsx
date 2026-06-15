import React, { useState } from 'react';
import { Package, Eye, Calendar, Clock, PlayCircle } from 'lucide-react';
import Skeleton from '../../common/Skeleton';
import '../css/ProcurementPremium.css';

const StaffTasks = ({ 
    pendingTasks, 
    inProgressTasks, 
    setSelectedTask, 
    setShowTaskDetailsModal, 
    setShowTimeExtension,
    loading 
}) => {
    const [activeTab, setActiveTab] = useState('pending');
    
    const renderTaskCard = (task) => (
        <div key={task._id} className="assigned-item-premium fade-in">
            <div className="item-header">
                <div className="title-group">
                    <span className="req-number">{task.requestNumber}</span>
                    <span className="proj-name">{task.project?.name || 'Unknown Project'}</span>
                </div>
                <span className={`status-pill ${task.status?.toLowerCase().replace(' ', '-')}`}>
                    {task.status}
                </span>
            </div>
            
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={16} color="#6366f1" />
                <span style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.85rem' }}>
                    {task.items?.length || 0} items requested
                </span>
            </div>
            
            <div className="item-footer">
                <div className="meta-info">
                    {/* Placeholder for future dates or meta */}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => {
                            setSelectedTask(task);
                            setShowTimeExtension(true);
                        }}
                        style={{
                            background: '#f8fafc',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    >
                        <Calendar size={14} /> Time
                    </button>
                    <button 
                        className="btn-approve"
                        style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => {
                            setSelectedTask(task);
                            setShowTaskDetailsModal(true);
                        }}
                    >
                        <Eye size={14} /> Details
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSkeletonCard = (idx) => (
        <div key={idx} className="assigned-item-premium fade-in">
            <div className="item-header">
                <div className="title-group" style={{ width: '60%' }}>
                    <Skeleton width="60%" height="16px" style={{ marginBottom: '6px' }} />
                    <Skeleton width="40%" height="12px" />
                </div>
                <Skeleton width="80px" height="24px" borderRadius="100px" />
            </div>
            
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Skeleton width="120px" height="14px" />
            </div>
            
            <div className="item-footer">
                <div className="meta-info"></div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Skeleton width="80px" height="32px" borderRadius="12px" />
                    <Skeleton width="90px" height="32px" borderRadius="12px" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: 0 }}>
            {/* Tabs */}
            <div className="meetings-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'white', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
                <button 
                    className={`meeting-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'pending' ? '#fef3c7' : 'transparent', color: activeTab === 'pending' ? '#d97706' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }}
                >
                    Pending Action ({pendingTasks.length})
                </button>
                <button 
                    className={`meeting-tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
                    onClick={() => setActiveTab('progress')}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'progress' ? '#e0e7ff' : 'transparent', color: activeTab === 'progress' ? '#4f46e5' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }}
                >
                    In Progress ({inProgressTasks.length})
                </button>
            </div>

            <div className="staff-tasks-tab-layout">
                
                {/* Pending Tasks Column */}
                {activeTab === 'pending' && (
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Clock size={16} strokeWidth={2.5} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Pending Action</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1rem' }}>
                            {loading ? (
                                [1, 2].map(renderSkeletonCard)
                            ) : pendingTasks.length > 0 ? (
                                pendingTasks.map(renderTaskCard)
                            ) : (
                                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                    <Package size={32} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>No pending tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* In Progress Tasks Column */}
                {activeTab === 'progress' && (
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PlayCircle size={16} strokeWidth={2.5} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>In Progress</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1rem' }}>
                            {loading ? (
                                [1, 2].map(renderSkeletonCard)
                            ) : inProgressTasks.length > 0 ? (
                                inProgressTasks.map(renderTaskCard)
                            ) : (
                                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                    <Package size={32} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>No tasks in progress</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default StaffTasks;
