import React from 'react';
import { Clock } from 'lucide-react';

const STAGE_LABELS = { PM:'Project Manager', PE:'Project Engineer', SE:'Site Engineer', SS:'Site Supervisor' };

const TaskSidebar = ({ task, user, supervisors, siteTeam, saving, handleReassignTask }) => {
    return (
        <div className="eng-detail-side">
            <div className="eng-section-card">
                <div className="eng-section-header">
                    <div className="eng-section-title">Details</div>
                </div>
                <div className="eng-info-rows">
                    {[
                        ['Project',     task.projectId?.projectName||'—'],
                        ['Assigned By', task.assignedBy?.fullName||'—'],
                        ['Assigned To', 'dropdown'], // Marker for custom render
                        ['Stage',       STAGE_LABELS[task.stage]||task.stage],
                        ['Priority',    task.priority],
                        ['Status',      task.status],
                        ['Due Date',    task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'],
                        ['Created',     new Date(task.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})],
                    ].map(([k,v])=>(
                        <div key={k} className="eng-info-row">
                            <span className="eng-info-label">{k}</span>
                            {v === 'dropdown' ? (
                                ['Project Engineer', 'Site Engineer'].includes(user?.role) ? (
                                    <select 
                                        className="eng-input" 
                                        value={task.assignedTo?._id || task.assignedTo || ''}
                                        onChange={(e) => handleReassignTask(e.target.value)}
                                        disabled={saving || task.status === 'Completed' || task.status === 'Approved'}
                                        style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', width: 'auto', flex: 1, marginLeft: '10px' }}
                                    >
                                        <option value="">Unassigned</option>
                                        {(user?.role === 'Site Engineer' ? supervisors : siteTeam).map(m => (
                                            <option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="eng-info-value">{task.assignedTo?.fullName||'Unassigned'}</span>
                                )
                            ) : (
                                <span className="eng-info-value">{v}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity / Updates */}
            {task.updates?.length > 0 && (
                <div className="eng-section-card" style={{ marginTop:16 }}>
                    <div className="eng-section-header">
                        <div className="eng-section-title"><Clock size={16}/>Update Log</div>
                    </div>
                    <div className="eng-activity-list" style={{ padding:'8px 0' }}>
                        {task.updates.slice(-5).reverse().map((u,i)=>(
                            <div key={i} className="eng-activity-item">
                                <div className="eng-activity-dot"/>
                                <div className="eng-activity-body">
                                    {u.note && <span className="eng-activity-msg">{u.note}</span>}
                                    <span className="eng-activity-meta">
                                        {u.updatedBy?.fullName} · {new Date(u.timestamp).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskSidebar;
