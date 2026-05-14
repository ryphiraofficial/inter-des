import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Bell, Menu, Plus, Search } from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';
import SalesNotificationPopup from './components/SalesNotificationPopup';
import './css/SalesHeader.css';

const SalesHeader = ({ title, subtitle, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showNotifications, setShowNotifications] = useState(false);

    const {
        notifications,
        unreadCount,
        fetchNotifications,
        handleMarkAsRead,
        handleMarkAllRead,
        handleDelete
    } = useNotifications();

    const handleSearchChange = (e) => {
        const val = e.target.value;
        if (val) {
            searchParams.set('q', val);
        } else {
            searchParams.delete('q');
        }
        setSearchParams(searchParams);
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
                    {title && <h1 className="sales-header-title">{title}</h1>}
                    {subtitle && <p className="sales-header-subtitle">{subtitle}</p>}
                </div>
            </div>

            {/* Right */}
            <div className="sales-header-actions">
                {['/staff/quotations', '/staff/clients', '/staff/tasks'].includes(location.pathname) && (
                    <div className="sales-header-search">
                        <Search size={16} className="sales-search-icon" />
                        <input 
                            type="text" 
                            placeholder={
                                location.pathname === '/staff/clients' ? "Search by name, email..." : 
                                location.pathname === '/staff/tasks' ? "Search your tasks..." :
                                "Search quote, project..."
                            }
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
                        <SalesNotificationPopup
                            notifications={notifications}
                            unreadCount={unreadCount}
                            onClose={() => setShowNotifications(false)}
                            onMarkAllRead={handleMarkAllRead}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
        </header>
    );
};

export default SalesHeader;
