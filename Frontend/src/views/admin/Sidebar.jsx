import React from 'react';
import { useNavGroups } from './sidebar/hooks/useNavGroups';
import SidebarHeader from './sidebar/components/SidebarHeader';
import SidebarNav from './sidebar/components/SidebarNav';
import SidebarFooter from './sidebar/components/SidebarFooter';

import './css/Sidebar.css';

const Sidebar = ({ user, onLogout, isCollapsed, toggleSidebar }) => {
    const { navGroups, department } = useNavGroups(user);

    return (
        <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''} ${department?.toLowerCase()}`} data-lenis-prevent>
            <SidebarHeader 
                department={department} 
                toggleSidebar={toggleSidebar} 
            />

            <SidebarNav navGroups={navGroups} />

            <SidebarFooter 
                user={user} 
                onLogout={onLogout} 
            />
        </div>
    );
};

export default Sidebar;
