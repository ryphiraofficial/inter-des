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

const ManagerDashboard = ({ user }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Overview user={user} />;
            case 'clearance': return <PaymentClearanceHub user={user} />;
            case 'clients': return <ManagerClients user={user} />;
            case 'invoices': return <AccountsInvoices user={user} />;
            case 'payments': return <ManagerPayments user={user} />;
            case 'expenses': return <ManagerExpenses user={user} />;
            case 'vendors': return <ManagerVendors user={user} />;
            case 'projects': return <AccountsProjects user={user} />;
            case 'reports': return <AccountsReports user={user} />;
            default: return <Overview user={user} />;
        }
    };

    return (
        <AccountsLayout role="manager" user={user}>
            <div className="role-dashboard accounts-manager-hub">
                {renderContent()}
            </div>
        </AccountsLayout>
    );
};

export default ManagerDashboard;
