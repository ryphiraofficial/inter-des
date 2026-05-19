import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountsLayout from '../layout/AccountsLayout';
import '../css/ManagerDashboard.css';

// Import Localized Sub-components
import Overview from '../common/Overview';
import PaymentClearanceHub from './PaymentClearanceHub';
import ManagerClients from './ManagerClients';
import ManagerPayments from './ManagerPayments';
import ManagerExpenses from './ManagerExpenses';
import ManagerVendors from './ManagerVendors';
import AccountsInvoices from '../common/AccountsInvoices';
import AccountsProjects from '../common/AccountsProjects';
import AccountsReports from '../common/AccountsReports';

const ManagerDashboard = ({ user, onLogout }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        setSearch('');
    }, [activeTab]);

    const exportSupportedTabs = ['expenses', 'payments', 'vendors', 'clients', 'invoices'];
    const handleExport = exportSupportedTabs.includes(activeTab) ? () => {
        window.dispatchEvent(new CustomEvent('accounts-export-data', { detail: { tab: activeTab } }));
    } : null;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Overview user={user} />;
            case 'clearance': return <PaymentClearanceHub user={user} search={search} setSearch={setSearch} />;
            case 'clients': return <ManagerClients user={user} search={search} setSearch={setSearch} />;
            case 'invoices': return <AccountsInvoices user={user} search={search} setSearch={setSearch} />;
            case 'payments': return <ManagerPayments user={user} search={search} setSearch={setSearch} />;
            case 'expenses': return <ManagerExpenses user={user} search={search} setSearch={setSearch} />;
            case 'vendors': return <ManagerVendors user={user} search={search} setSearch={setSearch} />;
            case 'projects': return <AccountsProjects user={user} search={search} setSearch={setSearch} />;
            case 'reports': return <AccountsReports user={user} search={search} setSearch={setSearch} />;
            default: return <Overview user={user} />;
        }
    };

    return (
        <AccountsLayout role="manager" user={user} onLogout={onLogout} search={search} setSearch={setSearch} onExport={handleExport}>
            <div className="role-dashboard accounts-manager-hub">
                {renderContent()}
            </div>
        </AccountsLayout>
    );
};

export default ManagerDashboard;
