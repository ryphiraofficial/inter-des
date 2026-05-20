import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    ClipboardCheck, Search, Eye, Loader, CheckCircle, 
    AlertCircle, MessageSquare, Briefcase, Calendar, X 
} from 'lucide-react';
import { taskAPI } from '../../models/api';
import DesignPreviewModal from './components/DesignPreviewModal';
import CustomSelect from './components/CustomSelect';
import './css/SalesTasks.css';
import './css/SalesApprovals.css';

const SalesApprovals = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [priorityFilter, setPriorityFilter] = useState('');
    
    // Interactive feedback modal state
    const [actionTask, setActionTask] = useState(null); 
    const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
    const [salesNotes, setSalesNotes] = useState('');
    const [submittingAction, setSubmittingAction] = useState(false);

    // Preview modal state
    const [previewTask, setPreviewTask] = useState(null);

    const searchTerm = searchParams.get('q') || '';

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await taskAPI.getAll();
            if (res.success) {
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

    const criticalCount = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length;

    return (
        <div className="st-tasks-container">
            <div className="st-tasks-wrapper">
                
                {/* ── Statistics Summary Grid (Same layout as other pages) ── */}
                <div className="st-stats-grid">
                    <div className="st-stat-card">
                        <div className="st-stat-info">
                            <span className="st-stat-label">Pending Review</span>
                            <span className="st-stat-value">{loading ? '...' : tasks.length}</span>
                        </div>
                    </div>
                    <div className="st-stat-card">
                        <div className="st-stat-info">
                            <span className="st-stat-label">High Priority</span>
                            <span className="st-stat-value">{loading ? '...' : criticalCount}</span>
                        </div>
                    </div>
                    <div className="st-stat-card">
                        <div className="st-stat-info">
                            <span className="st-stat-label">Action Required</span>
                            <span className="st-stat-value">{loading ? '...' : filteredTasks.length}</span>
                        </div>
                    </div>
                </div>

                {/* ── Filter Controls (Same theme & structure) ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <CustomSelect
                        variant="filter"
                        options={[
                            { value: '', label: 'All Priorities' },
                            { value: 'Critical', label: 'Critical' },
                            { value: 'High', label: 'High' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'Low', label: 'Low' }
                        ]}
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        placeholder="All Priorities"
                        name="priority"
                        searchable={false}
                    />
                </div>

                {/* ── Client Approvals Grid ── */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader className="spinner" size={40} />
                    </div>
                ) : filteredTasks.length > 0 ? (
                    <div className="st-tasks-grid">
                        {filteredTasks.map(task => {
                            const designerName = task.assignedTo?.map(s => s.name).join(', ') || 'Design Team';
                            const designerInitials = designerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                            
                            return (
                                <div key={task._id} className="st-task-card">
                                    <div className="st-task-card-header">
                                        <h3 className="st-task-title">{task.title}</h3>
                                        <span className={`st-priority-badge st-priority-${task.priority?.toLowerCase()}`}>
                                            {task.priority || 'Medium'}
                                        </span>
                                    </div>
                                    
                                    <div className="st-task-card-meta">
                                        <div className="st-meta-item">
                                            <Briefcase size={14} />
                                            <span>{task.project?.projectName || task.quotation?.projectName || 'Interior Project'}</span>
                                        </div>
                                        <div className="st-meta-item">
                                            <Calendar size={14} />
                                            <span>Deadline: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>

                                    {task.submissions?.[task.submissions.length - 1]?.designerNotes && (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#f8fafc', padding: '12px', borderRadius: '12px', marginTop: '4px' }}>
                                            <MessageSquare size={14} style={{ marginTop: '2px', flexShrink: 0, color: '#6366f1' }} />
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                                                {task.submissions[task.submissions.length - 1].designerNotes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="designer-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto' }}>
                                        <div className="designer-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', fontWeight: '600', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {designerInitials}
                                        </div>
                                        <div className="designer-name-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Designer</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{designerName}</span>
                                        </div>
                                    </div>

                                    <div className="st-task-card-footer" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                        <button 
                                            className="st-btn-action approve"
                                            style={{ background: '#f1f5f9', color: '#475569' }}
                                            onClick={() => setPreviewTask(task)}
                                        >
                                            Preview
                                        </button>
                                        <button 
                                            className="st-btn-action reject"
                                            onClick={() => triggerAction(task, 'reject')}
                                        >
                                            Revise
                                        </button>
                                        <button 
                                            className="st-btn-action approve"
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

            </div>

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
                                className="st-btn-action approve"
                                style={{ background: '#f1f5f9', color: '#475569', flex: 'none', width: '100px' }}
                                onClick={() => { setActionTask(null); setActionType(null); }}
                                disabled={submittingAction}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className={actionType === 'approve' ? 'st-btn-action approve' : 'st-btn-action reject'}
                                style={{ flex: 1 }}
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
