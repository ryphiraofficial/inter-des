import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Bell, X, Plus, Check, CheckCheck, Trash2,
    FileText, Package, ShoppingCart, ClipboardList,
    Receipt, AlertTriangle, Info, CheckCircle, XCircle, Download, Menu
} from 'lucide-react';
import { notificationAPI } from '../../models/api';

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
            if (tab === 'invoices') return { title: 'Invoices', subtitle: 'Manage your client invoices.' };
            if (tab === 'expenses') return { title: 'Expenses', subtitle: 'Track your business spending.' };
            if (tab === 'payments') return { title: 'Payments', subtitle: 'Manage your incoming payments.' };
            if (tab === 'clients') return { title: 'Clients', subtitle: 'Manage your client database and contact details.' };
            if (tab === 'vendors') return { title: 'Vendors', subtitle: 'Manage your vendors and suppliers.' };
            if (tab === 'projects') return { title: 'Projects', subtitle: 'Manage your ongoing projects.' };
            if (tab === 'reports') return { title: 'Analytics Reports', subtitle: 'Detailed overview of your business performance.' };
            if (tab === 'pipeline') return { title: 'Design Pipeline', subtitle: 'Manage your studio workflow.' };
            if (tab === 'dashboard') return { title: 'Studio Dashboard', subtitle: 'Overview of your studio operations.' };
            if (tab === 'requests') return { title: 'Material Requests', subtitle: 'Manage pending material requests.' };
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
        if (path === '/invoice') return { title: 'Billing Manager', subtitle: 'Generate and track professional client invoices.' };
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
        <header className="sticky top-0 z-40 w-full overflow-visible bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between h-[64px] md:h-[76px] px-6 md:px-10 lg:px-14 xl:px-16">
                {/* LEFT */}
                <div className="flex items-center gap-4 md:gap-5 min-w-0 flex-1 ml-1 md:ml-2">
                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-colors border-none bg-transparent cursor-pointer shrink-0"
                        onClick={toggleMobileSidebar}
                        title="Open Menu"
                    >
                        <Menu size={22} strokeWidth={2.4} />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-[1.1rem] md:text-[1.3rem] lg:text-[1.55rem] font-bold text-gray-900 m-0 truncate leading-snug tracking-[-0.01em]">{title}</h1>
                        {subtitle && (
                            <p className="text-[0.83rem] text-gray-400 m-0 mt-0.5 hidden md:block font-medium">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 md:gap-4 shrink-0 ml-4">
                    {/* Action Buttons */}
                    {(() => {
                        const ActionBtn = ({ show, onClick, label, icon: Icon = Plus, variant = 'primary' }) => {
                            if (!show) return null;
                            
                            // Using explicit classes instead of dynamic maps to ensure Tailwind's scanner always finds them
                            const buttonClasses = variant === 'primary'
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-indigo-500/30'
                                : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white shadow-emerald-500/30';

                            return (
                                <button
                                    className={`flex items-center justify-center gap-2 h-10 md:h-11 px-4 md:px-6 lg:px-7 min-w-[48px] ${buttonClasses} rounded-xl border border-transparent cursor-pointer text-sm md:text-[0.95rem] font-semibold tracking-[-0.01em] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:translate-y-0 whitespace-nowrap`}
                                    onClick={onClick}
                                >
                                    <Icon size={18} strokeWidth={2.4} />
                                    <span className="hidden sm:inline">{label}</span>
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
                                <ActionBtn show={isHome && tab === 'invoices'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-invoice-modal'))} label="Create Invoice" variant="primary" />
                                <ActionBtn show={isHome && tab === 'expenses'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-expense-modal'))} label="Add Expense" variant="primary" />
                                <ActionBtn show={isHome && tab === 'payments'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-payment-modal'))} label="Record Payment" variant="success" />
                                <ActionBtn show={isHome && tab === 'clients'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-client-modal'))} label="Add Client" variant="primary" />
                                <ActionBtn show={isHome && tab === 'vendors'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-vendor-modal'))} label="Add Vendor" variant="primary" />
                                <ActionBtn show={isHome && tab === 'projects'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-project-modal'))} label="New Project" variant="primary" />
                                <ActionBtn show={isHome && tab === 'reports'} onClick={() => window.dispatchEvent(new CustomEvent('export-reports-pdf'))} label="Export PDF" icon={Download} variant="primary" />
                                <ActionBtn show={location.pathname === '/po-inventory'} onClick={() => window.dispatchEvent(new CustomEvent('open-po-inventory-modal'))} label="Add Item" variant="primary" />
                            </>
                        );
                    })()}

                    {/* NOTIFICATION BELL */}
                    <div className="relative" ref={wrapperRef}>
                        <button
                            className={`relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl border cursor-pointer transition-all duration-200 ${
                                showNotifications
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-md'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:shadow-md'
                            }`}
                            onClick={toggleNotifications}
                        >
                            <Bell size={19} strokeWidth={2.2} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none shadow-sm">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 bg-black/8 z-[90]" onClick={() => setShowNotifications(false)} />
                                <div ref={popupRef} className="absolute top-[130%] right-0 w-[400px] max-md:fixed max-md:top-[64px] max-md:left-3 max-md:right-3 max-md:w-auto bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden origin-top-right animate-[popupIn_0.2s_ease-out]">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[0.9rem] font-bold text-gray-900 m-0">Notifications</h3>
                                            {unreadCount > 0 && <span className="text-[0.65rem] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">{unreadCount} new</span>}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {unreadCount > 0 && (
                                                <button className="text-indigo-500 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors border-none bg-transparent cursor-pointer flex items-center" onClick={handleMarkAllRead} title="Mark all as read">
                                                    <CheckCheck size={15} />
                                                </button>
                                            )}
                                            <button className="text-gray-400 p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer flex items-center" onClick={() => setShowNotifications(false)}>
                                                <X size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="max-h-[380px] max-md:max-h-[65vh] overflow-y-auto overscroll-contain">
                                        {notifications.length > 0 ? notifications.map((notif, index) => {
                                            const TypeIcon = ICON_MAP[notif.type] || Info;
                                            const typeColor = COLOR_MAP[notif.type] || '#6b7280';
                                            return (
                                                <div key={notif._id} className={`flex items-start gap-3 px-5 py-3 border-b border-gray-50/80 cursor-pointer transition-all hover:bg-gray-50/60 group ${!notif.isRead ? 'bg-indigo-50/20 border-l-[3px] border-l-indigo-400' : ''}`}>
                                                    <div className="w-8 h-8 min-w-[32px] rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${typeColor}12`, color: typeColor }}>
                                                        <TypeIcon size={15} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                                            <span className="text-[0.82rem] font-semibold text-gray-800 truncate">{notif.title}</span>
                                                            <span className="text-[0.68rem] text-gray-400 whitespace-nowrap shrink-0 font-medium">{timeAgo(notif.createdAt)}</span>
                                                        </div>
                                                        <p className="text-[0.78rem] text-gray-500 leading-relaxed m-0 line-clamp-2">{notif.description}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                        {!notif.isRead && (
                                                            <button className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors border-none bg-transparent cursor-pointer" onClick={(e) => handleMarkAsRead(notif._id, e)}>
                                                                <Check size={13} />
                                                            </button>
                                                        )}
                                                        <button className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer" onClick={(e) => handleDelete(notif._id, e)}>
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }) : (
                                            <div className="py-10 px-6 text-center flex flex-col items-center gap-1.5">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-2">
                                                    <Bell size={24} className="text-gray-300" strokeWidth={1.5} />
                                                </div>
                                                <p className="text-gray-800 font-semibold text-[0.9rem] m-0">No notifications yet</p>
                                                <span className="text-gray-400 text-[0.8rem]">You're all caught up!</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {notifications.length > 0 && (
                                        <div className="py-2.5 px-5 text-center border-t border-gray-100 bg-gray-50/50">
                                            <span className="text-[0.75rem] text-gray-400 font-medium">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
