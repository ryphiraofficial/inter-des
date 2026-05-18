import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import DesignLayout from '../../views/design/layout/DesignLayout';
import DesignManagerDashboard from '../../views/design/manager/DesignManagerDashboard';
import DesignStaffDashboard from '../../views/design/staff/DesignStaffDashboard';
import ProcurementManagerDashboard from '../../views/procurement/manager/ProcurementManagerDashboard';
import ProcurementStaffDashboard from '../../views/procurement/staff/ProcurementStaffDashboard';
import AdminDashboard from '../../views/admin/Dashboard';
import SalesDashboard from '../../views/sales/SalesDashboard';
import AccountsManagerDashboard from '../../views/Accounts/manager/ManagerDashboard';
import AccountsStaffDashboard from '../../views/Accounts/staff/StaffDashboard';

const RoleDashboard = ({ user, onLogout }) => {
    const dashboardType = useRoleDashboard(user?.role);

    switch (dashboardType) {
        case 'design_manager':
            return (
                <DesignLayout role="manager" user={user}>
                    <DesignManagerDashboard user={user} onLogout={onLogout} />
                </DesignLayout>
            );
        case 'design_staff':
            return (
                <DesignLayout role="staff" user={user}>
                    <DesignStaffDashboard user={user} onLogout={onLogout} />
                </DesignLayout>
            );
        case 'procurement_manager':
            return <ProcurementManagerDashboard user={user} onLogout={onLogout} />;
        case 'procurement_staff':
            return <ProcurementStaffDashboard user={user} onLogout={onLogout} />;
        case 'project_manager':
            return <Navigate to="/production-management/dashboard" replace />;
        case 'project_engineer':
            return <Navigate to="/engineer/dashboard" replace />;
        case 'site_engineer':
        case 'site_supervisor':
            return <Navigate to="/site/dashboard" replace />;
        case 'staff':
            return <SalesDashboard user={user} onLogout={onLogout} />;
        case 'sales':
            return <SalesDashboard user={user} />;
        case 'accounts_manager':
            return <AccountsManagerDashboard user={user} />;
        case 'accounts_staff':
            return <AccountsStaffDashboard user={user} />;
        case 'admin':
        default:
            return <AdminDashboard user={user} onLogout={onLogout} />;
    }
};

export default RoleDashboard;
