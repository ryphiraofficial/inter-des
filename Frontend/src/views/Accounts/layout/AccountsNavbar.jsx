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
    overview: { label: 'Overview', description: 'High-level financial performance and metrics' },
    clearance: { label: 'Payment Clearance Hub', description: 'Review and approve pending project payments' },
    collections: { label: 'My Collections', description: 'Track and manage your payment collections' },
    invoices: { label: 'Invoices', description: 'Manage billing and customer invoices' },
    payments: { label: 'Payments', description: 'Track incoming and outgoing transactions' },
    expenses: { label: 'All Expenses', description: 'Monitor and categorize all spending' },
    company_expenses: { label: 'Company Expenses', description: 'Monitor internal overhead and operational expenses' },
    clients: { label: 'Clients', description: 'Manage financial records for all clients' },
    vendors: { label: 'Vendors', description: 'Manage supplier and vendor accounts' },
    projects: { label: 'Projects', description: 'Financial overview of active projects' },
    reports: { label: 'Financial Reports', description: 'Generate detailed financial analytics' },
    meetings: { label: 'Meetings', description: 'Schedule and manage finance meetings' }
};

const SEARCH_CONFIGS = {
    clearance: { placeholder: 'Search projects...' },
    collections: { placeholder: 'Search project name, ID, or client...' },
    clients: { placeholder: 'Search by name, email or phone...' },
    payments: { placeholder: 'Search by client or reference...' },
    expenses: { placeholder: 'Search by description or category...' },
    company_expenses: { placeholder: 'Search company expenses...' },
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
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="accounts-navbar-title">{currentTab.label}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px', fontWeight: 500 }}>
                        {currentTab.description}
                    </span>
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

                {['expenses', 'company_expenses'].includes(activeTab) && (
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('open-create-expense-modal'))}
                        style={{ 
                            height: '38px', 
                            padding: '0 16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            fontSize: '13px',
                            background: '#0f172a',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                        onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
                    >
                        + Add Expense
                    </button>
                )}
                
                {activeTab === 'meetings' && ['admin', 'super admin', 'superadmin'].includes(user?.role?.toLowerCase()) && (
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
