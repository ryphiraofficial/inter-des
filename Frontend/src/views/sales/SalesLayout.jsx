import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SalesSidebar from './SalesSidebar';
import SalesHeader  from './SalesHeader';
import './css/SalesLayout.css';

const PAGE_MAP = {
    '/staff/dashboard':   { title: 'Dashboard',   subtitle: "Welcome back! Here's your task overview." },
    '/staff/tasks':       { title: 'My Tasks',     subtitle: 'View and manage your assigned tasks.'     },
    '/staff/approvals':   { title: 'Client Approvals', subtitle: 'Review and approve project designs before client presentation.' },
    '/staff/site-visits': { title: 'Site Visits',  subtitle: 'Document and track your site visit logs.' },
    '/staff/clients':     { title: 'Clients',      subtitle: 'View your assigned client details.'       },
    '/staff/quotations':  { title: 'Quotations',   subtitle: 'View project quotations assigned to you.' },
};

const SalesLayout = ({ user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const { title, subtitle } = PAGE_MAP[location.pathname] || { title: 'Sales Portal', subtitle: '' };

    const toggleSidebar = () => setSidebarOpen(v => !v);

    return (
        <div className="sales-layout">
            <SalesSidebar
                user={user}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <div className="sales-main">
                <SalesHeader
                    title={title}
                    subtitle={subtitle}
                    toggleSidebar={toggleSidebar}
                />
                <div className="sales-page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SalesLayout;
