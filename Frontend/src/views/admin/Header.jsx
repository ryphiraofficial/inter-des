import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { useHeaderState } from './header/hooks/useHeaderState';
import { useNotificationLogic } from './header/hooks/useNotificationLogic';
import { useSearchLogic } from './header/hooks/useSearchLogic';

import WelcomeSection from './header/components/WelcomeSection';
import HeaderSearch from './header/components/HeaderSearch';
import HeaderActions from './header/components/HeaderActions';
import NotificationPopup from './header/components/NotificationPopup';
import { getPageDetails } from './header/utils/getPageDetails';

import ProfileDropdown from './header/components/ProfileDropdown';

import './css/Header.css';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

const getInitials = (name) => {
    const user = useAppSelector(selectUser);
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const Header = ({ toggleMobileSidebar, onLogout }) => {
    const location = useLocation();
    const user = useAppSelector(selectUser);
    const state = useHeaderState();
    const popupRef = useRef(null);
    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);
    const profileRef = useRef(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const notificationLogic = useNotificationLogic({
        setNotifications: state.setNotifications,
        setUnreadCount: state.setUnreadCount,
        showNotifications: state.showNotifications,
        setShowNotifications: state.setShowNotifications,
        notifications: state.notifications
    });

    const searchLogic = useSearchLogic({
        setSearchValue: state.setSearchValue,
        setSearchOpen: state.setSearchOpen,
        pathname: location.pathname,
        searchInputRef
    });

    const { setShowNotifications } = state;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        if (state.showNotifications || isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [state.showNotifications, setShowNotifications, isProfileOpen]);



    const { title, subtitle } = getPageDetails(location, user);
    const tab = new URLSearchParams(location.search).get('tab')?.toLowerCase();
    const isDashboard = location.pathname === '/' && (!tab || tab === 'overview' || tab === 'dashboard');
    
    const searchablePaths = ['/', '/tasks', '/clients', '/inventory', '/invoice', '/quotations', '/staff', '/purchase-orders', '/po-inventory', '/projects', '/production-management/team', '/engineer/projects', '/site/projects', '/staff-reports'];
    const isSearchable = searchablePaths.includes(location.pathname) && !isDashboard;

    return (
        <header className="page-header">
            <WelcomeSection 
                title={title}
                subtitle={subtitle}
                toggleMobileSidebar={toggleMobileSidebar}
            />

            <div className="page-header-actions">
                <HeaderSearch 
                    isSearchable={isSearchable}
                    searchOpen={state.searchOpen}
                    searchValue={state.searchValue}
                    handleSearchToggle={searchLogic.handleSearchToggle}
                    handleSearchChange={searchLogic.handleSearchChange}
                    searchInputRef={searchInputRef}
                />
                
                {location.pathname === '/' && new URLSearchParams(location.search).get('tab') === 'overview' && (
                    <div className="header-date-filter" style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '13px', fontWeight: '500', cursor: 'pointer', gap: '6px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>This Month</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                )}

                <HeaderActions 
                    isHome={location.pathname === '/'}
                    tab={new URLSearchParams(location.search).get('tab')}
                    location={location}
                    user={user}
                />

                <div className="header-notification-wrapper" ref={wrapperRef}>
                    <button
                        className={`header-notification-btn ${state.showNotifications ? 'active' : ''}`}
                        onClick={notificationLogic.toggleNotifications}
                    >
                        <Bell size={19} strokeWidth={2.2} />
                        {state.unreadCount > 0 && (
                            <span className="header-notification-badge">
                                {state.unreadCount > 9 ? '9+' : state.unreadCount}
                            </span>
                        )}
                    </button>

                    <NotificationPopup 
                        showNotifications={state.showNotifications}
                        notifications={state.notifications}
                        unreadCount={state.unreadCount}
                        handleMarkAsRead={notificationLogic.handleMarkAsRead}
                        handleMarkAllRead={notificationLogic.handleMarkAllRead}
                        handleDelete={notificationLogic.handleDelete}
                        setShowNotifications={state.setShowNotifications}
                        popupRef={popupRef}
                    />
                </div>

                <div className="mobile-profile-wrapper" ref={profileRef} style={{ position: 'relative' }}>
                    <button 
                        className="header-profile-btn"
                        onClick={() => {
                            state.setShowNotifications(false);
                            setIsProfileOpen(!isProfileOpen);
                        }}
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
                            flexShrink: 0,
                            position: 'relative'
                        }}
                    >
                        {getInitials(user?.fullName || user?.name || 'Admin')}
                    </button>

                    <ProfileDropdown 
                        user={user}
                        isProfileOpen={isProfileOpen}
                        setIsProfileOpen={setIsProfileOpen}
                        state={state}
                        onLogout={onLogout}
                    />
                </div>


            </div>
        </header>
    );
};

export default Header;
