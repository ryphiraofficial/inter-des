import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, RefreshCw,
    CheckCircle, Package, LogOut, Video, FileText, History
} from 'lucide-react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const NAV_ITEMS = [
    { tab: 'overview',     label: 'My Overview',    icon: LayoutDashboard },
    { tab: 'tasks',        label: 'My Tasks',       icon: CheckSquare },
    { tab: 'revisions',    label: 'Revisions',      icon: RefreshCw },
    { tab: 'submissions',  label: 'Submissions',    icon: CheckCircle },
    { tab: 'materials',    label: 'Material Requests', icon: Package },
    { tab: 'meetings',     label: 'Meetings',         icon: Video },
    { tab: 'reports',      label: 'Reports',          icon: FileText },
];

const DesignStaffSidebar = ({ onLogout }) => {
    const user = useAppSelector(selectUser);
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
                    {NAV_ITEMS.map(({ tab, label, icon: Icon }) => {
                        const isReportsActive = activeTab === 'reports';
                        const isMainReportsActive = isReportsActive && searchParams.get('action') === 'new';
                        const isSubReportsActive = isReportsActive && searchParams.get('action') !== 'new';

                        return (
                            <div key={tab} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <button
                                    className={`design-sidebar-item ${tab === 'reports' ? (isMainReportsActive ? 'active' : '') : (activeTab === tab ? 'active' : '')}`}
                                    onClick={() => navigate(tab === 'reports' ? `?tab=${tab}&action=new` : `?tab=${tab}`)}
                                    style={{ width: '100%' }}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </button>
                                {tab === 'reports' && isReportsActive && (
                                    <div style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', marginBottom: '4px' }}>
                                        <button
                                            className={`design-sidebar-item ${isSubReportsActive ? 'active' : ''}`}
                                            onClick={() => navigate(`?tab=reports`)}
                                            style={{
                                                fontSize: '0.82rem',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                width: '100%',
                                                background: isSubReportsActive ? '#eef2ff' : 'transparent',
                                                color: isSubReportsActive ? '#4f46e5' : '#64748b',
                                                fontWeight: isSubReportsActive ? '700' : '500'
                                            }}
                                        >
                                            <History size={15} />
                                            <span>Previous Reports</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
