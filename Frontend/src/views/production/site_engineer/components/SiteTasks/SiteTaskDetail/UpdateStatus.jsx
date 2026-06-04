import React from 'react';
import { CheckSquare } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

const UpdateStatus = ({ localTask, user, handleStatus, statusSaving, showNote, setShowNote, note, setNote, isMine }) => {
    if (!(isMine && localTask.status !== 'Approved')) {
        return null;
    }

    return (
        <div className="site-card" style={{ marginBottom: 20 }}>
            <div className="site-card-header">
                <div className="site-card-title"><CheckSquare size={15} />Update Status</div>
            </div>
            <div className="site-status-row">
                {STATUS_OPTIONS.map(s => (
                    <button key={s} 
                        className={localTask.status === s ? 'site-btn-primary' : 'site-btn-secondary'}
                        onClick={() => {
                            if (s !== localTask.status || (s === 'Completed' && user?.role === 'Site Supervisor')) {
                                handleStatus(s);
                            }
                        }}
                        disabled={statusSaving || (localTask.status === s && (s !== 'Completed' || user?.role !== 'Site Supervisor'))}
                    >
                        {s === 'Completed' && localTask.status === 'Completed' && user?.role === 'Site Supervisor' ? '✏ Edit Completion Info' : s}
                    </button>
                ))}
                <button type="button" className="site-btn-secondary" onClick={() => setShowNote(!showNote)} style={{ marginLeft: 'auto' }}>
                    {showNote ? 'Hide Note' : '+ Note'}
                </button>
            </div>
            {showNote && (
                <div style={{ padding: '0 24px 14px' }}>
                    <textarea className="site-input" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Note…" />
                </div>
            )}
        </div>
    );
};

export default UpdateStatus;
