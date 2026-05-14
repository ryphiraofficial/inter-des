import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
    Bell, X, Check, CheckCheck, Trash2,
    ClipboardList, FileText, Package, ShoppingCart,
    Users, Receipt, AlertTriangle, Info, CheckCircle,
    XCircle, Menu, Plus, Search,
} from 'lucide-react';
import { notificationAPI } from '../../models/api';
import './css/SalesHeader.css';

const ICON_MAP = {
    task:            ClipboardList,
    quotation:       FileText,
    material:        Package,
    purchase_order:  ShoppingCart,
    client:          Users,
    payment:         Receipt,
    warning:         AlertTriangle,
    info:            Info,
    success:         CheckCircle,
    error:           XCircle,
};

const COLOR_MAP = {
    task:           '#10b981',
    quotation:      '#6366f1',
    material:       '#f59e0b',
    purchase_order: '#3b82f6',
    client:         '#8b5cf6',
    payment:        '#059669',
    warning:        '#f97316',
    info:           '#06b6d4',
    success:        '#10b981',
    error:          '#ef4444',
};

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

const SalesHeader = ({ title, subtitle, toggleSidebar }) => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const [notifications,    setNotifications]    = useState([]);
    const [unreadCount,      setUnreadCount]      = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const pollRef = useRef(null);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        if (val) {
            searchParams.set('q', val);
        } else {
            searchParams.delete('q');
        }
        setSearchParams(searchParams);
    };

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await notificationAPI.getAll();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (_) {}
    }, []);

    useEffect(() => {
        fetchNotifications();
        pollRef.current = setInterval(fetchNotifications, 30000);
        return () => clearInterval(pollRef.current);
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (_) {}
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (_) {}
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationAPI.delete(id);
            const wasUnread = notifications.find(n => n._id === id && !n.isRead);
            setNotifications(prev => prev.filter(n => n._id !== id));
            if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (_) {}
    };

    const toggleNotif = () => {
        setShowNotifications(v => !v);
        if (!showNotifications) fetchNotifications();
    };

    return (
        <header className="sales-header">
            {/* Left */}
            <div className="sales-header-left">
                <button className="sales-menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
                    <Menu size={20} />
                </button>
                <div className="sales-header-text">
                    {title    && <h1 className="sales-header-title">{title}</h1>}
                    {subtitle && <p  className="sales-header-subtitle">{subtitle}</p>}
                </div>
            </div>

            {/* Right */}
            <div className="sales-header-actions">
                {['/staff/quotations', '/staff/clients'].includes(location.pathname) && (
                    <div className="sales-header-search">
                        <Search size={16} className="sales-search-icon" />
                        <input 
                            type="text" 
                            placeholder={location.pathname === '/staff/clients' ? "Search by name, email..." : "Search quote, project..."}
                            value={searchParams.get('q') || ''}
                            onChange={handleSearchChange}
                        />
                    </div>
                )}

                {location.pathname === '/staff/quotations' && (
                    <button
                        className="sales-new-btn"
                        onClick={() => navigate('/staff/quotations/new')}
                    >
                        <Plus size={15} />
                        <span className="desktop-hide-text">New Quotation</span>
                    </button>
                )}

                {location.pathname === '/staff/clients' && (
                    <button
                        className="sales-new-btn"
                        onClick={() => {
                            const p = new URLSearchParams(searchParams);
                            p.set('action', 'new');
                            setSearchParams(p);
                        }}
                    >
                        <Plus size={15} />
                        <span className="desktop-hide-text">Add Client</span>
                    </button>
                )}

                {/* Notification bell */}
                <div className="sales-notif-wrapper">
                    <button
                        className={`sales-notif-btn ${showNotifications ? 'active' : ''}`}
                        onClick={toggleNotif}
                        aria-label="Notifications"
                    >
                        <Bell size={19} />
                        {unreadCount > 0 && (
                            <span className="sales-notif-badge">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <>
                            <div className="sales-notif-overlay" onClick={() => setShowNotifications(false)} />
                            <div className="sales-notif-popup">
                                <div className="sales-notif-popup-header">
                                    <span>Notifications</span>
                                    <div className="sales-notif-popup-actions">
                                        {unreadCount > 0 && (
                                            <button
                                                className="sales-notif-mark-all"
                                                onClick={handleMarkAllRead}
                                                title="Mark all as read"
                                            >
                                                <CheckCheck size={15} />
                                            </button>
                                        )}
                                        <button
                                            className="sales-notif-close"
                                            onClick={() => setShowNotifications(false)}
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="sales-notif-list">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif, i) => {
                                            const TypeIcon = ICON_MAP[notif.type] || Info;
                                            const color    = COLOR_MAP[notif.type] || '#6b7280';
                                            return (
                                                <div
                                                    key={notif._id}
                                                    className={`sales-notif-item ${!notif.isRead ? 'unread' : ''}`}
                                                    style={{ animationDelay: `${i * 0.04}s` }}
                                                    onClick={e => !notif.isRead && handleMarkAsRead(notif._id, e)}
                                                >
                                                    <div className="sales-notif-icon" style={{ background: `${color}18`, color }}>
                                                        <TypeIcon size={15} />
                                                    </div>
                                                    <div className="sales-notif-body">
                                                        <div className="sales-notif-title-row">
                                                            <span className="sales-notif-title">{notif.title}</span>
                                                            <span className="sales-notif-time">{timeAgo(notif.createdAt)}</span>
                                                        </div>
                                                        <p className="sales-notif-desc">{notif.description}</p>
                                                    </div>
                                                    <div className="sales-notif-btns">
                                                        {!notif.isRead && (
                                                            <button
                                                                className="sales-notif-action"
                                                                onClick={e => handleMarkAsRead(notif._id, e)}
                                                                title="Mark as read"
                                                            >
                                                                <Check size={13} />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="sales-notif-action delete"
                                                            onClick={e => handleDelete(notif._id, e)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="sales-notif-empty">
                                            <Bell size={30} strokeWidth={1.5} />
                                            <p>All caught up!</p>
                                            <span>No notifications yet</span>
                                        </div>
                                    )}
                                </div>

                                {notifications.length > 0 && (
                                    <div className="sales-notif-footer">
                                        {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
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

export default SalesHeader;
