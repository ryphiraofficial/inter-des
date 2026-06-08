import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useDeptSidebar } from '../hooks/useDeptSidebar';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import './css/Sidebar.css';

const DeptSidebar = ({ role, user, onLogout, isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar }) => {
    
    const { config, userInitials, avatarUrl, isActiveTab } = useDeptSidebar(role, user);

    if (!config) return null;

    const { brandTitle, brandSubtitle, sidebarClass, items } = config;
    const defaultSubtitle = brandSubtitle || `${brandTitle} Dashboard`;
    const { companyName, motto } = useCompanySettings('Interior Design', defaultSubtitle);

    const [expandedParents, setExpandedParents] = React.useState({});
    
    let currentParent = null;

    return (
        <div className={`sidebar-container ${sidebarClass} ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header" style={role === 'Design Manager' ? { borderBottom: '1px solid rgba(0,0,0,0.05)' } : {}}>
                <div className="brand-wrapper">
                    {role === 'Design Manager' ? (
                        <>
                            <h1 className="brand-title" style={{ fontWeight: 300, letterSpacing: '3px', fontSize: '24px', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {companyName}
                            </h1>
                            <p className="brand-subtitle" style={{ fontSize: '0.6rem', color: '#c4a484', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {motto || defaultSubtitle}
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="brand-title" style={{ fontSize: '24px', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{companyName}</h1>
                            <p className="brand-subtitle" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{motto || defaultSubtitle}</p>
                        </>
                    )}
                </div>
                <button className="btn-toggle-sidebar" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <button className="btn-close-sidebar-mobile" onClick={toggleMobileSidebar || toggleSidebar} title="Close Sidebar">
                    <X size={20} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {items.map((item, index) => {
                        const nextItem = items[index + 1];
                        const hasSub = !item.isSub && nextItem && nextItem.isSub;
                        
                        if (!item.isSub) {
                            currentParent = item.name;
                        }

                        const isExpanded = expandedParents[currentParent] !== false; // default true

                        if (item.isSub && !isExpanded) {
                            return null;
                        }

                        return (
                            <li key={item.name} className={`nav-item ${item.isSub ? 'sub-item' : ''}`}>
                                <NavLink
                                    to={item.path}
                                    className={() => `nav-link ${isActiveTab(item) ? 'active' : ''}`}
                                    onClick={() => {
                                        if (window.innerWidth <= 768 && toggleMobileSidebar && !hasSub) {
                                            toggleMobileSidebar();
                                        }
                                        if (hasSub && expandedParents[item.name] === false) {
                                            setExpandedParents(prev => ({ ...prev, [item.name]: true }));
                                        }
                                    }}
                                >
                                    <item.icon size={item.isSub ? 16 : 18} className="nav-icon" />
                                    <span>{item.name}</span>
                                    {hasSub && (
                                        <span 
                                            className="sub-chevron"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setExpandedParents(prev => ({ ...prev, [item.name]: !isExpanded }));
                                            }}
                                            title={isExpanded ? "Collapse" : "Expand"}
                                        >
                                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </span>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="footer-user-info">
                    <div className="footer-avatar">
                        {avatarUrl ? <img src={avatarUrl} alt="Avatar" /> : userInitials}
                    </div>
                    <div className="footer-details">
                        <p className="footer-name">{user?.fullName}</p>
                        <p className="footer-role">{user?.role}</p>
                    </div>
                </div>
                <button className="btn-logout-icon" onClick={onLogout} title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

export default DeptSidebar;
