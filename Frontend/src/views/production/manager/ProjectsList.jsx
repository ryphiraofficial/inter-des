import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Calendar, Target, Clock, CheckCircle, ChevronDown, X } from 'lucide-react';
import '../css/ProductionManagement.css';
import { productionManagerAPI } from '../../../models/api';
import ProjectTasksAssignment from './ProjectTasksAssignment';

const ProjectsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});

    const fetchProjects = async () => {
        try {
            const res = await productionManagerAPI.getProjects({
                status: filterStatus !== 'All' ? filterStatus : '',
                search: searchTerm
            });
            if (res?.success) {
                setProjects(res.data);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(() => {
        setLoading(true);
        const timeoutId = setTimeout(() => {
            fetchProjects();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterStatus]);

    const getStatusClass = (status) => {
        const map = { 'Active': 'active', 'On Hold': 'on-hold', 'Planning': 'planning', 'Completed': 'completed' };
        return map[status] || 'default';
    };

    const STATUS_OPTIONS = ['All', 'Active', 'Planning', 'On Hold', 'Completed'];
    const activeFilterCount = (filterStatus !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0);

    const displayProjects = projects;

    return (
        <div className="pm-dashboard">
            {/* Toolbar */}
            <div className="pm-toolbar">
                <div className="pm-toolbar-left">
                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setFiltersOpen(o => !o)}
                        className={`pm-filter-toggle-btn ${filtersOpen ? 'active' : ''}`}
                    >
                        <Filter size={15} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="pm-filter-count">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown size={14} className={`pm-chevron ${filtersOpen ? 'open' : ''}`} />
                    </button>

                    {/* Active filter chips */}
                    {filterStatus !== 'All' && (
                        <div className="pm-filter-chip">
                            {filterStatus}
                            <button onClick={() => setFilterStatus('All')} className="pm-filter-chip-close">
                                <X size={12} />
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Collapsible Filter Panel */}
            <div className={`pm-filter-panel-wrapper ${filtersOpen ? 'open' : ''}`}>
                <div className="pm-filter-panel">
                    {/* Search */}
                    <div className="pm-search-input-container">
                        <Search size={15} color="#64748b" />
                        <input
                            type="text"
                            placeholder="Search projects or clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pm-search-input"
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="pm-search-clear"><X size={14} /></button>}
                    </div>
                    {/* Status chips */}
                    <div className="pm-status-chips">
                        <span className="pm-status-label">Status:</span>
                        <div className="pm-status-chips-scroll">
                            {STATUS_OPTIONS.map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)} className={`pm-status-chip-btn ${filterStatus === s ? 'active' : ''}`}>
                                    {s === 'All' ? 'All Statuses' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pm-card">
                <div className="pm-table-container">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-desktop-only" style={{ width: '40px' }}></th>
                                <th>Project ID & Name</th>
                                <th className="pm-desktop-only">Client / Type</th>
                                <th>Status</th>
                                <th className="pm-desktop-only">Progress</th>
                                <th className="pm-desktop-only">Timeline</th>
                                <th className="pm-desktop-only">Engineer</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, rowIdx) => (
                                    <tr key={`skeleton-row-${rowIdx}`} className="pm-table-row">
                                        <td className="pm-desktop-only">
                                            <div className="pm-skeleton-circle" style={{ width: '20px', height: '20px' }} />
                                        </td>
                                        <td>
                                            <div className="pm-skeleton-line" style={{ width: '60%', marginBottom: '8px' }} />
                                            <div className="pm-skeleton-line" style={{ width: '35%' }} />
                                        </td>
                                        <td className="pm-desktop-only"><div className="pm-skeleton-line" style={{ width: '65%' }} /></td>
                                        <td><div className="pm-skeleton-line" style={{ width: '52%' }} /></td>
                                        <td className="pm-desktop-only"><div className="pm-skeleton-line" style={{ width: '70%' }} /></td>
                                        <td className="pm-desktop-only"><div className="pm-skeleton-line" style={{ width: '58%' }} /></td>
                                        <td className="pm-desktop-only"><div className="pm-skeleton-line" style={{ width: '64%' }} /></td>
                                        <td><div className="pm-skeleton-circle" style={{ width: '24px', height: '24px', marginLeft: 'auto' }} /></td>
                                    </tr>
                                ))
                            ) : displayProjects.map(project => (
                                <React.Fragment key={project._id}>
                                    <tr className={`pm-table-row ${expandedRows[project._id] ? 'expanded' : ''}`} onClick={() => window.innerWidth <= 768 && toggleRow(project._id)}>
                                        <td className="pm-desktop-only">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleRow(project._id); }}
                                                className="pm-expand-btn"
                                            >
                                                <ChevronDown size={16} style={{ transform: expandedRows[project._id] ? 'rotate(180deg)' : 'none' }} />
                                            </button>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <button 
                                                    className="pm-mobile-only pm-expand-btn-mobile"
                                                >
                                                    <ChevronDown size={14} style={{ transform: expandedRows[project._id] ? 'rotate(180deg)' : 'none' }} />
                                                </button>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{project.projectName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{project._id.toString().substring(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pm-desktop-only">
                                            <div style={{ fontWeight: 500, color: '#334155', marginBottom: '2px' }}>{project.clientId?.name || 'N/A'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{project.projectType || 'Residential'}</div>
                                        </td>
                                        <td>
                                            <span className={`pm-status-badge ${getStatusClass(project.status)}`}>{project.status}</span>
                                        </td>
                                        <td className="pm-desktop-only" style={{ minWidth: '150px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="pm-progress-bar-v2" style={{ flex: 1 }}>
                                                    <div className="pm-progress-fill-v2" style={{ width: `${project.progress || 0}%` }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{project.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td className="pm-desktop-only">
                                            <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                                <Calendar size={12} color="#64748b" /> {project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: '2-digit' }) : 'N/A'}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Target size={12} color="#64748b" /> {project.endDate ? new Date(project.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: '2-digit' }) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="pm-desktop-only">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div className="pm-team-avatar" style={{ width: '24px', height: '24px', fontSize: '0.7rem', background: '#eff6ff', color: '#3b82f6' }}>
                                                    {(project.projectEngineer?.fullName || project.projectManager?.fullName || 'N A').split(' ').map(n=>n[0]).join('')}
                                                </div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{project.projectEngineer?.fullName || project.projectManager?.fullName || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="pm-icon-btn" onClick={(e) => e.stopPropagation()}><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>

                                    {/* Expanded Detail Row (Mobile & Desktop) */}
                                    {expandedRows[project._id] && (
                                        <tr className="pm-expanded-row">
                                            <td colSpan="10" style={{ padding: 0 }}>
                                                <div className="pm-expanded-content">
                                                    <div className="pm-expanded-grid">
                                                        <div className="pm-expanded-item pm-mobile-only">
                                                            <label>Client & Type</label>
                                                            <div className="pm-expanded-value">
                                                                <strong>{project.clientId?.name || 'N/A'}</strong>
                                                                <span>{project.projectType || 'Residential'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="pm-expanded-item">
                                                            <label>Project Progress</label>
                                                            <div className="pm-expanded-value">
                                                                <div className="pm-expanded-progress-wrapper">
                                                                    <div className="pm-progress-bar-v2">
                                                                        <div className="pm-progress-fill-v2" style={{ width: `${project.progress || 0}%` }}></div>
                                                                    </div>
                                                                    <strong>{project.progress || 0}%</strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="pm-expanded-item pm-mobile-only">
                                                            <label>Timeline</label>
                                                            <div className="pm-expanded-value">
                                                                <div className="pm-expanded-timeline">
                                                                    <span><Calendar size={14} /> {project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                                                                    <span><Target size={14} /> {project.endDate ? new Date(project.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="pm-expanded-item pm-mobile-only">
                                                            <label>Assigned Engineer</label>
                                                            <div className="pm-expanded-value">
                                                                <div className="pm-expanded-engineer">
                                                                    <div className="pm-team-avatar">
                                                                        {(project.projectEngineer?.fullName || 'U').split(' ').map(n=>n[0]).join('')}
                                                                    </div>
                                                                    <strong>{project.projectEngineer?.fullName || 'Unassigned'}</strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ProjectTasksAssignment 
                                                        project={project} 
                                                        onProjectUpdate={fetchProjects} 
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {!loading && displayProjects.length === 0 && (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No projects found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectsList;
