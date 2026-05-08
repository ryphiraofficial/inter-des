import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, Clock, AlertTriangle, CheckCircle, ChevronRight,
    Plus, FileText, Users, MapPin, Eye, ExternalLink, Image, Package, LogOut, Briefcase
} from 'lucide-react';
import { taskAPI, siteVisitAPI, BASE_IMAGE_URL } from '../../models/api';
import Skeleton from '../common/Skeleton';
import './css/SalesDashboard.css';

const SalesDashboard = ({ user }) => {
    const navigate = useNavigate();
    const isManager = user?.role?.toLowerCase().includes('manager');

    // Data states
    const [tasks, setTasks] = useState([]);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [selectedApproval, setSelectedApproval] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [tasksRes, visitsRes] = await Promise.all([
                    taskAPI.getAll(),
                    siteVisitAPI.getAll({ limit: 4 })
                ]);
                if (tasksRes.success) setTasks(tasksRes.data);
                if (visitsRes.success) setVisits(visitsRes.data);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // ─── Data processing ───
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPending = t => t.status !== 'Completed';
    const pendingTasks = tasks.filter(isPending);
    const hotLeads = tasks.filter(t => isPending(t) && ['High', 'Critical'].includes(t.priority));
    const dueToday = tasks.filter(t => {
        if (!isPending(t) || !t.dueDate) return false;
        const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });
    const overdue = tasks.filter(t => {
        if (!isPending(t) || !t.dueDate) return false;
        const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
        return d.getTime() < today.getTime();
    });

    const pendingApprovals = tasks.filter(t => t.status === 'Pending Sales Review');
    const closedThisMonth = tasks.filter(t => {
        if (t.status !== 'Completed' || !t.updatedAt) return false;
        const d = new Date(t.updatedAt);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });

    // Pipeline breakdown
    const getStageCount = (keyword) => tasks.filter(t => isPending(t) && t.status?.toLowerCase().includes(keyword)).length;
    const pipeline = [
        { label: 'New Leads',    count: getStageCount('lead'),      pct: 20 },
        { label: 'Site Visits',  count: getStageCount('visit'),     pct: 40 },
        { label: 'Quotations',   count: getStageCount('quotation'), pct: 60 },
        { label: 'Negotiations', count: getStageCount('negotiat'),  pct: 80 }
    ];

    const maxStage = Math.max(1, ...pipeline.map(p => p.count));

    // KPI mapping
    const kpiData = [
        { lbl: 'Active Leads', val: pendingTasks.length, icon: Target, c: '#6366f1', chip: 'Total pipeline' },
        { lbl: 'Hot Leads', val: hotLeads.length, icon: AlertTriangle, c: '#f59e0b', chip: 'Action needed', chipClass: 'warn' },
        { lbl: 'Due Today', val: dueToday.length, icon: Clock, c: '#10b981', chip: "Today's focus" },
        { lbl: 'Overdue', val: overdue.length, icon: CheckCircle, c: '#ef4444', chip: 'Attention', chipClass: 'down' }
    ];

    if (isManager) {
        kpiData[1] = { lbl: 'Pending Approvals', val: pendingApprovals.length, icon: CheckCircle, c: '#f59e0b', chip: 'Needs review', chipClass: 'warn' };
        kpiData[3] = { lbl: 'Closed (MTD)', val: closedThisMonth.length, icon: Target, c: '#10b981', chip: 'Conversion', chipClass: 'up' };
    }

    // ─── Handlers ───
    const handleApproval = async (taskId, approved) => {
        try {
            const notes = window.prompt(approved ? 'Approval notes (optional):' : 'Rejection reason:');
            if (!approved && !notes) { alert('Rejection reason is required'); return; }
            const res = await taskAPI.salesApprove(taskId, { approved, salesNotes: notes });
            if (res.success) {
                alert(approved ? 'Approved!' : 'Sent back for revision');
                window.location.reload();
            }
        } catch (err) {
            alert('Action failed: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="sd-root">
                <div className="sd-banner">
                    <div className="sd-banner-left">
                        <Skeleton width="100px" height="14px" />
                        <div style={{ height: '8px' }} />
                        <Skeleton width="250px" height="32px" />
                        <div style={{ height: '8px' }} />
                        <Skeleton width="350px" height="16px" />
                    </div>
                </div>

                <div className="sd-kpi-row">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="sd-kpi-card">
                            <div className="sd-kpi-header">
                                <Skeleton width="36px" height="36px" borderRadius="10px" />
                                <Skeleton width="80px" height="20px" borderRadius="20px" />
                            </div>
                            <div style={{ height: '12px' }} />
                            <Skeleton width="50px" height="36px" />
                            <div style={{ height: '4px' }} />
                            <Skeleton width="100px" height="16px" />
                        </div>
                    ))}
                </div>

                <div className="sd-columns">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1.5 }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="sd-card">
                                <div className="sd-card-header">
                                    <Skeleton width="150px" height="24px" />
                                    <Skeleton width="80px" height="14px" />
                                </div>
                                <div className="sd-card-body">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Skeleton width="4px" height="40px" />
                                            <div style={{ flex: 1 }}>
                                                <Skeleton width="200px" height="18px" />
                                                <div style={{ height: '4px' }} />
                                                <Skeleton width="150px" height="14px" />
                                            </div>
                                            <Skeleton width="60px" height="24px" borderRadius="12px" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                        <div className="sd-card">
                            <div className="sd-card-header">
                                <Skeleton width="120px" height="20px" />
                            </div>
                            <div className="sd-actions-grid">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} width="100%" height="80px" borderRadius="16px" />
                                ))}
                            </div>
                        </div>
                        <div className="sd-card">
                            <div className="sd-card-header">
                                <Skeleton width="140px" height="20px" />
                            </div>
                            <div className="sd-card-body">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <Skeleton width="80px" height="14px" />
                                            <Skeleton width="30px" height="14px" />
                                        </div>
                                        <Skeleton width="100%" height="8px" borderRadius="10px" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sd-root">
            {/* ── Banner ── */}
            <div className="sd-banner">
                <div className="sd-banner-left">
                    <div className="sd-greeting">Overview</div>
                    <h1 className="sd-banner-name">Hello, {user?.fullName?.split(' ')[0] || 'Sales'}</h1>
                    <p className="sd-banner-sub">Here is what's happening with your pipeline today.</p>
                </div>
                <div className="sd-banner-right">
                    <div className="sd-date-badge">
                        <Clock size={14} />
                        {today.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    {closedThisMonth.length > 0 && (
                        <div className="sd-streak">🔥 {closedThisMonth.length} deals closed this month!</div>
                    )}
                </div>
            </div>

            {/* ── KPIs ── */}
            <div className="sd-kpi-row">
                {kpiData.map((kpi, i) => (
                    <div key={i} className="sd-kpi-card" style={{ '--c': kpi.c }}>
                        <div className="sd-kpi-header">
                            <div className="sd-kpi-icon"><kpi.icon size={18} /></div>
                            {kpi.chip && (
                                <span className={`sd-kpi-chip ${kpi.chipClass || 'up'}`}>{kpi.chip}</span>
                            )}
                        </div>
                        <div className="sd-kpi-val">{kpi.val}</div>
                        <div className="sd-kpi-lbl">{kpi.lbl}</div>
                    </div>
                ))}
            </div>

            {/* ── Two Column Layout ── */}
            <div className="sd-columns">
                
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Action Center preview */}
                    <div className="sd-card">
                        <div className="sd-card-header">
                            <div className="sd-card-title">
                                <div className="sd-card-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
                                    <Target size={18} />
                                </div>
                                <span className="sd-card-label">Action Center</span>
                                <span className="sd-card-count">{hotLeads.length + dueToday.length}</span>
                            </div>
                            <button className="sd-link-btn" onClick={() => navigate('/staff/tasks')}>Go to Pipeline</button>
                        </div>
                        <div className="sd-card-body" style={{ padding: '0.75rem 1rem 1rem' }}>
                            {hotLeads.length === 0 && dueToday.length === 0 ? (
                                <div className="sd-empty">
                                    <CheckCircle size={28} />
                                    <div>All caught up! No urgent tasks pending.</div>
                                </div>
                            ) : (
                                [...hotLeads, ...dueToday].slice(0, 5).map(task => {
                                    const prio = task.priority?.toLowerCase() || 'low';
                                    return (
                                        <div key={task._id} className="sd-task-row" onClick={() => navigate('/staff/tasks')}>
                                            <div className="sd-task-accent" style={{ background: prio === 'high' || prio === 'critical' ? '#ef4444' : '#f59e0b' }} />
                                            <div className="sd-task-body">
                                                <div className="sd-task-name">{task.title}</div>
                                                <div className="sd-task-sub">{task.client?.name || task.quotation?.projectName || 'No client linked'}</div>
                                            </div>
                                            <div className="sd-task-right">
                                                <span className={`sd-prio-pill ${prio}`}>{task.priority}</span>
                                                <span className="sd-due-chip overdue">
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                            <ChevronRight size={16} color="#cbd5e1" style={{ marginLeft: 4 }} />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Pending Approvals (Manager) */}
                    {isManager && (
                        <div className="sd-card">
                            <div className="sd-card-header">
                                <div className="sd-card-title">
                                    <div className="sd-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                                        <Eye size={18} />
                                    </div>
                                    <span className="sd-card-label">Design Approvals</span>
                                    <span className="sd-card-count" style={{ background: '#fef3c7', color: '#d97706' }}>{pendingApprovals.length}</span>
                                </div>
                            </div>
                            <div className="sd-card-body">
                                {pendingApprovals.length === 0 ? (
                                    <div className="sd-empty">
                                        <CheckCircle size={28} />
                                        <div>No designs waiting for review.</div>
                                    </div>
                                ) : (
                                    pendingApprovals.slice(0, 3).map(task => (
                                        <div key={task._id} className="sd-approval-item">
                                            <div className="sd-approval-info">
                                                <div className="sd-approval-title">{task.title}</div>
                                                <div className="sd-approval-sub">
                                                    Assigned: {task.assignedTo?.map(s => s.name).join(', ') || 'Team'}
                                                </div>
                                            </div>
                                            <div className="sd-approval-btns">
                                                <button className="sd-appr-btn approve" onClick={() => setSelectedApproval(task)}>Review</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recent Site Visits */}
                    <div className="sd-card">
                        <div className="sd-card-header">
                            <div className="sd-card-title">
                                <div className="sd-card-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>
                                    <MapPin size={18} />
                                </div>
                                <span className="sd-card-label">Recent Site Visits</span>
                            </div>
                            <button className="sd-link-btn" onClick={() => navigate('/staff/site-visits')}>Log Visit</button>
                        </div>
                        <div className="sd-visits-grid">
                            {visits.length === 0 ? (
                                <div className="sd-empty" style={{ gridColumn: '1/-1' }}>No recent site visits.</div>
                            ) : (
                                visits.slice(0, 3).map(v => (
                                    <div key={v._id} className="sd-visit-card" onClick={() => navigate('/staff/site-visits')}>
                                        <div className="sd-visit-img-wrap">
                                            {v.images?.length > 0 ? (
                                                <>
                                                    <img src={`${BASE_IMAGE_URL}${v.images[0]}`} alt="Site" />
                                                    <div className="sd-visit-photo-count">+{v.images.length}</div>
                                                </>
                                            ) : (
                                                <div className="sd-visit-no-img">No Photo</div>
                                            )}
                                        </div>
                                        <div className="sd-visit-info">
                                            <div className="sd-visit-name">{v.client?.name || 'Site Visit'}</div>
                                            <div className="sd-visit-date">{new Date(v.visitDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Quick Actions */}
                    <div className="sd-card">
                        <div className="sd-card-header">
                            <span className="sd-card-label">Quick Actions</span>
                        </div>
                        <div className="sd-actions-grid">
                            <button className="sd-action-btn" style={{ '--ac': '#6366f1' }} onClick={() => navigate('/staff/tasks')}>
                                <Target size={22} /> Add Lead
                            </button>
                            <button className="sd-action-btn" style={{ '--ac': '#10b981' }} onClick={() => navigate('/staff/clients')}>
                                <Users size={22} /> Add Client
                            </button>
                            <button className="sd-action-btn" style={{ '--ac': '#f59e0b' }} onClick={() => navigate('/staff/site-visits')}>
                                <MapPin size={22} /> Log Visit
                            </button>
                            <button className="sd-action-btn" style={{ '--ac': '#8b5cf6' }} onClick={() => navigate('/staff/quotations/new')}>
                                <FileText size={22} /> Quote
                            </button>
                        </div>
                    </div>

                    {/* Pipeline Funnel */}
                    <div className="sd-card">
                        <div className="sd-card-header">
                            <span className="sd-card-label">Pipeline Health</span>
                        </div>
                        <div className="sd-pipeline-list">
                            {pipeline.map(p => (
                                <div key={p.label} className="sd-pipeline-row">
                                    <div className="sd-pl-dot" style={{ background: `hsl(${220 - (p.pct/100)*100}, 80%, 60%)` }} />
                                    <div className="sd-pl-label">{p.label}</div>
                                    <div className="sd-pl-bar-wrap">
                                        <div className="sd-pl-bar" style={{ 
                                            width: `${maxStage ? (p.count / maxStage) * 100 : 0}%`,
                                            background: `linear-gradient(90deg, hsl(${220 - (p.pct/100)*100}, 80%, 60%), hsl(${220 - (p.pct/100)*100}, 80%, 75%))`
                                        }} />
                                    </div>
                                    <div className="sd-pl-count">{p.count}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="sd-card" style={{ flex: 1 }}>
                        <div className="sd-card-header">
                            <span className="sd-card-label">Recent Activity</span>
                        </div>
                        <div className="sd-card-body">
                            <div className="sd-activity-feed">
                                {visits.slice(0, 2).map(v => (
                                    <div key={`v-${v._id}`} className="sd-act-item">
                                        <div className="sd-act-dot" style={{ background: '#10b981' }} />
                                        <div className="sd-act-body">
                                            <div className="sd-act-title"><strong>Site Visit</strong> logged for {v.client?.name || 'Client'}</div>
                                            <div className="sd-act-time">{new Date(v.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                                {tasks.slice(0, 3).map(t => (
                                    <div key={`t-${t._id}`} className="sd-act-item">
                                        <div className="sd-act-dot" style={{ background: '#6366f1' }} />
                                        <div className="sd-act-body">
                                            <div className="sd-act-title"><strong>Task Updated:</strong> {t.title}</div>
                                            <div className="sd-act-time">{new Date(t.updatedAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Approval Modal ── */}
            {selectedApproval && (
                <div className="sd-modal-overlay">
                    <div className="sd-modal-box">
                        <button className="sd-modal-close" onClick={() => setSelectedApproval(null)}><LogOut size={16} /></button>
                        
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <div style={{ background: '#6366f1', color: 'white', padding: '10px', borderRadius: '14px' }}><Eye size={24} /></div>
                                <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>{selectedApproval.title}</h2>
                            </div>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Review the design files and item list before presenting to client.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Image size={18} color="#6366f1" /> Design Assets</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {selectedApproval.submissions?.[selectedApproval.submissions.length - 1]?.files?.map((file, i) => {
                                        const isImg = file.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                        return (
                                            <div key={i} style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                                {isImg ? (
                                                    <div style={{ height: '140px', background: '#eee' }}>
                                                        <img src={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ) : (
                                                    <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0' }}><FileText size={40} color="#64748b" /></div>
                                                )}
                                                <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name || `File ${i+1}`}</span>
                                                    <a href={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}><ExternalLink size={16} /></a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {!selectedApproval.submissions?.[selectedApproval.submissions.length - 1]?.files?.length && (
                                        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>No files attached.</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div style={{ background: '#f1f5f9', borderRadius: '20px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} color="#6366f1" /> Designer Notes</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>{selectedApproval.submissions?.[selectedApproval.submissions.length - 1]?.designerNotes || 'No notes provided.'}</p>
                                </div>

                                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.25rem' }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={16} color="#6366f1" /> Item Specs</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {selectedApproval.submissions?.[selectedApproval.submissions.length - 1]?.designItems?.map((item, i) => (
                                            <div key={i} style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.8rem', color: '#1e293b' }}>
                                                    <span>{item.name}</span>
                                                    <span style={{ color: '#6366f1' }}>{item.quantity} {item.unit}</span>
                                                </div>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>Size: {item.size || 'N/A'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setSelectedApproval(null)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                            <button onClick={() => handleApproval(selectedApproval._id, false)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 700, cursor: 'pointer' }}>Revise</button>
                            <button onClick={() => handleApproval(selectedApproval._id, true)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#10b981', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Approve Design</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesDashboard;
