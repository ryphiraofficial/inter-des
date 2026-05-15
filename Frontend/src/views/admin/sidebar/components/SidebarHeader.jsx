import React from 'react';
import { Menu } from 'lucide-react';

const SidebarHeader = ({ department, toggleSidebar }) => {
    return (
        <div className="sidebar-header">
            <div className="brand-wrapper">
                <h1 className="brand-title">Interior Design</h1>
                <p className="brand-subtitle">
                    {department} Dashboard
                </p>
            </div>
            <button className="btn-toggle-sidebar" onClick={toggleSidebar} title="Toggle Sidebar">
                <Menu size={20} />
            </button>
        </div>
    );
};

export default SidebarHeader;
