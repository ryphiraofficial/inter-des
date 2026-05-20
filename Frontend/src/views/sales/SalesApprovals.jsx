import React, { useState, useEffect, useCallback } from 'react';
import { 
    ClipboardCheck, Search, Filter, Eye, Loader, CheckCircle, 
    AlertCircle, MessageSquare, User, Calendar, X 
} from 'lucide-react';
import { taskAPI } from '../../models/api';
import DesignPreviewModal from './components/DesignPreviewModal';
import './css/SalesApprovals.css';

const SalesApprovals = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    
    // Interactive feedback modal state
    const [actionTask, setActionTask] = useState(null); // The task currently being approved/rejected
    const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
    const [salesNotes, setSalesNotes] = useState('');
    const [submittingAction, setSubmittingAction] = useState(false);

    // Preview modal state
    const [previewTask, setPreviewTask] = useState(null);

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await taskAPI.getAll();
            if (res.success) {
                // Filter only designs ready for client review
                const pendingReviews = res.data.filter(t => t.status === 'Pending Sales Review');
                setTasks(pendingReviews);
            }
        } catch (error) {
            console.error('Error loading client approvals:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    // Handle Search & Filter logic
    const filteredTasks = tasks.filter(task => {
        const titleMatch = task.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const projectMatch = (task.project?.projectName || task.quotation?.projectName || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        
        const matchesSearch = titleMatch || projectMatch;
        const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
        
        return matchesSearch && matchesPriority;
    });

    const triggerAction = (task, type) => {
        setActionTask(task);
        setActionType(type);
        setSalesNotes('');
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        if (!actionTask || !actionType) return;
        
        if (actionType === 'reject' && !salesNotes.trim()) {
            alert('Please provide feedback notes explaining the reason for the revision request.');
            return;
        }

        try {
            setSubmittingAction(true);
            const approved = actionType === 'approve';
            const res = await taskAPI.salesApprove(actionTask._id, { 
                approved, 
                salesNotes: salesNotes.trim() 
            });

            if (res.success) {
                setActionTask(null);
                setActionType(null);
                setSalesNotes('');
                loadTasks();
            } else {
                alert(res.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error reviewing design:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmittingAction(false);
        }
    };

    // Priority configuration helper
    const getPriorityClass = (priority) => {
        const mapping = {
            'Critical': 'priority-critical',
            'High': 'priority-high',
            'Medium': 'priority-medium',
            'Low': 'priority-low'
        };
        return mapping[priority] || 'priority-medium';
    };

    const criticalCount = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length;

    return (
        <div className="approvals-page-container">
            
            {/* ── Statistics Summary ── */}
            <div className="approvals-stats-banner">
                <div className="stat-box">
                    <div className="stat-icon primary">
                        <ClipboardCheck size={24} />
                    </div>
                    <div className="stat-info">
                        <h4>Pending Review</h4>
                        <p>{loading ? '...' : tasks.length}</p>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon warning">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h4>High Priority</h4>
                        <p>{loading ? '...' : criticalCount}</p>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon success">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h4>Action Required</h4>
                        <p>{loading ? '...' : filteredTasks.length}</p>
                    </div>
                </div>
            </div>

            {/* ── Search & Filters ── */}
            <div className="approvals-filter-bar">
                <div className="filter-left">
                    <div className="search-input-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by client, title, or project..."
                            className="approvals-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="filter-right">
                    <select
                        className="filter-select"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {/* ── Approvals Content ── */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader className="spinner" size={40} color="#6366f1" />
                </div>
            ) : filteredTasks.length > 0 ? (
                <div className="approvals-grid">
                    {filteredTasks.map(task => {
                        const designerName = task.assignedTo?.map(s => s.name).join(', ') || 'Design Team';
                        const designerInitials = designerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                        
                        return (
                            <div key={task._id} className="approval-card">
                                <span className={`card-header-badge ${getPriorityClass(task.priority)}`}>
                                    {task.priority || 'Medium'}
                                </span>
                                
                                <div className="card-body">
                                    <h3 className="card-title">{task.title}</h3>
                                    
                                    <div className="project-name-badge">
                                        {task.project?.projectName || task.quotation?.projectName || 'Interior Project'}
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} />
                                            <span>Deadline: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        {task.submissions?.[task.submissions.length - 1]?.designerNotes && (
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', background: '#f8fafc', padding: '10px', borderRadius: '10px', marginTop: '6px' }}>
                                                <MessageSquare size={14} style={{ marginTop: '2px', flexShrink: 0, color: '#6366f1' }} />
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                                                    {task.submissions[task.submissions.length - 1].designerNotes}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="designer-section">
                                        <div className="designer-avatar">{designerInitials}</div>
                                        <div className="designer-name-details">
                                            <span className="designer-label">Designer</span>
                                            <span className="designer-val">{designerName}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer-actions">
                                    <button 
                                        className="btn-action-ghost"
                                        onClick={() => setPreviewTask(task)}
                                    >
                                        <Eye size={16} /> Preview
                                    </button>
                                    <button 
                                        className="btn-action-reject"
                                        onClick={() => triggerAction(task, 'reject')}
                                    >
                                        Revise
                                    </button>
                                    <button 
                                        className="btn-action-approve"
                                        onClick={() => triggerAction(task, 'approve')}
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="approvals-empty">
                    <div className="approvals-empty-icon">
                        <ClipboardCheck size={40} />
                    </div>
                    <h3>No Client Approvals Found</h3>
                    <p>All submitted designs have been reviewed or matched no filters. Check back later when designers upload new concepts.</p>
                </div>
            )}

            {/* ── CUSTOM DECISION POPUP/MODAL ── */}
            {actionTask && actionType && (
                <div className="local-feedback-overlay">
                    <form className="local-feedback-card" onSubmit={handleActionSubmit}>
                        <div className="feedback-header">
                            <h3>{actionType === 'approve' ? 'Approve Concept Design' : 'Request Design Revision'}</h3>
                            <button 
                                type="button" 
                                className="btn-close-feedback"
                                onClick={() => { setActionTask(null); setActionType(null); }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="feedback-input-group">
                            <label>
                                {actionType === 'approve' 
                                    ? 'Add optional presentation or coordination notes for the Design Manager:' 
                                    : 'Provide mandatory revision reasons or client feedback details:'}
                            </label>
                            <textarea
                                className="feedback-textarea"
                                placeholder={actionType === 'approve' 
                                    ? 'E.g., Client approved color scheme, wants to finalise wardrobe material choice...' 
                                    : 'E.g., Client rejected the current wooden layout. Please change to matte white finishes and relocate the vanity unit...'}
                                value={salesNotes}
                                onChange={(e) => setSalesNotes(e.target.value)}
                                required={actionType === 'reject'}
                            />
                        </div>

                        <div className="feedback-actions">
                            <button 
                                type="button" 
                                className="btn-action-ghost"
                                onClick={() => { setActionTask(null); setActionType(null); }}
                                disabled={submittingAction}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className={actionType === 'approve' ? 'btn-action-approve' : 'btn-action-reject'}
                                disabled={submittingAction}
                            >
                                {submittingAction 
                                    ? 'Submitting...' 
                                    : actionType === 'approve' 
                                        ? 'Approve & Submit' 
                                        : 'Request Revision'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── DESIGN PREVIEW MODAL ── */}
            {previewTask && (
                <DesignPreviewModal 
                    selectedTask={previewTask}
                    onClose={() => setPreviewTask(null)}
                />
            )}

        </div>
    );
};

export default SalesApprovals;
