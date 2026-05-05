import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Camera,
    Users,
    FileText,
    LogOut,
    Menu,
    X,
    User,
    Target,
    Truck,
    Wrench,
    DollarSign,
    Building2,
    Palette,
    ShoppingCart,
    ClipboardCheck,
    CheckCircle,
    TrendingUp,
    BarChart2
} from 'lucide-react';
import { getRoleDepartment, useRoleDashboard } from '../../controllers/hooks/useRoleDashboard';
import './css/StaffSidebar.css';

const StaffSidebar = ({ user, onLogout, isOpen, toggleSidebar }) => {
    const department = getRoleDepartment(user?.role);
    const dashboardType = useRoleDashboard(user?.role);

    const getMenuItems = () => {
        const departmentItems = {
            Design: [
                { name: 'Dashboard',     icon: LayoutDashboard, path: '/staff/dashboard' },
                { name: 'My Tasks',      icon: CheckSquare,     path: '/staff/tasks' },
                { name: 'Site Visits',   icon: Camera,          path: '/staff/site-visits' },
                { name: 'Clients',       icon: Users,           path: '/staff/clients' },
                { name: 'Quotations',    icon: FileText,        path: '/staff/quotations' },
            ],
            Procurement: [
                { name: 'Dashboard',     icon: LayoutDashboard, path: '/staff/dashboard' },
                { name: 'My Tasks',      icon: CheckSquare,     path: '/staff/tasks' },
                { name: 'Clients',       icon: Users,           path: '/staff/clients' },
            ],
            Production: [
                { name: 'Dashboard',     icon: LayoutDashboard, path: '/staff/dashboard' },
                { name: 'My Tasks',      icon: CheckSquare,     path: '/staff/tasks' },
                { name: 'Site Visits',   icon: Camera,          path: '/staff/site-visits' },
                { name: 'Clients',       icon: Users,           path: '/staff/clients' },
            ],
            Accounts: [
                { name: 'Dashboard',     icon: LayoutDashboard, path: '/staff/dashboard' },
                { name: 'My Tasks',      icon: CheckSquare,     path: '/staff/tasks' },
                { name: 'Clients',       icon: Users,           path: '/staff/clients' },
            ],
            Sales: {
                groups: [
                    {
                        title: 'Sales Operations',
                        items: [
                            { name: 'Dashboard',      icon: LayoutDashboard, path: '/staff/dashboard' },
                            { name: 'Action Center',  icon: Target,          path: '/staff/tasks', badge: null },
                            { name: 'Site Visits',    icon: Camera,          path: '/staff/site-visits' },
                            { name: 'Quotations',     icon: FileText,        path: '/staff/quotations' },
                        ]
                    },
                    {
                        title: 'CRM',
                        items: [
                            { name: 'Clients',        icon: Users,           path: '/staff/clients' },
                        ]
                    },
                ]
            },
            'Sales Manager': {
                groups: [
                    {
                        title: 'Sales Operations',
                        items: [
                            { name: 'Dashboard',      icon: LayoutDashboard, path: '/staff/dashboard' },
                            { name: 'Action Center',  icon: Target,          path: '/staff/tasks', badge: null },
                            { name: 'Site Visits',    icon: Camera,          path: '/staff/site-visits' },
                            { name: 'Quotations',     icon: FileText,        path: '/staff/quotations' },
                        ]
                    },
                    {
                        title: 'CRM',
                        items: [
                            { name: 'Clients',        icon: Users,           path: '/staff/clients' },
                            { name: 'Reports',        icon: BarChart2,       path: '/staff/reports' },
                        ]
                    },
                ]
            },
            Admin: [
                { name: 'Dashboard',     icon: LayoutDashboard, path: '/staff/dashboard' },
                { name: 'My Tasks',      icon: CheckSquare,     path: '/staff/tasks' },
                { name: 'Site Visits',   icon: Camera,          path: '/staff/site-visits' },
                { name: 'Clients',       icon: Users,           path: '/staff/clients' },
                { name: 'Quotations',    icon: FileText,        path: '/staff/quotations' },
            ]
        };

        return departmentItems[department] || departmentItems[user?.role] || { groups: null, items: departmentItems.Admin };
    };

    const menuConfig = getMenuItems();
    const isSalesGrouped = menuConfig?.groups !== undefined;
    const menuItems = isSalesGrouped ? null : (menuConfig.items || menuConfig);

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : department ? department[0].toUpperCase() : 'U';

    return (
        <>
            <div className="staff-mobile-header">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="mobile-brand">Interior Design</div>
                <div className="mobile-user-icon" style={{ visibility: 'hidden' }}>
                    <User size={20} />
                </div>
            </div>

            {isOpen && <div className="staff-sidebar-overlay" onClick={toggleSidebar}></div>}

            <div className={`staff-sidebar ${isOpen ? 'open' : ''}`}>

                <div className="user-profile">
                    <div className="avatar" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        {userInitials}
                    </div>
                    <div className="user-info">
                        <span className="name">{user?.fullName}</span>
                        <span className="role">{user?.role}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {isSalesGrouped ? (
                        // Grouped CRM nav for Sales roles
                        menuConfig.groups.map(group => (
                            <div key={group.title}>
                                <div style={{
                                    fontSize: '0.6rem',
                                    fontWeight: 800,
                                    color: '#94a3b8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.09em',
                                    padding: '12px 14px 4px',
                                }}>
                                    {group.title}
                                </div>
                                <ul>
                                    {group.items.map(item => (
                                        <li key={item.name}>
                                            <NavLink
                                                to={item.path}
                                                className={({ isActive }) => isActive ? 'active' : ''}
                                                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                            >
                                                <item.icon size={20} />
                                                <span style={{ flex: 1 }}>{item.name}</span>
                                                {item.badge !== undefined && (
                                                    <span style={{
                                                        background: '#4f46e5',
                                                        color: 'white',
                                                        fontSize: '0.65rem',
                                                        fontWeight: 800,
                                                        padding: '2px 7px',
                                                        borderRadius: '20px',
                                                        minWidth: '20px',
                                                        textAlign: 'center',
                                                    }}>
                                                        •
                                                    </span>
                                                )}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        // Flat nav for all other departments
                        <ul>
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                    >
                                        <item.icon size={20} />
                                        <span>{item.name}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default StaffSidebar;
