import React from 'react';
import { CheckCircle, Check, Briefcase, Clock } from 'lucide-react';

const FinalizedSection = ({ adminApproval }) => {
    return (
        <div style={{ marginTop: '2rem', padding: '2rem', background: '#f0fdf4', borderRadius: '24px', border: '1px solid #bbf7d0', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <CheckCircle size={24} color="#15803d" />
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#15803d', fontWeight: 800 }}>Approved & Finalized Designs</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {adminApproval.filter(t => t.status === 'Pushed to Procurement' || t.status === 'Admin Approved').map(task => (
                    <div key={task._id} className="pipeline-card completed" style={{ background: '#ffffff', border: '1px solid #dcfce7', boxShadow: '0 4px 15px -5px rgba(0, 0, 0, 0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                        <div className="card-header" style={{ marginBottom: '1rem' }}>
                            <h4 style={{ color: '#064e3b', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{task.title}</h4>
                            <div className="success-pill" style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Check size={14} /> PUSHED
                            </div>
                        </div>
                        <div className="card-info" style={{ marginTop: '12px' }}>
                            <p style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '8px' }}><Briefcase size={16} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                            <p className="time-stamp" style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><Clock size={16} /> Finalized: {new Date(task.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {adminApproval.filter(t => t.status === 'Pushed to Procurement' || t.status === 'Admin Approved').length === 0 && (
                    <div className="empty-col" style={{ gridColumn: '1 / -1', padding: '20px', fontSize: '1rem', background: 'transparent', border: '2px dashed #86efac', color: '#15803d', borderRadius: '12px' }}>No finalized designs yet.</div>
                )}
            </div>
        </div>
    );
};

export default FinalizedSection;
