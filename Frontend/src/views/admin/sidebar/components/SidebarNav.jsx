import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SidebarNav = ({ navGroups }) => {
    const location = useLocation();
    const [collapsedGroups, setCollapsedGroups] = useState({});

    // Keep groups open if they contain the active item
    useEffect(() => {
        const currentTab = new URLSearchParams(location.search).get('tab');
        const activePath = location.pathname + (currentTab ? `?tab=${currentTab}` : '');
        
        navGroups.forEach(group => {
            const hasActive = group.items.some(item => {
                if (item.path.includes('?tab=')) {
                    const itemTab = new URLSearchParams(item.path.split('?')[1]).get('tab');
                    return currentTab === itemTab || (!currentTab && (itemTab === 'overview' || itemTab === 'dashboard' || itemTab === 'pipeline'));
                }
                return item.path === activePath;
            });
            
            if (hasActive) {
                setCollapsedGroups(prev => ({ ...prev, [group.title]: false }));
            } else if (collapsedGroups[group.title] === undefined && group.title !== 'Main') {
                 setCollapsedGroups(prev => ({ ...prev, [group.title]: false }));
            }
        });
    }, [navGroups, location]);

    const toggleGroup = (title) => {
        if (title === 'Main') return;
        setCollapsedGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <nav className="sidebar-nav">
            {navGroups.map((group) => {
                const isCollapsed = collapsedGroups[group.title];
                return (
                    <div key={group.title} className="nav-group">
                        {group.title !== 'Main' && (
                            <div 
                                className="nav-group-header" 
                                onClick={() => toggleGroup(group.title)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', paddingRight: '8px' }}
                            >
                                <h3 className="nav-group-title">{group.title}</h3>
                                {isCollapsed ? <ChevronRight size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
                            </div>
                        )}
                        {!isCollapsed && (
                            <ul className="nav-list" style={{ marginTop: group.title !== 'Main' ? '4px' : '0' }}>
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
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default SidebarNav;
