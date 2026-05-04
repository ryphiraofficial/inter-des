import React from 'react';
import { useSearchParams } from 'react-router-dom';
import '../css/ManagerDashboard.css';

// Import Sub-components
import Overview from '../common/Overview';
import ManagerClients from './ManagerClients';
import ManagerPayments from './ManagerPayments';
import ManagerExpenses from './ManagerExpenses';
import ManagerVendors from './ManagerVendors';
import Invoice from '../../admin/Invoice';
import Projects from '../../admin/Projects';
import Reports from '../../admin/Reports';

const ManagerDashboard = ({ user }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview user={user} />;
            case 'clients':
                return <ManagerClients user={user} />;
            case 'invoices':
                return <Invoice user={user} />;
            case 'payments':
                return <ManagerPayments user={user} />;
            case 'expenses':
                return <ManagerExpenses user={user} />;
            case 'vendors':
                return <ManagerVendors user={user} />;
            case 'projects':
                return <Projects user={user} />;
            case 'reports':
                return <Reports user={user} />;
            default:
                return <Overview user={user} />;
        }
    };

    return (
        <div className="role-dashboard accounts-manager-hub">
            {renderContent()}
        </div>
    );
};

export default ManagerDashboard;
