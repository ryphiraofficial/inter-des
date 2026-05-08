import React, { useState, useEffect } from 'react';
import { 
    Search, Plus, MoreVertical, Eye, Edit, Trash2, 
    ChevronDown, Filter, ArrowRight, CheckCircle, Clock,
    Play, Pause, XCircle, Target, Building2, Users, Calendar, SlidersHorizontal
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../../models/api';
import './css/Projects.css';
import Skeleton from '../common/Skeleton';


const Projects = () => {
    const navigate = useNavigate();
    const { id: urlProjectId } = useParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showStageDropdown, setShowStageDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleClose = () => {
        if (urlProjectId) {
            navigate(-1);
        } else {
            setSelectedProject(null);
        }
    };

    useEffect(() => {
        fetchProjects();
        const handleOpenModal = () => setShowModal(true);
        window.addEventListener('open-create-project-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-project-modal', handleOpenModal);
    }, [stageFilter, statusFilter]);

    useEffect(() => {
        if (urlProjectId) {
            const fetchSingleProject = async () => {
                try {
                    const res = await projectAPI.getById(urlProjectId);
                    if (res.success) {
                        setSelectedProject(res.data);
                    }
                } catch (err) {
                    console.error('Error fetching project details:', err);
                }
            };
            fetchSingleProject();
        }
    }, [urlProjectId]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const params = {};
            if (stageFilter) params.stage = stageFilter;
            if (statusFilter) params.status = statusFilter;
            
            const res = await projectAPI.getAll(params);
            if (res.success) setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        return `₹${amount.toLocaleString()}`;
    };

    const getStageColor = (stage) => {
        const colors = {
            'Design': '#8b5cf6',
            'Procurement': '#f59e0b',
            'Production': '#3b82f6',
            'Completed': '#10b981'
        };
        return colors[stage] || '#64748b';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'In Progress': return <Play size={14} />;
            case 'Completed': return <CheckCircle size={14} />;
            case 'On Hold': return <Pause size={14} />;
            case 'Not Started': return <Clock size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const handleStageChange = async (projectId, newStage) => {
        try {
            await projectAPI.updateStage(projectId, { stage: newStage });
            fetchProjects();
        } catch (err) {
            console.error('Error updating stage:', err);
        }
    };

    if (urlProjectId && loading) {
        return (
            <div className="projects-page focused-view">
                <div className="page-header">
                    <div className="header-title-section">
                        <Skeleton width="40px" height="40px" borderRadius="50%" />
                        <div>
                            <Skeleton width="240px" height="32px" />
                            <div style={{ marginTop: '8px' }}>
                                <Skeleton width="180px" height="16px" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detail-container-premium">
                    <div className="stat-grid-premium">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="info-block">
                                <Skeleton width="100px" height="12px" />
                                <div style={{ marginTop: '12px' }}>
                                    <Skeleton width="100%" height="32px" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="info-cards-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="info-card-premium">
                                <Skeleton width="100%" height="160px" borderRadius="16px" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Special View for Direct Project Review (Focused View)
    if (urlProjectId && selectedProject) {
        return (
            <div className="projects-page focused-view">
                <div className="page-header">
                    <div className="header-title-section">
                        <button 
                            className="btn-back-round" 
                            onClick={handleClose}
                        >
                            <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <div>
                            <h1 style={{ margin: 0 }}>{selectedProject.name}</h1>
                            <p style={{ margin: 0, color: '#64748b' }}>{selectedProject.projectNumber} • {selectedProject.client?.name}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <span className="badge-premium" style={{ background: getStageColor(selectedProject.stage) }}>
                            {selectedProject.stage} Stage
                        </span>
                    </div>
                </div>

                <div className="detail-container-premium">
                    <div className="stat-grid-premium">
                        <div className="info-block">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Project Status</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 600 }}>
                                {getStatusIcon(selectedProject.status)}
                                {selectedProject.status}
                            </div>
                        </div>
                        <div className="info-block">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Financial Overview</label>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{formatCurrency(selectedProject.budget)} Budget</div>
                        </div>
                        <div className="info-block">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Completion</label>
                            <div className="completion-bar-wrapper">
                                <div style={{ position: 'absolute', height: '100%', width: `${selectedProject.progress || 0}%`, background: getStageColor(selectedProject.stage), borderRadius: '4px' }}></div>
                                <span className="completion-pct">{selectedProject.progress || 0}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-cards-grid">
                        <div className="info-card-premium">
                            <h4 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Building2 size={18} /> Client Information</h4>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div><span style={{ color: '#64748b' }}>Name:</span> <strong>{selectedProject.client?.name}</strong></div>
                                <div><span style={{ color: '#64748b' }}>Email:</span> {selectedProject.client?.email || 'N/A'}</div>
                                <div><span style={{ color: '#64748b' }}>Phone:</span> {selectedProject.client?.phone || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="info-card-premium">
                            <h4 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> Timeline</h4>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div><span style={{ color: '#64748b' }}>Created On:</span> {new Date(selectedProject.createdAt).toLocaleDateString()}</div>
                                <div><span style={{ color: '#64748b' }}>Last Updated:</span> {new Date(selectedProject.updatedAt).toLocaleDateString()}</div>
                                <div><span style={{ color: '#64748b' }}>Current Stage:</span> <strong>{selectedProject.stage}</strong></div>
                            </div>
                        </div>
                        <div className="info-card-premium">
                            <h4 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18} /> Project Team</h4>
                            <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
                                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Design Mgr:</span> <strong>{selectedProject.assignedDesignManager?.fullName || 'Unassigned'}</strong></div>
                                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Procurement:</span> <strong>{selectedProject.assignedProcurementManager?.fullName || 'Unassigned'}</strong></div>
                                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Production:</span> <strong>{selectedProject.assignedProductionManager?.fullName || 'Unassigned'}</strong></div>
                                <div><span style={{ color: '#64748b', display: 'inline-block', width: '120px' }}>Created By:</span> {selectedProject.createdBy?.fullName || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-page" style={{ padding: '2rem 2.5rem', minHeight: '100vh', margin: '-24px -24px 0 -24px', maxWidth: 'none' }}>
            <div className="filters-bar" style={{ marginTop: '10px' }}>
                <div className="search-box">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-group">

                    {/* Stages Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => { setShowStageDropdown(p => !p); setShowStatusDropdown(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 14px', borderRadius: '8px', height: '42px',
                                border: '1px solid #e2e8f0',
                                background: stageFilter ? '#eef2ff' : '#fff',
                                color: stageFilter ? '#4f46e5' : '#64748b',
                                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                                transition: 'all 0.15s', whiteSpace: 'nowrap',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <SlidersHorizontal size={15} />
                            {stageFilter || 'All Stages'}
                            <ChevronDown size={14} style={{ opacity: 0.6, transform: showStageDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        {showStageDropdown && (
                            <>
                                <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowStageDropdown(false)} />
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                    background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50,
                                    minWidth: '160px', padding: '4px'
                                }}>
                                    <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Stage</p>
                                    {[
                                        { value: '',            label: 'All Stages',   dot: '#94a3b8' },
                                        { value: 'Design',      label: 'Design',       dot: '#6366f1' },
                                        { value: 'Procurement', label: 'Procurement',  dot: '#f59e0b' },
                                        { value: 'Production',  label: 'Production',   dot: '#3b82f6' },
                                        { value: 'Completed',   label: 'Completed',    dot: '#10b981' },
                                    ].map(opt => (
                                        <button key={opt.value}
                                            onClick={() => { setStageFilter(opt.value); setShowStageDropdown(false); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                width: '100%', padding: '8px 10px', borderRadius: '7px',
                                                border: 'none',
                                                background: stageFilter === opt.value ? '#f1f5f9' : 'transparent',
                                                color: stageFilter === opt.value ? '#0f172a' : '#475569',
                                                fontWeight: stageFilter === opt.value ? 700 : 500,
                                                fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left'
                                            }}
                                            onMouseEnter={e => { if (stageFilter !== opt.value) e.currentTarget.style.background = '#f8fafc'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = stageFilter === opt.value ? '#f1f5f9' : 'transparent'; }}
                                        >
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                                            {opt.label}
                                            {stageFilter === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Status Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => { setShowStatusDropdown(p => !p); setShowStageDropdown(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 14px', borderRadius: '8px', height: '42px',
                                border: '1px solid #e2e8f0',
                                background: statusFilter ? '#eef2ff' : '#fff',
                                color: statusFilter ? '#4f46e5' : '#64748b',
                                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                                transition: 'all 0.15s', whiteSpace: 'nowrap',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <SlidersHorizontal size={15} />
                            {statusFilter || 'All Status'}
                            <ChevronDown size={14} style={{ opacity: 0.6, transform: showStatusDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        {showStatusDropdown && (
                            <>
                                <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowStatusDropdown(false)} />
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                    background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50,
                                    minWidth: '160px', padding: '4px'
                                }}>
                                    <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Status</p>
                                    {[
                                        { value: '',            label: 'All Status',  dot: '#94a3b8' },
                                        { value: 'Not Started', label: 'Not Started', dot: '#64748b' },
                                        { value: 'In Progress', label: 'In Progress', dot: '#3b82f6' },
                                        { value: 'On Hold',     label: 'On Hold',     dot: '#f59e0b' },
                                        { value: 'Completed',   label: 'Completed',   dot: '#10b981' },
                                    ].map(opt => (
                                        <button key={opt.value}
                                            onClick={() => { setStatusFilter(opt.value); setShowStatusDropdown(false); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                width: '100%', padding: '8px 10px', borderRadius: '7px',
                                                border: 'none',
                                                background: statusFilter === opt.value ? '#f1f5f9' : 'transparent',
                                                color: statusFilter === opt.value ? '#0f172a' : '#475569',
                                                fontWeight: statusFilter === opt.value ? 700 : 500,
                                                fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left'
                                            }}
                                            onMouseEnter={e => { if (statusFilter !== opt.value) e.currentTarget.style.background = '#f8fafc'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = statusFilter === opt.value ? '#f1f5f9' : 'transparent'; }}
                                        >
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                                            {opt.label}
                                            {statusFilter === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>

            <div className="workflow-stages">
                {['Design', 'Procurement', 'Production', 'Completed'].map(stage => (
                    <div 
                        key={stage} 
                        className={`stage-column ${stageFilter === stage ? 'active' : ''}`}
                    >
                        <div className="stage-header" style={{ borderColor: getStageColor(stage) }}>
                            <span className="stage-name">{stage}</span>
                            <span className="stage-count">
                                {loading ? '...' : projects.filter(p => p.stage === stage).length}
                            </span>
                        </div>
                        <div className="stage-projects">
                            {loading ? (
                                [1, 2].map(i => (
                                    <div key={i} className="project-card skeleton" style={{ background: 'white', cursor: 'default' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <Skeleton width="120px" height="18px" />
                                            <Skeleton width="80px" height="14px" />
                                        </div>
                                        <Skeleton width="100px" height="14px" />
                                        <div style={{ margin: '15px 0' }}>
                                            <Skeleton width="100%" height="8px" />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Skeleton width="60px" height="16px" />
                                            <Skeleton width="80px" height="16px" />
                                        </div>
                                    </div>
                                ))
                            ) : projects
                                .filter(p => p.stage === stage)
                                .map(project => (
                                    <div key={project._id} className="project-card" onClick={() => setSelectedProject(project)}>
                                        <div className="card-header">
                                            <span className="project-name">{project.name}</span>
                                            <span className="project-code">{project.projectNumber}</span>
                                        </div>
                                        <div className="card-client">
                                            <Users size={14} />
                                            <span>{project.client?.name || 'No client'}</span>
                                        </div>
                                        <div className="card-progress">
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{ 
                                                        width: `${project.progress || 0}%`,
                                                        backgroundColor: getStageColor(stage)
                                                    }}
                                                ></div>
                                            </div>
                                            <span>{project.progress || 0}%</span>
                                        </div>
                                        <div className="card-footer">
                                            <span className="budget">{formatCurrency(project.budget)}</span>
                                            <span className="status" style={{ color: getStageColor(stage) }}>
                                                {getStatusIcon(project.status)}
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Project</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Project creation from approved quotations is automatic.</p>
                            <p>Quotations can be approved from the Quotations section.</p>
                        </div>
                    </div>
                </div>
            )}

            {selectedProject && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal-content project-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedProject.name}</h2>
                            <button className="close-btn" onClick={handleClose}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Project Number</label>
                                    <span>{selectedProject.projectNumber}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Client</label>
                                    <span>{selectedProject.client?.name || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Stage</label>
                                    <span style={{ color: getStageColor(selectedProject.stage) }}>
                                        {selectedProject.stage}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Status</label>
                                    <span>{selectedProject.status}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Budget</label>
                                    <span>{formatCurrency(selectedProject.budget)}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Spent</label>
                                    <span>{formatCurrency(selectedProject.spent)}</span>
                                </div>
                            </div>
                            <div className="stage-transition">
                                <h4>Move to Stage</h4>
                                <div className="stage-buttons">
                                    {['Design', 'Procurement', 'Production', 'Completed'].map(stage => (
                                        <button
                                            key={stage}
                                            className={`stage-btn ${selectedProject.stage === stage ? 'active' : ''}`}
                                            style={{ 
                                                borderColor: getStageColor(stage),
                                                backgroundColor: selectedProject.stage === stage ? getStageColor(stage) : 'transparent'
                                            }}
                                            onClick={() => handleStageChange(selectedProject._id, stage)}
                                        >
                                            {stage}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
