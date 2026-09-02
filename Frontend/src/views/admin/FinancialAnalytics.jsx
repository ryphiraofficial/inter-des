import React from 'react';
import AccountsDashboardV2 from '../Accounts/common/AccountsDashboardV2';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

const FinancialAnalytics = () => {
    const user = useAppSelector(selectUser);

    return (
        <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
            <AccountsDashboardV2 user={user} />
        </div>
    );
};

export default FinancialAnalytics;
