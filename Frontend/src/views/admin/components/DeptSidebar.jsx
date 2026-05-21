/**
 * DeptSidebar.jsx — Unified Department Sidebar
 *
 * Single file that houses the sidebar UI and nav-item config for every
 * department role. Layout.jsx and StaffLayout.jsx both import from here.
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
import {
    LayoutDashboard, FileText, Users, CheckSquare, Package, Send,
    ShoppingCart, Building2, Box, ClipboardCheck, Target,
    Wrench, Clock, Image, LogOut, Menu, Plus, CheckCircle,
    FolderOpen, CalendarOff, X, CreditCard, DollarSign, TrendingUp, BarChart2, Video
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../models/api';
import '../css/Sidebar.css';

// ─────────────────────────────────────────────────────────────────────────────
// Nav-item config map — keyed by role string
// ─────────────────────────────────────────────────────────────────────────────
const NAV_CONFIG = {
    'Design Manager': {
        brandTitle:    'STUDIO DESIGN',
        brandSubtitle: 'CREATIVE MANAGEMENT',
        sidebarClass:  'design',
        basePath:      '/',
        items: [
            { name: 'Dashboard',         icon: LayoutDashboard, path: '/?tab=dashboard',              tab: 'dashboard' },
            { name: 'Quotations',        icon: FileText,        path: '/quotations',                  tab: null },
            { name: 'Project Status',    icon: Clock,           path: '/?tab=pipeline',               tab: 'pipeline' },
            { name: 'Project Details',   icon: FileText,        path: '/?tab=project_details',        tab: 'project_details' },
            { name: 'Task Assignment',   icon: CheckSquare,     path: '/?tab=tasks',                   tab: 'tasks' },
            { name: 'Staff Overview',    icon: Users,           path: '/?tab=staff_overview',          tab: 'staff_overview' },
            { name: 'Material Hub',      icon: Package,         path: '/material-review',              tab: null },
        ],
    },

    'Design Staff': {
        brandTitle:   'Design Staff',
        sidebarClass: 'design',
        basePath:     '/',
        items: [
            { name: 'My Dashboard',    icon: LayoutDashboard, path: '/?tab=overview',    tab: 'overview' },
            { name: 'My Tasks',        icon: CheckSquare,     path: '/?tab=tasks',        tab: 'tasks' },
            { name: 'Revisions',       icon: Target,          path: '/?tab=revisions',    tab: 'revisions' },
            { name: 'Submitted Tasks', icon: CheckSquare,     path: '/?tab=submissions',  tab: 'submissions' },
        ],
    },

    'Project Manager': {
        brandTitle:   'Project Manager',
        sidebarClass: 'production',
        basePath:     '/production-management/dashboard',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/production-management/dashboard' },
            { name: 'Project Handoff', icon: Target,    path: '/production-management/handoff' },
            { name: 'Projects',  icon: Box,             path: '/production-management/projects' },
            { name: 'Tasks',     icon: CheckSquare,     path: '/production-management/tasks' },
            { name: 'Team',      icon: Users,           path: '/production-management/team' },
            { name: 'Approvals', icon: ClipboardCheck,  path: '/production-management/approvals' },
            { name: 'Reports',   icon: FileText,        path: '/production-management/reports' },
            { name: 'Meetings',  icon: Video,           path: '/meetings' },
        ],
    },

    'Project Engineer': {
        brandTitle:   'Engineer Portal',
        sidebarClass: 'production',
        basePath:     '/engineer/dashboard',
        items: [
            { name: 'Dashboard',     icon: LayoutDashboard, path: '/engineer/dashboard' },
            { name: 'Projects',      icon: FolderOpen,      path: '/engineer/projects' },
            { name: 'My Tasks',      icon: CheckSquare,     path: '/engineer/tasks' },
            { name: 'Site Reports',  icon: FileText,        path: '/engineer/reports' },
            { name: 'Approvals',     icon: ClipboardCheck,  path: '/engineer/approvals' },
            { name: 'Leave Request', icon: CalendarOff,     path: '/engineer/leave' },
            { name: 'Meetings',      icon: Video,           path: '/meetings' },
        ],
    },

    'Site Engineer': {
        brandTitle:   'Site Portal',
        sidebarClass: 'production',
        basePath:     '/site/dashboard',
        items: [
            { name: 'Dashboard',         icon: LayoutDashboard, path: '/site/dashboard' },
            { name: 'Projects',          icon: FolderOpen,      path: '/site/projects' },
            { name: 'Tasks',             icon: CheckSquare,     path: '/site/tasks' },
            { name: 'Transferred Tasks', icon: Users,           path: '/site/transferred-tasks' },
            { name: 'Reports',           icon: FileText,        path: '/site/reports' },
            { name: 'Leave Request',     icon: CalendarOff,     path: '/site/leave' },
            { name: 'Meetings',          icon: Video,           path: '/meetings' },
        ],
    },

    'Site Supervisor': {
        brandTitle:   'Site Supervisor',
        sidebarClass: 'production',
        basePath:     '/site/dashboard',
        items: [
            { name: 'Dashboard',     icon: LayoutDashboard, path: '/site/dashboard' },
            { name: 'Projects',      icon: FolderOpen,      path: '/site/projects' },
            { name: 'Tasks',         icon: CheckSquare,     path: '/site/tasks' },
            { name: 'Reports',       icon: FileText,        path: '/site/reports' },
            { name: 'Leave Request', icon: CalendarOff,     path: '/site/leave' },
            { name: 'Meetings',      icon: Video,           path: '/meetings' },
        ],
    },

    'Production Staff': {
        brandTitle:   'Production Staff',
        sidebarClass: 'production',
        basePath:     '/staff/dashboard',
        items: [
            { name: 'My Dashboard',  icon: LayoutDashboard, path: '/staff/dashboard' },
            { name: 'Task Tracker',  icon: CheckSquare,     path: '/staff/tasks' },
            { name: 'Site Inventory', icon: Box,            path: '/inventory' },
            { name: 'Checklists',    icon: ClipboardCheck,  path: '/checklists' },
        ],
    },

    'Accounts Manager': {
        brandTitle:    'Accounts Hub',
        brandSubtitle: 'FINANCIAL MANAGEMENT',
        sidebarClass:  'accounts',
        basePath:      '/',
        items: [
            { name: 'Dashboard',      icon: LayoutDashboard, path: '/?tab=overview',      tab: 'overview' },
            { name: 'Projects',       icon: FolderOpen,      path: '/?tab=projects',      tab: 'projects' },
            { name: 'Invoices',       icon: FileText,        path: '/?tab=invoices',      tab: 'invoices' },
            { name: 'Payments',       icon: CreditCard,      path: '/?tab=payments',      tab: 'payments' },
            { name: 'Expenses',       icon: DollarSign,      path: '/?tab=expenses',      tab: 'expenses' },
            { name: 'Clients',        icon: Users,           path: '/?tab=clients',       tab: 'clients' },
            { name: 'Vendors',        icon: Building2,       path: '/?tab=vendors',       tab: 'vendors' },
            { name: 'Reports',        icon: BarChart2,       path: '/?tab=reports',       tab: 'reports' },
        ],
    },

    'Accounts Staff': {
        brandTitle:    'Accounts Portal',
        brandSubtitle: 'STAFF WORKSPACE',
        sidebarClass:  'accounts',
        basePath:      '/',
        items: [
            { name: 'Overview',       icon: LayoutDashboard, path: '/?tab=overview',      tab: 'overview' },
            { name: 'Invoices',       icon: FileText,        path: '/?tab=invoices',      tab: 'invoices' },
            { name: 'Payments',       icon: CreditCard,      path: '/?tab=payments',      tab: 'payments' },
            { name: 'Expenses',       icon: DollarSign,      path: '/?tab=expenses',      tab: 'expenses' },
            { name: 'Vendors',        icon: Building2,       path: '/?tab=vendors',       tab: 'vendors' },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared helper — resolves avatar URL
// ─────────────────────────────────────────────────────────────────────────────
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DeptSidebar — the single exported component
// ─────────────────────────────────────────────────────────────────────────────
const DeptSidebar = ({ role, user, onLogout, isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar }) => {
    const location   = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentTab   = searchParams.get('tab') || 'overview';

    const config = NAV_CONFIG[role];

    // Graceful fallback — unknown role renders nothing
    if (!config) return null;

    const { brandTitle, brandSubtitle, sidebarClass, basePath, items } = config;

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    const isActiveTab = (item) => {
        if (item.tab) {
            return currentTab === item.tab && location.pathname === basePath;
        }
        return location.pathname === item.path;
    };

    return (
        <div className={`sidebar-container ${sidebarClass} ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header" style={role === 'Design Manager' ? { borderBottom: '1px solid rgba(0,0,0,0.05)' } : {}}>
                <div className="brand-wrapper">
                    {role === 'Design Manager' ? (
                        <>
                            <h1 className="brand-title" style={{ fontWeight: 300, letterSpacing: '3px', fontSize: '1rem' }}>
                                STUDIO <span style={{ fontWeight: 800 }}>DESIGN</span>
                            </h1>
                            <p className="brand-subtitle" style={{ fontSize: '0.6rem', color: '#c4a484', letterSpacing: '1px' }}>
                                CREATIVE MANAGEMENT
                            </p>
                        </>
                    ) : (
                        <h1 className="brand-title">{brandTitle}</h1>
                    )}
                </div>
                <button className="btn-toggle-sidebar" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <button className="btn-close-sidebar-mobile" onClick={toggleMobileSidebar || toggleSidebar} title="Close Sidebar">
                    <X size={20} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {items.map((item) => (
                        <li key={item.name} className="nav-item">
                            <NavLink
                                to={item.path}
                                className={() => `nav-link ${isActiveTab(item) ? 'active' : ''}`}
                                onClick={() => {
                                    if (window.innerWidth <= 768 && toggleMobileSidebar) {
                                        toggleMobileSidebar();
                                    }
                                }}
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

export default DeptSidebar;
