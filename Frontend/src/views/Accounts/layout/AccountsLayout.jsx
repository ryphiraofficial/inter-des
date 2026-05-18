import React from 'react';
import AccountsNavbar from './AccountsNavbar';
import AccountsManagerSidebar from './AccountsManagerSidebar';
import AccountsStaffSidebar from './AccountsStaffSidebar';
import '../css/AccountsLayout.css';

/**
 * AccountsLayout — shared wrapper for all Accounts module roles.
 * Renders the sidebar + navbar shell; page content goes in children.
 *
 * Props:
 *  - role: 'manager' | 'staff'
 *  - user: user object
 *  - onRefresh: optional callback for refresh button
 *  - isLoading: boolean for refresh spinner
 *  - children: page content
 */
const AccountsLayout = ({ role, user, onRefresh, isLoading, children }) => {
    const Sidebar = role === 'staff' ? AccountsStaffSidebar : AccountsManagerSidebar;

    return (
        <div className="accounts-layout">
            <Sidebar />
            <div className="accounts-layout-main">
                <AccountsNavbar user={user} onRefresh={onRefresh} isLoading={isLoading} />
                <main className="accounts-layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AccountsLayout;
