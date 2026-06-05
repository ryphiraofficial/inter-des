import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, CheckCircle, FileText, CreditCard,
    TrendingUp, Users, ShoppingBag, Briefcase, PieChart,
    Video, ChevronDown, ChevronRight, X
} from 'lucide-react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

const NAV_ITEMS = [
    { tab: 'overview',   label: 'Overview',            icon: LayoutDashboard },
    { tab: 'clearance',  label: 'Payment Clearance',   icon: CheckCircle },
    { tab: 'invoices',   label: 'Invoices',            icon: FileText },
    { tab: 'payments',   label: 'Payments',            icon: CreditCard },
    { 
        tab: 'expenses',   
        label: 'Expenses',            
        icon: TrendingUp,
        subItems: [
            { tab: 'company_expenses', label: 'Company Expenses' }
        ]
    },
    { tab: 'clients',    label: 'Clients',             icon: Users },
    { tab: 'vendors',    label: 'Vendors',             icon: ShoppingBag },
    { tab: 'projects',   label: 'Projects',            icon: Briefcase },
    { tab: 'reports',    label: 'Financial Reports',   icon: PieChart },
    { tab: 'meetings',   label: 'Meetings',            icon: Video },
];

const AccountsManagerSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { companyName } = useCompanySettings();

    const handleNav = (tab) => {
        navigate(`?tab=${tab}`);
        if (onClose) onClose(); // close sidebar on mobile after navigation
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
                        Accounts Manager
                    </span>
                </div>
                {/* Close button — mobile only */}
                <button className="accounts-sidebar-close" onClick={onClose} aria-label="Close menu">
                    <X size={20} />
                </button>
            </div>

            <div className="accounts-sidebar-nav-container">
                <nav className="accounts-sidebar-nav">
                    <div className="accounts-sidebar-section-label">FINANCE CONTROL</div>
                    {NAV_ITEMS.map(({ tab, label, icon: Icon, subItems }) => {
                        const isMainActive = activeTab === tab || (subItems && subItems.some(s => s.tab === activeTab));
                        return (
                            <React.Fragment key={tab}>
                                <button
                                    className={`accounts-sidebar-item ${isMainActive ? 'active' : ''}`}
                                    onClick={() => handleNav(tab)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Icon size={18} />
                                        <span>{label}</span>
                                    </div>
                                    {subItems && (
                                        isMainActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                    )}
                                </button>
                                {subItems && isMainActive && subItems.map(sub => (
                                    <button
                                        key={sub.tab}
                                        className={`accounts-sidebar-item ${activeTab === sub.tab ? 'active' : ''}`}
                                        onClick={() => handleNav(sub.tab)}
                                        style={{ 
                                            paddingLeft: '3.5rem', 
                                            fontSize: '0.875rem', 
                                            height: '38px',
                                            color: activeTab === sub.tab ? '#3b82f6' : '#64748b',
                                            fontWeight: activeTab === sub.tab ? 600 : 500,
                                            background: activeTab === sub.tab ? '#eff6ff' : 'transparent',
                                            borderLeft: activeTab === sub.tab ? '3px solid #3b82f6' : '3px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span>{sub.label}</span>
                                    </button>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>


        </aside>
    );
};

export default AccountsManagerSidebar;
