import React from 'react';
import { Palette, Plus, Briefcase, Users, Clock } from 'lucide-react';

const ActiveDesignColumn = ({ activeDesign, onOpenAssignModal }) => {
    return (
        <div className="pipeline-column">
            <div className="col-header" style={{ borderLeft: '4px solid #3b82f6' }}>
                <div className="col-title-box"><Palette size={18} /><span>Active Design</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="col-count" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{activeDesign.length}</span>
                    <button className="add-task-btn" onClick={onOpenAssignModal}
                        style={{ border: 'none', background: '#3b82f6', color: 'white', borderRadius: '6px', padding: '2px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Assign New Task">
                        <Plus size={14} />
                    </button>
                </div>
            </div>
            <div className="col-body">
                {activeDesign.map(task => (
                    <div key={task._id} className="pipeline-card staff-card" style={{ borderLeftColor: '#3b82f6' }}>
                        <div className="card-header">
                            <h4>{task.title}</h4>
                            <span className="badge" style={{ background: '#eff6ff', color: '#2563eb' }}>{task.status}</span>
                        </div>
                        <div className="card-info" style={{ marginTop: '10px' }}>
                            <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                            <p><Users size={12} /> {task.assignedTo?.map(s => s.name).join(', ') || 'Unassigned'}</p>
                            <p className="time-stamp" style={{ marginTop: '8px' }}><Clock size={12} /> Assigned: {new Date(task.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {activeDesign.length === 0 && <div className="empty-col">No designs currently in progress</div>}
            </div>
        </div>
    );
};

export default ActiveDesignColumn;
