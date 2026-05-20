import React, { useState } from 'react';
import DesignNavbar from './DesignNavbar';
import DesignManagerSidebar from './DesignManagerSidebar';
import DesignStaffSidebar from './DesignStaffSidebar';
import '../css/DesignLayout.css';

const DesignLayout = ({ role, user, onRefresh, isLoading, onLogout, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const Sidebar = role === 'staff' ? DesignStaffSidebar : DesignManagerSidebar;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={`design-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {isSidebarOpen && <div className="design-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            <Sidebar user={user} onLogout={onLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="design-layout-main">
                <DesignNavbar user={user} onRefresh={onRefresh} isLoading={isLoading} toggleSidebar={toggleSidebar} />
                <main className="design-layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DesignLayout;
