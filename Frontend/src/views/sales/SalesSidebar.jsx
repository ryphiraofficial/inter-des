import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    MapPin,
    Users,
    FileText,
    LogOut,
    ClipboardCheck
} from 'lucide-react';
import './css/SalesSidebar.css';

const NAV_ITEMS = [
    { to: '/staff/dashboard',   icon: LayoutDashboard,  label: 'Dashboard' },
    { to: '/staff/tasks',       icon: ClipboardList,    label: 'My Tasks'   },
    { to: '/staff/approvals',   icon: ClipboardCheck,   label: 'Client Approvals' },
    { to: '/staff/site-visits', icon: MapPin,           label: 'Site Visits' },
    { to: '/staff/clients',     icon: Users,            label: 'Clients'    },
    { to: '/staff/quotations',  icon: FileText,         label: 'Quotations' },
];

const SalesSidebar = ({ user, onLogout, isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout?.();
        navigate('/login');
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

    return (
        <>
            {isOpen && (
                <div className="sales-sidebar-overlay" onClick={toggleSidebar} />
            )}
            <aside className={`sales-sidebar ${isOpen ? 'mobile-open' : ''}`}>
                {/* Top Heading */}
                <div className="sales-sidebar-header">
                    <span className="sales-sidebar-logo-text">SALES</span>
                    <button className="sales-close-mobile" onClick={toggleSidebar}>
                        <LogOut size={18} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                </div>

                <div className="sales-sidebar-nav-container">
                    <nav className="sales-sidebar-nav">
                        <div className="sales-sidebar-section-label">DEPARTMENT</div>
                        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `sales-sidebar-item ${isActive ? 'active' : ''}`
                                }
                                onClick={() => isOpen && toggleSidebar()}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom Profile & Logout block */}
                <div className="sales-sidebar-footer">
                    <div className="sales-sidebar-user-block">
                        <div className="sales-sidebar-avatar">
                            {getInitials(user?.name)}
                        </div>
                        <div className="sales-sidebar-user-info">
                            <span className="sales-sidebar-user-name">{user?.name || 'Sales User'}</span>
                            <span className="sales-sidebar-user-role">{user?.role || 'Sales Staff'}</span>
                        </div>
                    </div>
                    <button
                        className="sales-sidebar-logout-btn"
                        onClick={handleLogout}
                        title="Log Out"
                    >
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SalesSidebar;
