import React from 'react';
import DesignNavbar from './DesignNavbar';
import DesignManagerSidebar from './DesignManagerSidebar';
import DesignStaffSidebar from './DesignStaffSidebar';
import '../css/DesignLayout.css';

/**
 * DesignLayout — shared wrapper for all Design module roles.
 * Renders the sidebar + navbar shell; page content goes in children.
 *
 * Props:
 *  - role: 'manager' | 'staff'
 *  - user: user object
 *  - onRefresh: optional callback for refresh button
 *  - isLoading: boolean for refresh spinner
 *  - children: page content
 */
const DesignLayout = ({ role, user, onRefresh, isLoading, children }) => {
    const Sidebar = role === 'staff' ? DesignStaffSidebar : DesignManagerSidebar;

    return (
        <div className="design-layout">
            <Sidebar />
            <div className="design-layout-main">
                <DesignNavbar user={user} onRefresh={onRefresh} isLoading={isLoading} />
                <main className="design-layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DesignLayout;
