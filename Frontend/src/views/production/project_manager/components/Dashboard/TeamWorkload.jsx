import React from 'react';
import { Users } from 'lucide-react';

const getCapacityColor = (capacity) => {
    if (capacity >= 90) return '#ef4444';
    if (capacity >= 70) return '#f59e0b';
    return '#10b981';
};

const TeamWorkload = ({ teamWorkload }) => {
    return (
        <div className="pm-card pm-team-card">
            <div className="pm-card-header">
                <h3><Users size={18} /> Team Workload</h3>
            </div>
            <div className="pm-team-workload-list">
                {teamWorkload.map(member => {
                    const capacity = Math.min((member.projects / 5) * 100, 100);
                    return (
                        <div className="pm-team-member-row" key={member.id}>
                            <div className="pm-team-member-info">
                                <div className="pm-team-avatar" style={{ background: getCapacityColor(capacity) + '18', color: getCapacityColor(capacity) }}>
                                    {member.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="pm-team-details">
                                    <span className="pm-team-name">{member.name}</span>
                                    <span className="pm-team-role">{member.role}</span>
                                </div>
                            </div>
                            <div className="pm-team-capacity">
                                <div className="pm-capacity-header">
                                    <span>{member.projects} projects</span>
                                    <span style={{ color: getCapacityColor(capacity) }}>{capacity}%</span>
                                </div>
                                <div className="pm-capacity-bar">
                                    <div
                                        className="pm-capacity-fill"
                                        style={{ width: `${capacity}%`, background: getCapacityColor(capacity) }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {teamWorkload.length === 0 && <p className="pm-empty-text" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No team members assigned.</p>}
            </div>
        </div>
    );
};

export default TeamWorkload;
