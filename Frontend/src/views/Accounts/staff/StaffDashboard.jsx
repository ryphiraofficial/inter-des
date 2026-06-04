import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountsLayout from '../layout/AccountsLayout';
import '../css/ManagerDashboard.css';

// Import Localized Sub-components
import Overview from '../common/Overview';
import ManagerClients from '../manager/ManagerClients';
import ManagerPayments from '../manager/ManagerPayments';
import ManagerExpenses from '../manager/ManagerExpenses';
import ManagerVendors from '../manager/ManagerVendors';
import AccountsInvoices from '../common/AccountsInvoices';
import MyCollections from './components/MyCollections';
import MeetingsPage from '../../common/MeetingsPage';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const StaffDashboard = ({ onLogout }) => {
    const user = useAppSelector(selectUser);
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        setSearch('');
    }, [activeTab]);

    const exportSupportedTabs = ['collections', 'invoices', 'payments', 'expenses', 'vendors', 'clients'];
    const handleExport = exportSupportedTabs.includes(activeTab) ? () => {
        window.dispatchEvent(new CustomEvent('accounts-export-data', { detail: { tab: activeTab } }));
    } : null;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Overview user={user} />;
            case 'collections': return <MyCollections user={user} search={search} setSearch={setSearch} />;
            case 'invoices': return <AccountsInvoices user={user} search={search} setSearch={setSearch} />;
            case 'payments': return <ManagerPayments user={user} search={search} setSearch={setSearch} />;
            case 'expenses': return <ManagerExpenses user={user} search={search} setSearch={setSearch} />;
            case 'vendors': return <ManagerVendors user={user} search={search} setSearch={setSearch} />;
            case 'clients': return <ManagerClients user={user} search={search} setSearch={setSearch} />;
            case 'meetings': return <MeetingsPage user={user} />;
            default: return <Overview user={user} />;
        }
    };

    return (
        <AccountsLayout role="staff" user={user} onLogout={onLogout} search={search} setSearch={setSearch} onExport={handleExport}>
            <div className="role-dashboard accounts-staff-hub">
                {renderContent()}
            </div>
        </AccountsLayout>
    );
};

export default StaffDashboard;
