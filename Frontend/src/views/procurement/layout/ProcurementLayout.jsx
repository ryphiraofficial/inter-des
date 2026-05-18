import React from 'react';
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
    const Sidebar = role === 'staff' ? ProcurementStaffSidebar : ProcurementManagerSidebar;

    return (
        <div className="procurement-layout">
            <Sidebar user={user} onLogout={onLogout} />
            <div className="procurement-layout-main">
                <ProcurementNavbar user={user} onRefresh={onRefresh} isLoading={isLoading} />
                <main className="procurement-layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ProcurementLayout;
