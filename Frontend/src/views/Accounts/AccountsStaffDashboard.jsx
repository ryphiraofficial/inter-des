import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './css/ManagerDashboard.css';

// Sub-components
import AccountsOverview from './AccountsOverview';
import AccountsManagerClients from './AccountsManagerClients';
import AccountsManagerPayments from './AccountsManagerPayments';
import AccountsManagerExpenses from './AccountsManagerExpenses';
import AccountsManagerVendors from './AccountsManagerVendors';
import Invoice from '../admin/Invoice';

const AccountsStaffDashboard = ({ user }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <AccountsOverview user={user} />;
            case 'invoices':
                return <Invoice user={user} />;
            case 'payments':
                return <AccountsManagerPayments user={user} />;
            case 'expenses':
                return <AccountsManagerExpenses user={user} />;
            case 'vendors':
                return <AccountsManagerVendors user={user} />;
            default:
                return <AccountsOverview user={user} />;
        }
    };

    return (
        <div className="role-dashboard accounts-staff-hub">
            {renderContent()}
        </div>
    );
};

export default AccountsStaffDashboard;
