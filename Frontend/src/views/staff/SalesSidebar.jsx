import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Target, Phone, Camera, FileText,
    Users, Briefcase, BarChart2, TrendingUp, DollarSign,
    CheckCircle, LogOut, Zap, Layers, X
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../models/api';
import './css/SalesSidebar.css';

/* ─── Nav config ──────────────────────────────────────────────────────────── */
const SALES_STAFF_NAV = [
    {
        group: 'Sales Operations',
        items: [
            { name: 'Dashboard',      icon: LayoutDashboard, path: '/staff/dashboard' },
            { name: 'My Projects',    icon: Layers,          path: '/staff/tasks' },
            { name: 'Site Visits',    icon: Camera,          path: '/staff/site-visits' },
            { name: 'Clients',        icon: Users,           path: '/staff/clients' },
            { name: 'Opportunities',  icon: Briefcase,       path: '/staff/opportunities', badge: 'New', badgeStyle: 'new' },
        ],
    }
];

const SALES_MANAGER_NAV = [
    {
        group: 'Sales Operations',
        items: [
            { name: 'Dashboard',      icon: LayoutDashboard, path: '/staff/dashboard' },
            { name: 'Team Projects',  icon: Layers,          path: '/staff/tasks' },
            { name: 'Site Visits',    icon: Camera,          path: '/staff/site-visits' },
            { name: 'Clients',        icon: Users,           path: '/staff/clients' },
            { name: 'Opportunities',  icon: Briefcase,       path: '/staff/opportunities' },
        ],
    },
    {
        group: 'Analytics',
        items: [
            { name: 'Reports',        icon: BarChart2,       path: '/staff/reports' },
            { name: 'Team Targets',   icon: TrendingUp,      path: '/staff/reports' },
            { name: 'Revenue',        icon: DollarSign,      path: '/staff/reports' },
        ],
    },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
const SalesSidebar = ({ user, onLogout, isOpen, toggleSidebar }) => {
    const isManager = user?.role?.toLowerCase().includes('manager');
    const navGroups = isManager ? SALES_MANAGER_NAV : SALES_STAFF_NAV;

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'SA';

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };
    const avatarSrc = getImageUrl(user?.avatar);

    // Mock KPI data — replace with real API data when available
    const kpiItems = isManager
        ? [{ val: '₹8.4L', lbl: 'Revenue' }, { val: '23', lbl: 'Leads' }, { val: '68%', lbl: 'Conv.' }]
        : [{ val: '12',    lbl: 'Tasks'   }, { val: '4',  lbl: 'Visits' }, { val: '3',   lbl: 'Quotes' }];
    const targetPct = isManager ? 72 : 58;

    const handleClick = () => {
        if (window.innerWidth < 1024) toggleSidebar();
    };

    return (
        <>
            <div className={`sales-sidebar-container ${isOpen ? 'open' : ''}`}>
                <button className="sales-close-sidebar" onClick={toggleSidebar} title="Close Sidebar">
                    <X size={20} />
                </button>

                {/* ── Profile block ── */}
                <div className="sales-profile-block">
                    <div className="sales-profile-card">
                        <div className="sales-profile-top">
                            <div className="sales-avatar">
                                {avatarSrc
                                    ? <img src={avatarSrc} alt={user?.fullName} className="sales-avatar-img" />
                                    : userInitials
                                }
                            </div>
                            <div className="sales-profile-info">
                                <span className="sales-profile-name">
                                    {user?.fullName || 'Sales User'}
                                </span>
                                <div className="sales-profile-role">
                                    <span className="sales-dept-badge">Sales</span>
                                    {isManager && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>Manager</span>}
                                </div>
                            </div>
                        </div>

                        {/* KPI strip */}
                        <div className="sales-kpi-strip">
                            {kpiItems.map(k => (
                                <div key={k.lbl} className="sales-kpi-item">
                                    <span className="sales-kpi-val">{k.val}</span>
                                    <span className="sales-kpi-lbl">{k.lbl}</span>
                                </div>
                            ))}
                        </div>

                        {/* Target progress */}
                        <div className="sales-target-bar-wrap">
                            <div className="sales-target-bar-header">
                                <span className="sales-target-label">Monthly Target</span>
                                <span className="sales-target-pct">{targetPct}%</span>
                            </div>
                            <div className="sales-target-bar-bg">
                                <div
                                    className="sales-target-bar-fill"
                                    style={{ width: `${targetPct}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Scrollable nav ── */}
                <div className="sales-sidebar-scroll">
                    {navGroups.map(group => (
                        <div key={group.group} className="sales-nav-group">
                            <div className="sales-nav-group-title">{group.group}</div>
                            <ul className="sales-nav-list">
                                {group.items.map(item => (
                                    <li key={item.name + item.path}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `sales-nav-link${isActive ? ' active' : ''}`
                                            }
                                            onClick={handleClick}
                                        >
                                            <item.icon size={17} className="sales-nav-icon" />
                                            <span className="sales-nav-label">{item.name}</span>
                                            {item.badge && (
                                                <span className={`sales-nav-badge ${item.badgeStyle}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ── Footer ── */}
                <div className="sales-sidebar-footer">
                    <button className="sales-logout-btn" onClick={onLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>

            </div>
        </>
    );
};

export default SalesSidebar;
