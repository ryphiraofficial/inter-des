import React from 'react';
import { Activity } from 'lucide-react';

const ProjectActivityTab = ({ activity }) => {
    return (
        <div className="eng-tab-content">
            <div className="eng-section-card">
                {activity.length === 0 ? (
                    <div className="eng-empty" style={{ padding:48 }}>
                        <Activity size={36}/><p>No activity yet</p>
                    </div>
                ) : (
                    <div className="eng-activity-list">
                        {activity.map((log,i)=>(
                            <div key={log._id||i} className="eng-activity-item">
                                <div className="eng-activity-dot"/>
                                <div className="eng-activity-body">
                                    <span className="eng-activity-msg">{log.message}</span>
                                    <span className="eng-activity-meta">
                                        {log.userId?.fullName} · {new Date(log.timestamp||log.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectActivityTab;
