import React from 'react';
import { FileText } from 'lucide-react';

const ProjectBreakdownTable = ({ projectBreakdown }) => {
    return (
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
    );
};

export default ProjectBreakdownTable;
