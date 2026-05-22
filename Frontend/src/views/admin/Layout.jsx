import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DeptSidebar from './components/DeptSidebar';
import Header from './Header';
import { getRoleDepartment } from './hooks/useRoleDashboard';
import './css/Layout.css';

const Layout = ({ user, onLogout }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    const location = useLocation();
    const department = getRoleDepartment(user?.role);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    React.useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname, location.search]);

    const renderSidebar = () => {
        const props = { user, onLogout, isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar };
        if (department === 'Design' || department === 'Procurement' || department === 'Production' || department === 'Accounts') {
            return <DeptSidebar role={user?.role} {...props} />;
        }
        return <Sidebar {...props} />;
    };


    if (department === 'Design' || department === 'Accounts' || department === 'Procurement') {
        return <Outlet />;
    }

    const mainContentStyle = isMobile
        ? { marginLeft: 0, width: '100%', maxWidth: '100vw' }
        : {};

    return (
        <div className={`layout-container ${isCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'mobile-sidebar-open' : ''} ${department?.toLowerCase()}-layout`}>
            {isMobileOpen && <div className="mobile-sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
            {renderSidebar()}
            <main className="main-content" style={mainContentStyle}>
                <Header user={user} toggleMobileSidebar={toggleMobileSidebar} />
                <div className="page-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
