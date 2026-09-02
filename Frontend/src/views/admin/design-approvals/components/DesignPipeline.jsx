import React from 'react';
import { CheckCircle, Eye, User, Image as ImageIcon, Sparkles, CheckCheck } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../config/constants';

const DesignPipeline = ({ tasks, setSelectedTask, setShowDesignModal, openApproveModal }) => {
    if (tasks.length === 0) {
        return (
            <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    <CheckCircle size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                    All Caught Up!
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
                    There are no designs currently awaiting your review. New submissions will appear here automatically.
                </p>
                <div style={{
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <CheckCheck size={14} /> Pipeline Active & Up to Date
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '1.25rem' }}>
            {tasks.map((task) => (
                <div key={task._id} className="approval-card" style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ height: '180px', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
                        {task.submissions?.[task.submissions.length - 1]?.files?.some(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? (
                            (() => {
                                const file = task.submissions[task.submissions.length - 1].files.find(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i));
                                const srcUrl = file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`;
                                return (
                                    <img 
                                        src={srcUrl} 
                                        alt="Design Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                );
                            })()
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                                <ImageIcon size={40} strokeWidth={1.5} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>No Visual Assets Preview</span>
                            </div>
                        )}
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
                            {task.submissions?.[task.submissions.length - 1]?.files?.length || 0} Files
                        </div>
                    </div>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{task.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem' }}>
                                    <User size={13} />
                                    <span>{task.assignedTo?.name || 'Designer'}</span>
                                </div>
                            </div>
                            <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '8px', color: '#2563eb' }}>
                                <Sparkles size={16} />
                            </div>
                        </div>

                        <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', margin: '0 0 1rem 0', flex: 1, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {task.submissions?.[task.submissions.length - 1]?.designerNotes || 'No notes provided by designer.'}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Client</span>
                                <span style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>{task.client?.name || 'N/A'}</span>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Submitted</span>
                                <span style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>{new Date(task.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="approval-card-actions" style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => { setSelectedTask(task); setShowDesignModal(true); }}
                                style={{ flex: 1, padding: '9px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#334155', fontWeight: 600, fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                            >
                                <Eye size={15} /> Review Assets
                            </button>
                            <button 
                                onClick={() => openApproveModal(task)}
                                style={{ flex: 1, padding: '9px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)', transition: 'all 0.15s ease' }}
                            >
                                <CheckCircle size={15} /> Approve
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DesignPipeline;
