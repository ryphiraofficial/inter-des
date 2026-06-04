import React from 'react';
import '../css/ProductionManagement.css';
import { useProductionReports } from './hooks/useProductionReports';
import ReportsSkeleton from './components/ProductionReports/ReportsSkeleton';
import ReportsMetricsGrid from './components/ProductionReports/ReportsMetricsGrid';
import ProjectBreakdownTable from './components/ProductionReports/ProjectBreakdownTable';

const ProductionReports = () => {
    const { reportsData, loading, error } = useProductionReports();

    if (loading) {
        return <ReportsSkeleton />;
    }
    
    if (error) {
        return <div className="pm-dashboard"><div style={{ padding: 40, color: 'red' }}>Error: {error}</div></div>;
    }

    const { projects, tasks, materials, leaves, projectBreakdown } = reportsData;

    return (
        <div className="pm-dashboard pm-production-reports">
            <ReportsMetricsGrid 
                projects={projects}
                tasks={tasks}
                materials={materials}
                leaves={leaves}
            />

            <ProjectBreakdownTable projectBreakdown={projectBreakdown} />
        </div>
    );
};

export default ProductionReports;
