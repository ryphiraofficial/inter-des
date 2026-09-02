import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';
import './layout.css';

/**
 * Universal AppLayout Shell
 * Master wrapper component across all departments.
 */
const AppLayout = ({
    department,
    menus,
    subtitle,
    role,
    user: propUser,
    title,
    description,
    search,
    setSearch,
    searchPlaceholder,
    onRefresh,
    isLoading,
    onLogout,
    actions,
    children
}) => {
    const reduxUser = useAppSelector(selectUser);
    const user = propUser || reduxUser;
    const location = useLocation();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Automatically close mobile sidebar on navigation change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname, location.search]);

    return (
        <div className="app-layout-root">
            {/* Mobile Backdrop Overlay */}
            <div
                className={`app-layout-backdrop${isSidebarOpen ? ' active' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            {/* Universal Configuration-Driven Sidebar */}
            <Sidebar
                department={department}
                menus={menus}
                subtitle={subtitle}
                role={role}
                user={user}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                onLogout={onLogout}
            />

            {/* Main Content Area */}
            <div className="app-layout-main">
                <Navbar
                    department={department}
                    title={title}
                    description={description}
                    search={search}
                    setSearch={setSearch}
                    searchPlaceholder={searchPlaceholder}
                    onRefresh={onRefresh}
                    isLoading={isLoading}
                    actions={actions}
                    onMenuToggle={openSidebar}
                    onLogout={onLogout}
                    user={user}
                />

                <main className="app-layout-content">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
