import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const NavGroup = ({ item, isActive, toggleSidebar }) => {
    const [isExpanded, setIsExpanded] = useState(isActive);
    const location = useLocation();

    const hasActiveSub = item.subItems?.some(sub => {
        if (sub.path.includes('?tab=')) {
            const currentTab = new URLSearchParams(location.search).get('tab');
            const itemTab = new URLSearchParams(sub.path.split('?')[1]).get('tab');
            return currentTab === itemTab;
        }
        return location.pathname === sub.path;
    });

    const activeState = isActive || hasActiveSub;

    const getLinkClass = ({ isActive: linkActive }, path) => {
        let finalActive = linkActive;
        if (path.includes('?tab=')) {
            const currentTab = new URLSearchParams(location.search).get('tab');
            const itemTab = new URLSearchParams(path.split('?')[1]).get('tab');
            finalActive = currentTab === itemTab;
        }
        return `acct-nav-item ${finalActive ? 'active' : ''}`;
    };

    if (!item.subItems) {
        return (
            <NavLink to={item.path} className={(p) => getLinkClass(p, item.path)} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                <div className="acct-nav-item-left">
                    <item.icon size={18} className="acct-nav-icon" />
                    <span>{item.name}</span>
                </div>
                {item.badge && <span className={`acct-badge acct-badge-${item.badgeColor || 'default'}`}>{item.badge}</span>}
            </NavLink>
        );
    }

    return (
        <div className="acct-nav-group-wrapper">
            <button className={`acct-nav-item ${activeState ? 'active' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
                <div className="acct-nav-item-left"><item.icon size={18} className="acct-nav-icon" /><span>{item.name}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.badge && !isExpanded && <span className={`acct-badge acct-badge-${item.badgeColor || 'default'}`}>{item.badge}</span>}
                    <ChevronRight size={16} className="acct-chevron" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }} />
                </div>
            </button>
            <ul className="acct-subnav-list" style={{ maxHeight: isExpanded ? `${item.subItems.length * 40}px` : '0px' }}>
                {item.subItems.map(sub => (
                    <li key={sub.name}>
                        <NavLink to={sub.path} className={(p) => getLinkClass(p, sub.path).replace('acct-nav-item', 'acct-subnav-item')} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                            <span>{sub.name}</span>
                            {sub.badge && <span className={`acct-badge acct-badge-${sub.badgeColor || 'default'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>{sub.badge}</span>}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NavGroup;
