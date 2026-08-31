import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, Plus, Package, CheckSquare,
    Building2, CheckCircle, LogOut, Video, FileText, Layers, ShoppingCart
} from 'lucide-react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const NAV_ITEMS = [
    { tab: 'overview',         label: 'Dashboard',         icon: LayoutDashboard },
    { tab: 'handoffs',         label: 'Design Handoffs',   icon: Plus },
    { tab: 'requests',         label: 'Material Requests', icon: Package },
    { tab: 'assignments',      label: 'Approvals & Assignments', icon: CheckSquare },
    { tab: 'vendors',          label: 'Vendors',           icon: Building2 },
    { tab: 'edge_bands',       label: 'Edge Bands (Approvals)', icon: Layers },
    { tab: 'eb_procurement',   label: 'Edge Band Queue',        icon: ShoppingCart },
    { tab: 'meetings',         label: 'Meetings',          icon: Video },
    { tab: 'reports',          label: 'Reports',           icon: FileText },
];

const ProcurementManagerSidebar = ({ onLogout, isMobileOpen, onCloseMobile }) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { companyName } = useCompanySettings();
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
                <div style={{ height: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 1.25rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '20px', color: '#000000', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>
                        {companyName}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                        Procurement Manager
                    </span>
                </div>

                <div className="procurement-sidebar-nav-container">
                    <nav className="procurement-sidebar-nav">
                        <div className="procurement-sidebar-section-label">MANAGEMENT</div>
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
                            <span className="procurement-sidebar-user-name">{user?.fullName || user?.name || 'Procurement Manager'}</span>
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

export default ProcurementManagerSidebar;
