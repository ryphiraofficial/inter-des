import React, { useState, useEffect } from 'react';
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
    { key: 'All',          label: 'All Tasks',      color: '#6366f1', bg: '#eef2ff' },
    { key: 'New Leads',    label: 'New Leads',       color: '#8b5cf6', bg: '#f5f3ff' },
    { key: 'Follow-Up',    label: 'Follow-Ups',      color: '#0ea5e9', bg: '#f0f9ff' },
    { key: 'Site Visits',  label: 'Site Visits',     color: '#f59e0b', bg: '#fffbeb' },
    { key: 'Quotations',   label: 'Quotations',      color: '#10b981', bg: '#ecfdf5' },
    { key: 'Negotiations', label: 'Negotiations',    color: '#ef4444', bg: '#fef2f2' },
    { key: 'Closed',       label: 'Closed Deals',    color: '#64748b', bg: '#f8fafc' },
];

const mapStatusToStage = (status) => {
    if (!status) return 'Follow-Up';
    const s = status.toLowerCase();
    if (s.includes('lead'))        return 'New Leads';
    if (s.includes('visit'))       return 'Site Visits';
    if (s.includes('quot'))        return 'Quotations';
    if (s.includes('negotiat'))    return 'Negotiations';
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

    const isSalesManager = user?.role?.toLowerCase().includes('manager');

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await taskAPI.getAll();
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
                                    style={{ '--stage-color': stage.color, '--stage-bg': stage.bg }}
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

                                    {/* Manager review actions */}
                                    {isSalesManager && isPendingReview && (
                                        <div className="st-card-actions">
                                            <button
                                                className="st-action-btn approve"
                                                onClick={() => handleSalesReview(task._id, true)}
                                                disabled={updatingId === task._id}
                                            >
                                                {updatingId === task._id
                                                    ? <Loader size={12} className="spinner" />
                                                    : <><CheckCircle size={12} /> Approve</>
                                                }
                                            </button>
                                            <button
                                                className="st-action-btn reject"
                                                onClick={() => handleSalesReview(task._id, false)}
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
        </div>
    );
};

export default SalesTasks;
