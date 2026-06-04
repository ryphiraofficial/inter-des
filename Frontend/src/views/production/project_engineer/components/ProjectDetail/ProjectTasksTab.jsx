import React from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STAGE_LABELS = { PM:'Project Manager', PE:'Project Engineer', SE:'Site Engineer', SS:'Site Supervisor' };
const getPriorityStyle = (p) => ({ Low:{color:'#64748b',bg:'#f1f5f9'}, Medium:{color:'#2563eb',bg:'#dbeafe'}, High:{color:'#d97706',bg:'#fef3c7'}, Urgent:{color:'#dc2626',bg:'#fee2e2'} }[p]||{color:'#64748b',bg:'#f1f5f9'});
const getStatusStyle   = (s) => ({ 'Pending':{label:'#92400e',bg:'#fef3c7',dot:'#f59e0b'}, 'In Progress':{label:'#1e40af',bg:'#dbeafe',dot:'#3b82f6'}, 'Completed':{label:'#065f46',bg:'#d1fae5',dot:'#10b981'}, 'Approved':{label:'#5b21b6',bg:'#ede9fe',dot:'#8b5cf6'} }[s]||{label:'#374151',bg:'#f3f4f6',dot:'#9ca3af'});

const ProjectTasksTab = ({ tasks, user, setNewTask, setShowTaskModal, setSelectedTask, setShowSubtaskModal, siteTeam, supervisors, handleAssignTask }) => {
    const navigate = useNavigate();
    const basePath = user?.role === 'Project Engineer' ? '/engineer' : '/site';

    return (
        <div className="eng-tab-content">
            {['Project Engineer', 'Site Engineer'].includes(user?.role) && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button 
                        className="eng-btn-primary" 
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem' }}
                        onClick={() => {
                            setNewTask({ title:'', description:'', assignedTo:'', priority:'Medium', dueDate:'' });
                            setShowTaskModal(true);
                        }}
                    >
                        <Plus size={16}/> Create Task
                    </button>
                </div>
            )}
            {tasks.length === 0 ? (
                <div className="eng-table-card">
                    <div className="eng-empty" style={{ padding:48 }}>
                        <ClipboardList size={36}/><p>No tasks in this project</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop View */}
                    <div className="eng-table-card desktop-only">
                        <table className="eng-table">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Stage</th>
                                    <th>Assigned To</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    {['Project Engineer','Site Engineer'].includes(user?.role) && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(t => {
                                    const pr = getPriorityStyle(t.priority);
                                    const st = getStatusStyle(t.status);
                                    const isMine = t.assignedTo?._id === user?._id;
                                    return (
                                        <tr key={t._id} style={{ cursor:'pointer' }} onClick={()=>navigate(`${basePath}/tasks/${t._id}`)}>
                                            <td>
                                                <div className="eng-td-title">{t.title}</div>
                                                {t.isSubtask && <div className="eng-td-sub">↳ Subtask</div>}
                                            </td>
                                            <td><span className="eng-stage-chip">{STAGE_LABELS[t.stage]||t.stage}</span></td>
                                            <td style={{ fontSize:13 }} onClick={e => e.stopPropagation()}>
                                                {['Project Engineer', 'Site Engineer'].includes(user?.role) ? (
                                                    <select 
                                                        className="eng-assign-select" 
                                                        value={t.assignedTo?._id || t.assignedTo || ''}
                                                        onChange={(e) => handleAssignTask(t._id, e.target.value)}
                                                        style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', fontWeight: 500 }}
                                                    >
                                                        <option value="">Unassigned</option>
                                                        {(user?.role === 'Site Engineer' ? supervisors : siteTeam).map(m => (
                                                            <option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span style={{ color: isMine?'#3b82f6':'#475569', fontWeight: isMine?700:400 }}>
                                                        {t.assignedTo?.fullName||'Unassigned'}{isMine?' (You)':''}
                                                    </span>
                                                )}
                                            </td>
                                            <td><span className="eng-badge" style={{color:pr.color,background:pr.bg}}>{t.priority}</span></td>
                                            <td><span className="eng-badge" style={{color:st.label,background:st.bg}}>{t.status}</span></td>
                                            {['Project Engineer','Site Engineer'].includes(user?.role) && (
                                                <td onClick={e=>e.stopPropagation()}>
                                                    {!t.isSubtask && (
                                                        <button className="eng-subtask-btn" onClick={()=>{ setSelectedTask(t); setShowSubtaskModal(true); }}>
                                                            <Plus size={13}/> Subtask
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="mobile-only">
                        {tasks.map(t => {
                            const pr = getPriorityStyle(t.priority);
                            const st = getStatusStyle(t.status);
                            const isMine = t.assignedTo?._id === user?._id;
                            return (
                                <div key={t._id} className="eng-mobile-task-card" onClick={()=>navigate(`${basePath}/tasks/${t._id}`)}>
                                    <div className="eng-mobile-task-header">
                                        <div className="eng-mobile-task-title">{t.title}</div>
                                        {t.isSubtask && <span className="eng-badge" style={{color:'#7c3aed',background:'#ede9fe'}}>Subtask</span>}
                                    </div>
                                    <div className="eng-mobile-task-meta">
                                        <span className="eng-badge" style={{color:pr.color,background:pr.bg}}>{t.priority}</span>
                                        <span className="eng-badge" style={{color:st.label,background:st.bg}}>{t.status}</span>
                                        <span className="eng-stage-chip">{STAGE_LABELS[t.stage]||t.stage}</span>
                                    </div>
                                    <div className="eng-mobile-task-info" onClick={e => e.stopPropagation()}>
                                        {['Project Engineer', 'Site Engineer'].includes(user?.role) ? (
                                            <select 
                                                className="eng-assign-select" 
                                                value={t.assignedTo?._id || t.assignedTo || ''}
                                                onChange={(e) => handleAssignTask(t._id, e.target.value)}
                                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc', fontWeight: 500 }}
                                            >
                                                <option value="">Unassigned</option>
                                                {(user?.role === 'Site Engineer' ? supervisors : siteTeam).map(m => (
                                                    <option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span style={{ fontWeight: isMine?700:400, color: isMine?'#3b82f6':'inherit' }}>
                                                {t.assignedTo?.fullName||'Unassigned'}{isMine?' (You)':''}
                                            </span>
                                        )}
                                        {['Project Engineer','Site Engineer'].includes(user?.role) && !t.isSubtask && (
                                            <button 
                                                className="eng-subtask-btn" 
                                                onClick={e=>{ e.stopPropagation(); setSelectedTask(t); setShowSubtaskModal(true); }}
                                            >
                                                <Plus size={12}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectTasksTab;
