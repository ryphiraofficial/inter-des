import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, CheckSquare, X, LogOut, TrendingUp } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../models/api';
import NavGroup from './components/NavGroup';
import { primaryNav, secondaryNav, systemNav } from './components/SidebarConfig';
import './css/AccountsStaffSidebar.css';

const AccountsStaffSidebar = ({ user, onLogout, isOpen, toggleSidebar }) => {
    const location = useLocation();
    const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`) : null;
    const userInitials = user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AS';

    const renderNavSection = (title, items) => (
        <div className="acct-nav-section">
            <h3 className="acct-nav-title">{title}</h3>
            <ul className="acct-nav-list">
                {items.map(item => (
                    <li key={item.name}>
                        <NavGroup 
                            item={item} 
                            isActive={
                                (location.pathname === item.path) || 
                                (item.path.includes('?tab=') && new URLSearchParams(location.search).get('tab') === new URLSearchParams(item.path.split('?')[1]).get('tab')) ||
                                (location.pathname === '/staff/dashboard' && item.path === '/staff/dashboard' && !location.search)
                            } 
                            toggleSidebar={toggleSidebar} 
                        />
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className={`acct-sidebar-container ${isOpen ? 'open' : ''}`}>
            <div className="acct-sidebar-header">
                <div className="acct-brand">
                    <div className="acct-logo-box"><TrendingUp size={22} strokeWidth={2.5} /></div>
                    <div className="acct-brand-text"><span className="acct-brand-title">Interior Design</span><span className="acct-brand-subtitle">Accounts Portal</span></div>
                </div>
                <button className="acct-close-btn" onClick={toggleSidebar}><X size={20} /></button>
            </div>

            <div className="acct-user-card">
                <div className="acct-avatar-wrapper">
                    {user?.avatar ? <img src={getImageUrl(user.avatar)} alt="Avatar" className="acct-avatar" /> : <div className="acct-avatar">{userInitials}</div>}
                    <span className="acct-status-dot"></span>
                </div>
                <div className="acct-user-info"><span className="acct-user-name">{user?.fullName || 'Accounts Staff'}</span><span className="acct-user-role">{user?.role || 'Staff Operations'}</span></div>
            </div>

            <div className="acct-quick-actions">
                <button className="acct-quick-btn" title="Notifications"><Bell size={14} /> Alerts</button>
                <button className="acct-quick-btn" title="Task Reminders"><CheckSquare size={14} /> Tasks</button>
            </div>

            <div className="acct-sidebar-scrollarea">
                {renderNavSection('Primary Workspace', primaryNav)}
                {renderNavSection('Staff Tools', secondaryNav)}
                {renderNavSection('Administrative', systemNav)}
            </div>

            <div className="acct-sidebar-footer">
                <button className="acct-logout-btn" onClick={onLogout}><LogOut size={16} /><span>Logout securely</span></button>
            </div>
        </div>
    );
};

export default AccountsStaffSidebar;
