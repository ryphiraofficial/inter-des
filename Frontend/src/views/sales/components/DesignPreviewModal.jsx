import React from 'react';
import { X, FileText, Image, ExternalLink, Package } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../models/api';

const DesignPreviewModal = ({ selectedTask, onClose }) => {
    if (!selectedTask) return null;

    return (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="modal-content" style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                    <X size={18} />
                </button>
                
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText color="#6366f1" /> {selectedTask.title}
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Review the design files and item list before presenting to client.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Image size={16} color="#6366f1" /> Design Assets</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.files?.map((file, i) => {
                                const isImg = file.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                return (
                                    <div key={i} style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                        {isImg && (
                                            <div style={{ height: '160px', background: '#eee' }}>
                                                <img src={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 500 }}>{file.name || `File ${i+1}`}</span>
                                            <a href={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}><ExternalLink size={16} /></a>
                                        </div>
                                    </div>
                                );
                            })}
                            {!selectedTask.submissions?.[selectedTask.submissions.length - 1]?.files?.length && (
                                <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#94a3b8', fontSize: '0.9rem' }}>No files attached.</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div style={{ background: '#e0e7ff', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #c7d2fe' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5' }}>
                                <FileText size={14} /> Designer Notes
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#0f172a', lineHeight: '1.6' }}>
                                {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designerNotes || 'No notes provided.'}
                            </p>
                        </div>

                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={14} color="#6366f1" /> Item Specifications
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designItems?.map((item, i) => (
                                    <div key={i} style={{ background: '#e0e7ff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>
                                            <span>{item.name}</span>
                                            <span style={{ color: '#6366f1' }}>{item.quantity} {item.unit}</span>
                                        </div>
                                    </div>
                                ))}
                                {!selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designItems?.length && (
                                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', padding: '1rem', margin: 0 }}>No item list provided.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignPreviewModal;
