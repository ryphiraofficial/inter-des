import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronDown, Calendar, Target, MoreVertical, CheckSquare, Lock, LockOpen } from 'lucide-react';
import { selectUser } from '../../../../../store/slices/authSlice';
import { useUnlockProjectMutation } from '../../../../../store/api/productionApi';
import ProjectTasksAssignment from '../../ProjectTasksAssignment';

const getStatusClass = (status) => {
    const map = { 'Active': 'active', 'On Hold': 'on-hold', 'Planning': 'planning', 'Completed': 'completed', 'Admin Approved': 'admin-approved' };
    return map[status] || 'default';
};

const ProjectsTableRow = ({ project, expandedRow, toggleRow, activeDropdown, setActiveDropdown, dropdownRef, onProjectUpdate }) => {
    const navigate = useNavigate();
    const isExpanded = expandedRow === project._id;
    const currentUser = useSelector(selectUser);
    const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin';
    const [unlockProject, { isLoading: unlocking }] = useUnlockProjectMutation();

    const handleUnlock = async (e) => {
        e.stopPropagation();
        try {
            await unlockProject(project._id).unwrap();
            if (onProjectUpdate) onProjectUpdate();
        } catch {}
    };

    return (
        <React.Fragment>
            <tr className={`pm-table-row ${isExpanded ? 'expanded' : ''}`} onClick={() => window.innerWidth <= 768 && toggleRow(project._id)}>
                <td className="pm-desktop-only">
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleRow(project._id); }}
                        className="pm-expand-btn"
                    >
                        <ChevronDown size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                    </button>
                </td>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button className="pm-mobile-only pm-expand-btn-mobile">
                            <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
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
                <td style={{ position: 'relative' }}>
                    {project.status === 'Admin Approved' ? (
                        // Locked projects show a lock badge + optional Unlock button for admins
                        <div title="Project locked — Admin Approved" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', padding: '0 8px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: '6px', border: '1px solid #fcd34d' }}>
                                <Lock size={11} /> Locked
                            </span>
                            {isAdmin && (
                                <button
                                    onClick={handleUnlock}
                                    disabled={unlocking}
                                    title="Unlock this project"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #c7d2fe', cursor: unlocking ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
                                    onMouseOver={e => { if (!unlocking) { e.currentTarget.style.background = '#e0e7ff'; } }}
                                    onMouseOut={e => { if (!unlocking) { e.currentTarget.style.background = '#eff6ff'; } }}
                                >
                                    <LockOpen size={11} /> {unlocking ? '...' : 'Unlock'}
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                className="pm-icon-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === project._id ? null : project._id);
                                }}
                            >
                                <MoreVertical size={16} />
                            </button>

                            {activeDropdown === project._id && (
                                <div
                                    ref={dropdownRef}
                                    style={{
                                        position: 'absolute',
                                        right: '40px',
                                        top: '30px',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        zIndex: 100,
                                        minWidth: '180px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/production-management/projects/${project._id}/complete`);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '10px 16px',
                                            textAlign: 'left',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            color: '#0f172a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <CheckSquare size={14} color="#10b981" />
                                        Project Completion
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </td>
            </tr>

            {isExpanded && (
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
                                onProjectUpdate={onProjectUpdate} 
                            />
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

export default ProjectsTableRow;
