import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, FileText, CreditCard,
    TrendingUp, Users, ShoppingBag, ClipboardList, Video, X
} from 'lucide-react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

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

const AccountsStaffSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { companyName } = useCompanySettings();

    const handleNav = (tab) => {
        navigate(`?tab=${tab}`);
        if (onClose) onClose();
    };

    return (
        <aside className={`accounts-sidebar${isOpen ? ' accounts-sidebar--open' : ''}`}>
            {/* Sidebar header with close button on mobile */}
            <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem', flexShrink: 0 }}>
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

            <div className="accounts-sidebar-nav-container">
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


        </aside>
    );
};

export default AccountsStaffSidebar;
