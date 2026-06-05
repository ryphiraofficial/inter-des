import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw, Bell, Search, Download, Video, Menu, LogOut, User, Settings } from 'lucide-react';
import { useNotificationLogic } from '../../admin/header/hooks/useNotificationLogic';
import NotificationPopup from '../../admin/header/components/NotificationPopup';
import '../../admin/css/Header.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';
import { TAB_META, SEARCH_CONFIGS } from './accountsNavConfig';

const AccountsNavbar = ({ onRefresh, isLoading, search, setSearch, onExport, onMenuToggle, onLogout }) => {
    const user       = useAppSelector(selectUser);
    const navigate   = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab  = searchParams.get('tab') || 'overview';

    const currentTab   = TAB_META[activeTab] || { label: 'Overview' };
    const searchConfig = SEARCH_CONFIGS[activeTab];

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications]         = useState([]);
    const [unreadCount, setUnreadCount]             = useState(0);
    const [showProfile, setShowProfile]             = useState(false);

    const wrapperRef = useRef(null);
    const popupRef   = useRef(null);
    const profileRef = useRef(null);

    const getInitials = (user) => {
        const name = user?.fullName || user?.name || '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AM';
    };

    const notificationLogic = useNotificationLogic({
        setNotifications, setUnreadCount, showNotifications, setShowNotifications, notifications
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

    const btnBase = {
        height: '38px', padding: '0 16px', display: 'flex', alignItems: 'center',
        gap: '8px', fontSize: '13px', border: 'none', borderRadius: '8px',
        fontWeight: 600, cursor: 'pointer', outline: 'none', transition: 'all 0.2s'
    };

    const handleProfileNav = (path) => {
        setShowProfile(false);
        navigate(path);
    };

    return (
        <header className="accounts-navbar" style={{ overflow: 'visible' }}>

            {/* ── Left: Hamburger (mobile) + Page title ── */}
            <div className="accounts-navbar-brand">
                <button className="accounts-hamburger" onClick={onMenuToggle} aria-label="Open navigation menu">
                    <Menu size={22} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="accounts-navbar-title">{currentTab.label}</span>
                    <span className="accounts-navbar-pagedesc">{currentTab.description}</span>
                </div>
            </div>

            {/* ── Right: Actions + Notifications + Profile ── */}
            <div className="accounts-navbar-right" style={{ overflow: 'visible' }}>

                {/* Refresh */}
                {onRefresh && (
                    <button className="accounts-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span className="accounts-btn-label">{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}

                {/* Search */}
                {searchConfig && setSearch && (
                    <div className="accounts-search-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '280px', minWidth: '180px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder={searchConfig.placeholder}
                            value={search || ''}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', height: '38px', padding: '0 16px 0 36px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#f8fafc', transition: 'all 0.2s' }}
                        />
                    </div>
                )}

                {/* Export */}
                {onExport && (
                    <button onClick={onExport} style={{ ...btnBase, background: '#fff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 500 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <Download size={15} />
                        <span className="accounts-btn-label">Export</span>
                    </button>
                )}

                {/* Add Expense */}
                {['expenses', 'company_expenses'].includes(activeTab) && (
                    <button onClick={() => window.dispatchEvent(new CustomEvent('open-create-expense-modal'))}
                        style={{ ...btnBase, background: '#0f172a', color: 'white' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                        onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
                        + <span className="accounts-btn-label">Add Expense</span>
                    </button>
                )}

                {/* Schedule Meeting */}
                {activeTab === 'meetings' && ['admin', 'super admin', 'superadmin'].includes(user?.role?.toLowerCase()) && (
                    <button onClick={() => window.dispatchEvent(new CustomEvent('open-schedule-meeting-modal'))}
                        style={{ ...btnBase, background: '#3b82f6', color: 'white' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}>
                        <Video size={16} />
                        <span className="accounts-btn-label">Schedule Meeting</span>
                    </button>
                )}

                {/* ── Notifications Bell (desktop) ── */}
                <div className="header-notification-wrapper accounts-hide-on-mobile" ref={wrapperRef} style={{ position: 'relative' }}>
                    <button
                        className={`header-notification-btn ${showNotifications ? 'active' : ''}`}
                        onClick={notificationLogic.toggleNotifications}
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}>
                        <Bell size={19} strokeWidth={2.2} />
                        {unreadCount > 0 && (
                            <span className="header-notification-badge" style={{ top: '-2px', right: '-2px' }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <NotificationPopup
                        showNotifications={showNotifications} notifications={notifications} unreadCount={unreadCount}
                        handleMarkAsRead={notificationLogic.handleMarkAsRead} handleMarkAllRead={notificationLogic.handleMarkAllRead}
                        handleDelete={notificationLogic.handleDelete} setShowNotifications={setShowNotifications} popupRef={popupRef}
                    />
                </div>

                {/* ── Profile dropdown — mobile only ── */}
                <div className="accounts-mobile-profile" ref={profileRef}>
                    {/* Avatar trigger */}
                    <button
                        className={`accounts-mobile-avatar-btn${showProfile ? ' open' : ''}`}
                        onClick={() => setShowProfile(v => !v)}
                        aria-label="Profile menu"
                    >
                        <div className="accounts-mobile-avatar">
                            {getInitials(user)}
                        </div>
                    </button>

                    {/* Dropdown panel */}
                    {showProfile && (
                        <div className="accounts-profile-dropdown">
                            {/* ── User header ── */}
                            <div className="accounts-profile-dropdown-header">
                                <div className="accounts-profile-dropdown-info">
                                    <span className="accounts-profile-dropdown-name">{user?.fullName || user?.name || 'User'}</span>
                                    <span className="accounts-profile-dropdown-role">
                                        {user?.role?.replace(/_/g, ' ') || 'Accounts'}
                                    </span>
                                </div>
                            </div>

                            <div className="accounts-profile-dropdown-divider" />

                            {/* ── Menu items ── */}
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

                            {/* ── Logout ── */}
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
