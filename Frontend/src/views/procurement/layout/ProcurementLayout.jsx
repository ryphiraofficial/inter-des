import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProcurementNavbar from './ProcurementNavbar';
import ProcurementManagerSidebar from './ProcurementManagerSidebar';
import ProcurementStaffSidebar from './ProcurementStaffSidebar';
import '../css/ProcurementLayout.css';

/**
 * ProcurementLayout — shared wrapper for all Procurement module roles.
 * Renders the sidebar + navbar shell; page content goes in children.
 *
 * Props:
 *  - role: 'manager' | 'staff'
 *  - user: user object
 *  - onRefresh: optional callback for refresh button
 *  - isLoading: boolean for refresh spinner
 *  - children: page content
 */
const ProcurementLayout = ({ role, user, onRefresh, isLoading, onLogout, children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const Sidebar = role === 'staff' ? ProcurementStaffSidebar : ProcurementManagerSidebar;

    return (
        <div className="procurement-layout">
            <Sidebar 
                user={user} 
                onLogout={onLogout} 
                isMobileOpen={isMobileMenuOpen} 
                onCloseMobile={() => setIsMobileMenuOpen(false)} 
            />
            <div className="procurement-layout-main">
                <ProcurementNavbar 
                    role={role} 
                    user={user} 
                    onRefresh={onRefresh} 
                    isLoading={isLoading} 
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    onLogout={onLogout}
                />
                <main className="procurement-layout-content">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default ProcurementLayout;
