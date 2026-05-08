import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Plus, Calendar, Target, Clock, CheckCircle, ChevronDown, X } from 'lucide-react';
import '../css/ProductionManagement.css';
import { productionManagerAPI } from '../../../models/api';

const ProjectsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
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

                <button className="pm-quick-action-btn">
                    <Plus size={15} />
                    <span>New Project</span>
                </button>
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
                                <th>Project ID & Name</th>
                                <th>Client / Type</th>
                                <th>Status</th>
                                <th>Progress</th>
                                <th>Timeline</th>
                                <th>Engineer</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading projects...</td>
                                </tr>
                            ) : displayProjects.map(project => (
                                <tr key={project._id} className="pm-table-row">
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{project.projectName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{project._id.toString().substring(0, 8)}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: '#334155', marginBottom: '2px' }}>{project.clientId?.name || 'N/A'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{project.projectType || 'Residential'}</div>
                                    </td>
                                    <td>
                                        <span className={`pm-status-badge ${getStatusClass(project.status)}`}>{project.status}</span>
                                    </td>
                                    <td style={{ minWidth: '150px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div className="pm-progress-bar-v2" style={{ flex: 1 }}>
                                                <div className="pm-progress-fill-v2" style={{ width: `${project.progress || 0}%` }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{project.progress || 0}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                            <Calendar size={12} color="#64748b" /> {project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: '2-digit' }) : 'N/A'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Target size={12} color="#64748b" /> {project.endDate ? new Date(project.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: '2-digit' }) : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div className="pm-team-avatar" style={{ width: '24px', height: '24px', fontSize: '0.7rem', background: '#eff6ff', color: '#3b82f6' }}>
                                                {(project.projectEngineer?.fullName || project.projectManager?.fullName || 'N A').split(' ').map(n=>n[0]).join('')}
                                            </div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{project.projectEngineer?.fullName || project.projectManager?.fullName || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="pm-icon-btn"><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && displayProjects.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No projects found matching your criteria.</td>
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
