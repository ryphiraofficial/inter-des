import React from 'react';
import { User } from 'lucide-react';

const TeamPopover = ({ managerType, manager, staff, loading, onClose }) => {
    return (
        <div className="team-popover">
            <div className="popover-header">
                <div className="p-title">
                    <User size={14} />
                    <span>{managerType} Team</span>
                </div>
                <button className="p-close" onClick={onClose}>×</button>
            </div>
            <div className="popover-body">
                <div className="manager-info">
                    <div className="m-avatar">{manager?.name?.charAt(0) || 'U'}</div>
                    <div className="m-details">
                        <span className="m-name">{manager?.name || 'Unassigned'}</span>
                        <span className="m-role">{managerType} Manager</span>
                    </div>
                </div>
                
                <div className="staff-section">
                    <label>Staff Members ({staff.length})</label>
                    {loading ? (
                        <div className="p-loading">Loading team...</div>
                    ) : staff.length === 0 ? (
                        <div className="p-empty">No staff assigned yet</div>
                    ) : (
                        <div className="staff-list">
                            {staff.map(s => (
                                <div key={s._id} className="staff-item">
                                    <div className="s-avatar">{s.name?.charAt(0)}</div>
                                    <div className="s-info">
                                        <span className="s-name">{s.name}</span>
                                        <span className="s-role">{s.role || 'Team Member'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamPopover;
