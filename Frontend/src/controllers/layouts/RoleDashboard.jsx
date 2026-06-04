import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';
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

const RoleDashboard = ({ onLogout }) => {
    const user = useAppSelector(selectUser);
    const dashboardType = useRoleDashboard(user?.role);

    switch (dashboardType) {
        case 'design_manager':
            return (
                <DesignLayout role="manager" onLogout={onLogout}>
                    <DesignManagerDashboard onLogout={onLogout} />
                </DesignLayout>
            );
        case 'design_staff':
            return (
                <DesignLayout role="staff" onLogout={onLogout}>
                    <DesignStaffDashboard onLogout={onLogout} />
                </DesignLayout>
            );
        case 'procurement_manager':
            return (
                <ProcurementLayout role="manager" onLogout={onLogout}>
                    <ProcurementManagerDashboard onLogout={onLogout} />
                </ProcurementLayout>
            );
        case 'procurement_staff':
            return (
                <ProcurementLayout role="staff" onLogout={onLogout}>
                    <ProcurementStaffDashboard onLogout={onLogout} />
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
            return <SalesDashboard onLogout={onLogout} />;
        case 'sales':
            return <SalesDashboard />;
        case 'accounts_manager':
            return <AccountsManagerDashboard onLogout={onLogout} />;
        case 'accounts_staff':
            return <AccountsStaffDashboard onLogout={onLogout} />;
        case 'admin':
        default:
            return <AdminDashboard onLogout={onLogout} />;
    }
};

export default RoleDashboard;
