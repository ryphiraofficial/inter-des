import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, Loader, Plus, Layers, ArrowRight, Building2, AlertTriangle } from 'lucide-react';
import { taskAPI, projectAPI } from '../../models/api';
import Skeleton from '../common/Skeleton';
import './css/SalesTasks.css';

const SalesTasks = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const isSalesManager = user?.role?.toLowerCase().includes('manager');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projRes, taskRes] = await Promise.all([
                projectAPI.getAll({ limit: 100 }),
                taskAPI.getAll({ includeSalesReview: 'true', limit: 100 })
            ]);
            
            const allProjects = projRes.success ? (projRes.data || []) : [];
            const allTasks = taskRes.success ? (taskRes.data || []) : [];
            
            setTasks(allTasks);

            // Filter to only show projects where this user created the quotation, unless they are a manager
            let myProjects = isSalesManager ? allProjects : allProjects.filter(p => {
                const creatorId = p.quotation?.createdBy;
                return creatorId === user._id || creatorId?._id === user._id;
            });
            
            // Map projects by ID for easy access
            const projMap = new Map(myProjects.map(p => [p._id, p]));
            
            // Add any projects from tasks that are assigned to this user or pending their review
            allTasks.forEach(t => {
                if (t.project && !projMap.has(t.project._id)) {
                    // Inject project from task if not already in list
                    const taskProj = {
                        ...t.project,
                        quotation: t.quotation || {},
                        client: t.client || t.project.client || {}
                    };
                    myProjects.push(taskProj);
                    projMap.set(t.project._id, taskProj);
                }
                
                // If there's a pending review task, attach it to the project
                if (t.status === 'Pending Sales Review' && t.project) {
                    const p = projMap.get(t.project._id);
                    if (p) p.pendingReviewTask = t;
                }
            });

            setProjects(myProjects);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSalesReview = async (e, taskId, approved) => {
        e.stopPropagation();
        try {
            const notes = prompt(approved ? 'Add approval notes (optional):' : 'Reason for rejection:');
            if (!approved && !notes) {
                alert('Rejection reason is required');
                return;
            }
            
            const response = await taskAPI.salesApprove(taskId, { approved, salesNotes: notes });
            if (response.success) {
                alert(approved ? 'Design approved successfully!' : 'Design sent back for revision');
                fetchData();
            }
        } catch (err) {
            console.error('Failed to review:', err);
            alert('Action failed: ' + err.message);
        }
    };

    const filtered = projects.filter(p => {
        const q = searchTerm.toLowerCase();
        return !q ||
            p.name?.toLowerCase().includes(q) ||
            p.projectNumber?.toLowerCase().includes(q) ||
            p.client?.name?.toLowerCase().includes(q) ||
            p.quotation?.projectName?.toLowerCase().includes(q);
    });

    if (loading) {
        return (
            <div className="st-sales-container">
                <div className="st-sales-wrapper">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '24px' }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', borderTop: '4px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <Skeleton width="180px" height="20px" />
                                        <div style={{ height: '4px' }} />
                                        <Skeleton width="100px" height="14px" />
                                    </div>
                                    <Skeleton width="80px" height="24px" borderRadius="12px" />
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                    <Skeleton width="16px" height="16px" borderRadius="50%" />
                                    <Skeleton width="120px" height="16px" />
                                </div>
                                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Skeleton width="40px" height="12px" />
                                        <div style={{ height: '4px' }} />
                                        <Skeleton width="80px" height="16px" />
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Skeleton width="40px" height="12px" />
                                        <div style={{ height: '4px' }} />
                                        <Skeleton width="80px" height="16px" />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <Skeleton width="100px" height="14px" />
                                        <Skeleton width="30px" height="14px" />
                                    </div>
                                    <Skeleton width="100%" height="8px" borderRadius="10px" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                    <Skeleton width="100px" height="16px" />
                                    <Skeleton width="80px" height="16px" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="st-sales-container">
            <div className="st-sales-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>My Projects</h2>
                        <p style={{ margin: '4px 0 0', color: '#64748b' }}>Track and manage your active sales projects and their pipeline progress.</p>
                    </div>
                </div>

                <div className="st-sales-controls" style={{ marginBottom: '24px' }}>
                    <div className="st-sales-search-wrap" style={{ flex: 1, maxWidth: '400px' }}>
                        <Search size={15} className="st-sales-search-icon" />
                        <input
                            type="text"
                            className="st-sales-search"
                            placeholder="Search projects by name, ID, or client…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="st-sales-empty">
                        <div className="st-sales-empty-icon">
                            <Target size={26} />
                        </div>
                        <h3>No projects found</h3>
                        <p>Create a new quotation to get started.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {filtered.map(proj => {
                            const stageColors = { Accounts: '#f59e0b', Design: '#8b5cf6', Procurement: '#f59e0b', Production: '#3b82f6', Completed: '#10b981' };
                            const stageColor = stageColors[proj.stage] || '#64748b';
                            
                            return (
                                <div
                                    key={proj._id}
                                    style={{
                                        background: 'white',
                                        border: '1px solid',
                                        borderColor: proj.pendingReviewTask ? '#f87171' : '#e2e8f0',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        borderTop: `4px solid ${proj.pendingReviewTask ? '#ef4444' : stageColor}`,
                                        boxShadow: proj.pendingReviewTask ? '0 4px 12px rgba(239,68,68,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = proj.pendingReviewTask ? '0 12px 24px rgba(239,68,68,0.15)' : '0 12px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = proj.pendingReviewTask ? '0 4px 12px rgba(239,68,68,0.1)' : '0 2px 4px rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    {proj.pendingReviewTask && (
                                        <div style={{ position: 'absolute', top: '-12px', right: '16px', background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(239,68,68,0.3)' }}>
                                            <AlertTriangle size={12} />
                                            Action Required
                                        </div>
                                    )}
                                    <div onClick={() => navigate(`/staff/projects/${proj._id}`)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>{proj.quotation?.projectName || proj.name}</h3>
                                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{proj.projectNumber}</p>
                                            </div>
                                            <span style={{ background: stageColor + '15', color: stageColor, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 700 }}>
                                                {proj.stage}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: '#475569', fontWeight: 500 }}>
                                            <Building2 size={16} color="#94a3b8" />
                                            <span>{proj.client?.name || 'Unknown Client'}</span>
                                        </div>
                                        
                                        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Value</p>
                                                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>₹{(proj.budget || proj.quotation?.totalAmount || 0).toLocaleString('en-IN')}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Payment</p>
                                                <p style={{ margin: 0, fontWeight: 600, color: proj.paymentStatus === 'Cleared' ? '#10b981' : '#f59e0b' }}>{proj.paymentStatus || 'Pending'}</p>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                                                <span>Overall Progress</span>
                                                <span style={{ color: stageColor }}>{proj.progress || 0}%</span>
                                            </div>
                                            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${proj.progress || 0}%`, background: stageColor, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                                                Status: <span style={{ color: '#0f172a' }}>{proj.status || 'In Progress'}</span>
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6366f1', fontSize: '13px', fontWeight: 600 }}>
                                                View Details <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {proj.pendingReviewTask && (
                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
                                            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0', fontWeight: 600 }}>
                                                <span style={{ color: '#ef4444' }}>Pending Review:</span> {proj.pendingReviewTask.title}
                                            </p>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    onClick={(e) => handleSalesReview(e, proj.pendingReviewTask._id, true)}
                                                    style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={(e) => handleSalesReview(e, proj.pendingReviewTask._id, false)}
                                                    style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesTasks;
