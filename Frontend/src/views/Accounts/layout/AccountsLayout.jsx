import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Video, Plus } from 'lucide-react';
import AppLayout from '../../../layouts/AppLayout/AppLayout';

/**
 * AccountsLayout — department-specific adapter on top of the universal AppLayout shell.
 */
const AccountsLayout = ({ role, user, onRefresh, isLoading, onLogout, search, setSearch, onExport, children }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    // Department-specific contextual actions for the Navbar
    const renderActions = () => {
        const isManager = ['admin', 'super admin', 'superadmin', 'accounts manager'].includes(user?.role?.toLowerCase());

        return (
            <>
                {['expenses', 'company_expenses'].includes(activeTab) && (
                    <button
                        className="app-navbar-btn-action app-navbar-btn-primary"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-create-expense-modal'))}
                    >
                        <Plus size={15} />
                        <span>Add Expense</span>
                    </button>
                )}

                {activeTab === 'meetings' && isManager && (
                    <button
                        className="app-navbar-btn-action app-navbar-btn-primary"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-schedule-meeting-modal'))}
                    >
                        <Video size={15} />
                        <span>Schedule Meeting</span>
                    </button>
                )}
            </>
        );
    };

    // On the Invoices page only, the search bar is placed directly next to the status filter
    const navbarSearch = activeTab === 'invoices' ? null : search;
    const navbarSetSearch = activeTab === 'invoices' ? null : setSearch;

    return (
        <AppLayout
            department="accounts"
            role={role}
            user={user}
            search={navbarSearch}
            setSearch={navbarSetSearch}
            onRefresh={onRefresh}
            isLoading={isLoading}
            onLogout={onLogout}
            actions={renderActions()}
        >
            {children}
        </AppLayout>
    );
};

export default AccountsLayout;

