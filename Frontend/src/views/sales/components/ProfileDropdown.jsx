import React from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';

const ProfileDropdown = ({ user, unreadCount, onClose, onLogout, toggleNotif }) => (
    <div style={{ position: 'absolute', top: '48px', right: 0, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.5rem', width: '240px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{user?.fullName || user?.name || 'Sales Staff'}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'capitalize' }}>{user?.role?.replace(/_/g, ' ') || 'Sales Dept'}</div>
        </div>
        <button className="sales-navbar-dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.8rem', color: '#334155', cursor: 'pointer', borderRadius: '8px' }}>
            <User size={16} /> My Profile
        </button>
        <button className="sales-navbar-dropdown-item" onClick={toggleNotif} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.8rem', color: '#334155', cursor: 'pointer', borderRadius: '8px', position: 'relative' }}>
            <Bell size={16} /> Notifications
            {unreadCount > 0 && <span style={{ marginLeft: 'auto', background: '#eef2ff', color: '#4f46e5', padding: '2px 6px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600 }}>{unreadCount}</span>}
        </button>
        <button className="sales-navbar-dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.8rem', color: '#334155', cursor: 'pointer', borderRadius: '8px' }}>
            <Settings size={16} /> Settings
        </button>
        {onLogout && (
            <button className="sales-navbar-dropdown-item" onClick={() => { onClose(); onLogout(); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.8rem', color: '#ef4444', cursor: 'pointer', borderRadius: '8px', marginTop: '0.25rem', borderTop: '1px solid #f1f5f9' }}>
                <LogOut size={16} /> Log Out
            </button>
        )}
    </div>
);

export default ProfileDropdown;
