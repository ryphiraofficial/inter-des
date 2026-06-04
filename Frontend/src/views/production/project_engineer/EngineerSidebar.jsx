import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, LogOut, Menu, HardHat, FolderOpen, CalendarOff, Users, Video
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../config/constants';
import '../../admin/css/Sidebar.css';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const EngineerSidebar = ({ onLogout, isCollapsed, toggleSidebar }) => {
    const user = useAppSelector(selectUser);
    const navGroups = [
        {
            title: "Engineer Portal",
            items: [
                { name: 'Dashboard',     icon: LayoutDashboard, path: '/engineer/dashboard' },
                { name: 'Projects',      icon: FolderOpen,      path: '/engineer/projects' },
                { name: 'My Tasks',      icon: CheckSquare,     path: '/engineer/tasks' },
                { name: 'Transferred Tasks', icon: Users,       path: '/engineer/transferred-tasks' },
                { name: 'Leave Request', icon: CalendarOff,     path: '/engineer/leave' },
                { name: 'Meetings',      icon: Video,           path: '/meetings' },
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
                        Project Engineer
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

export default EngineerSidebar;
