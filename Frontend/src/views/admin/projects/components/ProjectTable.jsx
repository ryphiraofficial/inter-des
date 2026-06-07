import React, { useState, useEffect } from 'react';
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectTable = ({ projects, onProjectClick, onEditClick, onDeleteClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(projects.length / itemsPerPage) || 1;

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [projects.length, totalPages, currentPage]);

    const getStageColor = (stage) => {
        const colors = {
            'Design': '#8b5cf6',
            'Procurement': '#f59e0b',
            'Production': '#3b82f6',
            'Completed': '#10b981'
        };
        return colors[stage] || '#64748b';
    };

    const currentProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    {currentProjects.map(project => (
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
                                    <button 
                                        className="action-icon-btn" 
                                        onClick={(e) => { e.stopPropagation(); onProjectClick(project); }}
                                        title="View Project"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button 
                                        className="action-icon-btn" 
                                        onClick={(e) => { e.stopPropagation(); onEditClick(project); }}
                                        title="Edit Project"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button 
                                        className="action-icon-btn delete-btn" 
                                        onClick={(e) => { e.stopPropagation(); onDeleteClick(project); }}
                                        title="Delete Project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem', gap: '1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, projects.length)} of {projects.length} entries
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ 
                                padding: '0.35rem 0.5rem', 
                                borderRadius: '6px', 
                                border: '1px solid #e2e8f0', 
                                background: currentPage === 1 ? '#f8fafc' : 'white', 
                                color: currentPage === 1 ? '#cbd5e1' : '#475569',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ 
                                padding: '0.35rem 0.5rem', 
                                borderRadius: '6px', 
                                border: '1px solid #e2e8f0', 
                                background: currentPage === totalPages ? '#f8fafc' : 'white', 
                                color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectTable;
