import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, Plus, Package, CheckSquare,
    Building2, CheckCircle, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
    { tab: 'overview',         label: 'Dashboard',         icon: LayoutDashboard },
    { tab: 'handoffs',         label: 'Design Handoffs',   icon: Plus },
    { tab: 'requests',         label: 'Material Requests', icon: Package },
    { tab: 'assignments',      label: 'Approvals & Assignments', icon: CheckSquare },
    { tab: 'vendors',          label: 'Vendors',           icon: Building2 },
    { tab: 'completed',        label: 'Completed & Handoff', icon: CheckCircle },
];

const ProcurementManagerSidebar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'P';

    return (
        <aside className="procurement-sidebar">
            {/* Top Heading */}
            <div className="procurement-sidebar-header">
                <span className="procurement-sidebar-logo-text">PROCUREMENT</span>
            </div>

            <div className="procurement-sidebar-nav-container">
                <nav className="procurement-sidebar-nav">
                    <div className="procurement-sidebar-section-label">MANAGEMENT</div>
                    {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
                        <button
                            key={tab}
                            className={`procurement-sidebar-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => navigate(`?tab=${tab}`)}
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
                        <span className="procurement-sidebar-user-name">{user?.fullName || user?.name || 'Procurement Manager'}</span>
                        <span className="procurement-sidebar-user-role">{user?.role?.replace(/_/g, ' ')}</span>
                    </div>
                </div>
                {onLogout && (
                    <button className="procurement-sidebar-logout-btn" onClick={onLogout} title="Log Out">
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                )}
            </div>
        </aside>
    );
};

export default ProcurementManagerSidebar;
