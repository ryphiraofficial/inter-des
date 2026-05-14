import React, { useState, useEffect } from 'react';
import {
    Search,
    Calendar,
    Clock,
    User,
    Briefcase,
    LayoutGrid,
    List as ListIcon,
    ChevronDown,
    Edit
} from 'lucide-react';
import { taskAPI } from '../../models/api';
import { getRoleDepartment } from '../../controllers/hooks/useRoleDashboard';

import SalesCollectionQueue from './components/SalesCollectionQueue';
import Skeleton from './components/Skeleton';
import './css/SalesTasks.css';

const SalesTasks = ({ user, forceTable = false }) => {
    const department = getRoleDepartment(user?.role);

    if (department === 'Accounts' && !forceTable) return <SalesCollectionQueue user={user} />;
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [updatingTaskId, setUpdatingTaskId] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getAll();
            if (response.success) {
                setTasks(response.data);
            }
        } catch (err) {
            console.error('Failed to load tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSalesReview = async (taskId, approved) => {
        try {
            const notes = prompt(approved ? 'Add approval notes (optional):' : 'Reason for rejection:');
            if (!approved && !notes) {
                alert('Rejection reason is required');
                return;
            }
            
            setUpdatingTaskId(taskId);
            const response = await taskAPI.salesApprove(taskId, { approved, salesNotes: notes });
            if (response.success) {
                alert(approved ? 'Design approved successfully!' : 'Design sent back for revision');
                fetchTasks();
            }
        } catch (err) {
            console.error('Failed to review:', err);
            alert('Action failed: ' + err.message);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        Total: tasks.length,
        'To Do': tasks.filter(t => t.status === 'To Do').length,
        'In Progress': tasks.filter(t => t.status === 'In Progress').length,
        'Review Required': tasks.filter(t => t.status === 'Pending Sales Review').length,
        Completed: tasks.filter(t => t.status === 'Completed').length
    };


    return (
        <div className="st-tasks-container">
            <div className="st-tasks-wrapper">

                <div className="st-stats-grid">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="st-stat-card">
                                <div className="st-stat-info">
                                    <Skeleton width="60px" height="12px" />
                                    <div style={{ height: '4px' }} />
                                    <Skeleton width="40px" height="24px" />
                                </div>
                            </div>
                        ))
                    ) : Object.entries(stats).map(([label, value]) => (
                        <div
                            key={label}
                            className={`st-stat-card ${filterStatus === label ? 'selected' : ''}`}
                            onClick={() => {
                                if (label === 'Total') setFilterStatus('All');
                                else if (label === 'Review Required') setFilterStatus('Pending Sales Review');
                                else setFilterStatus(label);
                            }}
                        >
                            <div className="st-stat-info">
                                <span className="st-stat-label">{label}</span>
                                <span className="st-stat-value">{value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="st-tasks-controls">
                    <div className="st-search-container">
                        <Search className="st-search-icon" size={18} />
                        <input
                            type="text"
                            className="st-search-input"
                            placeholder="Search your tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="st-tasks-grid">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="st-task-card loading">
                                <Skeleton width="70%" height="20px" borderRadius="6px" />
                                <div style={{ height: '12px' }} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Skeleton width="40%" height="14px" />
                                    <Skeleton width="40%" height="14px" />
                                </div>
                                <div style={{ height: '16px' }} />
                                <Skeleton width="100%" height="40px" borderRadius="8px" />
                                <div style={{ height: '20px' }} />
                                <Skeleton width="100%" height="30px" borderRadius="12px" />
                            </div>
                        ))
                    ) : filteredTasks.length === 0 ? (
                        <div className="st-empty-state-card">
                            <p>No tasks found matching your criteria</p>
                        </div>
                    ) : filteredTasks.map(task => (
                        <div key={task._id} className="st-task-card">
                            <div className="st-task-card-header">
                                <h3 className="st-task-title">{task.title}</h3>
                                <span className={`st-priority-badge st-priority-${task.priority?.toLowerCase()}`}>
                                    {task.priority}
                                </span>
                            </div>
                            
                            <div className="st-task-card-meta">
                                <div className="st-meta-item">
                                    <Briefcase size={14} />
                                    <span>{task.quotation?.projectName || 'General'}</span>
                                </div>
                                <div className="st-meta-item">
                                    <Calendar size={14} />
                                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            <p className="st-task-desc">
                                {task.description || 'No description provided.'}
                            </p>
                            
                            <div className="st-progress-cell">
                                <div className="st-progress-meta">
                                    <span className="st-progress-label">Progress</span>
                                    <span className="st-progress-text">{task.progress || 0}%</span>
                                </div>
                                <div className="st-progress-bar-bg">
                                    <div
                                        className="st-progress-bar-fill"
                                        style={{ width: `${task.progress || 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="st-task-card-footer">
                                {task.status === 'Pending Sales Review' ? (
                                    <div className="st-review-actions">
                                        <button 
                                            onClick={() => handleSalesReview(task._id, true)}
                                            disabled={updatingTaskId === task._id}
                                            className="st-btn-action approve"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleSalesReview(task._id, false)}
                                            disabled={updatingTaskId === task._id}
                                            className="st-btn-action reject"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`st-status-badge ${task.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                        {task.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesTasks;
