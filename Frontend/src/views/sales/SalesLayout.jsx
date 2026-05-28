import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DeptSidebar from './components/DeptSidebar';
import SalesHeader  from './SalesHeader';
import './css/SalesLayout.css';

const PAGE_MAP = {
    '/staff/dashboard':   { title: 'Dashboard',   subtitle: "Welcome back! Here's your task overview." },
    '/staff/tasks':       { title: 'My Tasks',     subtitle: 'View and manage your assigned tasks.'     },
    '/staff/approvals':   { title: 'Client Approvals', subtitle: 'Review and approve project designs before client presentation.' },
    '/staff/site-visits': { title: 'Site Visits',  subtitle: 'Document and track your site visit logs.' },
    '/staff/clients':     { title: 'Clients',      subtitle: 'View your assigned client details.'       },
    '/staff/quotations':  { title: 'Quotations',   subtitle: 'View project quotations assigned to you.' },
    '/staff/meetings':    { title: 'Meetings',     subtitle: 'View and join your scheduled team and client meetings.' },
};

const SalesLayout = ({ user, onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname, location.search]);

    const { title, subtitle } = PAGE_MAP[location.pathname] || { title: 'Sales Portal', subtitle: '' };

    const toggleSidebar = () => setIsCollapsed(v => !v);
    const toggleMobileSidebar = () => setIsMobileOpen(v => !v);

    const isQuotationView = location.pathname.includes('/quotations/view/');

    const mainContentStyle = isMobile
        ? { marginLeft: 0, width: '100%', maxWidth: '100vw' }
        : {};

    return (
        <div className={`layout-container ${isCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'mobile-sidebar-open' : ''} sales-layout`}>
            {isMobileOpen && <div className="mobile-sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
            <DeptSidebar
                role={user?.role}
                user={user}
                onLogout={onLogout}
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                isMobileOpen={isMobileOpen}
                toggleMobileSidebar={toggleMobileSidebar}
            />

            <main className="main-content sales-main" style={mainContentStyle}>
                {!isQuotationView && (
                    <SalesHeader
                        title={title}
                        subtitle={subtitle}
                        toggleSidebar={isMobile ? toggleMobileSidebar : toggleSidebar}
                        user={user}
                        onLogout={onLogout}
                    />
                )}
                <div className={`sales-page-content page-wrapper ${isQuotationView ? 'full-height' : ''}`}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SalesLayout;
