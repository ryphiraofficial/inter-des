import React from 'react';
import { User, Briefcase, Calendar, Clock, CheckCircle, X, Eye, Edit, Trash2, AlertTriangle, ChevronDown, Palette } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const TasksTable = ({ 
    tasks, 
    isStaff, 
    expandedRow, 
    toggleRow, 
    getPriorityColor, 
    handleStatusChange, 
    handleProgressChange, 
    handleSalesReview, 
    handleAdminReview, 
    handleViewDetails, 
    handleEdit, 
    handleDelete,
    setShowDesignModal,
    setSelectedTask
}) => {
    return (
        <div className="tasks-list-card">
            <div className="tasks-table-container">
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Task Details</th>
                            <th className="desktop-hide">Assigned To</th>
                            <th className="desktop-hide">Client & Project</th>
                            <th className="desktop-hide">Due Date</th>
                            <th className="desktop-hide">Duration</th>
                            <th className="desktop-hide">Priority</th>
                            <th className="desktop-hide">Status</th>
                            <th className="desktop-hide">Progress</th>
                            <th className="desktop-hide">{!isStaff && 'Actions'}</th>
                            <th className="mobile-show">Status</th>
                            <th className="mobile-show"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <React.Fragment key={task._id}>
                                <tr 
                                    className={`task-row ${expandedRow === task._id ? 'expanded' : ''}`}
                                    onClick={() => handleViewDetails(task)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className="row-number-cell" style={{ fontWeight: '600', color: '#64748b' }}>
                                        {index + 1}
                                    </td>
                                    <td className="task-details-cell">
                                        <div className="task-info-main">
                                            <span className="task-list-title">{task.title}</span>
                                            <span className="task-list-desc">{task.description}</span>
                                            <div className="mobile-task-meta mobile-show">
                                                <span className="priority-dot" style={{ background: getPriorityColor(task.priority) }}></span>
                                                {task.priority} Priority • {task.progress || 0}%
                                            </div>
                                        </div>
                                    </td>
                                    <td className="desktop-hide">
                                        <div className="task-assignee">
                                            <div className="assignee-avatar">
                                                {task.assignedTo?.name?.charAt(0) || '?'}
                                            </div>
                                            <div className="assignee-info">
                                                <span className="assignee-name">{task.assignedTo?.name || 'Unassigned'}</span>
                                                <span className="assignee-role">{task.assignedTo?.role || ''}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="desktop-hide">
                                        <div className="task-project-cell">
                                            {task.client && (
                                                <div className="project-item">
                                                    <User size={12} />
                                                    <span>{task.client.name}</span>
                                                </div>
                                            )}
                                            {task.quotation && (
                                                <div className="project-item quotation">
                                                    <Briefcase size={12} />
                                                    <span>{task.quotation.projectName}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="desktop-hide">
                                        <div className="task-date">
                                            <Calendar size={14} />
                                            <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                        </div>
                                    </td>
                                    <td className="desktop-hide">
                                        <div className="task-duration">
                                            <Clock size={14} />
                                            <span>{task.estimatedDuration || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="desktop-hide">
                                        <span className="priority-badge-small" style={{ borderLeft: `3px solid ${getPriorityColor(task.priority)}` }}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="desktop-hide" onClick={(e) => e.stopPropagation()}>
                                        <CustomSelect
                                            variant="inline"
                                            options={[
                                                { value: 'To Do', label: 'To Do' },
                                                { value: 'In Progress', label: 'In Progress' },
                                                { value: 'Review Pending', label: 'Review Pending' },
                                                { value: 'Revision Required', label: 'Revision Required' },
                                                { value: 'Approved', label: 'Approved (Manager)' },
                                                { value: 'Pending Sales Review', label: 'Pending Sales' },
                                                { value: 'Pushed to Procurement', label: 'Procurement Ready' },
                                                { value: 'Completed', label: 'Completed' },
                                                { value: 'Blocked', label: 'Blocked' }
                                            ]}
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            searchable={false}
                                        />
                                    </td>
                                    <td className="desktop-hide" onClick={(e) => e.stopPropagation()}>
                                        <div className="task-progress-cell">
                                            <div className="progress-info">
                                                <div className="progress-bar-bg">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{
                                                            width: `${task.progress || 0}%`,
                                                            backgroundColor: task.progress === 100 ? '#10b981' : '#6366f1'
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="progress-value">{task.progress || 0}%</span>
                                            </div>
                                            {isStaff && (
                                                <input
                                                    type="range" min="0" max="100" step="5"
                                                    className="progress-slider"
                                                    value={task.progress || 0}
                                                    onChange={(e) => handleProgressChange(task._id, parseInt(e.target.value))}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="desktop-hide task-actions-cell" onClick={(e) => e.stopPropagation()}>
                                        <div className="task-actions">
                                            {task.status === 'Pending Sales Review' && (
                                                 <>
                                                     <button className="btn-icon approve" onClick={() => handleSalesReview(task._id, true)} style={{ color: '#10b981' }}><CheckCircle size={16} /></button>
                                                     <button className="btn-icon reject" onClick={() => handleSalesReview(task._id, false)} style={{ color: '#ef4444' }}><X size={16} /></button>
                                                 </>
                                             )}
                                             {task.status === 'Pending Admin Review' && (
                                                 <>
                                                     <button className="btn-icon approve" onClick={() => { setSelectedTask(task); setShowDesignModal(true); }} title="Review Design Files" style={{ color: '#6366f1' }}><Palette size={16} /></button>
                                                     <button className="btn-icon approve" onClick={() => handleAdminReview(task._id, true)} title="Approve Task" style={{ color: '#10b981' }}><CheckCircle size={16} /></button>
                                                     <button className="btn-icon reject" onClick={() => handleAdminReview(task._id, false)} title="Reject Task" style={{ color: '#ef4444' }}><AlertTriangle size={16} /></button>
                                                 </>
                                             )}
                                            <button className="btn-icon" onClick={() => handleViewDetails(task)} title="View Details"><Eye size={16} /></button>
                                            <button className="btn-icon" onClick={() => handleEdit(task)} title="Edit"><Edit size={16} /></button>
                                            <button className="btn-icon delete" onClick={() => handleDelete(task._id)} title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                    <td className="mobile-show">
                                        <span className="mobile-status-text">{task.status}</span>
                                    </td>
                                    <td className="mobile-show toggle-cell">
                                        <ChevronDown size={18} className={`toggle-icon ${expandedRow === task._id ? 'active' : ''}`} />
                                    </td>
                                </tr>
                                {expandedRow === task._id && (
                                    <tr className="mobile-expansion-row mobile-show">
                                        <td colSpan="4">
                                            <div className="expansion-content">
                                                <div className="info-grid">
                                                    <div className="info-item"><label>Assigned To</label><span>{task.assignedTo?.name || 'Unassigned'}</span></div>
                                                    <div className="info-item"><label>Project</label><span>{task.quotation?.projectName || 'No Project'}</span></div>
                                                    <div className="info-item"><label>Due Date</label><span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span></div>
                                                    <div className="info-item"><label>Progress</label><span>{task.progress || 0}%</span></div>
                                                </div>
                                                <div className="expansion-actions">
                                                    <button className="btn-mobile-action primary" onClick={() => handleViewDetails(task)}><Eye size={16} /> View Details</button>
                                                    <button className="btn-mobile-action secondary" onClick={() => handleEdit(task)}><Edit size={16} /> Edit Task</button>
                                                    {!isStaff && <button className="btn-mobile-action danger" onClick={() => handleDelete(task._id)}><Trash2 size={16} /> Delete</button>}
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
    );
};

export default TasksTable;
