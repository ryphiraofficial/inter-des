import React, { useState, useEffect } from 'react';
import {
    CheckSquare,
    Clock,
    AlertCircle,
    Plus,
    FileText,
    Users,
    ChevronRight,
    TrendingUp,
    Calendar,
    X,
    ExternalLink,
    Eye,
    Package,
    Image,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { taskAPI, siteVisitAPI, quotationAPI, BASE_IMAGE_URL } from '../../models/api';
import Skeleton from './components/Skeleton';
import './css/SalesDashboard.css';

const SalesDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        pendingTasks: 0,
        completedToday: 0,
        activeProjects: 0
    });
    const [urgentTasks, setUrgentTasks] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [recentVisits, setRecentVisits] = useState([]);
    const [recentQuotations, setRecentQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [tasksRes, visitsRes, quotesRes] = await Promise.all([
                    taskAPI.getAll(),
                    siteVisitAPI.getAll({ limit: 4 }),
                    quotationAPI.getAll({ limit: 4 })
                ]);

                if (tasksRes.success) {
                    const tasks = tasksRes.data;
                    const pending = tasks.filter(t => t.status !== 'Completed').length;

                    const today = new Date().toDateString();
                    const doneToday = tasks.filter(t =>
                        t.status === 'Completed' &&
                        new Date(t.updatedAt).toDateString() === today
                    ).length;

                    const activeProjs = [...new Set(tasks.filter(t => t.status !== 'Completed').map(t => t.quotation?._id))].filter(id => id).length;

                    setStats({
                        pendingTasks: pending,
                        completedToday: doneToday,
                        activeProjects: activeProjs || 0
                    });

                    const urgent = tasks.filter(t =>
                        t.status !== 'Completed' &&
                        (t.priority === 'High' || t.priority === 'Critical')
                    ).slice(0, 3);
                    setUrgentTasks(urgent);

                    if (user?.role === 'Sales') {
                        const reviews = tasks.filter(t => t.status === 'Pending Sales Review');
                        setPendingReviews(reviews);
                    }
                }

                if (visitsRes.success) {
                    setRecentVisits(visitsRes.data);
                }

                if (quotesRes?.success) {
                    // Filter or sort if necessary, assume the API handles it
                    const sortedQuotes = quotesRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
                    setRecentQuotations(sortedQuotes);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const quickActions = [
        { name: 'New Quotation', icon: FileText, path: '/staff/quotations/new', color: '#6366f1' },
        { name: 'Add Client', icon: Users, path: '/staff/clients', color: '#0ea5e9' },
        { name: 'Log Visit', icon: AlertCircle, path: '/staff/site-visits', color: '#f59e0b' },
    ];

    return (
        <div className="staff-dashboard">

            {/* ── Top Stats Grid ── */}
            <div className="stats-grid">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="stat-card">
                            <Skeleton width="60px" height="60px" borderRadius="18px" />
                            <div className="stat-data" style={{ marginLeft: '1rem', flex: 1 }}>
                                <Skeleton width="40px" height="32px" />
                                <div style={{ height: '4px' }} />
                                <Skeleton width="80px" height="14px" />
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="stat-card">
                            <div className="stat-icon pending">
                                <Clock size={28} />
                            </div>
                            <div className="stat-data">
                                <span className="value">{stats.pendingTasks}</span>
                                <span className="label">Pending Tasks</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon completed">
                                <TrendingUp size={28} />
                            </div>
                            <div className="stat-data">
                                <span className="value">{stats.completedToday}</span>
                                <span className="label">Done Today</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon projects">
                                <CheckSquare size={28} />
                            </div>
                            <div className="stat-data">
                                <span className="value">{stats.activeProjects}</span>
                                <span className="label">Active Projects</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon reviews">
                                <AlertCircle size={28} />
                            </div>
                            <div className="stat-data">
                                <span className="value">{pendingReviews.length}</span>
                                <span className="label">Pending Reviews</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ── Bento Grid Layout ── */}
            <div className="dashboard-bento">
                {/* Left Column (Main Content) */}
                <div className="bento-col">
                    
                    {/* Sales Specific: Approvals */}
                    {user?.role === 'Sales' && (
                        <div className="approvals-card">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FileText size={20} color="#6366f1" />
                                    {loading ? <Skeleton width="180px" height="24px" /> : `Pending Client Approvals (${pendingReviews.length})`}
                                </h2>
                                {!loading && <button onClick={() => navigate('/staff/tasks')} className="view-all">View All <ArrowRight size={14} /></button>}
                            </div>
                            
                            <div className="approvals-list">
                                {loading ? (
                                    <div className="approval-item">
                                        <div style={{ flex: 1 }}>
                                            <Skeleton width="140px" height="20px" />
                                            <div style={{ height: '8px' }} />
                                            <Skeleton width="100px" height="14px" />
                                        </div>
                                        <Skeleton width="90px" height="36px" borderRadius="20px" />
                                    </div>
                                ) : pendingReviews.length > 0 ? (
                                    pendingReviews.map((task) => (
                                        <div key={task._id} className="approval-item">
                                            <div className="approval-info">
                                                <h3>{task.title} <span className="approval-badge">REVIEW READY</span></h3>
                                                <p>Project: {task.project?.projectName || task.quotation?.projectName || 'Interior Design Project'}</p>
                                                <span>Assigned to: {task.assignedTo?.map(s => s.name).join(', ') || 'N/A'}</span>
                                            </div>
                                            <div className="approval-actions">
                                                <button 
                                                    className="btn-pill-ghost"
                                                    onClick={() => { setSelectedTask(task); setShowViewModal(true); }}
                                                >
                                                    <Eye size={16} /> Preview
                                                </button>
                                                <button 
                                                    className="btn-pill-solid"
                                                    onClick={async () => {
                                                        const notes = prompt('Add optional notes for the Design Manager:');
                                                        try {
                                                            const res = await taskAPI.salesApprove(task._id, { approved: true, salesNotes: notes || '' });
                                                            if (res.success) {
                                                                alert('✅ Design approved and forwarded!');
                                                                window.location.reload();
                                                            }
                                                        } catch (err) { alert('Approval failed'); }
                                                    }}
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <CheckSquare size={32} color="#cbd5e1" />
                                        <p>All caught up! No designs pending your review.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="quick-actions-card">
                        <h2 className="section-title">Quick Actions</h2>
                        <div className="quick-actions-grid">
                            {quickActions.map((action) => (
                                <button
                                    key={action.name}
                                    className="action-card"
                                    onClick={() => navigate(action.path)}
                                    style={{ '--hover-color': action.color }}
                                >
                                    <div className="action-icon-wrapper" style={{ background: action.color + '15', color: action.color }}>
                                        <action.icon size={24} />
                                    </div>
                                    <span>{action.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Site Visits Gallery */}
                    <div className="visits-card">
                        <div className="section-header">
                            <h2 className="section-title">Last Site Visits</h2>
                            {!loading && <button onClick={() => navigate('/staff/site-visits')} className="view-all">Log New <ArrowRight size={14} /></button>}
                        </div>
                        <div className="visits-grid">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="visit-item">
                                        <Skeleton width="100%" height="120px" />
                                    </div>
                                ))
                            ) : recentVisits.length > 0 ? (
                                recentVisits.map((visit) => (
                                    <div key={visit._id} className="visit-item" onClick={() => navigate('/staff/site-visits')}>
                                        <div className="visit-image-wrapper">
                                            {visit.images && visit.images.length > 0 ? (
                                                <img src={`${BASE_IMAGE_URL}${visit.images[0]}`} alt="Site" onError={(e) => { e.target.style.display = 'none'; }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                                            )}
                                            <div className="visit-overlay">
                                                <h4>{visit.client?.name || 'Site Visit'}</h4>
                                                <p><Calendar size={10} /> {new Date(visit.visitDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1' }} className="empty-state">
                                    <p>No recent site visits logged.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Target (Fill space) */}
                    <div className="target-card">
                        <div className="section-header">
                            <h2 className="section-title">Monthly Target Progress</h2>
                        </div>
                        <div className="target-content">
                            <div className="target-stats">
                                <div className="target-stat">
                                    <span className="target-label">Achieved</span>
                                    <span className="target-value">₹3,50,000</span>
                                </div>
                                <div className="target-stat right">
                                    <span className="target-label">Goal</span>
                                    <span className="target-value">₹5,00,000</span>
                                </div>
                            </div>
                            <div className="target-progress-container">
                                <div className="target-progress-bar" style={{ width: '70%' }}></div>
                            </div>
                            <p className="target-message">You're on track! 70% of monthly goal reached.</p>
                        </div>
                    </div>

                </div>

                {/* Right Column (Side Content) */}
                <div className="bento-col">
                    
                    {/* My Tasks */}
                    <div className="tasks-card">
                        <div className="section-header">
                            <h2 className="section-title">Urgent Tasks</h2>
                            {!loading && <button onClick={() => navigate('/staff/tasks')} className="view-all">See All <ArrowRight size={14} /></button>}
                        </div>
                        <div className="tasks-list">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="task-item">
                                        <Skeleton width="40px" height="40px" borderRadius="10px" />
                                        <div className="task-info">
                                            <Skeleton width="100px" height="14px" />
                                            <div style={{ height: '6px' }} />
                                            <Skeleton width="140px" height="10px" />
                                        </div>
                                    </div>
                                ))
                            ) : urgentTasks.length > 0 ? (
                                urgentTasks.map((task) => (
                                    <div key={task._id} className="task-item" onClick={() => navigate('/staff/tasks')}>
                                        <div className={`task-priority-indicator ${task.priority?.toLowerCase()}`} />
                                        <div className="task-info">
                                            <h4 title={task.title}>{task.title}</h4>
                                            <p>{task.client?.name || task.quotation?.projectName || 'No project assigned'}</p>
                                        </div>
                                        <ChevronRight size={16} className="task-chevron" />
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                                    <CheckSquare size={24} color="#cbd5e1" />
                                    <p>No urgent tasks!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="activity-card">
                        <h2 className="section-title">Recent Activity</h2>
                        <div className="activity-feed">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="activity-item">
                                        <Skeleton width="32px" height="32px" borderRadius="50%" />
                                        <div className="activity-content" style={{ flex: 1 }}>
                                            <Skeleton width="90%" height="12px" />
                                            <div style={{ height: '6px' }} />
                                            <Skeleton width="40%" height="10px" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    {recentVisits.slice(0, 2).map((visit) => (
                                        <div key={visit._id} className="activity-item">
                                            <div className="activity-icon"><AlertCircle size={16} /></div>
                                            <div className="activity-content">
                                                <p><strong>Site Visit</strong> logged for {visit.client?.name || 'Client'}</p>
                                                <span className="activity-time">{new Date(visit.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {urgentTasks.slice(0, 2).map((task) => (
                                        <div key={task._id} className="activity-item">
                                            <div className="activity-icon"><Clock size={16} /></div>
                                            <div className="activity-content">
                                                <p><strong>Task Updated:</strong> {task.title}</p>
                                                <span className="activity-time">{new Date(task.updatedAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Recent Quotations */}
                    <div className="activity-card" style={{ marginTop: '1.5rem' }}>
                        <div className="section-header" style={{ marginBottom: '1rem' }}>
                            <h2 className="section-title">Recent Quotations</h2>
                            {!loading && <button onClick={() => navigate('/staff/quotations')} className="view-all">See All <ArrowRight size={14} /></button>}
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

                </div>
            </div>

            {/* ── DESIGN PREVIEW MODAL ── */}
            {showViewModal && selectedTask && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="modal-content" style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <button onClick={() => setShowViewModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                            <X size={18} />
                        </button>
                        
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText color="#6366f1" /> {selectedTask.title}
                            </h2>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Review the design files and item list before presenting to client.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Image size={16} color="#6366f1" /> Design Assets</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.files?.map((file, i) => {
                                        const isImg = file.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                        return (
                                            <div key={i} style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                                {isImg && (
                                                    <div style={{ height: '160px', background: '#eee' }}>
                                                        <img src={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                )}
                                                <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 500 }}>{file.name || `File ${i+1}`}</span>
                                                    <a href={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}><ExternalLink size={16} /></a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {!selectedTask.submissions?.[selectedTask.submissions.length - 1]?.files?.length && (
                                        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#94a3b8', fontSize: '0.9rem' }}>No files attached.</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div style={{ background: '#e0e7ff', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #c7d2fe' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5' }}>
                                        <FileText size={14} /> Designer Notes
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#0f172a', lineHeight: '1.6' }}>
                                        {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designerNotes || 'No notes provided.'}
                                    </p>
                                </div>

                                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Package size={14} color="#6366f1" /> Item Specifications
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designItems?.map((item, i) => (
                                            <div key={i} style={{ background: '#e0e7ff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>
                                                    <span>{item.name}</span>
                                                    <span style={{ color: '#6366f1' }}>{item.quantity} {item.unit}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {!selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designItems?.length && (
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', padding: '1rem', margin: 0 }}>No item list provided.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesDashboard;
