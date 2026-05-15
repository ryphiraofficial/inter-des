import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useHeaderState } from './header/hooks/useHeaderState';
import { useNotificationLogic } from './header/hooks/useNotificationLogic';
import { useSearchLogic } from './header/hooks/useSearchLogic';

import WelcomeSection from './header/components/WelcomeSection';
import HeaderSearch from './header/components/HeaderSearch';
import HeaderActions from './header/components/HeaderActions';
import NotificationPopup from './header/components/NotificationPopup';

import './css/Header.css';

const Header = ({ user, toggleMobileSidebar }) => {
    const location = useLocation();
    const state = useHeaderState();
    const popupRef = useRef(null);
    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                state.setShowNotifications(false);
            }
        };
        if (state.showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [state.showNotifications]);

    const getPageDetails = () => {
        const path = location.pathname;
        const tab = new URLSearchParams(location.search).get('tab')?.toLowerCase();

        if (path === '/') {
            if (tab === 'invoices') return { title: 'Invoices', subtitle: 'Manage your client invoices.' };
            if (tab === 'expenses') return { title: 'Expenses', subtitle: 'Track your business spending.' };
            if (tab === 'payments') return { title: 'Payments', subtitle: 'Manage your incoming payments.' };
            if (tab === 'clients') return { title: 'Clients', subtitle: 'Manage your client database.' };
            if (tab === 'vendors') return { title: 'Vendors', subtitle: 'Manage your vendors and suppliers.' };
            if (tab === 'projects') return { title: 'Projects', subtitle: 'Manage your ongoing projects.' };
            if (tab === 'reports') return { title: 'Analytics Reports', subtitle: 'Detailed overview of performance.' };
            if (tab === 'pipeline') return { title: 'Design Pipeline', subtitle: 'Manage your studio workflow.' };
            if (tab === 'dashboard' || tab === 'overview') return { title: 'Studio Dashboard', subtitle: 'Overview of operations.' };
            if (tab === 'requests') return { title: 'Material Requests', subtitle: 'Manage pending material requests.' };
            return { title: 'Dashboard', subtitle: "Welcome back! Here's your business overview." };
        }
        
        const staticMap = {
            '/quotations': { title: 'Quotations', subtitle: 'Detailed overview of project estimates.' },
            '/quotations/new': { title: 'New Quotation', subtitle: 'Craft a professional estimate.' },
            '/inventory': { title: 'Global Inventory', subtitle: 'Track your primary design materials.' },
            '/purchase-orders': { title: 'Purchase Orders', subtitle: 'Manage supplier orders.' },
            '/po-inventory': { title: 'PO Tracking', subtitle: 'Monitor stock received through POs.' },
            '/clients': { title: 'Relationships', subtitle: 'Manage your client database.' },
            '/tasks': { title: 'Tasks Hub', subtitle: 'Keep track of project milestones.' },
            '/reports': { title: 'Analytics', subtitle: 'Deep dive into your revenue metrics.' },
            '/settings': { title: 'System Controls', subtitle: 'Configure your preferences.' },
            '/users': { title: 'Team Access', subtitle: 'Manage staff accounts.' },
            '/invoice': { title: 'Invoices', subtitle: 'Generate and track professional client invoices.' },
            '/engineer/dashboard': { title: 'Dashboard', subtitle: 'Overview of assigned tasks' },
            '/engineer/projects': { title: 'My Projects', subtitle: 'Projects you are assigned to' },
            '/engineer/tasks': { title: 'My Tasks', subtitle: 'All tasks assigned to you' },
            '/engineer/leave': { title: 'Leave Request', subtitle: 'Submit and track applications' },
            '/engineer/reports': { title: 'Site Monitoring', subtitle: 'Review daily progress logs' },
            '/engineer/approvals': { title: 'Approvals', subtitle: 'Review and approve requests' },
            '/site/dashboard': { title: 'Dashboard', subtitle: 'Your site tasks at a glance' },
            '/site/tasks': { title: 'My Tasks', subtitle: 'Tasks assigned from Engineer' },
            '/site/reports': { title: 'Site Reports', subtitle: 'Submit daily progress reports' },
            '/site/leave': { title: 'Leave Request', subtitle: 'Submit and track applications' }
        };

        if (staticMap[path]) return staticMap[path];
        
        if (path.startsWith('/production-management/dashboard')) return { title: 'Production Dashboard', subtitle: 'Overview of operations' };
        if (path.startsWith('/production-management/projects')) return { title: 'Projects Overview', subtitle: 'Manage projects' };
        if (path.startsWith('/production-management/tasks')) return { title: 'Tasks Board', subtitle: 'Track production tasks' };
        if (path.startsWith('/production-management/team')) return { title: 'Team Directory', subtitle: 'Manage team members' };
        if (path.startsWith('/production-management/approvals')) return { title: 'Approvals & Requests', subtitle: 'Review requests' };
        if (path.startsWith('/production-management/handoff')) return { title: 'Project Handoff', subtitle: 'Review new projects' };
        if (path.startsWith('/production-management/reports')) return { title: 'Reports & Export', subtitle: 'Analytics data' };
        if (path.startsWith('/engineer/projects/')) return { title: 'Project Detail', subtitle: 'Project overview and tasks' };
        if (path.startsWith('/engineer/tasks/')) return { title: 'Task Detail', subtitle: 'Full task view' };

        return {
            title: path.replace('/', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            subtitle: ''
        };
    };

    const { title, subtitle } = getPageDetails();
    const searchablePaths = ['/users', '/tasks', '/clients', '/inventory', '/invoice', '/quotations', '/staff', '/purchase-orders', '/po-inventory'];
    const isSearchable = searchablePaths.includes(location.pathname);

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
            </div>
        </header>
    );
};

export default Header;
