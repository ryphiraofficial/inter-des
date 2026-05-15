import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SidebarNav = ({ navGroups }) => {
    const location = useLocation();

    return (
        <nav className="sidebar-nav">
            {navGroups.map((group) => (
                <div key={group.title} className="nav-group">
                    {group.title !== 'Main' && <h3 className="nav-group-title">{group.title}</h3>}
                    <ul className="nav-list">
                        {group.items.map((item) => (
                            <li key={item.name} className="nav-item">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => {
                                        if (item.path.includes('?tab=')) {
                                            const currentTab = new URLSearchParams(location.search).get('tab');
                                            const itemTab = new URLSearchParams(item.path.split('?')[1]).get('tab');
                                            const isTabActive = currentTab === itemTab || 
                                                (!currentTab && (itemTab === 'overview' || itemTab === 'dashboard' || itemTab === 'pipeline'));
                                            return `nav-link ${isTabActive ? 'active' : ''}`;
                                        }
                                        return `nav-link ${isActive ? 'active' : ''}`;
                                    }}
                                >
                                    <item.icon size={18} className="nav-icon" />
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );
};

export default SidebarNav;
