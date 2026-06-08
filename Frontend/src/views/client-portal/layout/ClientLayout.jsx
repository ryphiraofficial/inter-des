import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout, selectToken } from '../../../store/slices/authSlice';
import { setSelectedProject, selectSelectedProjectId } from '../../../store/slices/clientPortalSlice';
import { useGetPublicSettingsQuery } from '../../../store/api/authApi';
import { BASE_IMAGE_URL } from '../../../config/constants';
import { LogOut, Menu, LayoutDashboard, FileText, FileSignature, Settings, X, Receipt, CreditCard, Users, MessageSquare, ChevronDown } from 'lucide-react';
import './ClientLayout.css';

const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`) : null;

const ClientLayout = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const selectedProjectId = useAppSelector(selectSelectedProjectId);
    
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [projects, setProjects] = useState([]);

    const { data: settingsData } = useGetPublicSettingsQuery();
    const companyLogo = settingsData?.data?.company?.companyLogo;
    const companyName = settingsData?.data?.company?.companyName || 'WOODAURA';

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/client/projects-list', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success && response.data.data.length > 0) {
                    setProjects(response.data.data);
                    if (!selectedProjectId) {
                        // Default to the first active one, or the first one in the list
                        const defaultProject = response.data.data.find(p => ['Not Started', 'In Progress', 'On Hold'].includes(p.status)) || response.data.data[0];
                        dispatch(setSelectedProject(defaultProject._id));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch projects list", error);
            }
        };

        if (token) {
            fetchProjects();
        }
    }, [token, dispatch, selectedProjectId]);

    const handleProjectChange = (e) => {
        dispatch(setSelectedProject(e.target.value));
    };

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = '/client/login';
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const renderBrand = () => (
        <div className="client-brand">
            {companyLogo && !imageError ? (
                <img 
                    src={getImageUrl(companyLogo)} 
                    alt="Logo" 
                    className="client-brand-logo-img"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="client-brand-logo">
                    {companyName.charAt(0).toUpperCase()}
                </div>
            )}
            <span className="client-brand-name">{companyName}</span>
        </div>
    );

    return (
        <div className="client-layout">
            {/* Sidebar Overlay for Mobile */}
            <div 
                className={`client-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`client-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="client-sidebar-header">
                    {renderBrand()}
                    <button className="client-close-sidebar" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="client-sidebar-nav">
                    <NavLink to="/client/dashboard" className={({isActive}) => `client-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/client/quotations" className={({isActive}) => `client-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <FileSignature size={18} />
                        <span>Quotations</span>
                    </NavLink>
                    <NavLink to="/client/invoices" className={({isActive}) => `client-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <Receipt size={18} />
                        <span>Invoices</span>
                    </NavLink>
                    <NavLink to="/client/payments" className={({isActive}) => `client-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <CreditCard size={18} />
                        <span>Payments</span>
                    </NavLink>
                    <NavLink to="/client/documents" className={({isActive}) => `client-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <FileText size={18} />
                        <span>Documents</span>
                    </NavLink>
                    <NavLink to="/client/working-members" className={({isActive}) => `client-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <Users size={18} />
                        <span>Working Members</span>
                    </NavLink>
                    <NavLink to="/client/group-updates" className={({isActive}) => `client-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <MessageSquare size={18} />
                        <span>Group Updates</span>
                    </NavLink>
                    <NavLink to="/client/settings" className={({isActive}) => `client-nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <Settings size={18} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="client-sidebar-footer">
                    <button onClick={handleLogout} className="client-logout-btn">
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="client-main-wrapper">
                <header className="client-topbar">
                    <div className="client-topbar-left">
                        <button className="client-hamburger" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <div className="client-brand mobile-only">
                            <span className="client-brand-name">{companyName}</span>
                        </div>
                    </div>
                    
                    <div className="client-topbar-right">
                        {projects.length > 0 && (
                            <div className="client-project-selector-wrapper">
                                <select 
                                    className="client-project-selector" 
                                    value={selectedProjectId || ''} 
                                    onChange={handleProjectChange}
                                >
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} {p.status === 'Completed' ? '(Completed)' : ''}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="client-project-selector-icon" size={16} />
                            </div>
                        )}
                    </div>
                </header>

                <main className="client-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ClientLayout;
