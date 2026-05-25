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
        overview: { title: 'Dashboard', icon: LayoutDashboard, description: 'Overview of procurement activities' },
        handoffs: { title: 'Design Handoffs', icon: Plus, description: 'Review and approve design handoffs' },
        requests: { title: 'Material Requests', icon: Package, description: 'Manage and track material requests' },
        assignments: { title: 'Assignments', icon: CheckSquare, description: 'Assign tasks to procurement staff' },
        vendors: { title: 'Vendors', icon: Building2, description: 'Manage vendor relationships' },
        completed: { title: 'Completed & Handoff', icon: CheckCircle, description: 'View completed procurement handoffs' },
        meetings: { title: 'Meetings', icon: Video, description: 'Schedule and manage vendor meetings' }
    } : {
        overview: { title: 'My Dashboard', icon: LayoutDashboard, description: 'Manage your assigned material requests, track incoming stock, and log your vendor interactions all in one place.' },
        sourcing: { title: 'Sourcing Hub', icon: ShoppingCart, description: 'Select a project to start curating materials.' },
        tasks: { title: 'My Tasks', icon: CheckSquare, description: 'Track your pending and in-progress material tasks.' },
        history: { title: 'Purchase History', icon: Package, description: 'View historical purchases and compare vendor prices.' },
        vendors: { title: 'Vendors', icon: Box, description: 'Browse active vendors and review purchase histories.' },
        meetings: { title: 'Meetings', icon: Video, description: 'Schedule and manage your vendor or team meetings.' }
    };

    const { title, icon: Icon, description } = tabMeta[activeTab] || { title: 'Sourcing Hub', icon: ShoppingCart, description: 'Select a project to start curating materials.' };

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
                <div id="procurement-navbar-actions"></div>
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
