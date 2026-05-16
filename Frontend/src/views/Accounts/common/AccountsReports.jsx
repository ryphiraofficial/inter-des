import React from 'react';
import { useAccountsReportLogic } from '../hooks/useAccountsReportLogic';
import { ReportMetrics, ReportSummaryTable } from './components/reports/ReportElements';
import { StatsSkeleton, TableSkeleton } from '../components/UI/Skeleton';

const AccountsReports = () => {
    const { stats, quotations, loading, error } = useAccountsReportLogic();

    return (
        <div className="reports-container">
            <div className="reports-wrapper">
                {error && <div className="error-banner">{error}</div>}
                {loading ? (
                    <>
                        <StatsSkeleton count={4} />
                        <TableSkeleton rows={8} cols={4} />
                    </>
                ) : (
                    <>
                        <ReportMetrics stats={stats} />
                        <div className="accounts-card" style={{ marginTop: '24px' }}>
                            <div className="card-header-simple"><h2>Financial Summary</h2></div>
                            <ReportSummaryTable quotations={quotations} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountsReports;
