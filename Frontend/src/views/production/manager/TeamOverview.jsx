import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, MoreVertical, Award, Briefcase, Activity, Users, X, Plus, ChevronDown } from 'lucide-react';
import '../css/ProductionManagement.css';
import { teamMemberAPI } from '../../../models/api';

const TeamOverview = () => {
    const [teamData, setTeamData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [newMember, setNewMember] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        location: '',
        reportingManager: '', // Will split by comma on submit
        activeProjects: 0,
        workloadPercentage: 0,
        performance: 'Good'
    });

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const res = await teamMemberAPI.getMembers();
            if (res.success) {
                setTeamData(res.data);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    useEffect(() => {
        const openCreateMemberModal = () => setIsModalOpen(true);
        window.addEventListener('open-create-production-member-modal', openCreateMemberModal);
        return () => window.removeEventListener('open-create-production-member-modal', openCreateMemberModal);
    }, []);

    useEffect(() => {
        const handleHeaderSearch = (e) => {
            setSearchTerm(e.detail || '');
        };
        window.addEventListener('header-search', handleHeaderSearch);
        return () => window.removeEventListener('header-search', handleHeaderSearch);
    }, []);

    const filteredTeam = teamData.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCapacityColor = (cap) => {
        if (cap >= 90) return '#ef4444'; // Overloaded
        if (cap >= 70) return '#f59e0b'; // High
        if (cap >= 40) return '#10b981'; // Optimal
        return '#3b82f6'; // Available
    };

    const handleCreateMember = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...newMember,
                reportingManager: newMember.reportingManager
                    ? newMember.reportingManager.split(',').map(m => m.trim()).filter(Boolean)
                    : []
            };
            const res = await teamMemberAPI.createMember(dataToSubmit);
            if (res.success) {
                setIsModalOpen(false);
                setNewMember({
                    name: '', role: '', email: '', phone: '', location: '',
                    reportingManager: '', activeProjects: 0, workloadPercentage: 0, performance: 'Good'
                });
                fetchTeam();
            } else {
                alert("Error: " + res.message);
            }
        } catch (err) {
            alert("Error creating member: " + err.message);
        }
    };

    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className="pm-dashboard" style={{ paddingTop: '1.5rem' }}>


            {error && <div className="pm-error-message">{error}</div>}

            <div className="pm-card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div className="pm-loading-state">
                        <div className="pm-loading-spinner"></div>
                        <span>Loading team members...</span>
                    </div>
                ) : (
                    <div className="pm-table-container">
                        <table className="pm-table">
                            <thead>
                                <tr>
                                    <th>Member Profile</th>
                                    <th className="pm-desktop-only">Reporting Team</th>
                                    <th className="pm-desktop-only">Workload & Capacity</th>
                                    <th className="pm-desktop-only">Performance</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                    <th className="pm-mobile-only"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeam.map(member => (
                                    <React.Fragment key={member._id}>
                                        <tr className={`pm-table-row ${expandedRow === member._id ? 'active' : ''}`} onClick={() => window.innerWidth <= 768 && toggleRow(member._id)}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div className="pm-team-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                                        {member.name ? member.name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px', fontSize: '0.95rem' }}>{member.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Briefcase size={12} /> {member.role}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="pm-desktop-only">
                                                {member.reportingManager && member.reportingManager.length > 0 ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                        {member.reportingManager.map((sub, idx) => (
                                                            <span key={idx} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                                                                {sub}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>None</span>
                                                )}
                                            </td>
                                            <td className="pm-desktop-only" style={{ minWidth: '160px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>{member.activeProjects} Projects</span>
                                                        <span style={{ color: getCapacityColor(member.workloadPercentage) }}>{member.workloadPercentage}%</span>
                                                    </div>
                                                    <div className="pm-capacity-bar" style={{ background: '#f1f5f9', height: '6px', borderRadius: '3px' }}>
                                                        <div className="pm-capacity-fill" style={{ width: `${member.workloadPercentage}%`, background: getCapacityColor(member.workloadPercentage), height: '100%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="pm-desktop-only">
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}>
                                                    <Award size={14} color={member.performance === 'Outstanding' ? '#f59e0b' : member.performance === 'Excellent' ? '#10b981' : '#64748b'} />
                                                    {member.performance}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button className="pm-icon-btn pm-desktop-only" style={{ color: '#3b82f6', background: '#eff6ff' }}>
                                                        <Mail size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if(window.confirm('Delete this team member?')) {
                                                                await teamMemberAPI.deleteMember(member._id);
                                                                fetchTeam();
                                                            }
                                                        }}
                                                        className="pm-icon-btn" style={{ color: '#ef4444', background: '#fee2e2' }}>
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="pm-mobile-only">
                                                <ChevronDown size={18} style={{ color: '#94a3b8', transform: expandedRow === member._id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                            </td>
                                        </tr>
                                        {expandedRow === member._id && (
                                            <tr className="pm-expanded-row">
                                                <td colSpan="6">
                                                    <div className="pm-expanded-content">
                                                        <div className="pm-expanded-grid">
                                                            <div className="pm-expanded-item">
                                                                <span className="pm-expanded-label">Contact Details</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                                        <Mail size={14} color="#64748b" /> {member.email}
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                                        <Phone size={14} color="#64748b" /> {member.phone}
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                                        <MapPin size={14} color="#64748b" /> {member.location}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="pm-expanded-item">
                                                                <span className="pm-expanded-label">Workload & Projects</span>
                                                                <div style={{ marginTop: '8px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{member.activeProjects} Active Projects</span>
                                                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: getCapacityColor(member.workloadPercentage) }}>{member.workloadPercentage}% Capacity</span>
                                                                    </div>
                                                                    <div className="pm-capacity-bar" style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px' }}>
                                                                        <div className="pm-capacity-fill" style={{ width: `${member.workloadPercentage}%`, background: getCapacityColor(member.workloadPercentage), height: '100%' }}></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {member.reportingManager && member.reportingManager.length > 0 && (
                                                                <div className="pm-expanded-item">
                                                                    <span className="pm-expanded-label">Reporting Team</span>
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '6px' }}>
                                                                        {member.reportingManager.map((sub, idx) => (
                                                                            <span key={idx} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }}>
                                                                                {sub}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ marginTop: '1.25rem' }}>
                                                            <button className="pm-quick-action-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                                                <Mail size={16} /> Contact Member
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
                {filteredTeam.length === 0 && !loading && (
                    <div className="pm-loading-state">
                        <span>No team members found.</span>
                    </div>
                )}

            {/* Add Member Modal */}
            {isModalOpen && (
                <div className="pm-modal-overlay">
                    <div className="pm-modal" style={{ maxWidth: '600px' }}>
                        <div className="pm-modal-header">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                                <Users size={24} color="#3b82f6" /> Add Team Member
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="pm-modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateMember}>
                            <div className="pm-modal-body" data-lenis-prevent>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="pm-input-label">Full Name *</label>
                                        <input required type="text" className="pm-text-input" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="pm-input-label">Role *</label>
                                        <input required type="text" className="pm-text-input" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="e.g. Project Engineer" />
                                    </div>
                                    <div>
                                        <label className="pm-input-label">Location *</label>
                                        <input required type="text" className="pm-text-input" value={newMember.location} onChange={e => setNewMember({...newMember, location: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="pm-input-label">Email *</label>
                                        <input required type="email" className="pm-text-input" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="pm-input-label">Phone *</label>
                                        <input required type="text" className="pm-text-input" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="pm-input-label">Reporting Team (Comma separated names)</label>
                                        <input type="text" className="pm-text-input" value={newMember.reportingManager} onChange={e => setNewMember({...newMember, reportingManager: e.target.value})} placeholder="e.g. Arjun M., Neha S." />
                                    </div>
                                    <div>
                                        <label className="pm-input-label">Active Projects</label>
                                        <input type="number" min="0" className="pm-text-input" value={newMember.activeProjects} onChange={e => setNewMember({...newMember, activeProjects: parseInt(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="pm-input-label">Workload %</label>
                                        <input type="number" min="0" max="100" className="pm-text-input" value={newMember.workloadPercentage} onChange={e => setNewMember({...newMember, workloadPercentage: parseInt(e.target.value)})} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="pm-input-label">Performance</label>
                                        <select className="pm-text-input" value={newMember.performance} onChange={e => setNewMember({...newMember, performance: e.target.value})}>
                                            <option value="Good">Good</option>
                                            <option value="Excellent">Excellent</option>
                                            <option value="Outstanding">Outstanding</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="pm-modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="pm-modal-btn secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="pm-modal-btn primary" style={{ flex: 1 }}>Add Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamOverview;
