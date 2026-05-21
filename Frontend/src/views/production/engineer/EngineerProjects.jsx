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

    useEffect(() => { 
        load(); 
        
        const handleSearch = (e) => setFilters(p => ({ ...p, search: e.detail }));
        window.addEventListener('header-search', handleSearch);
        return () => window.removeEventListener('header-search', handleSearch);
    }, []);

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
            <div className="eng-page-header" style={{ justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {STATUS_FILTERS.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setFilters(p => ({ ...p, status: tab }))}
                            style={{
                                background: filters.status === tab ? '#eff6ff' : 'transparent',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: 14,
                                fontWeight: filters.status === tab ? 600 : 500,
                                color: filters.status === tab ? '#3b82f6' : '#64748b',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
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
