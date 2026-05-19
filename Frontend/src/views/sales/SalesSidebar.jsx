import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    MapPin,
    Users,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    X,
    Menu,
} from 'lucide-react';
import './css/SalesSidebar.css';

const NAV_ITEMS = [
    { to: '/staff/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/staff/tasks',       icon: ClipboardList,   label: 'My Tasks'   },
    { to: '/staff/site-visits', icon: MapPin,          label: 'Site Visits' },
    { to: '/staff/clients',     icon: Users,           label: 'Clients'    },
    { to: '/staff/quotations',  icon: FileText,        label: 'Quotations' },
];

const SalesSidebar = ({ user, onLogout, isOpen, toggleSidebar }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout?.();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'S';

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div className="sales-sidebar-overlay" onClick={toggleSidebar} />
            )}

            <aside className={`sales-sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'mobile-open' : ''}`}>

                {/* Brand */}
                <div className="sales-sidebar-brand">
                    <div className="sales-brand-icon">
                        <TrendingUp size={20} />
                    </div>
                    {!collapsed && (
                        <div className="sales-brand-text">
                            <span className="sales-brand-name">Sales</span>
                            <span className="sales-brand-sub">Department</span>
                        </div>
                    )}
                    
                    <button
                        className="sales-collapse-btn-inline header-version"
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? 'Expand' : 'Collapse'}
                    >
                        <Menu size={16} />
                    </button>

                    <button className="sales-close-mobile" onClick={toggleSidebar}>
                        <X size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="sales-sidebar-nav">
                    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `sales-nav-item ${isActive ? 'active' : ''}`
                            }
                            title={collapsed ? label : undefined}
                            onClick={() => isOpen && toggleSidebar()}
                        >
                            <span className="sales-nav-icon"><Icon size={18} /></span>
                            {!collapsed && <span className="sales-nav-label">{label}</span>}
                            {!collapsed && <span className="sales-nav-indicator" />}
                        </NavLink>
                    ))}
                </nav>

                {/* User footer */}
                <div className="sales-sidebar-footer">
                    <div className="sales-user-card">
                        <div className="sales-user-avatar">{initials}</div>
                        {!collapsed && (
                            <div className="sales-user-info">
                                <span className="sales-user-name">{user?.name || 'Sales User'}</span>
                                <span className="sales-user-role">{user?.role || 'Sales Staff'}</span>
                            </div>
                        )}
                    </div>
                    <button
                        className="sales-logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={20} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SalesSidebar;
