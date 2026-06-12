import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    RefreshCw, ShoppingCart, LayoutDashboard, Plus, 
    Package, CheckSquare, Building2, CheckCircle, Box, Menu, Bell, Video,
    User, Settings, LogOut, ChevronDown, FileText
} from 'lucide-react';

import { useNotifications } from '../../sales/hooks/useNotifications';
import NotificationPopup from '../../sales/components/SalesNotificationPopup';
import '../../sales/css/SalesHeader.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ProcurementNavbar = ({ role, onRefresh, isLoading, onMenuClick, onLogout }) => {
    const user = useAppSelector(selectUser);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef(null);

    const isManager = role === 'manager' || user?.role === 'procurement_manager';

    const {
        notifications,
        unreadCount,
        fetchNotifications,
        handleMarkAsRead,
        handleMarkAllRead,
        handleDelete
    } = useNotifications();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'P';

    const tabMeta = isManager ? {
        overview: { title: 'Dashboard', icon: LayoutDashboard, description: 'Overview of procurement activities' },
        handoffs: { title: 'Design Handoffs', icon: Plus, description: 'Review and approve design handoffs' },
        requests: { title: 'Material Requests', icon: Package, description: 'Manage and track material requests' },
        assignments: { title: 'Assignments', icon: CheckSquare, description: 'Assign tasks to procurement staff' },
        vendors: { title: 'Vendors', icon: Building2, description: 'Manage vendor relationships' },
        completed: { title: 'Completed & Handoff', icon: CheckCircle, description: 'View completed procurement handoffs' },
        meetings: { title: 'Meetings', icon: Video, description: 'Schedule and manage vendor meetings' },
        reports: { title: 'Staff Reports', icon: FileText, description: 'Review and manage reports submitted by staff.' }
    } : {
        overview: { title: 'My Dashboard', icon: LayoutDashboard, description: 'Manage your assigned material requests, track incoming stock, and log your vendor interactions all in one place.' },
        sourcing: { title: 'Sourcing Hub', icon: ShoppingCart, description: 'Select a project to start curating materials.' },
        tasks: { title: 'My Tasks', icon: CheckSquare, description: 'Track your pending and in-progress material tasks.' },
        history: { title: 'Purchase History', icon: Package, description: 'View historical purchases and compare vendor prices.' },
        vendors: { title: 'Vendors', icon: Box, description: 'Browse active vendors and review purchase histories.' },
        meetings: { title: 'Meetings', icon: Video, description: 'Schedule and manage your vendor or team meetings.' },
        reports: { title: 'Staff Reports', icon: FileText, description: 'Track and review all your submitted reports and their status.' }
    };

    const { title, icon: Icon, description } = tabMeta[activeTab] || { title: 'Sourcing Hub', icon: ShoppingCart, description: 'Select a project to start curating materials.' };

    const toggleNotif = () => {
        setIsProfileOpen(false);
        setShowNotifications(v => !v);
        if (!showNotifications) fetchNotifications();
    };

    return (
        <header className="procurement-navbar">
            <div className="procurement-navbar-brand">
                <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle Menu">
                    <Menu size={24} />
                </button>

                <div>
                    <span className="procurement-navbar-title">{title}</span>
                    <span className="procurement-navbar-subtitle">
                        {description || user?.role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                </div>
            </div>

            <div className="procurement-navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div id="procurement-navbar-actions">
                    {activeTab === 'reports' && (
                        <button 
                            onClick={() => {
                                const p = new URLSearchParams(searchParams);
                                p.set('action', 'new');
                                setSearchParams(p);
                            }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', background: '#4f46e5', color: 'white',
                                border: 'none', borderRadius: '6px', fontWeight: 600,
                                fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#4338ca'}
                            onMouseLeave={(e) => e.target.style.background = '#4f46e5'}
                        >
                            <Plus size={16} /> Create Report
                        </button>
                    )}
                </div>
                {onRefresh && (
                    <button className="procurement-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}

                <div style={{ position: 'relative' }}>
                    <button 
                        className="procurement-navbar-bell" 
                        onClick={() => {
                            setIsProfileOpen(false);
                            setShowNotifications(v => !v);
                            if (!showNotifications) fetchNotifications();
                        }}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-2px', right: '-2px',
                                background: '#ef4444', color: 'white', fontSize: '0.65rem',
                                fontWeight: 'bold', width: '18px', height: '18px',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', border: '2px solid white'
                            }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <NotificationPopup 
                            notifications={notifications}
                            unreadCount={unreadCount}
                            onClose={() => setShowNotifications(false)}
                            onMarkAsRead={handleMarkAsRead}
                            onMarkAllRead={handleMarkAllRead}
                            onDelete={handleDelete}
                        />
                    )}
                </div>

                <div className="procurement-navbar-profile-wrapper" ref={profileRef} style={{ position: 'relative' }}>
                    <button 
                        className="procurement-navbar-profile-btn"
                        onClick={() => {
                            setShowNotifications(false);
                            setIsProfileOpen(!isProfileOpen);
                        }}
                        style={{ position: 'relative' }}
                    >
                        <div className="procurement-navbar-avatar" style={{ width: '38px', height: '38px' }}>
                            {getInitials(user?.fullName || user?.name)}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="procurement-navbar-profile-dropdown">
                            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
                                    {user?.fullName || user?.name || 'Staff User'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'capitalize' }}>
                                    {user?.role?.replace(/_/g, ' ') || 'Procurement Role'}
                                </div>
                            </div>
                            <button className="procurement-navbar-dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                <User size={16} /> My Profile
                            </button>
                            <button className="procurement-navbar-dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                <Settings size={16} /> Settings
                            </button>
                            {onLogout && (
                                <button className="procurement-navbar-dropdown-item logout" onClick={() => { setIsProfileOpen(false); onLogout(); }}>
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

export default ProcurementNavbar;
