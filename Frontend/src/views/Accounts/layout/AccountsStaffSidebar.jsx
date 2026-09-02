import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, FileText, CreditCard,
    TrendingUp, Users, ShoppingBag, ClipboardList, Video, X, LogOut, BarChart3,
    BookOpen, Receipt, Building2, Wallet
} from 'lucide-react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

const NAV_ITEMS = [
    { tab: 'overview',   label: 'Overview',            icon: LayoutDashboard },
    { tab: 'vouchers',   label: 'Vouchers (V2)',       icon: Receipt },
    { tab: 'ledgers',    label: 'Ledgers (V2)',        icon: BookOpen },
    { tab: 'programs',   label: 'Programs (V2)',       icon: Building2 },
    { tab: 'accounts_v2',label: 'Bank & Cash (V2)',    icon: Wallet },
    { tab: 'invoices',   label: 'Invoices',            icon: FileText },
    { tab: 'payments',   label: 'Payments',            icon: CreditCard },
    { tab: 'expenses',   label: 'Expenses',            icon: TrendingUp },
    { tab: 'clients',    label: 'Clients',             icon: Users },
    { tab: 'vendors',    label: 'Vendors',             icon: ShoppingBag },
    { tab: 'reports',    label: 'Reports',             icon: FileText },
    { tab: 'performance',label: 'Performance Analytics',icon: BarChart3 },
    { tab: 'meetings',   label: 'Meetings',            icon: Video },
];

const AccountsStaffSidebar = ({ isOpen, onClose, user, onLogout }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { companyName } = useCompanySettings();

    const handleNav = (tab) => {
        navigate(`?tab=${tab}`);
        if (onClose) onClose();
    };

    const getInitials = (u) => {
        const name = u?.fullName || u?.name || '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    };

    return (
        <aside className={`accounts-sidebar${isOpen ? ' accounts-sidebar--open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar header with close button on mobile */}
            <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '20px', color: '#000000', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>
                        {companyName}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                        Accounts Staff
                    </span>
                </div>
                {/* Close button — mobile only */}
                <button className="accounts-sidebar-close" onClick={onClose} aria-label="Close menu">
                    <X size={20} />
                </button>
            </div>

            <div className="accounts-sidebar-nav-container" style={{ flex: 1, overflowY: 'auto', paddingTop: '1rem' }}>
                <nav className="accounts-sidebar-nav">
                    <div className="accounts-sidebar-section-label">OPERATIONS</div>
                    {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
                        <button
                            key={tab}
                            className={`accounts-sidebar-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => handleNav(tab)}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Profile and Logout for Desktop Only */}
            <div className="accounts-sidebar-footer accounts-hide-on-mobile" style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', marginTop: 'auto', flexShrink: 0, background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                    <div className="accounts-mobile-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem', flexShrink: 0 }}>
                        {getInitials(user)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        <span className="accounts-sidebar-user-name">{user?.fullName || user?.name || 'User'}</span>
                        <span className="accounts-sidebar-user-role">{user?.role?.replace(/_/g, ' ') || 'Accounts'}</span>
                    </div>
                </div>
                {onLogout && (
                    <button className="accounts-sidebar-logout-btn" onClick={onLogout}>
                        <LogOut size={16} />
                        <span>Log Out</span>
                    </button>
                )}
            </div>
        </aside>
    );
};

export default AccountsStaffSidebar;
