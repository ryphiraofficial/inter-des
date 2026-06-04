import React from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { DEPARTMENTS } from '../../../utils/meetingUtils';

const MeetingInviteesForm = ({ 
    form, 
    deptFilter, 
    setDeptFilter, 
    search, 
    setSearch, 
    filteredUsers, 
    toggleInvitee 
}) => {
    return (
        <div className="meeting-modal-section">
            <h3>Invite Staff ({form.inviteeIds.length} selected)</h3>
            
            <div className="meeting-dept-tabs">
                {DEPARTMENTS.map(dept => (
                    <button
                        key={dept.value}
                        type="button"
                        className={`meeting-dept-tab ${deptFilter === dept.value ? 'active' : ''}`}
                        onClick={() => setDeptFilter(dept.value)}
                    >
                        {dept.label}
                    </button>
                ))}
            </div>

            <div className="sdcn-search-wrap">
                <Search size={14} />
                <input
                    className="sdcn-input"
                    placeholder="Search by name or role..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className="meeting-user-list">
                {filteredUsers.map(u => {
                    const selected = form.inviteeIds.includes(u._id);
                    return (
                        <div
                            key={u._id}
                            className={`meeting-user-item ${selected ? 'selected' : ''}`}
                            onClick={() => toggleInvitee(u._id)}
                        >
                            <div className="meeting-user-avatar">
                                {u.fullName?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="meeting-user-info">
                                <span className="meeting-user-name">{u.fullName}</span>
                                <span className="meeting-user-role">{u.role}</span>
                            </div>
                            {selected && <CheckCircle size={16} className="meeting-user-check" />}
                        </div>
                    );
                })}
                {filteredUsers.length === 0 && (
                    <p className="meeting-empty-search">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default MeetingInviteesForm;
