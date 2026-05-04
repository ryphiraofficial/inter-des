import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, Users, FileText, DollarSign,
    CreditCard, Building2, BarChart2, Calendar, FolderOpen,
    Bell, MessageSquare, Award, Clock, Settings, Shield,
    HelpCircle, Activity, LogOut, ChevronRight, X, User, TrendingUp
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../models/api';
import './css/AccountsStaffSidebar.css';

const NavGroup = ({ item, isActive, toggleSidebar }) => {
    const [isExpanded, setIsExpanded] = useState(isActive);
    const location = useLocation();

    // Determine if any sub-item is currently active
    const hasActiveSub = item.subItems?.some(sub => {
        if (sub.path.includes('?tab=')) {
            const currentTab = new URLSearchParams(location.search).get('tab');
            const itemTab = new URLSearchParams(sub.path.split('?')[1]).get('tab');
            return currentTab === itemTab;
        }
        return location.pathname === sub.path;
    });

    const activeState = isActive || hasActiveSub;

    if (!item.subItems) {
        return (
            <NavLink
                to={item.path}
                className={({ isActive: linkActive }) => {
                    let finalActive = linkActive;
                    if (item.path.includes('?tab=')) {
                        const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';
                        const itemTab = new URLSearchParams(item.path.split('?')[1]).get('tab');
                        finalActive = currentTab === itemTab;
                    }
                    return `acct-nav-item ${finalActive ? 'active' : ''}`;
                }}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            >
                <div className="acct-nav-item-left">
                    <item.icon size={18} className="acct-nav-icon" />
                    <span>{item.name}</span>
                </div>
                {item.badge && (
                    <span className={`acct-badge acct-badge-${item.badgeColor || 'default'}`}>
                        {item.badge}
                    </span>
                )}
            </NavLink>
        );
    }

    return (
        <div className="acct-nav-group-wrapper">
            <button 
                className={`acct-nav-item ${activeState ? 'active' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <div className="acct-nav-item-left">
                    <item.icon size={18} className="acct-nav-icon" />
                    <span>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.badge && !isExpanded && (
                        <span className={`acct-badge acct-badge-${item.badgeColor || 'default'}`}>
                            {item.badge}
                        </span>
                    )}
                    <ChevronRight size={16} className="acct-chevron" />
                </div>
            </button>
            
            <ul className="acct-subnav-list" style={{ maxHeight: isExpanded ? `${item.subItems.length * 40}px` : '0px' }}>
                {item.subItems.map(sub => (
                    <li key={sub.name}>
                        <NavLink
                            to={sub.path}
                            className={({ isActive: linkActive }) => {
                                let finalActive = linkActive;
                                if (sub.path.includes('?tab=')) {
                                    const currentTab = new URLSearchParams(location.search).get('tab');
                                    const itemTab = new URLSearchParams(sub.path.split('?')[1]).get('tab');
                                    finalActive = currentTab === itemTab;
                                }
                                return `acct-subnav-item ${finalActive ? 'active' : ''}`;
                            }}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        >
                            <span>{sub.name}</span>
                            {sub.badge && (
                                <span className={`acct-badge acct-badge-${sub.badgeColor || 'default'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                                    {sub.badge}
                                </span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AccountsStaffSidebar = ({ user, onLogout, isOpen, toggleSidebar }) => {
    const location = useLocation();
    
    // Primary Modules
    const primaryNav = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/staff/dashboard' },
        { name: 'My Tasks', icon: CheckSquare, path: '/staff/tasks', badge: '3', badgeColor: 'warning' },
        { name: 'Clients', icon: Users, path: '/staff/clients' },
        { 
            name: 'Invoices', 
            icon: FileText, 
            path: '/staff/dashboard?tab=invoices', // Placeholder routes for future expansion
            badge: '2',
            badgeColor: 'danger',
            subItems: [
                { name: 'Pending', path: '/staff/dashboard?tab=invoices-pending', badge: '2', badgeColor: 'danger' },
                { name: 'Processing', path: '/staff/dashboard?tab=invoices-processing' },
                { name: 'Drafts', path: '/staff/dashboard?tab=invoices-drafts' },
            ]
        },
        { 
            name: 'Expenses', 
            icon: DollarSign, 
            path: '/staff/dashboard?tab=expenses',
            subItems: [
                { name: 'Submissions', path: '/staff/dashboard?tab=expenses-submissions' },
                { name: 'Approvals', path: '/staff/dashboard?tab=expenses-approvals' },
            ]
        },
        { name: 'Payments', icon: CreditCard, path: '/staff/dashboard?tab=payments' },
        { name: 'Vendors', icon: Building2, path: '/staff/dashboard?tab=vendors' },
        { name: 'Reports', icon: BarChart2, path: '/staff/dashboard?tab=reports' },
        { name: 'Calendar', icon: Calendar, path: '/staff/dashboard?tab=calendar' },
        { name: 'Documents', icon: FolderOpen, path: '/staff/dashboard?tab=documents' },
    ];

    // Secondary Tools
    const secondaryNav = [
        { name: 'Notifications', icon: Bell, path: '/staff/notifications', badge: 'New', badgeColor: 'primary' },
        { name: 'Internal Notes', icon: MessageSquare, path: '/staff/notes' },
        { name: 'Performance', icon: Award, path: '/staff/performance' },
        { name: 'Attendance', icon: Clock, path: '/staff/attendance' },
    ];

    // System Nav
    const systemNav = [
        { name: 'Settings', icon: Settings, path: '/staff/settings' },
        { name: 'Security', icon: Shield, path: '/staff/security' },
        { name: 'Help Center', icon: HelpCircle, path: '/staff/help' },
        { name: 'Audit Logs', icon: Activity, path: '/staff/audit' },
    ];

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'AS';

    return (
        <>
            {/* Mobile Header Toggle inside StaffLayout, but we can have an overlay here */}
            <div className={`acct-mobile-overlay ${isOpen ? 'visible' : ''}`} onClick={toggleSidebar}></div>

            <div className={`acct-sidebar-container ${isOpen ? 'open' : ''}`}>
                <div className="acct-sidebar-header">
                    <div className="acct-brand">
                        <div className="acct-logo-box">
                            <TrendingUp size={22} strokeWidth={2.5} />
                        </div>
                        <div className="acct-brand-text">
                            <span className="acct-brand-title">Interior Design</span>
                            <span className="acct-brand-subtitle">Accounts Portal</span>
                        </div>
                    </div>
                </div>

                <div className="acct-user-card">
                    <div className="acct-avatar-wrapper">
                        {user?.avatar ? (
                            <img src={getImageUrl(user.avatar)} alt="Avatar" className="acct-avatar" />
                        ) : (
                            <div className="acct-avatar">{userInitials}</div>
                        )}
                        <span className="acct-status-dot"></span>
                    </div>
                    <div className="acct-user-info">
                        <span className="acct-user-name">{user?.fullName || 'Accounts Staff'}</span>
                        <span className="acct-user-role">{user?.role || 'Staff Operations'}</span>
                    </div>
                </div>

                <div className="acct-quick-actions">
                    <button className="acct-quick-btn" title="Notifications">
                        <Bell size={14} />
                        Alerts
                    </button>
                    <button className="acct-quick-btn" title="Task Reminders">
                        <CheckSquare size={14} />
                        Tasks
                    </button>
                </div>

                <div className="acct-sidebar-scrollarea">
                    <div className="acct-nav-section">
                        <h3 className="acct-nav-title">Primary Workspace</h3>
                        <ul className="acct-nav-list">
                            {primaryNav.map(item => (
                                <li key={item.name}>
                                    <NavGroup 
                                        item={item} 
                                        isActive={
                                            (location.pathname === item.path) || 
                                            (item.path.includes('?tab=') && new URLSearchParams(location.search).get('tab') === new URLSearchParams(item.path.split('?')[1]).get('tab')) ||
                                            (location.pathname === '/staff/dashboard' && item.path === '/staff/dashboard' && !location.search) // explicit check for exact match without tabs
                                        } 
                                        toggleSidebar={toggleSidebar} 
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="acct-nav-section">
                        <h3 className="acct-nav-title">Staff Tools</h3>
                        <ul className="acct-nav-list">
                            {secondaryNav.map(item => (
                                <li key={item.name}>
                                    <NavGroup item={item} isActive={location.pathname === item.path} toggleSidebar={toggleSidebar} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="acct-nav-section">
                        <h3 className="acct-nav-title">Administrative</h3>
                        <ul className="acct-nav-list">
                            {systemNav.map(item => (
                                <li key={item.name}>
                                    <NavGroup item={item} isActive={location.pathname === item.path} toggleSidebar={toggleSidebar} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="acct-sidebar-footer">
                    <button className="acct-logout-btn" onClick={onLogout}>
                        <LogOut size={16} />
                        <span>Logout securely</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AccountsStaffSidebar;
