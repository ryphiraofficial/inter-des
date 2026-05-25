import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    RefreshCw, Landmark, LayoutDashboard, CheckCircle,
    FileText, CreditCard, TrendingUp, Users, ShoppingBag,
    Briefcase, PieChart, Bell, Search, Download, Video
} from 'lucide-react';
import { useNotificationLogic } from '../../admin/header/hooks/useNotificationLogic';
import NotificationPopup from '../../admin/header/components/NotificationPopup';
import '../../admin/css/Header.css';

const TAB_META = {
    overview: { label: 'Overview', icon: LayoutDashboard },
    clearance: { label: 'Payment Clearance Hub', icon: CheckCircle },
    collections: { label: 'My Collections', icon: CheckCircle },
    invoices: { label: 'Invoices', icon: FileText },
    payments: { label: 'Payments', icon: CreditCard },
    expenses: { label: 'Expenses', icon: TrendingUp },
    clients: { label: 'Clients', icon: Users },
    vendors: { label: 'Vendors', icon: ShoppingBag },
    projects: { label: 'Projects', icon: Briefcase },
    reports: { label: 'Financial Reports', icon: PieChart },
    meetings: { label: 'Meetings', icon: Video }
};

const SEARCH_CONFIGS = {
    clearance: { placeholder: 'Search projects...' },
    collections: { placeholder: 'Search project name, ID, or client...' },
    clients: { placeholder: 'Search by name, email or phone...' },
    payments: { placeholder: 'Search by client or reference...' },
    expenses: { placeholder: 'Search by description or category...' },
    vendors: { placeholder: 'Search by name or category...' }
};

const AccountsNavbar = ({ user, onRefresh, isLoading, search, setSearch, onExport }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

    const currentTab = TAB_META[activeTab] || { label: 'Overview', icon: LayoutDashboard };
    const IconComponent = currentTab.icon;

    const searchConfig = SEARCH_CONFIGS[activeTab];

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const wrapperRef = useRef(null);
    const popupRef = useRef(null);

    const notificationLogic = useNotificationLogic({
        setNotifications,
        setUnreadCount,
        showNotifications,
        setShowNotifications,
        notifications
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <header className="accounts-navbar" style={{ overflow: 'visible' }}>
            <div className="accounts-navbar-brand">
                <div className="accounts-navbar-icon">
                    <IconComponent size={20} />
                </div>
                <div>
                    <span className="accounts-navbar-title">{currentTab.label}</span>
                </div>
            </div>

            <div className="accounts-navbar-right" style={{ overflow: 'visible' }}>
                {onRefresh && (
                    <button className="accounts-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}

                {searchConfig && setSearch && (
                    <div style={{ position: 'relative', width: '100%', maxWidth: '280px', minWidth: '220px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder={searchConfig.placeholder}
                            value={search || ''}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                height: '38px',
                                padding: '0 16px 0 36px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '13px',
                                outline: 'none',
                                background: '#f8fafc',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>
                )}

                {onExport && (
                    <button 
                        onClick={onExport} 
                        style={{ 
                            height: '38px', 
                            padding: '0 16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            fontSize: '13px',
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            color: '#475569',
                            fontWeight: 500,
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                        <Download size={15} /> Export
                    </button>
                )}
                
                {activeTab === 'meetings' && ['accounts manager', 'admin', 'super admin', 'manager'].some(r => user?.role?.toLowerCase().includes(r)) && (
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('open-schedule-meeting-modal'))}
                        style={{ 
                            height: '38px', 
                            padding: '0 16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            fontSize: '13px',
                            background: '#3b82f6',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
                    >
                        <Video size={16} /> Schedule Meeting
                    </button>
                )}
                
                {/* Notification bell */}
                <div className="header-notification-wrapper" ref={wrapperRef} style={{ marginRight: '8px', position: 'relative' }}>
                    <button
                        className={`header-notification-btn ${showNotifications ? 'active' : ''}`}
                        onClick={notificationLogic.toggleNotifications}
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
                    >
                        <Bell size={19} strokeWidth={2.2} />
                        {unreadCount > 0 && (
                            <span className="header-notification-badge" style={{ top: '-2px', right: '-2px' }}>
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

            </div>
        </header>
    );
};

export default AccountsNavbar;
