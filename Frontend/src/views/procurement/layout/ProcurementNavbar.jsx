import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    RefreshCw, ShoppingCart, LayoutDashboard, Plus, 
    Package, CheckSquare, Building2, CheckCircle, Box 
} from 'lucide-react';

const ProcurementNavbar = ({ user, role, onRefresh, isLoading }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const isManager = role === 'manager' || user?.role === 'procurement_manager';

    const tabMeta = isManager ? {
        overview: { title: 'Dashboard', icon: LayoutDashboard },
        handoffs: { title: 'Design Handoffs', icon: Plus },
        requests: { title: 'Material Requests', icon: Package },
        assignments: { title: 'Assignments', icon: CheckSquare },
        vendors: { title: 'Vendors', icon: Building2 },
        completed: { title: 'Completed & Handoff', icon: CheckCircle }
    } : {
        overview: { title: 'My Dashboard', icon: LayoutDashboard },
        sourcing: { title: 'Sourcing Hub', icon: ShoppingCart },
        tasks: { title: 'My Tasks', icon: CheckSquare },
        history: { title: 'Purchase History', icon: Package },
        vendors: { title: 'Vendors', icon: Box }
    };

    const { title, icon: Icon } = tabMeta[activeTab] || { title: 'Sourcing Hub', icon: ShoppingCart };

    return (
        <header className="procurement-navbar">
            <div className="procurement-navbar-brand">
                <div className="procurement-navbar-icon">
                    <Icon size={20} />
                </div>
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
            </div>
        </header>
    );
};

export default ProcurementNavbar;
