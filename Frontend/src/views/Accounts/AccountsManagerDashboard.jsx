import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './css/ManagerDashboard.css';

// Import Sub-components
import AccountsOverview from './AccountsOverview';
import AccountsManagerClients from './AccountsManagerClients';
import AccountsManagerPayments from './AccountsManagerPayments';
import AccountsManagerExpenses from './AccountsManagerExpenses';
import AccountsManagerVendors from './AccountsManagerVendors';
import Invoice from '../admin/Invoice';
import Projects from '../admin/Projects';
import Reports from '../admin/Reports';

const AccountsManagerDashboard = ({ user }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <AccountsOverview user={user} />;
            case 'clients':
                return <AccountsManagerClients user={user} />;
            case 'invoices':
                return <Invoice user={user} />;
            case 'payments':
                return <AccountsManagerPayments user={user} />;
            case 'expenses':
                return <AccountsManagerExpenses user={user} />;
            case 'vendors':
                return <AccountsManagerVendors user={user} />;
            case 'projects':
                return <Projects user={user} />;
            case 'reports':
                return <Reports user={user} />;
            default:
                return <AccountsOverview user={user} />;
        }
    };

    return (
        <div className="role-dashboard accounts-manager-hub">
            {renderContent()}
        </div>
    );
};

export default AccountsManagerDashboard;
