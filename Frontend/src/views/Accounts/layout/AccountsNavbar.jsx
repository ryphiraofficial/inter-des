import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    RefreshCw, Landmark, LayoutDashboard, CheckCircle,
    FileText, CreditCard, TrendingUp, Users, ShoppingBag,
    Briefcase, PieChart
} from 'lucide-react';

const TAB_META = {
    overview: { label: 'Overview', icon: LayoutDashboard },
    clearance: { label: 'Payment Clearance Hub', icon: CheckCircle },
    invoices: { label: 'Invoices', icon: FileText },
    payments: { label: 'Payments', icon: CreditCard },
    expenses: { label: 'Expenses', icon: TrendingUp },
    clients: { label: 'Clients', icon: Users },
    vendors: { label: 'Vendors', icon: ShoppingBag },
    projects: { label: 'Projects', icon: Briefcase },
    reports: { label: 'Financial Reports', icon: PieChart }
};

const AccountsNavbar = ({ user, onRefresh, isLoading }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

    const currentTab = TAB_META[activeTab] || { label: 'Overview', icon: LayoutDashboard };
    const IconComponent = currentTab.icon;

    return (
        <header className="accounts-navbar">
            <div className="accounts-navbar-brand">
                <div className="accounts-navbar-icon">
                    <IconComponent size={20} />
                </div>
                <div>
                    <span className="accounts-navbar-title">{currentTab.label}</span>
                    <span className="accounts-navbar-subtitle">
                        {user?.role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                </div>
            </div>

            <div className="accounts-navbar-right">
                {onRefresh && (
                    <button className="accounts-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}
                <div className="accounts-navbar-user">
                    <div className="accounts-navbar-avatar">{getInitials(user?.name)}</div>
                    <div className="accounts-navbar-userinfo">
                        <span className="accounts-navbar-name">{user?.name || 'Accounts Officer'}</span>
                        <span className="accounts-navbar-role">{user?.role?.replace(/_/g, ' ')}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AccountsNavbar;
