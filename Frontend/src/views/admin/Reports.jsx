import React from 'react';
import { useReportData } from './reports/hooks/useReportData';
import ReportMetrics from './reports/components/ReportMetrics';
import ReportSummaryTable from './reports/components/ReportSummaryTable';

import './css/Reports.css';

const Reports = () => {
    const { stats, quotations, loading, error, conversionRate } = useReportData();

    return (
        <div className="reports-container">
            <div className="reports-wrapper">
                {error && <div className="error-banner">{error}</div>}

                {loading ? (
                    <div className="reports-skeleton">
                        <div className="skeleton-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="skeleton skeleton-card" style={{ height: '140px', borderRadius: '16px' }} />
                            ))}
                        </div>
                        <div className="skeleton skeleton-table-area" style={{ height: '400px', borderRadius: '24px', marginTop: '2rem' }} />
                    </div>
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
