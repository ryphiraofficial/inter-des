import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { NAV_ITEMS } from './accountsNavConfig';
import '../css/AccountsLayout.css';

const AccountsSidebar = ({ user, onLogout, isOpen, onClose }) => {
    const role = user?.role || 'Accounts Staff';

    const renderNavItems = () => {
        return NAV_ITEMS.map((item) => {
            if (!item.roles.includes(role)) return null;

            const Icon = item.icon;
            return (
                <NavLink
                    key={item.tab}
                    to={`/accounts?tab=${item.tab}`}
                    className={({ isActive }) => `accounts-sidebar-item ${isActive || window.location.search.includes(`tab=${item.tab}`) ? 'active' : ''}`}
                    onClick={() => {
                        if (onClose) onClose();
                    }}
                >
                    <Icon className="accounts-sidebar-icon" />
                    <span>{item.label}</span>
                </NavLink>
            );
        });
    };

    return (
        <aside className={`accounts-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="accounts-sidebar-header" style={{ padding: '1.5rem 1rem 0.5rem', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', paddingLeft: '0.2rem' }}>Accounts Dept</h2>
                <div className="accounts-sidebar-user-block" style={{ paddingLeft: '0.2rem' }}>
                    <div className="accounts-sidebar-avatar">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="accounts-sidebar-user-info">
                        <span className="accounts-sidebar-user-name">{user?.fullName || 'User'}</span>
                        <span className="accounts-sidebar-user-role">{role}</span>
                    </div>
                </div>
            </div>

            <nav className="accounts-sidebar-nav">
                {renderNavItems()}
            </nav>

            <div className="accounts-sidebar-footer">
                <button onClick={onLogout} className="accounts-sidebar-logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AccountsSidebar;
