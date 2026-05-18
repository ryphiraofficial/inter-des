import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, GitBranch, FileText, Briefcase,
    CheckSquare, Users, Package, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
    { tab: 'overview',           label: 'Overview',          icon: LayoutDashboard },
    { tab: 'pipeline',           label: 'Project Pipeline',  icon: GitBranch },
    { tab: 'project_details',    label: 'Project Details',   icon: FileText },
    { tab: 'project_management', label: 'Projects',          icon: Briefcase },
    { tab: 'tasks',              label: 'Task Management',   icon: CheckSquare },
    { tab: 'staff_overview',     label: 'Staff Overview',    icon: Users },
    { tab: 'material_review',    label: 'Material Review',   icon: Package },
];

const DesignManagerSidebar = ({ user, onLogout }) => {
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
                    <div className="design-sidebar-section-label">MANAGEMENT</div>
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
                        <span className="design-sidebar-user-name">{user?.name || 'Design Manager'}</span>
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

export default DesignManagerSidebar;
