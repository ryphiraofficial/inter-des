import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    RefreshCw, Plus, Menu, Bell
} from 'lucide-react';

import { useNotifications } from '../../sales/hooks/useNotifications';
import NotificationPopup from '../../sales/components/SalesNotificationPopup';
import '../../sales/css/SalesHeader.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const DesignNavbar = ({ onRefresh, isLoading, toggleSidebar }) => {
    const user = useAppSelector(selectUser);
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    const isManager = user?.role?.toLowerCase().replace(/_/g, ' ').includes('design manager') || user?.role?.toLowerCase().includes('admin');

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
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const tabMeta = isManager ? {
        overview: { title: 'Overview', description: 'High-level studio performance and metrics' },
        pipeline: { title: 'Project Pipeline', description: 'Track all active design projects and statuses' },
        project_management: { title: 'Projects', description: 'Manage overall project timelines and resources' },
        tasks: { title: 'Task Management', description: 'Assign and track design tasks' },
        staff_overview: { title: 'Staff Overview', description: 'Monitor team workload and capacity' },
        material_review: { title: 'Material Review', description: 'Review and approve material selections' },
        meetings: { title: 'Meetings', description: 'Schedule and manage team meetings' }
    } : {
        overview: { title: 'My Overview', description: 'Your personal design dashboard and metrics' },
        tasks: { title: 'My Tasks', description: 'Manage your active design assignments' },
        revisions: { title: 'Revisions', description: 'Handle requested design modifications' },
        submissions: { title: 'Submissions', description: 'View your finalized and approved designs' },
        materials: { title: 'Material Requests', description: 'Submit and track your material selections' },
        meetings: { title: 'Meetings', description: 'View your scheduled meetings' }
    };

    const { title, description } = tabMeta[activeTab] || { title: 'Design Studio', description: 'Design management portal' };

    const handleAssignClick = () => {
        window.dispatchEvent(new CustomEvent('open-assign-modal'));
    };

    const toggleNotif = () => {
        setShowNotifications(v => !v);
        if (!showNotifications) fetchNotifications();
    };

    return (
        <header className="design-navbar">
            <div className="design-navbar-brand">
                <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
                    <Menu size={20} />
                </button>
                <div>
                    <span className="design-navbar-title">{title}</span>
                    <span className="design-navbar-subtitle">
                        {description}
                    </span>
                </div>
            </div>

            <div className="design-navbar-right">
                {isManager && ['tasks', 'pipeline'].includes(activeTab) && (
                    <button 
                        className="design-navbar-action-btn" 
                        onClick={handleAssignClick}
                        title="Assign New Design"
                    >
                        <Plus size={16} />
                        <span>Assign New Design</span>
                    </button>
                )}
                {onRefresh && (
                    <button className="design-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}

                {/* Notification Bell */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                    <button
                        onClick={toggleNotif}
                        title="Notifications"
                        style={{
                            position: 'relative',
                            background: showNotifications ? '#f1f5f9' : 'transparent',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#475569',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid white'
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
            </div>
        </header>
    );
};

export default DesignNavbar;
