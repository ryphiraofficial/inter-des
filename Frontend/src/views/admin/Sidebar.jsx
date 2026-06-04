import React from 'react';
import { useNavGroups } from './sidebar/hooks/useNavGroups';
import SidebarHeader from './sidebar/components/SidebarHeader';
import SidebarNav from './sidebar/components/SidebarNav';
import SidebarFooter from './sidebar/components/SidebarFooter';

import './css/Sidebar.css';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

const Sidebar = ({ onLogout, isCollapsed, toggleSidebar }) => {
    const user = useAppSelector(selectUser);
    const { navGroups, department } = useNavGroups();

    return (
        <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''} ${department?.toLowerCase()}`} data-lenis-prevent>
            <SidebarHeader 
                department={department} 
                toggleSidebar={toggleSidebar} 
            />

            <SidebarNav navGroups={navGroups} />

            <SidebarFooter 
                onLogout={onLogout} 
            />
        </div>
    );
};

export default Sidebar;
