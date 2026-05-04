import React from 'react';
import { useSearchParams } from 'react-router-dom';
import '../css/ManagerDashboard.css';

// Sub-components
import Overview from '../common/Overview';
import ManagerClients from '../manager/ManagerClients';
import ManagerPayments from '../manager/ManagerPayments';
import ManagerExpenses from '../manager/ManagerExpenses';
import ManagerVendors from '../manager/ManagerVendors';
import Invoice from '../../admin/Invoice';

const StaffDashboard = ({ user }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview user={user} />;
            case 'invoices':
                return <Invoice user={user} />;
            case 'payments':
                return <ManagerPayments user={user} />;
            case 'expenses':
                return <ManagerExpenses user={user} />;
            case 'vendors':
                return <ManagerVendors user={user} />;
            default:
                return <Overview user={user} />;
        }
    };

    return (
        <div className="role-dashboard accounts-staff-hub">
            {renderContent()}
        </div>
    );
};

export default StaffDashboard;
