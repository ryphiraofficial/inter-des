import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Target, Users, CheckSquare, ChevronRight, Search, Zap, CheckCircle2 } from 'lucide-react';
import { engineerAPI } from '../../../models/api';
import './Engineer.css';

const STATUS_FILTERS = ['All', 'Planning', 'Active', 'On Hold', 'Completed'];

const EngineerProjects = ({ user }) => {
    const navigate  = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [filters,  setFilters]  = useState({ status: 'All', search: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await engineerAPI.getMyProjects();
            if (res.success) setProjects(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const myRole = (p) => {
        const uid = user?._id;
        if (p.projectEngineer?._id === uid || p.projectEngineer === uid) return 'Project Engineer';
        if (p.siteEngineer?._id    === uid || p.siteEngineer    === uid) return 'Site Engineer';
        return 'Site Supervisor';
    };

    const basePath = user?.role === 'Project Engineer' ? '/engineer' : '/site';

    const filtered = projects.filter(p => {
        if (filters.status !== 'All' && p.status !== filters.status) return false;
        if (filters.search && !p.projectName.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const activeFilterCount = (filters.status !== 'All' ? 1 : 0) + (filters.search ? 1 : 0);

    return (
        <div className="eng-tasks-page">
            <div className="eng-page-header" style={{ justifyContent: 'flex-end', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="eng-search-wrapper desktop-only" style={{ minWidth: 200 }}>
                        <Search size={14} className="eng-search-icon" />
                        <input
                            type="text"
                            className="eng-search-input"
                            placeholder="Search..."
                            value={filters.search}
                            onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>
                    <button 
                        className={`eng-filter-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Target size={16} /> 
                        Filters
                        {activeFilterCount > 0 && <span className="eng-filter-badge">{activeFilterCount}</span>}
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="eng-filters-panel">
                    <div className="eng-filter-group mobile-only">
                        <span className="eng-filter-label">Search</span>
                        <input 
                            className="eng-filter-input" 
                            placeholder="Search by project name..." 
                            value={filters.search}
                            onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>
                    <div className="eng-filter-group">
                        <span className="eng-filter-label">Status</span>
                        <div className="eng-filter-options">
                            {STATUS_FILTERS.map(o => (
                                <button 
                                    key={o} 
                                    className={`eng-filter-chip ${filters.status===o?'active':''}`} 
                                    onClick={() => setFilters(p => ({ ...p, status: o }))}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="eng-loading">Loading projects…</div>
            ) : projects.length === 0 ? (
                <div className="eng-section-card">
                    <div className="eng-empty" style={{ padding:'64px 24px' }}>
                        <Target size={40}/>
                        <p>No projects assigned yet</p>
                        <span>Your Project Manager will assign you to a project shortly.</span>
                    </div>
                </div>
            ) : (
                <div className="eng-projects-grid">
                    {filtered.map(p => (
                        <div key={p._id} className="eng-project-card" onClick={() => navigate(`${basePath}/projects/${p._id}`)}>
                            <div className="eng-project-card-header">
                                <div className="eng-project-icon-box">
                                    <FolderOpen size={20} style={{ color:'#6366f1' }}/>
                                </div>
                                <div className="eng-project-status-chip" style={{ 
                                    color: p.status === 'Completed' ? '#059669' : '#2563eb',
                                    background: p.status === 'Completed' ? '#d1fae5' : '#dbeafe'
                                }}>
                                    {p.status || 'Active'}
                                </div>
                            </div>
                            
                            <div className="eng-project-card-body">
                                <h3 className="eng-project-title">{p.projectName}</h3>
                                <p className="eng-project-pm">PM: {p.projectManager?.fullName || '—'}</p>
                                
                                <div className="eng-project-progress-container">
                                    <div className="eng-progress-label">
                                        <span>Progress</span>
                                        <span>{p.progress || 0}%</span>
                                    </div>
                                    <div className="eng-progress-track">
                                        <div className="eng-progress-fill" style={{ width: `${p.progress || 0}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="eng-project-card-footer">
                                <div className="eng-project-meta-item">
                                    <Users size={14}/>
                                    <span>{myRole(p)}</span>
                                </div>
                                <ChevronRight size={16} className="eng-chevron"/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EngineerProjects;
