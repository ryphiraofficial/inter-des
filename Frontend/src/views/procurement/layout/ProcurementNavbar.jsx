import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    RefreshCw, ShoppingCart, LayoutDashboard, Plus, 
    Package, CheckSquare, Building2, CheckCircle, Box, Menu, Bell, Video
} from 'lucide-react';

const ProcurementNavbar = ({ user, role, onRefresh, isLoading, onMenuClick }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const isManager = role === 'manager' || user?.role === 'procurement_manager';

    const tabMeta = isManager ? {
        overview: { title: 'Dashboard', icon: LayoutDashboard },
        handoffs: { title: 'Design Handoffs', icon: Plus },
        requests: { title: 'Material Requests', icon: Package },
        assignments: { title: 'Assignments', icon: CheckSquare },
        vendors: { title: 'Vendors', icon: Building2 },
        completed: { title: 'Completed & Handoff', icon: CheckCircle },
        meetings: { title: 'Meetings', icon: Video }
    } : {
        overview: { title: 'My Dashboard', icon: LayoutDashboard },
        sourcing: { title: 'Sourcing Hub', icon: ShoppingCart },
        tasks: { title: 'My Tasks', icon: CheckSquare },
        history: { title: 'Purchase History', icon: Package },
        vendors: { title: 'Vendors', icon: Box },
        meetings: { title: 'Meetings', icon: Video }
    };

    const { title, icon: Icon } = tabMeta[activeTab] || { title: 'Sourcing Hub', icon: ShoppingCart };

    return (
        <header className="procurement-navbar">
            <div className="procurement-navbar-brand">
                <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle Menu">
                    <Menu size={24} />
                </button>

                <div>
                    <span className="procurement-navbar-title">{title}</span>
                    <span className="procurement-navbar-subtitle">
                        {user?.role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                </div>
            </div>

            <div className="procurement-navbar-right">
                {onRefresh && (
                    <button className="procurement-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}
                <button className="procurement-navbar-bell" aria-label="Notifications">
                    <Bell size={19} strokeWidth={2.2} />
                </button>
            </div>
        </header>
    );
};

export default ProcurementNavbar;
