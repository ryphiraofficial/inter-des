import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle2, AlertCircle, Clock, PieChart, BarChart2, Briefcase, Activity } from 'lucide-react';
import { productionAPI } from '../../../models/api';
import '../css/ProductionManagement.css';
// import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ProductionReports = () => {
    const [reportsData, setReportsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        const handleExport = () => {
            console.log("Exporting production reports...");
            // Trigger CSV download as a substitute for PDF for now
            downloadCSV();
        };
        window.addEventListener('export-production-reports-pdf', handleExport);
        return () => window.removeEventListener('export-production-reports-pdf', handleExport);
    }, [reportsData]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await productionAPI.getProductionReports();
            if (res.success) {
                setReportsData(res.data);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (!reportsData || !reportsData.projectBreakdown) return;
        
        const headers = ['Project Name', 'Status', 'Total Tasks', 'Completed Tasks', 'Completion Rate (%)'];
        const csvRows = [headers.join(',')];

        reportsData.projectBreakdown.forEach(proj => {
            csvRows.push([
                `"${proj.projectName}"`,
                `"${proj.status}"`,
                proj.totalTasks,
                proj.completedTasks,
                proj.completionRate
            ].join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `production_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (loading) {
        return (
            <div className="pm-dashboard pm-production-reports">
                <div className="pm-metrics-grid">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="pm-card pm-metric-card">
                            <div className="pm-skeleton-line" style={{ width: '58%', marginBottom: '14px' }} />
                            <div className="pm-skeleton-line" style={{ width: '34%', height: '34px', marginBottom: '10px' }} />
                            <div className="pm-skeleton-line" style={{ width: '52%' }} />
                        </div>
                    ))}
                </div>
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <div className="pm-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="pm-reports-table-header">
                            <div className="pm-skeleton-line" style={{ width: '42%', height: '24px' }} />
                        </div>
                        <div style={{ padding: '1rem' }}>
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="pm-skeleton-block" style={{ height: '96px', marginBottom: idx === 2 ? 0 : '0.75rem' }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) return <div className="pm-dashboard"><div style={{ padding: 40, color: 'red' }}>Error: {error}</div></div>;

    const { projects, tasks, materials, leaves, projectBreakdown } = reportsData;

    return (
        <div className="pm-dashboard pm-production-reports">
            {/* High-level metrics */}
            <div className="pm-metrics-grid">
                <div className="pm-card pm-metric-card">
                    <div className="pm-metric-header">
                        <Briefcase size={20} /> <span>Project Health</span>
                    </div>
                    <div className="pm-metric-value">{projects.active} <span>Active</span></div>
                    <div className="pm-metric-footer" style={{ color: projects.delayed > 0 ? '#ef4444' : '#10b981' }}>{projects.delayed} delayed projects</div>
                </div>

                <div className="pm-card pm-metric-card">
                    <div className="pm-metric-header">
                        <CheckCircle2 size={20} /> <span>Task Completion</span>
                    </div>
                    <div className="pm-metric-value">{tasks.completed} <span>/ {tasks.total}</span></div>
                    <div className="pm-metric-footer" style={{ color: tasks.overdue > 0 ? '#ef4444' : '#10b981' }}>{tasks.overdue} tasks overdue</div>
                </div>

                <div className="pm-card pm-metric-card">
                    <div className="pm-metric-header">
                        <Activity size={20} /> <span>Resource Requests</span>
                    </div>
                    <div className="pm-metric-value">{materials.pending} <span>Pending</span></div>
                    <div className="pm-metric-footer" style={{ color: '#64748b' }}>{materials.total} total material requests</div>
                </div>

                <div className="pm-card pm-metric-card">
                    <div className="pm-metric-header">
                        <Clock size={20} /> <span>Team Leaves</span>
                    </div>
                    <div className="pm-metric-value">{leaves.pending} <span>Pending</span></div>
                    <div className="pm-metric-footer" style={{ color: '#64748b' }}>Require your review</div>
                </div>
            </div>

            {/* Project Breakdown Table */}
            <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }} className="pm-table-wrapper">
                <div className="pm-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="pm-reports-table-header">
                        <FileText size={20} color="#334155" />
                        <h2>Project Task Breakdown</h2>
                    </div>
                    
                    {projectBreakdown.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No project data available.</div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="pm-table-container pm-desktop-only">
                                <table className="pm-table">
                                    <thead>
                                        <tr>
                                            <th>Project Name</th>
                                            <th>Status</th>
                                            <th>Total Tasks</th>
                                            <th>Completed</th>
                                            <th>Completion Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectBreakdown.map((proj, idx) => (
                                            <tr key={idx} className="pm-table-row">
                                                <td><strong style={{ color: '#0f172a' }}>{proj.projectName}</strong></td>
                                                <td>
                                                    <span style={{ 
                                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                                                        background: proj.status === 'Completed' ? '#dcfce7' : proj.status === 'Delayed' ? '#fee2e2' : '#eff6ff',
                                                        color: proj.status === 'Completed' ? '#16a34a' : proj.status === 'Delayed' ? '#ef4444' : '#3b82f6'
                                                    }}>
                                                        {proj.status}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 500 }}>{proj.totalTasks}</td>
                                                <td style={{ fontWeight: 500 }}>{proj.completedTasks}</td>
                                                <td>
                                                    <div className="pm-progress-wrapper">
                                                        <div className="pm-progress-bar-bg">
                                                            <div className="pm-progress-bar-fill" style={{ width: `${proj.completionRate}%` }} />
                                                        </div>
                                                        <span className="pm-progress-percent">{proj.completionRate}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="pm-mobile-reports-list pm-mobile-only">
                                {projectBreakdown.map((proj, idx) => (
                                    <div key={idx} className="pm-report-mobile-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <span className="pm-report-card-title">{proj.projectName}</span>
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                                                background: proj.status === 'Completed' ? '#dcfce7' : proj.status === 'Delayed' ? '#fee2e2' : '#eff6ff',
                                                color: proj.status === 'Completed' ? '#16a34a' : proj.status === 'Delayed' ? '#ef4444' : '#3b82f6'
                                            }}>
                                                {proj.status}
                                            </span>
                                        </div>
                                        
                                        <div className="pm-report-card-row">
                                            <span className="pm-report-card-label">Total Tasks</span>
                                            <span className="pm-report-card-value">{proj.totalTasks}</span>
                                        </div>
                                        <div className="pm-report-card-row">
                                            <span className="pm-report-card-label">Completed</span>
                                            <span className="pm-report-card-value">{proj.completedTasks}</span>
                                        </div>
                                        
                                        <div style={{ marginTop: '1rem' }}>
                                            <div className="pm-report-card-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>Completion Progress</div>
                                            <div className="pm-progress-wrapper" style={{ marginTop: 0 }}>
                                                <div className="pm-progress-bar-bg">
                                                    <div className="pm-progress-bar-fill" style={{ width: `${proj.completionRate}%` }} />
                                                </div>
                                                <span className="pm-progress-percent">{proj.completionRate}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductionReports;
