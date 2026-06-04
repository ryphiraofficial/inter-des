import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Target, Users, ChevronRight } from 'lucide-react';
import './Engineer.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';
import { useGetEngineerProjectsQuery } from '../../../store/api/productionApi';
import ProjectsFilterPanel from '../project_manager/components/ProjectsList/ProjectsFilterPanel';

const STATUS_FILTERS = ['All', 'Planning', 'Active', 'On Hold', 'Completed'];

const EngineerProjects = () => {
    const user = useAppSelector(selectUser);
    const navigate  = useNavigate();
    
    // Split filter state to support ProjectsFilterPanel
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);

    const { data: res, isLoading: loading } = useGetEngineerProjectsQuery();
    const projects = res?.success ? res.data : [];

    useEffect(() => { 
        const handleSearch = (e) => setSearchTerm(e.detail);
        window.addEventListener('header-search', handleSearch);
        return () => window.removeEventListener('header-search', handleSearch);
    }, []);

    const myRole = (p) => {
        const uid = user?._id;
        if (p.projectEngineer?._id === uid || p.projectEngineer === uid) return 'Project Engineer';
        if (p.siteEngineer?._id    === uid || p.siteEngineer    === uid) return 'Site Engineer';
        return 'Site Supervisor';
    };

    const basePath = user?.role === 'Project Engineer' ? '/engineer' : '/site';

    const filtered = projects.filter(p => {
        if (filterStatus !== 'All' && p.status !== filterStatus) return false;
        if (searchTerm && !p.projectName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="eng-tasks-page">
            <div style={{ marginBottom: 24 }}>
                <ProjectsFilterPanel 
                    filtersOpen={filtersOpen}
                    setFiltersOpen={setFiltersOpen}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </div>

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
