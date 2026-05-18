import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import DesignLayout from '../../views/design/layout/DesignLayout';
import DesignManagerDashboard from '../../views/design/manager/DesignManagerDashboard';
import DesignStaffDashboard from '../../views/design/staff/DesignStaffDashboard';
import ProcurementLayout from '../../views/procurement/layout/ProcurementLayout';
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
                <DesignLayout role="manager" user={user} onLogout={onLogout}>
                    <DesignManagerDashboard user={user} onLogout={onLogout} />
                </DesignLayout>
            );
        case 'design_staff':
            return (
                <DesignLayout role="staff" user={user} onLogout={onLogout}>
                    <DesignStaffDashboard user={user} onLogout={onLogout} />
                </DesignLayout>
            );
        case 'procurement_manager':
            return (
                <ProcurementLayout role="manager" user={user} onLogout={onLogout}>
                    <ProcurementManagerDashboard user={user} onLogout={onLogout} />
                </ProcurementLayout>
            );
        case 'procurement_staff':
            return (
                <ProcurementLayout role="staff" user={user} onLogout={onLogout}>
                    <ProcurementStaffDashboard user={user} onLogout={onLogout} />
                </ProcurementLayout>
            );
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
            return <AccountsManagerDashboard user={user} onLogout={onLogout} />;
        case 'accounts_staff':
            return <AccountsStaffDashboard user={user} onLogout={onLogout} />;
        case 'admin':
        default:
            return <AdminDashboard user={user} onLogout={onLogout} />;
    }
};

export default RoleDashboard;
