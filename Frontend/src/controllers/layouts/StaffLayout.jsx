import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AccountsStaffSidebar from '../../views/Accounts/staff/AccountsStaffSidebar';
import DeptSidebar from '../../views/common/DeptSidebar';
import SalesHeader from '../../views/sales/SalesHeader';
import { getRoleDepartment } from '../hooks/useRoleDashboard';
import '../../views/sales/css/SalesLayout.css';

const StaffLayout = ({ user, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const department = getRoleDepartment(user?.role);

    const toggleSidebar = () => setIsSidebarOpen(v => !v);

    const getPageDetails = () => {
        const path = location.pathname;
        if (path === '/staff/dashboard')   return { title: 'Dashboard',   subtitle: "Welcome back! Here's your task overview." };
        if (path === '/staff/tasks')       return { title: 'My Tasks',     subtitle: 'View and manage your assigned tasks.'     };
        if (path === '/staff/site-visits') return { title: 'Site Visits',  subtitle: 'Document and track your site visit logs.' };
        if (path === '/staff/clients')     return { title: 'Clients',      subtitle: 'View your assigned client details.'       };
        if (path === '/staff/quotations')  return { title: 'Quotations',   subtitle: 'View project quotations assigned to you.' };
        return { title: 'Staff Portal', subtitle: '' };
    };

    const { title, subtitle } = getPageDetails();

    const renderSidebar = () => {
        const props = { user, onLogout, isCollapsed: !isSidebarOpen, toggleSidebar, isMobileOpen: isSidebarOpen, toggleMobileSidebar: toggleSidebar };
        if (department === 'Design' || department === 'Procurement' || department === 'Production') {
            return <DeptSidebar role={user?.role} {...props} />;
        }
        if (department === 'Accounts') {
            return <AccountsStaffSidebar {...props} />;
        }
        return <DeptSidebar role={user?.role} {...props} />;
    };

    return (
        <div className={`staff-layout ${isSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
            {isSidebarOpen && <div className="staff-mobile-sidebar-overlay" onClick={toggleSidebar} />}
            {renderSidebar()}

            <main className="staff-main-content">
                <div className="staff-header-container">
                    <SalesHeader title={title} subtitle={subtitle} toggleSidebar={toggleSidebar} />
                </div>
                <div className="content-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default StaffLayout;
