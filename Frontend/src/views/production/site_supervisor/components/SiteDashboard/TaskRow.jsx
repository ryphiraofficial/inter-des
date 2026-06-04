import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getPriorityStyle = (p) => ({ Low:{color:'#64748b',bg:'#f1f5f9'}, Medium:{color:'#2563eb',bg:'#dbeafe'}, High:{color:'#d97706',bg:'#fef3c7'}, Urgent:{color:'#dc2626',bg:'#fee2e2'} }[p]||{color:'#64748b',bg:'#f1f5f9'});
const getStatusStyle   = (s) => ({ 'Pending':{dot:'#f59e0b',label:'#92400e',bg:'#fef3c7'}, 'In Progress':{dot:'#3b82f6',label:'#1e40af',bg:'#dbeafe'}, 'Completed':{dot:'#10b981',label:'#065f46',bg:'#d1fae5'}, 'Approved':{dot:'#8b5cf6',label:'#5b21b6',bg:'#ede9fe'} }[s]||{dot:'#94a3b8',label:'#374151',bg:'#f3f4f6'});

const TaskRow = ({ task }) => {
    const navigate = useNavigate();
    const st = getStatusStyle(task.status);
    const pr = getPriorityStyle(task.priority);
    const overdue = task.dueDate && new Date(task.dueDate) < new Date() && !['Completed','Approved'].includes(task.status);
    return (
        <div className="site-task-row" onClick={()=>navigate(`/site/tasks/${task._id}`)}>
            <div className="site-task-dot" style={{background:st.dot}}/>
            <div style={{flex:1,minWidth:0}}>
                <div className="site-task-title">{task.title}</div>
                <div className="site-task-meta">
                    {task.projectId?.projectName||'General'}
                    {task.dueDate && <span style={{color:overdue?'#ef4444':'#94a3b8',marginLeft:6}}>
                        · Due {new Date(task.dueDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}
                    </span>}
                </div>
            </div>
            <div style={{display:'flex',gap:6,flexShrink:0}}>
                <span className="site-badge" style={{color:pr.color,background:pr.bg}}>{task.priority}</span>
                <span className="site-badge" style={{color:st.label,background:st.bg}}>{task.status}</span>
            </div>
            <ChevronRight size={14} style={{color:'#94a3b8',flexShrink:0}}/>
        </div>
    );
};

export default TaskRow;
