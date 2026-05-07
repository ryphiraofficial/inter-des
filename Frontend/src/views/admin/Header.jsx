import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Bell, X, Plus, Check, CheckCheck, Trash2,
    FileText, Package, ShoppingCart, ClipboardList,
    Receipt, AlertTriangle, Info, CheckCircle, XCircle, Download, Menu
} from 'lucide-react';
import { notificationAPI } from '../../models/api';
import './css/Header.css';

const ICON_MAP = {
    Quote: FileText, Invoice: Receipt, Task: ClipboardList,
    Inventory: Package, PO: ShoppingCart, Info: Info,
    Success: CheckCircle, Warning: AlertTriangle, Error: XCircle,
};

const COLOR_MAP = {
    Quote: '#6366f1', Invoice: '#0ea5e9', Task: '#f59e0b',
    Inventory: '#8b5cf6', PO: '#ec4899', Info: '#3b82f6',
    Success: '#10b981', Warning: '#f59e0b', Error: '#ef4444',
};

const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const Header = ({ user, toggleMobileSidebar }) => {
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const popupRef = useRef(null);
    const wrapperRef = useRef(null);
    const pollRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await notificationAPI.getAll({ limit: 30 });
            if (res?.success) {
                setNotifications(res.data || []);
                setUnreadCount(res.unreadCount || 0);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        pollRef.current = setInterval(fetchNotifications, 30000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [fetchNotifications]);

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

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error('Failed to mark as read:', err); }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) { console.error('Failed to mark all as read:', err); }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationAPI.delete(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
            const wasUnread = notifications.find(n => n._id === id && !n.isRead);
            if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error('Failed to delete notification:', err); }
    };

    const toggleNotifications = () => {
        const willShow = !showNotifications;
        setShowNotifications(willShow);
        if (willShow) fetchNotifications();
    };

    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');

    const getPageDetails = () => {
        const path = location.pathname;
        if (path === '/') {
            const currentTab = tab?.toLowerCase();
            if (currentTab === 'invoices') return { title: 'Invoices', subtitle: 'Manage your client invoices.' };
            if (currentTab === 'expenses') return { title: 'Expenses', subtitle: 'Track your business spending.' };
            if (currentTab === 'payments') return { title: 'Payments', subtitle: 'Manage your incoming payments.' };
            if (currentTab === 'clients') return { title: 'Clients', subtitle: 'Manage your client database and contact details.' };
            if (currentTab === 'vendors') return { title: 'Vendors', subtitle: 'Manage your vendors and suppliers.' };
            if (currentTab === 'projects') return { title: 'Projects', subtitle: 'Manage your ongoing projects.' };
            if (currentTab === 'reports') return { title: 'Analytics Reports', subtitle: 'Detailed overview of your business performance.' };
            if (currentTab === 'pipeline') return { title: 'Design Pipeline', subtitle: 'Manage your studio workflow.' };
            if (currentTab === 'dashboard' || currentTab === 'overview') return { title: 'Studio Dashboard', subtitle: 'Overview of your studio operations.' };
            if (currentTab === 'requests') return { title: 'Material Requests', subtitle: 'Manage pending material requests.' };
            return { title: 'Dashboard', subtitle: "Welcome back! Here's your business overview." };
        }
        if (path === '/quotations') return { title: 'Quotations', subtitle: 'Detailed overview of your project estimates and proposals.' };
        if (path === '/quotations/new') return { title: 'New Quotation', subtitle: 'Craft a professional estimate for your client.' };
        if (path === '/inventory') return { title: 'Global Inventory', subtitle: 'Track your primary design materials and stock levels.' };
        if (path === '/purchase-orders') return { title: 'Purchase Orders', subtitle: 'Manage supplier orders and procurement status.' };
        if (path === '/po-inventory') return { title: 'PO Tracking', subtitle: 'Monitor stock received specifically through purchase orders.' };
        if (path === '/clients') return { title: 'Relationships', subtitle: 'Manage your client database and contact details.' };
        if (path === '/tasks') return { title: 'Tasks Hub', subtitle: 'Keep track of project milestones and team assignments.' };
        if (path === '/reports') return { title: 'Analytics', subtitle: 'Deep dive into your revenue and conversion metrics.' };
        if (path === '/settings') return { title: 'System Controls', subtitle: 'Configure your preferences and account security.' };
        if (path === '/users') return { title: 'Team Access', subtitle: 'Manage staff accounts and administrative permissions.' };
        if (path === '/invoice') return { title: 'Invoices', subtitle: 'Generate and track professional client invoices.' };
        if (path.startsWith('/production-management/dashboard')) return { title: 'Production Dashboard', subtitle: 'Overview of your production operations' };
        if (path.startsWith('/production-management/projects')) return { title: 'Projects Overview', subtitle: 'Manage and monitor all production projects' };
        if (path.startsWith('/production-management/tasks')) return { title: 'Tasks Board', subtitle: 'Track and assign production tasks' };
        if (path.startsWith('/production-management/team')) return { title: 'Team Directory', subtitle: 'Manage your production team members' };
        if (path.startsWith('/production-management/approvals')) return { title: 'Approvals & Requests', subtitle: 'Review and manage material or milestone requests' };
        if (path.startsWith('/production-management/handoff')) return { title: 'Project Handoff', subtitle: 'Review new projects assigned to you' };
        if (path.startsWith('/production-management/reports')) return { title: 'Reports & Export', subtitle: 'Analytics and aggregated data for all production projects' };
        if (path === '/engineer/dashboard') return { title: 'Dashboard', subtitle: 'Overview of your assigned tasks and activity' };
        if (path === '/engineer/projects') return { title: 'My Projects', subtitle: 'Projects you are assigned to' };
        if (path.startsWith('/engineer/projects/')) return { title: 'Project Detail', subtitle: 'Overview, tasks and activity for this project' };
        if (path === '/engineer/tasks') return { title: 'My Tasks', subtitle: 'All tasks assigned to you' };
        if (path.startsWith('/engineer/tasks/')) return { title: 'Task Detail', subtitle: 'Full task view, status updates and comments' };
        if (path === '/engineer/leave') return { title: 'Leave Request', subtitle: 'Submit and track your leave applications' };
        if (path === '/site/dashboard') return { title: 'Dashboard', subtitle: 'Your site tasks and daily progress at a glance' };
        if (path === '/site/tasks') return { title: 'My Tasks', subtitle: 'Tasks assigned to you from the Project Engineer' };
        if (path === '/site/reports') return { title: 'Site Reports', subtitle: 'Submit and review daily site progress reports' };
        if (path === '/site/leave') return { title: 'Leave Request', subtitle: 'Submit and track your leave applications' };
        return {
            title: path.replace('/', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            subtitle: ''
        };
    };

    const { title, subtitle } = getPageDetails();

    return (
        <header className="page-header">
            {/* LEFT */}
            <div className="header-left">
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMobileSidebar}
                    title="Open Menu"
                >
                    <Menu size={22} strokeWidth={2.4} />
                </button>
                <div className="welcome-text">
                    <h1>{title}</h1>
                    {subtitle && <p>{subtitle}</p>}
                </div>
            </div>

            {/* RIGHT */}
            <div className="header-actions">
                {/* Action Buttons */}
                {(() => {
                    const ActionBtn = ({ show, onClick, label, icon: Icon = Plus, variant = 'primary' }) => {
                        if (!show) return null;
                        
                        return (
                            <button
                                className={`btn-${variant}`}
                                onClick={onClick}
                            >
                                <Icon size={18} strokeWidth={2.4} />
                                <span>{label}</span>
                            </button>
                        );
                    };

                    const isHome = location.pathname === '/';
                    return (
                        <>
                            {isHome && (!tab || tab === 'overview' || tab === 'dashboard') && user?.role?.toLowerCase() !== 'design manager' && (
                                <Link to="/quotations/new" className="no-underline">
                                    <ActionBtn show={true} label="New Quotation" variant="primary" />
                                </Link>
                            )}
                            {(isHome && tab === 'invoices' || location.pathname === '/invoice') && (
                                <ActionBtn show={true} onClick={() => window.dispatchEvent(new CustomEvent('open-create-invoice-modal'))} label="Create Invoice" variant="primary" />
                            )}
                            <ActionBtn show={isHome && tab === 'expenses'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-expense-modal'))} label="Add Expense" variant="primary" />
                            <ActionBtn show={isHome && tab === 'payments'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-payment-modal'))} label="Record Payment" variant="success" />
                            <ActionBtn show={isHome && tab === 'clients'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-client-modal'))} label="Add Client" variant="primary" />
                            <ActionBtn show={isHome && tab === 'vendors'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-vendor-modal'))} label="Add Vendor" variant="primary" />
                            <ActionBtn show={isHome && tab === 'projects'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-project-modal'))} label="New Project" variant="primary" />
                            <ActionBtn show={isHome && tab === 'reports'} onClick={() => window.dispatchEvent(new CustomEvent('export-reports-pdf'))} label="Export PDF" icon={Download} variant="primary" />
                            <ActionBtn show={location.pathname === '/po-inventory'} onClick={() => window.dispatchEvent(new CustomEvent('open-po-inventory-modal'))} label="Add Item" variant="primary" />
                            <ActionBtn show={location.pathname === '/purchase-orders'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-po-modal'))} label="Create PO" variant="primary" />
                            <ActionBtn show={location.pathname === '/tasks'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-task-modal'))} label="Assign New Task" variant="primary" />
                            <ActionBtn show={location.pathname === '/staff'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-staff-modal'))} label="Add New Staff" variant="primary" />
                            <ActionBtn show={location.pathname === '/clients'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-client-modal'))} label="Add New Client" variant="primary" />
                            <ActionBtn show={location.pathname === '/inventory'} onClick={() => window.dispatchEvent(new CustomEvent('open-inventory-modal'))} label="Add New Item" variant="primary" />
                        </>
                    );
                })()}

                {/* NOTIFICATION BELL */}
                <div className="notification-wrapper" ref={wrapperRef}>
                    <button
                        className={`btn-icon ${showNotifications ? 'active' : ''}`}
                        onClick={toggleNotifications}
                    >
                        <Bell size={19} strokeWidth={2.2} />
                        {unreadCount > 0 && (
                            <span className="notification-badge">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <>
                            <div className="notification-overlay" onClick={() => setShowNotifications(false)} />
                            <div ref={popupRef} className="notification-popup">
                                {/* Header */}
                                <div className="popup-header">
                                    <div className="header-left" style={{ gap: '0.5rem' }}>
                                        <h3>Notifications</h3>
                                        {unreadCount > 0 && <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--primary-color)', background: '#eef2ff', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{unreadCount} new</span>}
                                    </div>
                                    <div className="popup-header-actions">
                                        {unreadCount > 0 && (
                                            <button className="popup-mark-all" onClick={handleMarkAllRead} title="Mark all as read">
                                                <CheckCheck size={15} />
                                            </button>
                                        )}
                                        <button className="popup-close" onClick={() => setShowNotifications(false)}>
                                            <X size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="popup-content">
                                    {notifications.length > 0 ? notifications.map((notif, index) => {
                                        const TypeIcon = ICON_MAP[notif.type] || Info;
                                        const typeColor = COLOR_MAP[notif.type] || '#6b7280';
                                        return (
                                            <div key={notif._id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                                                <div className="notif-icon-wrap" style={{ backgroundColor: `${typeColor}12`, color: typeColor }}>
                                                    <TypeIcon size={15} />
                                                </div>
                                                <div className="notif-body">
                                                    <div className="notif-title-row">
                                                        <span className="notif-title">{notif.title}</span>
                                                        <span className="notif-time">{timeAgo(notif.createdAt)}</span>
                                                    </div>
                                                    <p className="notif-desc">{notif.description}</p>
                                                </div>
                                                <div className="notif-actions">
                                                    {!notif.isRead && (
                                                        <button className="notif-action-btn" onClick={(e) => handleMarkAsRead(notif._id, e)}>
                                                            <Check size={13} />
                                                        </button>
                                                    )}
                                                    <button className="notif-action-btn delete" onClick={(e) => handleDelete(notif._id, e)}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="no-notif">
                                            <Bell size={32} strokeWidth={1.5} />
                                            <p>No notifications yet</p>
                                            <span>You're all caught up!</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                {notifications.length > 0 && (
                                    <div className="popup-footer">
                                        <span className="notif-summary">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
