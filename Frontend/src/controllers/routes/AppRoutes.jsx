import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Controllers — Layouts
import Layout from '../../views/admin/Layout';
import SalesLayout from '../../views/sales/SalesLayout';
import RoleDashboard from '../layouts/RoleDashboard';

// Views — Admin
import Quotations from '../../views/admin/Quotations';
import NewQuotation from '../../views/admin/NewQuotation';
import Inventory from '../../views/admin/Inventory';
import PurchaseOrders from '../../views/admin/PurchaseOrders';
import POInventory from '../../views/admin/POInventory';
import Clients from '../../views/admin/Clients';
import Staff from '../../views/admin/Staff';
import Tasks from '../../views/admin/Tasks';
import Reports from '../../views/admin/Reports';
import Settings from '../../views/admin/Settings';
import Users from '../../views/admin/Users';
import Invoice from '../../views/admin/Invoice';
import QuotationView from '../../views/admin/QuotationView';
import Projects from '../../views/admin/Projects';
import DesignApprovals from '../../views/admin/DesignApprovals';

// Views — Production Manager
import ProductionDashboard from '../../views/production/manager/Dashboard';
import ProductionProjectsList from '../../views/production/manager/ProjectsList';
import ProductionTasksBoard from '../../views/production/manager/TasksBoard';
import ProductionTeamOverview from '../../views/production/manager/TeamOverview';
import ProductionApprovals from '../../views/production/manager/Approvals';
import ProjectHandoff from '../../views/production/manager/ProjectHandoff';
import ProductionReports from '../../views/production/manager/ProductionReports';

// Views — Engineer
import EngineerDashboard from '../../views/production/engineer/EngineerDashboard';
import EngineerTasks from '../../views/production/engineer/EngineerTasks';
import EngineerProjects from '../../views/production/engineer/EngineerProjects';
import ProjectDetail from '../../views/production/engineer/ProjectDetail';
import TaskDetail from '../../views/production/engineer/TaskDetail';
import EngineerReports from '../../views/production/engineer/EngineerReports';
import LeaveRequest from '../../views/production/engineer/LeaveRequest';
import EngineerApprovals from '../../views/production/engineer/EngineerApprovals';

// Views — Site
import SiteDashboard from '../../views/production/site/SiteDashboard';
import SiteTasks from '../../views/production/site/SiteTasks';
import SiteReports from '../../views/production/site/SiteReports';
import SiteLeave from '../../views/production/site/SiteLeave';

// Views — Meetings
import AdminMeetings from '../../views/admin/Meetings';
import MeetingsPage from '../../views/common/MeetingsPage';

// Views — Staff
import SalesDashboard from '../../views/sales/SalesDashboard';
import SiteVisit from '../../views/sales/SiteVisit';
import SalesTasks from '../../views/sales/SalesTasks';
import SalesClients from '../../views/sales/SalesClients';
import SalesQuotations from '../../views/sales/SalesQuotations';
import SalesNewQuotation from '../../views/sales/SalesNewQuotation';
import SalesQuotationView from '../../views/sales/SalesQuotationView';
import SalesApprovals from '../../views/sales/SalesApprovals';

// Views — Design
import MaterialReviewHub from '../../views/design/manager/MaterialReviewHub';

// Views — Procurement
import ProcurementLayout from '../../views/procurement/layout/ProcurementLayout';
import ProcurementManagerDashboard from '../../views/procurement/manager/ProcurementManagerDashboard';
import ProcurementStaffDashboard from '../../views/procurement/staff/ProcurementStaffDashboard';

// Controllers — Hooks
import { isAdminLayout, isStaffLayout } from '../hooks/useRoleDashboard';

const AppRoutes = ({ user, onLogout }) => {
    const userRole = user?.role;
    const isProductionEngineer = ['Project Engineer', 'Site Engineer', 'Site Supervisor'].includes(userRole);
    const isProcurementRole = userRole === 'Procurement Manager' || userRole === 'Procurement Staff';
    const shouldUseAdminLayout = (isAdminLayout(userRole) || isProductionEngineer) && !isProcurementRole;
    const shouldUseSalesLayout = isStaffLayout(userRole) && !isProductionEngineer;

    const isGeneralAdmin = ['super admin', 'admin', 'manager', 'superadmin'].includes(userRole?.toLowerCase());
    const isDesignManager = userRole === 'Design Manager';

    return (
        <Routes>
            {/* Dedicated Procurement Layout Route */}
            {isProcurementRole && (
                <Route path="/" element={<ProcurementLayout role={userRole === 'Procurement Staff' ? 'staff' : 'manager'} user={user} onLogout={onLogout} />}>
                    <Route index element={userRole === 'Procurement Staff' ? <ProcurementStaffDashboard user={user} onLogout={onLogout} /> : <ProcurementManagerDashboard user={user} onLogout={onLogout} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            )}

            {/* Admin Layout - for Super Admin, Admin, Manager, and Department Managers */}
            {shouldUseAdminLayout && (
                <Route path="/" element={<Layout user={user} onLogout={onLogout} />}>
                    <Route index element={<RoleDashboard user={user} onLogout={onLogout} />} />
                    
                    {/* General Admin Only Routes */}
                    <Route path="projects" element={isGeneralAdmin ? <Projects /> : <Navigate to="/" replace />} />
                    <Route path="projects/:id" element={isGeneralAdmin ? <Projects /> : <Navigate to="/" replace />} />
                    <Route path="inventory" element={isGeneralAdmin ? <Inventory /> : <Navigate to="/" replace />} />
                    <Route path="purchase-orders" element={isGeneralAdmin ? <PurchaseOrders /> : <Navigate to="/" replace />} />
                    <Route path="po-inventory" element={isGeneralAdmin ? <POInventory /> : <Navigate to="/" replace />} />
                    <Route path="clients" element={isGeneralAdmin ? <Clients /> : <Navigate to="/" replace />} />
                    <Route path="staff" element={isGeneralAdmin ? <Staff /> : <Navigate to="/" replace />} />
                    <Route path="tasks" element={isGeneralAdmin ? <Tasks /> : <Navigate to="/" replace />} />
                    <Route path="reports" element={isGeneralAdmin ? <Reports /> : <Navigate to="/" replace />} />
                    <Route path="settings" element={isGeneralAdmin ? <Settings /> : <Navigate to="/" replace />} />
                    <Route path="users" element={isGeneralAdmin ? <Users /> : <Navigate to="/" replace />} />
                    <Route path="invoice" element={isGeneralAdmin ? <Invoice /> : <Navigate to="/" replace />} />
                    <Route path="approvals" element={isGeneralAdmin ? <DesignApprovals /> : <Navigate to="/" replace />} />

                    {/* Quotations & Material Review: General Admin & Design Manager Only */}
                    <Route path="quotations" element={(isGeneralAdmin || isDesignManager) ? <Quotations user={user} /> : <Navigate to="/" replace />} />
                    <Route path="quotations/new" element={(isGeneralAdmin || isDesignManager) ? <NewQuotation /> : <Navigate to="/" replace />} />
                    <Route path="quotations/edit/:id" element={(isGeneralAdmin || isDesignManager) ? <NewQuotation isEdit={true} /> : <Navigate to="/" replace />} />
                    <Route path="quotations/view/:id" element={(isGeneralAdmin || isDesignManager) ? <QuotationView /> : <Navigate to="/" replace />} />
                    <Route path="material-review" element={(isGeneralAdmin || isDesignManager) ? <MaterialReviewHub user={user} /> : <Navigate to="/" replace />} />

                    {/* Production Management Routes (Project Manager) */}
                    <Route path="production-management/dashboard" element={(isGeneralAdmin || userRole === 'Project Manager') ? <ProductionDashboard /> : <Navigate to="/" replace />} />
                    <Route path="production-management/handoff" element={(isGeneralAdmin || userRole === 'Project Manager') ? <ProjectHandoff /> : <Navigate to="/" replace />} />
                    <Route path="production-management/projects" element={(isGeneralAdmin || userRole === 'Project Manager') ? <ProductionProjectsList /> : <Navigate to="/" replace />} />
                    <Route path="production-management/tasks" element={(isGeneralAdmin || userRole === 'Project Manager') ? <ProductionTasksBoard user={user} /> : <Navigate to="/" replace />} />
                    <Route path="production-management/team" element={(isGeneralAdmin || userRole === 'Project Manager') ? <ProductionTeamOverview /> : <Navigate to="/" replace />} />
                    <Route path="production-management/approvals" element={(isGeneralAdmin || userRole === 'Project Manager') ? <ProductionApprovals /> : <Navigate to="/" replace />} />
                    <Route path="production-management/reports" element={(isGeneralAdmin || userRole === 'Project Manager') ? <ProductionReports /> : <Navigate to="/" replace />} />

                    {/* Engineer Routes (Project Engineer only) */}
                    <Route path="engineer/dashboard" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <EngineerDashboard user={user} /> : <Navigate to="/" replace />} />
                    <Route path="engineer/projects" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <EngineerProjects user={user} /> : <Navigate to="/" replace />} />
                    <Route path="engineer/projects/:id" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <ProjectDetail user={user} /> : <Navigate to="/" replace />} />
                    <Route path="engineer/tasks" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <EngineerTasks user={user} /> : <Navigate to="/" replace />} />
                    <Route path="engineer/transferred-tasks" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <EngineerTasks user={user} isTransferred={true} /> : <Navigate to="/" replace />} />
                    <Route path="engineer/tasks/:id" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <TaskDetail user={user} /> : <Navigate to="/" replace />} />
                    <Route path="engineer/reports" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <EngineerReports /> : <Navigate to="/" replace />} />
                    <Route path="engineer/leave" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <LeaveRequest user={user} /> : <Navigate to="/" replace />} />
                    <Route path="engineer/approvals" element={(isGeneralAdmin || userRole === 'Project Engineer') ? <EngineerApprovals /> : <Navigate to="/" replace />} />

                    {/* Site Portal Routes (Site Engineer & Site Supervisor) */}
                    <Route path="site/dashboard" element={(isGeneralAdmin || ['Site Engineer', 'Site Supervisor'].includes(userRole)) ? <SiteDashboard user={user} /> : <Navigate to="/" replace />} />
                    <Route path="site/projects" element={(isGeneralAdmin || ['Site Engineer', 'Site Supervisor'].includes(userRole)) ? <EngineerProjects user={user} /> : <Navigate to="/" replace />} />
                    <Route path="site/projects/:id" element={(isGeneralAdmin || ['Site Engineer', 'Site Supervisor'].includes(userRole)) ? <ProjectDetail user={user} /> : <Navigate to="/" replace />} />
                    <Route path="site/tasks" element={(isGeneralAdmin || ['Site Engineer', 'Site Supervisor'].includes(userRole)) ? <SiteTasks user={user} /> : <Navigate to="/" replace />} />
                    <Route path="site/transferred-tasks" element={(isGeneralAdmin || userRole === 'Site Engineer') ? <SiteTasks user={user} isTransferred={true} /> : <Navigate to="/" replace />} />
                    <Route path="site/tasks/:id" element={(isGeneralAdmin || ['Site Engineer', 'Site Supervisor'].includes(userRole)) ? <TaskDetail user={user} /> : <Navigate to="/" replace />} />
                    <Route path="site/reports" element={(isGeneralAdmin || ['Site Engineer', 'Site Supervisor'].includes(userRole)) ? <SiteReports user={user} /> : <Navigate to="/" replace />} />
                    <Route path="site/leave" element={(isGeneralAdmin || ['Site Engineer', 'Site Supervisor'].includes(userRole)) ? <SiteLeave user={user} /> : <Navigate to="/" replace />} />

                    {/* Meetings — Admin manages, all production staff can view */}
                    <Route path="meetings" element={isGeneralAdmin ? <AdminMeetings user={user} /> : <MeetingsPage user={user} />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            )}

            {/* Staff Layout - for Department Staff */}
            {shouldUseSalesLayout && (
                <Route path="/staff" element={<SalesLayout user={user} onLogout={onLogout} />}>
                    <Route index element={<Navigate to="/staff/dashboard" replace />} />
                    <Route path="dashboard" element={<RoleDashboard user={user} onLogout={onLogout} />} />
                    <Route path="tasks" element={<SalesTasks user={user} />} />
                    <Route path="approvals" element={<SalesApprovals user={user} />} />
                    <Route path="all-tasks" element={<SalesTasks user={user} forceTable={true} />} />
                    <Route path="site-visits" element={<SiteVisit user={user} />} />
                    <Route path="clients" element={<SalesClients user={user} />} />
                    <Route path="opportunities" element={<SalesClients user={user} isOpportunities={true} />} />
                    <Route path="quotations" element={<SalesQuotations user={user} />} />
                    <Route path="quotations/new" element={<SalesNewQuotation isStaff={true} user={user} />} />
                    <Route path="quotations/edit/:id" element={<SalesNewQuotation isStaff={true} isEdit={true} user={user} />} />
                    <Route path="quotations/view/:id" element={<SalesQuotationView isStaff={true} />} />
                    <Route path="projects/:id" element={<Projects />} />
                    <Route path="material-review" element={<MaterialReviewHub user={user} />} />
                    <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
                </Route>
            )}

            {/* Fallback routing */}
            <Route path="*" element={
                isProductionEngineer ? (
                    <Navigate to="/engineer/dashboard" replace />
                ) : shouldUseAdminLayout ? (
                    <Navigate to="/" replace />
                ) : shouldUseSalesLayout ? (
                    <Navigate to="/staff/dashboard" replace />
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>No Dashboard Assigned</h2>
                        <p>User Role: {userRole || 'None'}</p>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                )
            } />
        </Routes>
    );
};

export default AppRoutes;
