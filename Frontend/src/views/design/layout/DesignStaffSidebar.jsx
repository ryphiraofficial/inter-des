import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, RefreshCw,
    CheckCircle, Package, LogOut, Video
} from 'lucide-react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

const NAV_ITEMS = [
    { tab: 'overview',     label: 'My Overview',    icon: LayoutDashboard },
    { tab: 'tasks',        label: 'My Tasks',       icon: CheckSquare },
    { tab: 'revisions',    label: 'Revisions',      icon: RefreshCw },
    { tab: 'submissions',  label: 'Submissions',    icon: CheckCircle },
    { tab: 'materials',    label: 'Material Requests', icon: Package },
    { tab: 'meetings',     label: 'Meetings',         icon: Video },
];

const DesignStaffSidebar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { companyName } = useCompanySettings();
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'D';

    return (
        <aside className="design-sidebar">
            {/* Top Heading */}
            <div className="design-sidebar-header" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <span className="design-sidebar-logo-text" style={{ fontSize: '20px', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>
                    {companyName}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                    Design Staff
                </span>
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
