import React from 'react';
import { Eye, Edit3, MoreVertical } from 'lucide-react';

const ProjectTable = ({ projects, onProjectClick }) => {
    const getStageColor = (stage) => {
        const colors = {
            'Design': '#8b5cf6',
            'Procurement': '#f59e0b',
            'Production': '#3b82f6',
            'Completed': '#10b981'
        };
        return colors[stage] || '#64748b';
    };

    return (
        <div className="project-table-container">
            <table className="project-table">
                <thead>
                    <tr>
                        <th>Project Details</th>
                        <th>Client</th>
                        <th>Stage</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Budget</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project._id} onClick={() => onProjectClick(project)}>
                            <td>
                                <div className="project-info-cell">
                                    <span className="p-name">{project.name}</span>
                                    <span className="p-code">{project.projectNumber}</span>
                                </div>
                            </td>
                            <td>{project.client?.name || 'N/A'}</td>
                            <td>
                                <span className="stage-badge" style={{ backgroundColor: `${getStageColor(project.stage)}15`, color: getStageColor(project.stage) }}>
                                    {project.stage}
                                </span>
                            </td>
                            <td>
                                <span className={`status-dot ${project.status?.toLowerCase().replace(' ', '-')}`}></span>
                                {project.status}
                            </td>
                            <td>
                                <div className="table-progress-wrapper">
                                    <div className="table-progress-bar">
                                        <div className="table-progress-fill" style={{ width: `${project.progress}%`, backgroundColor: getStageColor(project.stage) }}></div>
                                    </div>
                                    <span className="pct">{project.progress}%</span>
                                </div>
                            </td>
                            <td className="budget-cell">₹{project.budget?.toLocaleString()}</td>
                            <td>{project.targetEndDate ? new Date(project.targetEndDate).toLocaleDateString() : 'No date'}</td>
                            <td>
                                <div className="table-actions">
                                    <button className="action-icon-btn"><Eye size={16} /></button>
                                    <button className="action-icon-btn"><Edit3 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTable;
