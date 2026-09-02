import React, { useState } from 'react';
import AccountsNavbar from './AccountsNavbar';
import AccountsManagerSidebar from './AccountsManagerSidebar';
import AccountsStaffSidebar from './AccountsStaffSidebar';
import '../css/AccountsLayout.css';

/**
 * AccountsLayout — shared wrapper for all Accounts module roles.
 */
const AccountsLayout = ({ role, user, onRefresh, isLoading, onLogout, search, setSearch, onExport, children }) => {
    const Sidebar = role === 'staff' ? AccountsStaffSidebar : AccountsManagerSidebar;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openSidebar  = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="accounts-layout">
            {/* Mobile overlay backdrop */}
            {sidebarOpen && (
                <div className="accounts-sidebar-overlay" onClick={closeSidebar} />
            )}

            <Sidebar
                user={user}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            <div className="accounts-layout-main">
                <AccountsNavbar
                    user={user}
                    onRefresh={onRefresh}
                    isLoading={isLoading}
                    search={search}
                    setSearch={setSearch}
                    onExport={onExport}
                    onMenuToggle={openSidebar}
                    onLogout={onLogout}
                />
                <main className="accounts-layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AccountsLayout;
