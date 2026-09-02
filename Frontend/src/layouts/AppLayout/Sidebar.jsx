import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, X, LogOut } from 'lucide-react';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { BASE_IMAGE_URL } from '../../config/constants';
import { resolveDepartment } from './departmentConfig';

/**
 * Universal Configuration-Driven Sidebar Component
 */
const Sidebar = ({
    department: explicitDepartment,
    menus: customMenus,
    subtitle: customSubtitle,
    isOpen,
    onClose,
    user,
    onLogout
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const currentPath = location.pathname;

    const [openSubmenus, setOpenSubmenus] = useState({});

    const deptConfig = resolveDepartment(explicitDepartment, user?.role);
    const { companyName } = useCompanySettings('WOODAURA');

    const brandSubtitle = customSubtitle || deptConfig?.subtitle || deptConfig?.name || 'MANAGEMENT';
    const navigationSections = customMenus || deptConfig?.menus || [];

    const handleItemClick = (item) => {
        if (item.subItems && item.subItems.length > 0) {
            setOpenSubmenus(prev => ({
                ...prev,
                [item.tab || item.label]: !prev[item.tab || item.label]
            }));
        }

        if (item.path) {
            navigate(item.path);
        } else if (item.tab) {
            navigate(`?tab=${item.tab}`);
        }

        if (onClose && window.innerWidth <= 768 && (!item.subItems || item.subItems.length === 0)) {
            onClose();
        }
    };

    const handleSubItemClick = (subItem) => {
        if (subItem.path) {
            navigate(subItem.path);
        } else if (subItem.tab) {
            navigate(`?tab=${subItem.tab}`);
        }

        if (onClose && window.innerWidth <= 768) {
            onClose();
        }
    };

    const isItemActive = (item) => {
        if (item.path) {
            if (item.path === '/') return currentPath === '/' && !searchParams.get('tab');
            return currentPath === item.path || currentPath.startsWith(item.path + '/');
        }
        if (item.tab) {
            if (activeTab === item.tab) return true;
            if (item.subItems && item.subItems.some(sub => sub.tab === activeTab || (sub.path && (currentPath === sub.path || currentPath.startsWith(sub.path + '/'))))) {
                return true;
            }
        }
        return false;
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const displayName = user?.fullName || user?.name || user?.username || 'User';
    const userRole = user?.role ? user.role.replace(/_/g, ' ') : deptConfig?.name || 'Staff';
    const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'WA';

    return (
        <aside className={`app-sidebar${isOpen ? ' app-sidebar--open' : ''}`}>
            {/* Header & Brand Identity */}
            <div className="app-sidebar-header">
                <div className="app-sidebar-brand">
                    <h1 className="app-sidebar-brand-title">{companyName}</h1>
                    <p className="app-sidebar-brand-subtitle">{brandSubtitle}</p>
                </div>
                <button
                    className="app-sidebar-close-btn"
                    onClick={onClose}
                    aria-label="Close sidebar"
                    title="Close Sidebar"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Scrollable Navigation Area */}
            <div className="app-sidebar-nav-container">
                {navigationSections.map((section, sIdx) => (
                    <div key={section.section || sIdx} className="app-sidebar-section">
                        {section.section && (
                            <div className="app-sidebar-section-title">{section.section}</div>
                        )}
                        <nav className="app-sidebar-nav">
                            {section.items.map((item) => {
                                const active = isItemActive(item);
                                const hasSubItems = item.subItems && item.subItems.length > 0;
                                const isSubmenuOpen = openSubmenus[item.tab || item.label] ?? active;
                                const Icon = item.icon;

                                return (
                                    <React.Fragment key={item.tab || item.path || item.label}>
                                        <button
                                            className={`app-sidebar-item${active ? ' active' : ''}`}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className="app-sidebar-item-left">
                                                {Icon && <Icon size={18} className="app-sidebar-item-icon" />}
                                                <span>{item.label}</span>
                                            </div>
                                            {hasSubItems && (
                                                <span className="app-sidebar-chevron">
                                                    {isSubmenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </span>
                                            )}
                                        </button>

                                        {/* Nested Sub-items */}
                                        {hasSubItems && isSubmenuOpen && (
                                            <div className="app-sidebar-subitem-group">
                                                {item.subItems.map((sub) => {
                                                    const isSubActive = sub.tab ? activeTab === sub.tab : (sub.path && (currentPath === sub.path || currentPath.startsWith(sub.path + '/')));
                                                    return (
                                                        <button
                                                            key={sub.tab || sub.path || sub.label}
                                                            className={`app-sidebar-subitem${isSubActive ? ' active' : ''}`}
                                                            onClick={() => handleSubItemClick(sub)}
                                                        >
                                                            <span className="app-sidebar-subitem-dot" />
                                                            <span>{sub.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            {/* Bottom Profile Footer */}
            <div className="app-sidebar-footer">
                <div className="app-sidebar-user-info">
                    <div className="app-sidebar-avatar">
                        {user?.avatar ? (
                            <img src={getImageUrl(user.avatar)} alt="Avatar" />
                        ) : (
                            userInitials
                        )}
                    </div>
                    <div className="app-sidebar-user-details">
                        <p className="app-sidebar-user-name" title={displayName}>{displayName}</p>
                        <p className="app-sidebar-user-role" title={userRole}>{userRole}</p>
                    </div>
                </div>
                {onLogout && (
                    <button
                        className="app-sidebar-logout-btn"
                        onClick={onLogout}
                        title="Sign Out"
                        aria-label="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
