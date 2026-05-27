import React from 'react';
import { Calendar, CheckCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductionPipeline = ({ handoverProjects, handleHandoverApprove, approving }) => {
    const navigate = useNavigate();

    if (!handoverProjects || handoverProjects.length === 0) {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '5rem 2rem', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                <div style={{ width: '80px', height: '80px', background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={40} />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>All Caught Up!</h3>
                <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>There are no completed production projects awaiting final approval.</p>
            </div>
        );
    }

    return (
        <div className="pipeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {handoverProjects.map((project) => (
                <div key={project._id} className="approval-card" style={{ background: '#fff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Production Complete
                            </span>
                            <h3 style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '1.1rem', color: '#1e293b' }}>
                                {project.name}
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                #{project.projectNumber}
                            </p>
                        </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Calendar size={16} color="#64748b" />
                            <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                                Client: <span style={{ fontWeight: 600 }}>{project.client?.name || 'N/A'}</span>
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={16} color="#10b981" />
                            <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                                Stage: <span style={{ fontWeight: 600 }}>{project.stage}</span>
                            </span>
                        </div>
                    </div>

                    <div className="approval-card-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button
                            onClick={() => navigate(`/projects/${project._id}`)}
                            style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#1e293b', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
                        >
                            <Eye size={18} /> View Details
                        </button>
                        <button 
                            className="btn-primary" 
                            style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: approving[project._id] ? 'not-allowed' : 'pointer', opacity: approving[project._id] ? 0.7 : 1 }}
                            onClick={() => handleHandoverApprove(project._id)}
                            disabled={approving[project._id]}
                        >
                            {approving[project._id] ? 'Approving...' : (
                                <>
                                    <CheckCircle size={18} /> Approve Handover
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductionPipeline;
