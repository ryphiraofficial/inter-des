import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useDeptSidebar } from '../hooks/useDeptSidebar';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import './css/Sidebar.css';

const DeptSidebar = ({ role, user, onLogout, isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar }) => {
    
    const { config, userInitials, avatarUrl, isActiveTab } = useDeptSidebar(role, user);

    if (!config) return null;

    const { brandTitle, brandSubtitle, sidebarClass, items } = config;
    const defaultSubtitle = brandSubtitle || `${brandTitle} Dashboard`;
    const { companyName, motto } = useCompanySettings('Interior Design', defaultSubtitle);

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
                    {items.map((item) => (
                        <li key={item.name} className="nav-item">
                            <NavLink
                                to={item.path}
                                className={() => `nav-link ${isActiveTab(item) ? 'active' : ''}`}
                                onClick={() => {
                                    if (window.innerWidth <= 768 && toggleMobileSidebar) {
                                        toggleMobileSidebar();
                                    }
                                }}
                            >
                                <item.icon size={18} className="nav-icon" />
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
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
