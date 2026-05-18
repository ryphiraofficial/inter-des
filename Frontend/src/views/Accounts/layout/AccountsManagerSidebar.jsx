import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, CheckCircle, FileText, CreditCard,
    TrendingUp, Users, ShoppingBag, Briefcase, PieChart
} from 'lucide-react';

const NAV_ITEMS = [
    { tab: 'overview',   label: 'Overview',            icon: LayoutDashboard },
    { tab: 'clearance',  label: 'Payment Clearance',   icon: CheckCircle },
    { tab: 'invoices',   label: 'Invoices',            icon: FileText },
    { tab: 'payments',   label: 'Payments',            icon: CreditCard },
    { tab: 'expenses',   label: 'Expenses',            icon: TrendingUp },
    { tab: 'clients',    label: 'Clients',             icon: Users },
    { tab: 'vendors',    label: 'Vendors',             icon: ShoppingBag },
    { tab: 'projects',   label: 'Projects',            icon: Briefcase },
    { tab: 'reports',    label: 'Financial Reports',   icon: PieChart },
];

const AccountsManagerSidebar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    return (
        <aside className="accounts-sidebar">
            <nav className="accounts-sidebar-nav">
                <div className="accounts-sidebar-section-label">FINANCE CONTROL</div>
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
        </aside>
    );
};

export default AccountsManagerSidebar;
