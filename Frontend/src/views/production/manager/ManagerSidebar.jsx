import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Wrench, ClipboardCheck, Box, CheckSquare, Target, LogOut, Menu, Users, Settings, Video
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../models/api';
import '../../admin/css/Sidebar.css';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

const ManagerSidebar = ({ user, onLogout, isCollapsed, toggleSidebar }) => {
    const navGroups = [
        {
            title: "Production",
            items: [
                { name: 'Dashboard', icon: LayoutDashboard, path: '/production-management/dashboard' },
                { name: 'Project Handoff', icon: Target, path: '/production-management/handoff' },
                { name: 'Projects', icon: Box, path: '/production-management/projects' },
                { name: 'Tasks', icon: CheckSquare, path: '/production-management/tasks' },
                { name: 'Team', icon: Users, path: '/production-management/team' },
                { name: 'Approvals', icon: ClipboardCheck, path: '/production-management/approvals' },
                { name: 'Meetings',  icon: Video,          path: '/meetings' },
            ]
        },
        {
            title: "System",
            items: [
                { name: 'Settings', icon: Settings, path: '/production-management/settings' },
            ]
        }
    ];

    const { companyName } = useCompanySettings();

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    return (
        <div className={`sidebar-container production ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="brand-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 className="brand-title" style={{ fontSize: '20px', color: '#000000', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2', margin: 0 }}>
                        {companyName}
                    </h1>
                    <p className="brand-subtitle" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '2px 0 0 0' }}>
                        Project Manager
                    </p>
                </div>
                <button className="btn-toggle-sidebar" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
            </div>

            <nav className="sidebar-nav">
                {navGroups.map((group) => (
                    <div key={group.title} className="nav-group">
                        <h3 className="nav-group-title" style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', margin: '15px 0 5px 15px', fontWeight: '600' }}>{group.title}</h3>
                        <ul className="nav-list">
                            {group.items.map((item) => (
                                <li key={item.name} className="nav-item">
                                    <NavLink to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                        <item.icon size={18} className="nav-icon" />
                                        <span>{item.name}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="footer-user-info">
                    <div className="footer-avatar">
                        {user?.avatar ? <img src={getImageUrl(user.avatar)} alt="Avatar" /> : userInitials}
                    </div>
                    <div className="footer-details">
                        <p className="footer-name">{user?.fullName}</p>
                        <p className="footer-role">{user?.role}</p>
                    </div>
                </div>
                <button className="btn-logout-icon" onClick={onLogout} title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

export default ManagerSidebar;
