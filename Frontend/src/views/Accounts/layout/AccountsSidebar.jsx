import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { NAV_ITEMS } from './accountsNavConfig';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import { BASE_IMAGE_URL } from '../../../config/constants';
import '../css/AccountsLayout.css';

const AccountsSidebar = ({ user, onLogout, isOpen, onClose }) => {
    const role = user?.role || 'Accounts Staff';
    const { companyName } = useCompanySettings();

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const displayName = user?.fullName || user?.name || 'User';
    const userInitials = displayName ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

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
                    <Icon size={18} className="nav-icon" />
                    <span>{item.label}</span>
                </NavLink>
            );
        });
    };

    return (
        <aside className={`accounts-sidebar${isOpen ? ' accounts-sidebar--open' : ''}`}>
            <div className="sidebar-header">
                <div className="brand-wrapper">
                    <h1 className="brand-title">
                        {companyName}
                    </h1>
                    <p className="brand-subtitle">
                        {role}
                    </p>
                </div>
                <button className="btn-close-sidebar-mobile accounts-sidebar-close" onClick={onClose} aria-label="Close menu" title="Close Sidebar">
                    <X size={20} />
                </button>
            </div>

            <div className="accounts-sidebar-nav-container">
                <nav className="accounts-sidebar-nav">
                    <div className="accounts-sidebar-section-label">NAVIGATION</div>
                    {renderNavItems()}
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="footer-user-info">
                    <div className="footer-avatar">
                        {user?.avatar ? (
                            <img src={getImageUrl(user.avatar)} alt="Avatar" />
                        ) : (
                            userInitials
                        )}
                    </div>
                    <div className="footer-details">
                        <p className="footer-name">{displayName}</p>
                        <p className="footer-role">{role ? role.replace(/_/g, ' ') : 'Accounts'}</p>
                    </div>
                </div>
                {onLogout && (
                    <button className="btn-logout-icon" onClick={onLogout} title="Logout">
                        <LogOut size={18} />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default AccountsSidebar;
