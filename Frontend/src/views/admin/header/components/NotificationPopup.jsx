import React from 'react';
import { Bell, X, Check, CheckCheck, Trash2, FileText, Package, ShoppingCart, ClipboardList, Receipt, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

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

const NotificationPopup = ({ 
    showNotifications, notifications, unreadCount, handleMarkAsRead, handleMarkAllRead, handleDelete, setShowNotifications, popupRef 
}) => {
    if (!showNotifications) return null;

    return (
        <>
            <div className="header-notification-overlay" onClick={() => setShowNotifications(false)} />
            <div ref={popupRef} className="header-notification-popup">
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

                <div className="popup-content">
                    {notifications.length > 0 ? notifications.map((notif) => {
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

                {notifications.length > 0 && (
                    <div className="popup-footer">
                        <span className="notif-summary">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationPopup;
