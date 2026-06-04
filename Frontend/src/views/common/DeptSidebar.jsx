/**
 * DeptSidebar.jsx — Unified Department Sidebar
 *
 * Props:
 *   role         {string}   - The user's role string (e.g. 'Design Manager')
 *   user         {object}   - User object ({ fullName, role, avatar })
 *   onLogout     {function} - Logout callback
 *   isCollapsed  {bool}     - Whether the sidebar is in collapsed/icon-only mode
 *   toggleSidebar{function} - Callback to toggle collapsed state
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../config/constants';
import '../admin/css/Sidebar.css';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';
import NAV_CONFIG from './navConfig';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const DeptSidebar = ({ role, user, onLogout, isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar }) => {
    const location    = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentTab   = searchParams.get('tab') || 'overview';

    const config = NAV_CONFIG[role];
    if (!config) return null;

    const { sidebarClass, basePath, items } = config;

    const displayName  = user?.fullName || user?.name || 'User';
    const userInitials = displayName
        ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    const isActiveTab = (item) => {
        if (item.tab) return currentTab === item.tab && location.pathname === basePath;
        return location.pathname === item.path;
    };

    return (
        <div className={`sidebar-container ${sidebarClass} ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header" style={role === 'Design Manager' ? { borderBottom: '1px solid rgba(0,0,0,0.05)' } : {}}>
                <div className="brand-wrapper">
                    {role === 'Design Manager' ? (
                        <>
                            <h1 className="brand-title" style={{ fontWeight: 300, letterSpacing: '3px', fontSize: '24px', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {companyName}
                            </h1>
                            <p className="brand-subtitle" style={{ fontSize: '0.6rem', color: '#c4a484', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {motto || defaultSubtitle}
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="brand-title" style={{ fontSize: '24px', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{companyName}</h1>
                            <p className="brand-subtitle" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{motto || defaultSubtitle}</p>
                        </>
                    )}
                </div>
                <button className="btn-toggle-sidebar" onClick={toggleSidebar}><Menu size={20} /></button>
                <button className="btn-close-sidebar-mobile" onClick={toggleMobileSidebar || toggleSidebar} title="Close Sidebar"><X size={20} /></button>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {items.map((item) => (
                        <li key={item.name} className="nav-item">
                            <NavLink
                                to={item.path}
                                className={() => `nav-link ${isActiveTab(item) ? 'active' : ''}`}
                                onClick={() => { if (window.innerWidth <= 768 && toggleMobileSidebar) toggleMobileSidebar(); }}
                            >
                                <item.icon size={18} className="nav-icon" />
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="footer-user-info">
                    <div className="footer-avatar">
                        {user?.avatar ? <img src={getImageUrl(user.avatar)} alt="Avatar" /> : userInitials}
                    </div>
                    <div className="footer-details">
                        <p className="footer-name">{displayName}</p>
                        <p className="footer-role">{user?.role ? user.role.replace(/_/g, ' ') : ''}</p>
                    </div>
                </div>
                <button className="btn-logout-icon mobile-hide" onClick={onLogout} title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

export default DeptSidebar;
