import React from 'react';
import AccountsDashboardV2 from '../Accounts/common/AccountsDashboardV2';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

const FinancialAnalytics = () => {
    const user = useAppSelector(selectUser);

    return (
        <div style={{ padding: '1.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            <AccountsDashboardV2 user={user} />
        </div>
    );
};

export default FinancialAnalytics;
