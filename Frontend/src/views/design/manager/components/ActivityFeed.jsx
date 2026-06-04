import React from 'react';
import { Bell } from 'lucide-react';

const ActivityFeed = ({ notifications }) => {
    return (
        <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <Bell size={20} color="#6366f1" />
                <h3 style={{ margin: 0, fontWeight: 800 }}>Studio Activity Feed</h3>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
                {notifications.length > 0 ? notifications.map(notif => (
                    <div key={notif._id} style={{ padding: '12px', background: notif.notifRead ? '#f8fafc' : '#f5f3ff', borderRadius: '16px', border: `1px solid ${notif.notifRead ? '#e2e8f0' : '#e0e7ff'}` }}>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{notif.title}</p>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#64748b' }}>{notif.description}</p>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                )) : <div style={{ textAlign: 'center', color: '#94a3b8' }}>No recent activity</div>}
            </div>
        </div>
    );
};

export default ActivityFeed;
