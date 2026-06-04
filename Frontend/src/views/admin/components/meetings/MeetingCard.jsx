import React from 'react';
import { Edit2, XCircle, Calendar, Clock, Users, Video } from 'lucide-react';
import { STATUS_CONFIG, computeStatus, formatDateTime } from '../../utils/meetingUtils';

const MeetingCard = ({ meeting, onEdit, onCancel }) => {
    const status = computeStatus(meeting);
    const cfg = STATUS_CONFIG[status];

    return (
        <div className={`meeting-card ${status}`}>
            <div className="meeting-card-header">
                <div className="meeting-card-left">
                    <span className="meeting-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
                        {status === 'ongoing' && <span className="meeting-live-dot" />}
                        {cfg.label}
                    </span>
                    <h3 className="meeting-card-title">{meeting.title}</h3>
                    {meeting.description && <p className="meeting-card-desc">{meeting.description}</p>}
                </div>
                {status !== 'cancelled' && status !== 'completed' && (
                    <div className="meeting-card-actions">
                        <button className="meeting-icon-btn" title="Edit" onClick={() => onEdit(meeting)}>
                            <Edit2 size={15} />
                        </button>
                        <button className="meeting-icon-btn danger" title="Cancel" onClick={() => onCancel(meeting)}>
                            <XCircle size={15} />
                        </button>
                    </div>
                )}
            </div>

            <div className="meeting-card-meta">
                <span><Calendar size={14} />{formatDateTime(meeting.scheduledAt)}</span>
                <span><Clock size={14} />{meeting.duration} mins</span>
                <span><Users size={14} />{meeting.invitees?.length || 0} invitees</span>
            </div>

            <div className="meeting-card-footer">
                <div className="meeting-invitee-avatars">
                    {meeting.invitees?.slice(0, 5).map((inv, i) => (
                        <div key={i} className="meeting-avatar" title={inv.user?.fullName}>
                            {inv.user?.fullName?.charAt(0).toUpperCase() || '?'}
                        </div>
                    ))}
                    {meeting.invitees?.length > 5 && (
                        <div className="meeting-avatar more">+{meeting.invitees.length - 5}</div>
                    )}
                </div>
                {(status === 'upcoming' || status === 'ongoing') && (
                    <a
                        href={meeting.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`meeting-join-btn ${status === 'ongoing' ? 'live' : ''}`}
                    >
                        <Video size={15} />
                        {status === 'ongoing' ? 'Join Now' : 'Open Link'}
                    </a>
                )}
            </div>
        </div>
    );
};

export default MeetingCard;
