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

const StaffDashboard = ({ user, onLogout }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Overview user={user} />;
            case 'collections': return <MyCollections user={user} />;
            case 'invoices': return <AccountsInvoices user={user} />;
            case 'payments': return <ManagerPayments user={user} />;
            case 'expenses': return <ManagerExpenses user={user} />;
            case 'vendors': return <ManagerVendors user={user} />;
            default: return <Overview user={user} />;
        }
    };

    return (
        <AccountsLayout role="staff" user={user} onLogout={onLogout}>
            <div className="role-dashboard accounts-staff-hub">
                {renderContent()}
            </div>
        </AccountsLayout>
    );
};

export default StaffDashboard;
