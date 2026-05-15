import React from 'react';
import { CheckCircle, Eye, User, Image as ImageIcon, Sparkles } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../models/api';

const DesignPipeline = ({ tasks, setSelectedTask, setShowDesignModal, openApproveModal }) => {
    if (tasks.length === 0) {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '5rem 2rem', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                <div style={{ width: '80px', height: '80px', background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>All Caught Up!</h3>
                <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>There are no designs currently awaiting your review.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))', gap: '2rem' }}>
            {tasks.map((task) => (
                <div key={task._id} className="approval-card" style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.3s ease', position: 'relative' }}>
                    <div style={{ height: '200px', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                        {task.submissions?.[task.submissions.length - 1]?.files?.some(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? (
                            <img 
                                src={`${BASE_IMAGE_URL}${task.submissions[task.submissions.length - 1].files.find(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i)).url}`} 
                                alt="Design Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#94a3b8' }}>
                                <ImageIcon size={48} strokeWidth={1.5} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>No Visual Assets Preview</span>
                            </div>
                        )}
                        <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {task.submissions?.[task.submissions.length - 1]?.files?.length || 0} Files
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>{task.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                                    <User size={14} />
                                    <span>{task.assignedTo?.name || 'Designer'}</span>
                                </div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <Sparkles size={18} color="#4f46e5" />
                            </div>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', margin: '0 0 1.5rem 0', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {task.submissions?.[task.submissions.length - 1]?.designerNotes || 'No notes provided by designer.'}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Client</span>
                                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{task.client?.name || 'N/A'}</span>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Submitted</span>
                                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{new Date(task.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={() => { setSelectedTask(task); setShowDesignModal(true); }}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#f1f5f9', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                                <Eye size={18} /> Review Assets
                            </button>
                            <button 
                                onClick={() => openApproveModal(task)}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)' }}
                            >
                                <CheckCircle size={18} /> Approve
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DesignPipeline;
