import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, RefreshCw,
    CheckCircle, Package, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
    { tab: 'overview',     label: 'My Overview',    icon: LayoutDashboard },
    { tab: 'tasks',        label: 'My Tasks',       icon: CheckSquare },
    { tab: 'revisions',    label: 'Revisions',      icon: RefreshCw },
    { tab: 'submissions',  label: 'Submissions',    icon: CheckCircle },
    { tab: 'materials',    label: 'Material Requests', icon: Package },
];

const DesignStaffSidebar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'D';

    return (
        <aside className="design-sidebar">
            {/* Top Heading */}
            <div className="design-sidebar-header">
                <span className="design-sidebar-logo-text">DESIGN PORTAL</span>
            </div>

            <div className="design-sidebar-nav-container">
                <nav className="design-sidebar-nav">
                    <div className="design-sidebar-section-label">WORKSPACE</div>
                    {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
                        <button
                            key={tab}
                            className={`design-sidebar-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => navigate(`?tab=${tab}`)}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Bottom Profile & Logout block */}
            <div className="design-sidebar-footer">
                <div className="design-sidebar-user-block">
                    <div className="design-sidebar-avatar">
                        {getInitials(user?.name)}
                    </div>
                    <div className="design-sidebar-user-info">
                        <span className="design-sidebar-user-name">{user?.name || 'Designer'}</span>
                        <span className="design-sidebar-user-role">{user?.role?.replace(/_/g, ' ')}</span>
                    </div>
                </div>
                {onLogout && (
                    <button className="design-sidebar-logout-btn" onClick={onLogout} title="Log Out">
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                )}
            </div>
        </aside>
    );
};

export default DesignStaffSidebar;
