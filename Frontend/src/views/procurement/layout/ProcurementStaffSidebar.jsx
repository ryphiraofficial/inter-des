import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, CheckSquare, Package,
    Box, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
    { tab: 'overview',     label: 'My Dashboard',     icon: LayoutDashboard },
    { tab: 'sourcing',     label: 'Sourcing Hub',     icon: ShoppingCart },
    { tab: 'tasks',        label: 'My Tasks',         icon: CheckSquare },
    { tab: 'history',      label: 'Purchase History', icon: Package },
    { tab: 'vendors',      label: 'Vendors',          icon: Box },
];

const ProcurementStaffSidebar = ({ user, onLogout, isMobileOpen, onCloseMobile }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'P';

    const handleNav = (tab) => {
        navigate(`?tab=${tab}`);
        if (onCloseMobile) onCloseMobile();
    };

    return (
        <>
            {isMobileOpen && (
                <div className="procurement-sidebar-overlay" onClick={onCloseMobile} />
            )}
            <aside className={`procurement-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
                {/* Top Heading */}
                <div className="procurement-sidebar-header">
                    <span className="procurement-sidebar-logo-text">PROCUREMENT</span>
                </div>

                <div className="procurement-sidebar-nav-container">
                    <nav className="procurement-sidebar-nav">
                        <div className="procurement-sidebar-section-label">MY WORKFLOW</div>
                        {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
                            <button
                                key={tab}
                                className={`procurement-sidebar-item ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => handleNav(tab)}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Bottom Profile & Logout block */}
                <div className="procurement-sidebar-footer">
                    <div className="procurement-sidebar-user-block">
                        <div className="procurement-sidebar-avatar">
                            {getInitials(user?.fullName || user?.name)}
                        </div>
                        <div className="procurement-sidebar-user-info">
                            <span className="procurement-sidebar-user-name">{user?.fullName || user?.name || 'Procurement Staff'}</span>
                            <span className="procurement-sidebar-user-role">{user?.role?.replace(/_/g, ' ')}</span>
                        </div>
                    </div>
                    {onLogout && (
                        <button className="procurement-sidebar-logout-btn" onClick={() => {
                            if (onCloseMobile) onCloseMobile();
                            onLogout();
                        }} title="Log Out">
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default ProcurementStaffSidebar;
