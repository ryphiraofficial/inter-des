import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import DateFilterDropdown from '../../layouts/AppLayout/DateFilterDropdown';
import { DateFilterProvider } from '../../context/DateFilterContext';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

/**
 * Admin / Global Executive Layout — delegates to universal AppLayout
 */
const Layout = ({ onLogout }) => {
    const user = useAppSelector(selectUser);
    const location = useLocation();

    // Conditionally render the date dropdown filter in the navbar for overview/analytical dashboards
    const showDateFilter = location.pathname === '/' || location.pathname === '' || location.pathname === '/financial-analytics' || location.pathname === '/reports';

    const renderActions = () => {
        if (showDateFilter) {
            return <DateFilterDropdown />;
        }
        return null;
    };

    return (
        <DateFilterProvider>
            <AppLayout
                department="admin"
                user={user}
                onLogout={onLogout}
                actions={renderActions()}
            >
                <Outlet />
            </AppLayout>
        </DateFilterProvider>
    );
};

export default Layout;
