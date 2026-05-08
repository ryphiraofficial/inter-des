import React, { useState, useEffect } from 'react';
import {
    Search,
    Loader,
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
import SalesTasks from './SalesTasks';
import StaffCollectionQueue from '../Accounts/staff/StaffCollectionQueue';
import Skeleton from '../common/Skeleton';
import './css/StaffTasks.css';

const StaffTasks = ({ user, forceTable = false }) => {
    const department = getRoleDepartment(user?.role);
    if (department === 'Sales' && !forceTable) return <SalesTasks user={user} />;
    if (department === 'Accounts' && !forceTable) return <StaffCollectionQueue user={user} />;
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getAll(); // The API should handle staff scoping via token
            if (response.success) {
                setTasks(response.data);
            }
        } catch (err) {
            console.error('Failed to load tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProgressUpdate = async (taskId, progress) => {
        // Update local state immediately for smooth UI
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, progress } : t));

        setUpdatingTaskId(taskId);
        try {
            await taskAPI.updateProgress(taskId, { progress });
        } catch (err) {
            console.error('Failed to sync progress:', err);
        } finally {
            setUpdatingTaskId(null);
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

                <div className="st-tasks-list-card">
                    <div className="st-table-container">
                        <table className="st-tasks-table">
                            <thead>
                                <tr>
                                    <th>Task Details</th>
                                    <th className="desktop-hide">Project / Client</th>
                                    <th className="desktop-hide">Progress</th>
                                    <th className="desktop-hide">Priority</th>
                                    <th className="desktop-hide">Deadline</th>
                                    <th className="desktop-hide">Actions</th>
                                    <th className="mobile-show">Status</th>
                                    <th className="mobile-show"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(6)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="st-details-cell">
                                                <Skeleton width="180px" height="18px" />
                                                <div style={{ height: '8px' }} />
                                                <Skeleton width="240px" height="14px" />
                                            </td>
                                            <td className="desktop-hide">
                                                <Skeleton width="120px" height="16px" />
                                            </td>
                                            <td className="desktop-hide">
                                                <Skeleton width="100px" height="8px" borderRadius="10px" />
                                            </td>
                                            <td className="desktop-hide">
                                                <Skeleton width="80px" height="24px" borderRadius="12px" />
                                            </td>
                                            <td className="desktop-hide">
                                                <Skeleton width="100px" height="16px" />
                                            </td>
                                            <td className="desktop-hide">
                                                <Skeleton width="100px" height="32px" borderRadius="8px" />
                                            </td>
                                            <td className="mobile-show">
                                                <Skeleton width="80px" height="20px" borderRadius="12px" />
                                            </td>
                                            <td className="mobile-show">
                                                <Skeleton width="20px" height="20px" borderRadius="50%" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredTasks.length === 0 ? (
                                    <tr>
                                        <td colSpan="8">
                                            <div className="st-empty-state">
                                                <p>No tasks found matching your criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredTasks.map(task => (
                                    <React.Fragment key={task._id}>
                                        <tr 
                                            className={`st-task-row ${expandedRow === task._id ? 'expanded' : ''}`}
                                            onClick={() => toggleRow(task._id)}
                                        >
                                            <td className="st-details-cell">
                                                <div className="st-task-info">
                                                    <span className="st-task-title">{task.title}</span>
                                                    <span className="st-task-desc desktop-hide">{task.description}</span>
                                                    <div className="st-mobile-meta mobile-show">
                                                        {task.priority} Priority • {task.progress || 0}%
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="desktop-hide">
                                                <div className="st-project-info">
                                                    <Briefcase size={12} />
                                                    <span>{task.quotation?.projectName || 'General'}</span>
                                                </div>
                                            </td>
                                            <td className="desktop-hide">
                                                <div className="st-progress-cell">
                                                    <div className="st-progress-bar-bg">
                                                        <div
                                                            className="st-progress-bar-fill"
                                                            style={{ width: `${task.progress}%` }}
                                                        />
                                                    </div>
                                                    <div className="st-slider-container">
                                                        <input
                                                            type="range"
                                                            className="st-slider"
                                                            min="0"
                                                            max="100"
                                                            step="5"
                                                            value={task.progress || 0}
                                                            onChange={(e) => handleProgressUpdate(task._id, parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="st-progress-meta">
                                                        <span className="st-progress-text">{task.progress}%</span>
                                                        {updatingTaskId === task._id && <Loader size={12} className="spinner" />}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="desktop-hide">
                                                <span className={`st-priority-badge st-priority-${task.priority?.toLowerCase()}`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="desktop-hide">
                                                <div className="st-date-info">
                                                    <Calendar size={12} />
                                                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="desktop-hide">
                                                {task.status === 'Pending Sales Review' ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
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
                                                    <span className="st-status-badge">{task.status}</span>
                                                )}
                                            </td>
                                            <td className="mobile-show">
                                                <span className="st-mobile-status">{task.status}</span>
                                            </td>
                                            <td className="mobile-show st-toggle-cell">
                                                <ChevronDown size={18} className={`st-toggle-icon ${expandedRow === task._id ? 'active' : ''}`} />
                                            </td>
                                        </tr>
                                        {expandedRow === task._id && (
                                            <tr className="st-expansion-row mobile-show">
                                                <td colSpan="3">
                                                    <div className="st-expansion-content">
                                                        <div className="st-info-grid">
                                                            <div className="st-info-item">
                                                                 <label>Description</label>
                                                                 <p>{task.description || 'No description provided'}</p>
                                                            </div>
                                                            <div className="st-info-item">
                                                                 <label>Project</label>
                                                                 <span>{task.quotation?.projectName || 'General'}</span>
                                                            </div>
                                                            <div className="st-info-item">
                                                                 <label>Deadline</label>
                                                                 <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                                            </div>
                                                            <div className="st-info-item">
                                                                 <label>Update Progress</label>
                                                                 <div className="st-mobile-progress">
                                                                     <input
                                                                         type="range"
                                                                         className="st-slider"
                                                                         min="0"
                                                                         max="100"
                                                                         step="5"
                                                                         value={task.progress || 0}
                                                                         onChange={(e) => handleProgressUpdate(task._id, parseInt(e.target.value))}
                                                                     />
                                                                     <span>{task.progress}%</span>
                                                                 </div>
                                                            </div>
                                                        </div>
                                                        <div className="st-expansion-actions">
                                                            {task.status === 'Pending Sales Review' && (
                                                                <div className="st-review-actions">
                                                                    <button 
                                                                        onClick={() => handleSalesReview(task._id, true)}
                                                                        disabled={updatingTaskId === task._id}
                                                                        className="st-mobile-btn-action approve"
                                                                    >
                                                                        Approve Design
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleSalesReview(task._id, false)}
                                                                        disabled={updatingTaskId === task._id}
                                                                        className="st-mobile-btn-action reject"
                                                                    >
                                                                        Request Revision
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffTasks;
