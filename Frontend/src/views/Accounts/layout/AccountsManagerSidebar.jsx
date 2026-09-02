import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, CheckCircle, FileText, CreditCard,
    TrendingUp, Users, ShoppingBag, Briefcase, PieChart,
    Video, ChevronDown, ChevronRight, X, LogOut, BarChart3,
    BookOpen, Receipt, Building2, Wallet
} from 'lucide-react';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import { BASE_IMAGE_URL } from '../../../config/constants';

const NAV_ITEMS = [
    { tab: 'overview',   label: 'Overview',            icon: LayoutDashboard },
    { tab: 'vouchers',   label: 'Vouchers',            icon: Receipt },
    { tab: 'ledgers',    label: 'Ledgers',             icon: BookOpen },
    { tab: 'programs',   label: 'Programs',            icon: Building2 },
    { tab: 'accounts_v2',label: 'Bank & Cash',         icon: Wallet },
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
    { tab: 'staff_reports', label: 'Staff Reports',    icon: FileText },
    { tab: 'performance',label: 'Performance Analytics',icon: BarChart3 },
    { tab: 'meetings',   label: 'Meetings',            icon: Video },
];

const AccountsManagerSidebar = ({ isOpen, onClose, user, onLogout }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { companyName } = useCompanySettings();

    const handleNav = (tab) => {
        navigate(`?tab=${tab}`);
        if (onClose) onClose();
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const displayName = user?.fullName || user?.name || 'Accounts Manager';
    const userInitials = displayName ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AM';

    return (
        <aside className={`accounts-sidebar${isOpen ? ' accounts-sidebar--open' : ''}`}>
            {/* Sidebar header */}
            <div className="sidebar-header">
                <div className="brand-wrapper">
                    <h1 className="brand-title">
                        {companyName}
                    </h1>
                    <p className="brand-subtitle">
                        Accounts Manager
                    </p>
                </div>
                <button className="btn-close-sidebar-mobile accounts-sidebar-close" onClick={onClose} aria-label="Close menu" title="Close Sidebar">
                    <X size={20} />
                </button>
            </div>

            {/* Navigation container */}
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
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Icon size={18} className="nav-icon" />
                                        <span>{label}</span>
                                    </div>
                                    {subItems && (
                                        isMainActive ? <ChevronDown size={14} className="nav-chevron" /> : <ChevronRight size={14} className="nav-chevron" />
                                    )}
                                </button>
                                {subItems && isMainActive && subItems.map(sub => (
                                    <button
                                        key={sub.tab}
                                        className={`accounts-sidebar-subitem ${activeTab === sub.tab ? 'active' : ''}`}
                                        onClick={() => handleNav(sub.tab)}
                                    >
                                        <span className="accounts-sidebar-subitem-dot" />
                                        <span>{sub.label}</span>
                                    </button>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>

            {/* Sidebar Footer with Admin styling */}
            <div className="sidebar-footer">
                <div className="footer-user-info">
                    <div className="footer-avatar">
                        {user?.avatar ? (
                            <img src={getImageUrl(user.avatar)} alt="Avatar" />
                        ) : (
                            userInitials
                        )}
                    </div>
                    <div className="footer-details">
                        <p className="footer-name">{displayName}</p>
                        <p className="footer-role">{user?.role ? user.role.replace(/_/g, ' ') : 'Accounts Manager'}</p>
                    </div>
                </div>
                {onLogout && (
                    <button className="btn-logout-icon" onClick={onLogout} title="Logout">
                        <LogOut size={18} />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default AccountsManagerSidebar;
