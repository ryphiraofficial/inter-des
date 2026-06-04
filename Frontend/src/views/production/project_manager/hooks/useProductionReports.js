import { useEffect } from 'react';
import { useGetProductionReportsQuery } from '../../../../store/api/productionApi';

export const useProductionReports = () => {
    const { data, isLoading: loading, error: rawError } = useGetProductionReportsQuery();
    const reportsData = data?.success ? data.data : null;
    const error = rawError?.message ?? null;

    useEffect(() => {
        // Download CSV — triggered by a global event from the toolbar button
        const downloadCSV = () => {
            if (!reportsData?.projectBreakdown) return;

            const headers = ['Project Name', 'Status', 'Total Tasks', 'Completed Tasks', 'Completion Rate (%)'];
            const csvRows = [headers.join(',')];
            reportsData.projectBreakdown.forEach(proj => {
                csvRows.push([
                    `"${proj.projectName}"`,
                    `"${proj.status}"`,
                    proj.totalTasks,
                    proj.completedTasks,
                    proj.completionRate,
                ].join(','));
            });

            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `production_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        const handleExport = () => downloadCSV();
        window.addEventListener('export-production-reports-pdf', handleExport);
        return () => window.removeEventListener('export-production-reports-pdf', handleExport);
    }, [reportsData]);

    return { reportsData, loading, error };
};
