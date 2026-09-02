import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '../../../layouts/AppLayout/AppLayout';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

/**
 * ProcurementLayout — delegates to universal AppLayout
 */
const ProcurementLayout = ({ role, user: propUser, onRefresh, isLoading, onLogout, children }) => {
    const reduxUser = useAppSelector(selectUser);
    const user = propUser || reduxUser;

    return (
        <AppLayout
            department="procurement"
            role={role}
            user={user}
            onRefresh={onRefresh}
            isLoading={isLoading}
            onLogout={onLogout}
        >
            {children || <Outlet />}
        </AppLayout>
    );
};

export default ProcurementLayout;
