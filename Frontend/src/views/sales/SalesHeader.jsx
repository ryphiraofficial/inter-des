import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Bell, Menu, Plus, Search, User, Settings, LogOut } from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';
import SalesNotificationPopup from './components/SalesNotificationPopup';
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
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

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
        setIsProfileOpen(false);
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
                {['/staff/quotations', '/staff/clients', '/staff/tasks', '/staff/approvals'].includes(location.pathname) && (
                    <div className="sales-header-search">
                        <Search size={16} className="sales-search-icon" />
                        <input 
                            type="text" 
                            placeholder={
                                location.pathname === '/staff/clients' ? "Search by name, email..." : 
                                location.pathname === '/staff/tasks' ? "Search your tasks..." :
                                location.pathname === '/staff/approvals' ? "Search client, title, or project..." :
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

                <div className="sales-notif-wrapper">
                    <button 
                        className={`sales-notif-btn ${showNotifications ? 'active' : ''}`}
                        onClick={() => {
                            setIsProfileOpen(false);
                            setShowNotifications(!showNotifications);
                            if (!showNotifications) fetchNotifications();
                        }}
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="sales-notif-badge">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <div style={{ position: 'absolute', top: '115%', right: 0, zIndex: 100 }}>
                            <SalesNotificationPopup
                                notifications={notifications}
                                unreadCount={unreadCount}
                                onClose={() => setShowNotifications(false)}
                                onMarkAllRead={handleMarkAllRead}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </div>

                <div className="sales-navbar-profile-wrapper mobile-profile-wrapper" ref={profileRef} style={{ position: 'relative' }}>
                    <button 
                        className="sales-navbar-profile-btn"
                        onClick={() => {
                            setShowNotifications(false);
                            setIsProfileOpen(!isProfileOpen);
                        }}
                        style={{
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                            position: 'relative'
                        }}
                    >
                        {getInitials(user?.fullName || user?.name || 'Sales Staff')}
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                background: '#ef4444',
                                color: 'white',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid white'
                            }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isProfileOpen && (
                        <div className="sales-navbar-profile-dropdown" style={{
                            position: 'absolute',
                            top: '48px',
                            right: 0,
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '0.5rem',
                            width: '240px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            zIndex: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem'
                        }}>
                            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
                                    {user?.fullName || user?.name || 'Sales Staff'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'capitalize' }}>
                                    {user?.role?.replace(/_/g, ' ') || 'Sales Dept'}
                                </div>
                            </div>
                            <button className="sales-navbar-dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.8rem', color: '#334155', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}>
                                <User size={16} /> My Profile
                            </button>
                            <button className="sales-navbar-dropdown-item" onClick={toggleNotif} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.8rem', color: '#334155', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s', position: 'relative' }}>
                                <Bell size={16} /> Notifications
                                {unreadCount > 0 && <span style={{ marginLeft: 'auto', background: '#eef2ff', color: '#4f46e5', padding: '2px 6px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600 }}>{unreadCount}</span>}
                            </button>
                            <button className="sales-navbar-dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.8rem', color: '#334155', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}>
                                <Settings size={16} /> Settings
                            </button>
                            {onLogout && (
                                <button className="sales-navbar-dropdown-item" onClick={() => { setIsProfileOpen(false); onLogout(); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.8rem', color: '#ef4444', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s', marginTop: '0.25rem', borderTop: '1px solid #f1f5f9' }}>
                                    <LogOut size={16} /> Log Out
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default SalesHeader;
