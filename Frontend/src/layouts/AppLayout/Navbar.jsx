import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Menu, Search, RefreshCw, Bell, User, Settings, LogOut } from 'lucide-react';
import { TAB_META, SEARCH_CONFIGS } from './departmentConfig';
import { useNotificationLogic } from '../../views/admin/header/hooks/useNotificationLogic';
import NotificationPopup from '../../views/admin/header/components/NotificationPopup';
import '../../views/admin/css/Header.css';

/**
 * Universal Configuration-Driven Navbar Component
 */
const Navbar = ({
    title: explicitTitle,
    description: explicitDescription,
    search,
    setSearch,
    searchPlaceholder,
    onRefresh,
    isLoading,
    actions,
    onMenuToggle,
    onLogout,
    user
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const queryTab = searchParams.get('tab');
    const pathSegments = location.pathname.replace(/^\//, '').split('/');
    let pathKey = pathSegments[0];
    if ((pathSegments[0] === 'staff' || pathSegments[0] === 'production-management' || pathSegments[0] === 'hr' || pathSegments[0] === 'sales') && pathSegments[1]) {
        pathKey = pathSegments[1];
    }
    const activeTab = queryTab || pathKey || 'overview';
    const resolvedKey = activeTab;
    const currentMeta = TAB_META[resolvedKey] || { label: 'Overview', description: 'High-level performance and operational metrics' };

    const pageTitle = explicitTitle || currentMeta.label;
    const pageDescription = explicitDescription !== undefined ? explicitDescription : currentMeta.description;
    const placeholder = searchPlaceholder || SEARCH_CONFIGS[resolvedKey]?.placeholder || 'Search...';

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showProfile, setShowProfile] = useState(false);

    const wrapperRef = useRef(null);
    const popupRef = useRef(null);
    const profileRef = useRef(null);

    const notificationLogic = useNotificationLogic({
        setNotifications,
        setUnreadCount,
        showNotifications,
        setShowNotifications,
        notifications
    });

    // Close notifications on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handler);
            document.addEventListener('touchstart', handler);
        }
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [showNotifications]);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        };
        if (showProfile) {
            document.addEventListener('mousedown', handler);
            document.addEventListener('touchstart', handler);
        }
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [showProfile]);

    const getInitials = (u) => {
        const name = u?.fullName || u?.name || u?.username || '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'WA';
    };

    return (
        <header className="app-navbar">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="app-navbar-left">
                <button
                    className="app-navbar-hamburger"
                    onClick={onMenuToggle}
                    aria-label="Toggle navigation menu"
                    title="Toggle Menu"
                >
                    <Menu size={20} />
                </button>
                <div className="app-navbar-title-wrap">
                    <h1 className="app-navbar-title">{pageTitle}</h1>
                    {pageDescription && <p className="app-navbar-desc">{pageDescription}</p>}
                </div>
            </div>

            {/* Right: Search, Refresh, Custom Actions, Notifications, Profile */}
            <div className="app-navbar-right">
                {/* Search Bar */}
                {setSearch && search !== null && activeTab !== 'invoices' && (
                    <div className="app-navbar-search">
                        <Search size={16} className="app-navbar-search-icon" />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                )}

                {/* Refresh Button */}
                {onRefresh && (
                    <button
                        className="app-navbar-btn-action"
                        onClick={onRefresh}
                        disabled={isLoading}
                        title="Refresh Data"
                    >
                        <RefreshCw size={15} className={isLoading ? 'shell-spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}

                {/* Custom Action Slots */}
                {actions}

                {/* Notifications Bell */}
                <div className="header-notification-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
                    <button
                        className={`app-navbar-notif-btn ${showNotifications ? 'active' : ''}`}
                        onClick={notificationLogic.toggleNotifications}
                        title="Notifications"
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="app-navbar-notif-badge">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <NotificationPopup
                        showNotifications={showNotifications}
                        notifications={notifications}
                        unreadCount={unreadCount}
                        handleMarkAsRead={notificationLogic.handleMarkAsRead}
                        handleMarkAllRead={notificationLogic.handleMarkAllRead}
                        handleDelete={notificationLogic.handleDelete}
                        setShowNotifications={setShowNotifications}
                        popupRef={popupRef}
                    />
                </div>

                {/* Profile menu for mobile */}
                <div className="mobile-profile-wrapper accounts-mobile-profile" ref={profileRef} style={{ display: 'none' }}>
                    <button
                        className="header-profile-btn"
                        onClick={() => setShowProfile(v => !v)}
                        aria-label="Profile menu"
                        style={{
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {getInitials(user)}
                    </button>

                    {showProfile && (
                        <div className="accounts-profile-dropdown">
                            <div className="accounts-profile-dropdown-header">
                                <div className="accounts-profile-dropdown-info">
                                    <span className="accounts-profile-dropdown-name">{user?.fullName || user?.name || 'User'}</span>
                                    <span className="accounts-profile-dropdown-role">
                                        {user?.role?.replace(/_/g, ' ') || 'Staff'}
                                    </span>
                                </div>
                            </div>
                            <div className="accounts-profile-dropdown-divider" />
                            <div className="accounts-profile-dropdown-menu">
                                <button className="accounts-profile-menu-item" onClick={() => { setShowProfile(false); navigate('/settings'); }}>
                                    <Settings size={17} className="accounts-profile-menu-icon" />
                                    <span>Settings</span>
                                </button>
                            </div>
                            <div className="accounts-profile-dropdown-divider" />
                            {onLogout && (
                                <button className="accounts-profile-dropdown-logout" onClick={() => { setShowProfile(false); onLogout(); }}>
                                    <LogOut size={16} />
                                    <span>Log Out</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
