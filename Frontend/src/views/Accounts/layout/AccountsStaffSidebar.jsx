import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, FileText, CreditCard,
    TrendingUp, Users, ShoppingBag, LogOut, ClipboardList, Video
} from 'lucide-react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const NAV_ITEMS = [
    { tab: 'overview',   label: 'Overview',            icon: LayoutDashboard },
    { tab: 'collections', label: 'My Collections',      icon: ClipboardList },
    { tab: 'invoices',   label: 'Invoices',            icon: FileText },
    { tab: 'payments',   label: 'Payments',            icon: CreditCard },
    { tab: 'expenses',   label: 'Expenses',            icon: TrendingUp },
    { tab: 'clients',    label: 'Clients',             icon: Users },
    { tab: 'vendors',    label: 'Vendors',             icon: ShoppingBag },
    { tab: 'meetings',   label: 'Meetings',            icon: Video },
];

const AccountsStaffSidebar = ({ onLogout }) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { companyName } = useCompanySettings();
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

    return (
        <aside className="accounts-sidebar">
            <div style={{ height: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 1.25rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <span style={{ fontSize: '20px', color: '#000000', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>
                    {companyName}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                    Accounts Staff
                </span>
            </div>
            <div className="accounts-sidebar-nav-container">
                <nav className="accounts-sidebar-nav">
                    <div className="accounts-sidebar-section-label">OPERATIONS</div>
                    {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
                        <button
                            key={tab}
                            className={`accounts-sidebar-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => navigate(`?tab=${tab}`)}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Profile Info and Logout button inside Sidebar footer */}
            <div className="accounts-sidebar-footer">
                <div className="accounts-sidebar-user-block">
                    <div className="accounts-sidebar-avatar">
                        {getInitials(user?.name)}
                    </div>
                    <div className="accounts-sidebar-user-info">
                        <span className="accounts-sidebar-user-name">{user?.name || 'Accounts Staff'}</span>
                        <span className="accounts-sidebar-user-role">{user?.role?.replace(/_/g, ' ')}</span>
                    </div>
                </div>
                {onLogout && (
                    <button className="accounts-sidebar-logout-btn" onClick={onLogout} title="Log Out">
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                )}
            </div>
        </aside>
    );
};

export default AccountsStaffSidebar;
