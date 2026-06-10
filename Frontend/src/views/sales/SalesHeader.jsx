import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Bell, Menu, Plus, Search, X } from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';
import SalesNotificationPopup from './components/SalesNotificationPopup';
import ProfileDropdown from './components/ProfileDropdown';
import './css/SalesHeader.css';

const SalesHeader = ({ title, subtitle, toggleSidebar, user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showNotifications, setShowNotifications] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

    const { notifications, unreadCount, fetchNotifications, handleMarkAsRead, handleMarkAllRead, handleDelete } = useNotifications();

    const handleSearchChange = (e) => {
        const val = e.target.value;
        if (val) { searchParams.set('q', val); } else { searchParams.delete('q'); }
        setSearchParams(searchParams);
    };

    const toggleNotif = () => {
        setIsProfileOpen(false);
        setShowNotifications(v => !v);
        if (!showNotifications) fetchNotifications();
    };

    const searchPaths = ['/staff/quotations', '/staff/clients', '/staff/tasks', '/staff/approvals'];
    const searchPlaceholders = {
        '/staff/clients': 'Search by name, email...',
        '/staff/tasks': 'Search your tasks...',
        '/staff/approvals': 'Search client, title, or project...',
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
                {searchPaths.includes(location.pathname) && (
                    <div className="sales-header-search">
                        <Search size={16} className="sales-search-icon" />
                        <input type="text"
                            placeholder={searchPlaceholders[location.pathname] || 'Search quote, project...'}
                            value={searchParams.get('q') || ''}
                            onChange={handleSearchChange}
                        />
                    </div>
                )}

                {location.pathname === '/staff/quotations' && (
                    <button className="sales-new-btn" onClick={() => navigate('/staff/quotations/new')}>
                        <Plus size={15} /><span className="desktop-hide-text">New Quotation</span>
                    </button>
                )}

                {location.pathname === '/staff/clients' && (
                    <button className="sales-new-btn" onClick={() => { const p = new URLSearchParams(searchParams); p.set('action', 'new'); setSearchParams(p); }}>
                        <Plus size={15} /><span className="desktop-hide-text">Add Client</span>
                    </button>
                )}

                {location.pathname === '/staff/reports' && (
                    <button className="sales-new-btn" onClick={() => { 
                        const p = new URLSearchParams(searchParams); 
                        if (p.get('action') === 'new') p.delete('action');
                        else p.set('action', 'new');
                        setSearchParams(p); 
                    }}>
                        {searchParams.get('action') === 'new' ? <X size={15} /> : <Plus size={15} />}
                        <span className="desktop-hide-text">
                            {searchParams.get('action') === 'new' ? 'Close Form' : 'New Report'}
                        </span>
                    </button>
                )}

                {/* Notifications Bell */}
                <div className="sales-notif-wrapper">
                    <button className={`sales-notif-btn ${showNotifications ? 'active' : ''}`} onClick={toggleNotif} aria-label="Notifications">
                        <Bell size={18} />
                        {unreadCount > 0 && <span className="sales-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                    </button>
                    {showNotifications && (
                        <div style={{ position: 'absolute', top: '115%', right: 0, zIndex: 100 }}>
                            <SalesNotificationPopup notifications={notifications} unreadCount={unreadCount} onClose={() => setShowNotifications(false)} onMarkAllRead={handleMarkAllRead} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} />
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="sales-navbar-profile-wrapper mobile-profile-wrapper" ref={profileRef} style={{ position: 'relative' }}>
                    <button className="sales-navbar-profile-btn"
                        onClick={() => { setShowNotifications(false); setIsProfileOpen(!isProfileOpen); }}
                        style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative' }}
                    >
                        {getInitials(user?.fullName || user?.name || 'Sales Staff')}
                        {unreadCount > 0 && (
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isProfileOpen && (
                        <ProfileDropdown
                            user={user}
                            unreadCount={unreadCount}
                            onClose={() => setIsProfileOpen(false)}
                            onLogout={onLogout}
                            toggleNotif={toggleNotif}
                        />
                    )}
                </div>
            </div>
        </header>
    );
};

export default SalesHeader;
