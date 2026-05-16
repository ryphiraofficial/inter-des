import React from 'react';
import { useReportData } from './reports/hooks/useReportData';
import ReportMetrics from './reports/components/ReportMetrics';
import ReportSummaryTable from './reports/components/ReportSummaryTable';
import { TableSkeleton, StatsSkeleton } from './components/Skeleton';

import './css/Reports.css';

const Reports = () => {
    const { stats, quotations, loading, error, conversionRate } = useReportData();

    return (
        <div className="reports-container">
            <div className="reports-wrapper">
                {error && <div className="error-banner">{error}</div>}

                {loading ? (
                    <>
                        <StatsSkeleton count={8} />
                        <TableSkeleton rows={8} cols={5} />
                    </>
                ) : (
                    <>
                        <ReportMetrics 
                            stats={stats} 
                            conversionRate={conversionRate} 
                        />
                        
                        <ReportSummaryTable 
                            quotations={quotations} 
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;
