import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw, Bell, Search, Video, Menu, LogOut, User, Settings } from 'lucide-react';
import { useNotificationLogic } from '../../admin/header/hooks/useNotificationLogic';
import NotificationPopup from '../../admin/header/components/NotificationPopup';
import '../../admin/css/Header.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';
import { TAB_META, SEARCH_CONFIGS } from './accountsNavConfig';

const AccountsNavbar = ({ onRefresh, isLoading, search, setSearch, onMenuToggle, onLogout }) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const currentTab = TAB_META[activeTab] || { label: 'Overview' };
    const searchConfig = SEARCH_CONFIGS[activeTab];

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showProfile, setShowProfile] = useState(false);

    const wrapperRef = useRef(null);
    const popupRef = useRef(null);
    const profileRef = useRef(null);

    const getInitials = (user) => {
        const name = user?.fullName || user?.name || '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AM';
    };

    const notificationLogic = useNotificationLogic({
        setNotifications,
        setUnreadCount,
        showNotifications,
        setShowNotifications,
        notifications
    });

    /* Close notifications on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target))
                setShowNotifications(false);
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

    /* Close profile dropdown on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target))
                setShowProfile(false);
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

    const handleProfileNav = (path) => {
        setShowProfile(false);
        navigate(path);
    };

    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchInputRef = useRef(null);

    /* Close search on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (isSearchExpanded && !e.target.closest('.header-search-bar')) {
                setIsSearchExpanded(false);
            }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [isSearchExpanded]);

    const handleSearchClick = () => {
        if (!isSearchExpanded) {
            setIsSearchExpanded(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            setIsSearchExpanded(false);
        }
    };

    return (
        <header className="page-header accounts-navbar" style={{ overflow: 'visible' }}>
            {/* ── Left: Mobile Menu button + Title / Description ── */}
            <div className="header-left accounts-navbar-brand">
                <button
                    className="mobile-menu-btn accounts-hamburger"
                    onClick={onMenuToggle}
                    aria-label="Open navigation menu"
                    title="Open Menu"
                >
                    <Menu size={22} strokeWidth={2.4} />
                </button>
                <div className="welcome-text">
                    <h1>{currentTab.label}</h1>
                    {currentTab.description && <p>{currentTab.description}</p>}
                </div>
            </div>

            {/* ── Right: Search + Refresh + Actions + Notifications + Mobile Profile ── */}
            <div className="page-header-actions accounts-navbar-right" style={{ overflow: 'visible' }}>
                {/* Search */}
                {searchConfig && setSearch && (
                    <div className={`header-search-bar ${isSearchExpanded ? 'expanded' : 'collapsed'}`}>
                        <button
                            className="search-toggle-btn"
                            onClick={handleSearchClick}
                            title={isSearchExpanded ? 'Close search' : 'Search'}
                        >
                            <Search size={18} />
                        </button>
                        {isSearchExpanded && (
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={searchConfig.placeholder}
                                value={search || ''}
                                onChange={e => setSearch(e.target.value)}
                            />
                        )}
                    </div>
                )}

                {/* Refresh */}
                {onRefresh && (
                    <button className="accounts-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={15} className={isLoading ? 'spin' : ''} />
                        <span className="accounts-btn-label">{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}

                {/* Add Expense */}
                {['expenses', 'company_expenses'].includes(activeTab) && (
                    <button
                        className="btn-primary"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-create-expense-modal'))}
                    >
                        + <span className="accounts-btn-label">Add Expense</span>
                    </button>
                )}

                {/* Schedule Meeting */}
                {activeTab === 'meetings' && ['admin', 'super admin', 'superadmin'].includes(user?.role?.toLowerCase()) && (
                    <button
                        className="btn-primary"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-schedule-meeting-modal'))}
                    >
                        <Video size={16} />
                        <span className="accounts-btn-label">Schedule Meeting</span>
                    </button>
                )}

                {/* ── Notifications Bell ── */}
                <div className="header-notification-wrapper accounts-hide-on-mobile" ref={wrapperRef} style={{ position: 'relative' }}>
                    <button
                        className={`header-notification-btn ${showNotifications ? 'active' : ''}`}
                        onClick={notificationLogic.toggleNotifications}
                        title="Notifications"
                    >
                        <Bell size={19} strokeWidth={2.2} />
                        {unreadCount > 0 && (
                            <span className="header-notification-badge">
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

                {/* ── Profile dropdown — mobile only ── */}
                <div className="mobile-profile-wrapper accounts-mobile-profile" ref={profileRef}>
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
                            cursor: 'pointer',
                            flexShrink: 0
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
                                        {user?.role?.replace(/_/g, ' ') || 'Accounts'}
                                    </span>
                                </div>
                            </div>

                            <div className="accounts-profile-dropdown-divider" />

                            <div className="accounts-profile-dropdown-menu">
                                <button className="accounts-profile-menu-item" onClick={() => handleProfileNav('/accounts-manager/settings?tab=profile')}>
                                    <User size={17} className="accounts-profile-menu-icon" />
                                    <span>My Profile</span>
                                </button>

                                <button className="accounts-profile-menu-item" onClick={() => {
                                    setShowProfile(false);
                                    notificationLogic.toggleNotifications();
                                }}>
                                    <Bell size={17} className="accounts-profile-menu-icon" />
                                    <span>Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="accounts-profile-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                    )}
                                </button>

                                <button className="accounts-profile-menu-item" onClick={() => handleProfileNav('/accounts-manager/settings')}>
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

export default AccountsNavbar;
