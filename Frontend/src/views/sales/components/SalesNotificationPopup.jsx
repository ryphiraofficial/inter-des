import React from 'react';
import { Bell, X, Check, CheckCheck, Trash2, ClipboardList, FileText, Package, ShoppingCart, Users, Receipt, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

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

const SalesNotificationPopup = ({ 
    notifications, 
    unreadCount, 
    onClose, 
    onMarkAllRead, 
    onMarkAsRead, 
    onDelete 
}) => {
    return (
        <>
            <div className="sales-notif-overlay" onClick={onClose} />
            <div className="sales-notif-popup">
                <div className="sales-notif-popup-header">
                    <span>Notifications</span>
                    <div className="sales-notif-popup-actions">
                        {unreadCount > 0 && (
                            <button
                                className="sales-notif-mark-all"
                                onClick={onMarkAllRead}
                                title="Mark all as read"
                            >
                                <CheckCheck size={15} />
                            </button>
                        )}
                        <button
                            className="sales-notif-close"
                            onClick={onClose}
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
                                    onClick={e => !notif.isRead && onMarkAsRead(notif._id, e)}
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
                                                onClick={e => onMarkAsRead(notif._id, e)}
                                                title="Mark as read"
                                            >
                                                <Check size={13} />
                                            </button>
                                        )}
                                        <button
                                            className="sales-notif-action delete"
                                            onClick={e => onDelete(notif._id, e)}
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
    );
};

export default SalesNotificationPopup;
