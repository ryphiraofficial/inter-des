import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

/**
 * Sales Layout — delegates to universal AppLayout
 */
const SalesLayout = ({ onLogout }) => {
    const user = useAppSelector(selectUser);

    return (
        <AppLayout department="sales" user={user} onLogout={onLogout}>
            <Outlet />
        </AppLayout>
    );
};

export default SalesLayout;
