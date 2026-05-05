import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, Search, Loader, Calendar, Briefcase,
    Plus, Phone, FileText, RefreshCw, Users,
    TrendingUp, AlertTriangle, Clock, CheckCircle, Zap
} from 'lucide-react';
import { taskAPI } from '../../models/api';
import { getRoleDepartment } from '../../controllers/hooks/useRoleDashboard';
import './css/SalesTasks.css';

/* ─── Pipeline stage config ──────────────────────────────────────────────── */
const STAGES = [
    { key: 'All',              label: 'All Tasks',        color: '#6366f1', bg: '#eef2ff' },
    { key: 'New Leads',        label: 'New Leads',         color: '#8b5cf6', bg: '#f5f3ff' },
    { key: 'Design Approvals', label: 'Design Approvals',  color: '#d946ef', bg: '#fdf4ff' },
    { key: 'Follow-Up',        label: 'Follow-Ups',        color: '#0ea5e9', bg: '#f0f9ff' },
    { key: 'Site Visits',      label: 'Site Visits',       color: '#f59e0b', bg: '#fffbeb' },
    { key: 'Quotations',       label: 'Quotations',        color: '#10b981', bg: '#ecfdf5' },
    { key: 'Negotiations',     label: 'Negotiations',      color: '#ef4444', bg: '#fef2f2' },
    { key: 'Closed',           label: 'Closed Deals',      color: '#64748b', bg: '#f8fafc' },
];

const mapStatusToStage = (status) => {
    if (!status) return 'Follow-Up';
    const s = status.toLowerCase();
    if (s.includes('lead'))        return 'New Leads';
    if (s.includes('visit'))       return 'Site Visits';
    if (s.includes('quot'))        return 'Quotations';
    if (s.includes('negotiat'))    return 'Negotiations';
    if (s.includes('sales review') || s.includes('client approval') || s.includes('admin approved')) return 'Design Approvals';
    if (s === 'completed' || s.includes('closed')) return 'Closed';
    return 'Follow-Up';
};

const getDeadlineChip = (dueDate) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diff = Math.floor((due - today) / 86400000);
    if (diff < 0)  return { cls: 'overdue',  label: `${Math.abs(diff)}d overdue` };
    if (diff === 0) return { cls: 'today',   label: 'Due today' };
    return { cls: 'upcoming', label: due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) };
};

/* ─── SalesTasks Component ───────────────────────────────────────────────── */
const SalesTasks = ({ user }) => {
    const [tasks, setTasks]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [activeStage, setActiveStage] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy]         = useState('deadline');
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();

    const isSalesManager = user?.role?.toLowerCase().includes('manager');

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await taskAPI.getAll({ includeSalesReview: 'true' });
            if (res.success) setTasks(res.data);
        } catch (err) {
            console.error('Failed to load tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    /* ── Derived data ── */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isOverdue   = (t) => t.dueDate && new Date(t.dueDate) < today && t.status !== 'Completed';
    const isDueToday  = (t) => { const d = new Date(t.dueDate); d.setHours(0,0,0,0); return t.dueDate && d.getTime() === today.getTime(); };
    const isHighPrio  = (t) => ['High','Critical'].includes(t.priority);

    const kpiData = [
        {
            label: 'Total Tasks',
            value: tasks.length,
            icon: Target,
            accent: '#6366f1',
            trend: null,
        },
        {
            label: 'Overdue',
            value: tasks.filter(isOverdue).length,
            icon: AlertTriangle,
            accent: '#ef4444',
            trend: 'down',
            trendLabel: 'Needs action',
        },
        {
            label: 'Due Today',
            value: tasks.filter(isDueToday).length,
            icon: Clock,
            accent: '#f59e0b',
            trend: 'warn',
            trendLabel: "Today's focus",
        },
        {
            label: 'High Priority',
            value: tasks.filter(isHighPrio).length,
            icon: Zap,
            accent: '#8b5cf6',
            trend: null,
        },
    ];

    const stageCountMap = STAGES.reduce((acc, s) => {
        acc[s.key] = s.key === 'All'
            ? tasks.length
            : tasks.filter(t => mapStatusToStage(t.status) === s.key).length;
        return acc;
    }, {});

    /* ── Filtering + sorting ── */
    const filtered = tasks
        .filter(t => {
            const stage = mapStatusToStage(t.status);
            const matchStage = activeStage === 'All' || stage === activeStage;
            const q = searchTerm.toLowerCase();
            const matchSearch = !q ||
                t.title?.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.quotation?.projectName?.toLowerCase().includes(q);
            return matchStage && matchSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'deadline') {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            if (sortBy === 'priority') {
                const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
            }
            if (sortBy === 'progress') return (a.progress || 0) - (b.progress || 0);
            return 0;
        });

    /* ── Handlers ── */
    const handleSalesReview = async (taskId, approved) => {
        try {
            const notes = window.prompt(approved ? 'Approval notes (optional):' : 'Rejection reason:');
            if (!approved && !notes) { alert('Rejection reason is required'); return; }
            setUpdatingId(taskId);
            const res = await taskAPI.salesApprove(taskId, { approved, salesNotes: notes });
            if (res.success) {
                alert(approved ? 'Approved!' : 'Sent back for revision');
                fetchTasks();
            }
        } catch (err) {
            alert('Action failed: ' + err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    /* ── Render ── */
    if (loading) {
        return (
            <div className="st-sales-container">
                <div className="st-sales-loading">
                    <Loader size={36} className="spinner" color="#6366f1" />
                    <span>Loading your Action Center…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="st-sales-container">
            <div className="st-sales-wrapper">

                {/* Quick actions */}
                <div className="st-sales-quick-bar">
                    <button className="st-sales-quick-btn primary">
                        <Plus size={14} /> Add Lead
                    </button>
                    <button className="st-sales-quick-btn secondary">
                        <Phone size={14} /> Schedule Call
                    </button>
                    <button className="st-sales-quick-btn secondary">
                        <FileText size={14} /> Send Quote
                    </button>
                    <button className="st-sales-quick-btn secondary" onClick={fetchTasks}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="st-sales-kpi-grid">
                    {kpiData.map(kpi => (
                        <div
                            key={kpi.label}
                            className="st-sales-kpi-card"
                            style={{ '--kpi-accent': kpi.accent }}
                        >
                            <div className="st-kpi-top">
                                <div className="st-kpi-icon">
                                    <kpi.icon size={17} />
                                </div>
                                {kpi.trendLabel && (
                                    <span className={`st-kpi-trend ${kpi.trend}`}>{kpi.trendLabel}</span>
                                )}
                            </div>
                            <div className="st-kpi-value">{kpi.value}</div>
                            <div className="st-kpi-label">{kpi.label}</div>
                        </div>
                    ))}
                </div>

                {/* Manager team strip */}
                {isSalesManager && (
                    <div className="st-sales-team-strip">
                        <div className="st-team-strip-stat">
                            <div className="st-team-strip-title">Team Tasks</div>
                            <div className="st-team-strip-val">{tasks.length}</div>
                        </div>
                        <div className="st-team-strip-divider" />
                        <div className="st-team-strip-stat">
                            <div className="st-team-strip-title">Pending Review</div>
                            <div className="st-team-strip-val">
                                {tasks.filter(t => t.status === 'Pending Sales Review').length}
                            </div>
                        </div>
                        <div className="st-team-strip-divider" />
                        <div className="st-team-strip-stat">
                            <div className="st-team-strip-title">Closed This Month</div>
                            <div className="st-team-strip-val">
                                {tasks.filter(t => t.status === 'Completed').length}
                            </div>
                        </div>
                        <div className="st-team-strip-divider" />
                        <div className="st-team-strip-stat">
                            <div className="st-team-strip-title">Hot Leads</div>
                            <div className="st-team-strip-val">
                                {tasks.filter(isHighPrio).length}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stage tabs */}
                <div className="st-sales-tabs-bar">
                    {STAGES.map(stage => (
                        <button
                            key={stage.key}
                            className={`st-sales-tab ${activeStage === stage.key ? 'active' : ''}`}
                            onClick={() => setActiveStage(stage.key)}
                        >
                            {stage.label}
                            <span className="st-sales-tab-count">
                                {stageCountMap[stage.key] ?? 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="st-sales-controls">
                    <div className="st-sales-search-wrap">
                        <Search size={15} className="st-sales-search-icon" />
                        <input
                            type="text"
                            className="st-sales-search"
                            placeholder="Search tasks, clients, projects…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="st-sales-sort-select"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                    >
                        <option value="deadline">Sort: Deadline</option>
                        <option value="priority">Sort: Priority</option>
                        <option value="progress">Sort: Progress</option>
                    </select>
                </div>

                {/* Task Cards */}
                {filtered.length === 0 ? (
                    <div className="st-sales-empty">
                        <div className="st-sales-empty-icon">
                            <Target size={26} />
                        </div>
                        <h3>No tasks found</h3>
                        <p>Try a different stage or search term.</p>
                    </div>
                ) : (
                    <div className="st-sales-cards-grid">
                        {filtered.map(task => {
                            const stage = STAGES.find(s => s.key === mapStatusToStage(task.status)) || STAGES[0];
                            const deadline = getDeadlineChip(task.dueDate);
                            const prio = task.priority?.toLowerCase() || 'low';
                            const isPendingReview = task.status === 'Pending Sales Review';

                            return (
                                <div
                                    key={task._id}
                                    className="st-sales-task-card"
                                    style={{ 
                                        '--stage-color': stage.color, 
                                        '--stage-bg': stage.bg,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        if (task.project?._id) {
                                            navigate(`/staff/projects/${task.project._id}`);
                                        } else if (task.quotation?._id) {
                                            navigate(`/staff/quotations/view/${task.quotation._id}`);
                                        } else {
                                            setSelectedTask(task);
                                        }
                                    }}
                                >
                                    {/* Top badges row */}
                                    <div className="st-card-top">
                                        <div className="st-card-badges">
                                            <span
                                                className="st-stage-badge"
                                                style={{ '--stage-color': stage.color, '--stage-bg': stage.bg }}
                                            >
                                                {stage.label}
                                            </span>
                                            <span className={`st-priority-pill ${prio}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        {deadline && (
                                            <span className={`st-deadline-chip ${deadline.cls}`}>
                                                <Calendar size={11} />
                                                {deadline.label}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title + desc */}
                                    <div>
                                        <p className="st-card-title">{task.title}</p>
                                        {task.description && (
                                            <p className="st-card-desc">{task.description}</p>
                                        )}
                                    </div>

                                    {/* Meta */}
                                    <div className="st-card-meta">
                                        {task.quotation?.projectName && (
                                            <span className="st-card-meta-item">
                                                <Briefcase size={12} />
                                                {task.quotation.projectName}
                                            </span>
                                        )}
                                        {isSalesManager && task.assignedTo && (
                                            <span className="st-card-meta-item">
                                                <Users size={12} />
                                                {task.assignedTo?.fullName || 'Unassigned'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="st-card-progress-row">
                                        <div className="st-card-prog-bar">
                                            <div
                                                className="st-card-prog-fill"
                                                style={{ width: `${task.progress || 0}%` }}
                                            />
                                        </div>
                                        <span className="st-card-prog-pct">{task.progress || 0}%</span>
                                    </div>

                                    {/* Sales review actions (Client & Sales Approval) */}
                                    {isPendingReview && (
                                        <div className="st-card-actions">
                                            <button
                                                className="st-action-btn approve"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSalesReview(task._id, true);
                                                }}
                                                disabled={updatingId === task._id}
                                            >
                                                {updatingId === task._id
                                                    ? <Loader size={12} className="spinner" />
                                                    : <><CheckCircle size={12} /> Approve Design</>
                                                }
                                            </button>
                                            <button
                                                className="st-action-btn reject"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSalesReview(task._id, false);
                                                }}
                                                disabled={updatingId === task._id}
                                            >
                                                Revise
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedTask && (
                <div className="st-sales-modal-overlay" onClick={() => setSelectedTask(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="st-sales-modal-content" onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Task Details</h2>
                            <button onClick={() => setSelectedTask(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#64748b' }}>&times;</button>
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Title</label>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: '#1e293b' }}>{selectedTask.title}</p>
                            </div>
                            {selectedTask.description && (
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Description</label>
                                    <p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '0.95rem' }}>{selectedTask.description}</p>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</label>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>{selectedTask.status}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Priority</label>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>{selectedTask.priority}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Deadline</label>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Progress</label>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>{selectedTask.progress || 0}%</p>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                                <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
                                This is a general task not linked to any specific Project or Quotation.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesTasks;
