import React from 'react';
import { ImageIcon, X, FileText, ExternalLink, Package } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../config/constants';

const DesignPreviewModal = ({ selectedTask, setShowDesignModal, handleReject, openApproveModal }) => {
    return (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content-wide design-preview-admin" style={{ maxHeight: '90vh', overflowY: 'auto', background: 'white', borderRadius: '32px' }}>
                <div className="modal-header" style={{ padding: '1.5rem 2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: '#6366f1', color: 'white', padding: '12px', borderRadius: '16px' }}><ImageIcon size={24} /></div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Design Authentication</h2>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{selectedTask.title}</p>
                        </div>
                    </div>
                    <button className="btn-close" onClick={() => setShowDesignModal(false)} style={{ background: '#f1f5f9', borderRadius: '50%', padding: '10px' }}><X size={20} /></button>
                </div>
                
                <div className="modal-body" style={{ padding: '2.5rem' }}>
                    <div className="preview-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem' }}>
                        <div className="preview-assets">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 750, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
                                <ImageIcon size={20} color="#6366f1" /> Submitted Artwork & Assets
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.files?.map((file, i) => {
                                    const isImg = file.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                    return (
                                        <div key={i} style={{ background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                            {isImg ? (
                                                <div style={{ height: '160px', background: '#eee' }}>
                                                    <img src={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ) : (
                                                <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0' }}><FileText size={48} color="#64748b" /></div>
                                            )}
                                            <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 700, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name || `Asset ${i+1}`}</span>
                                                <a href={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} target="_blank" rel="noreferrer" style={{ background: '#eef2ff', color: '#6366f1', padding: '6px', borderRadius: '8px' }}><ExternalLink size={16} /></a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="preview-details">
                            <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 750, margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={20} color="#6366f1" /> Designer's Commentary</h3>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.7' }}>
                                    {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designerNotes || 'No specific notes provided for this submission.'}
                                </p>
                            </div>

                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 750, margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Package size={20} color="#6366f1" /> Bill of Quantities (BOQ)</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designItems?.map((item, i) => (
                                        <div key={i} style={{ padding: '12px 15px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 750, fontSize: '0.9rem', color: '#1e293b' }}>{item.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Spec: {item.size || 'Standard'}</span>
                                            </div>
                                            <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem' }}>
                                                {item.quantity} {item.unit}
                                            </div>
                                        </div>
                                    ))}
                                    {!selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designItems?.length && (
                                        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', padding: '1rem' }}>No item list attached.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer" style={{ padding: '1.5rem 3rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button className="btn-cancel" onClick={() => setShowDesignModal(false)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700 }}>Close Preview</button>
                    <button className="btn-submit" onClick={() => handleReject(selectedTask._id)} style={{ background: '#ef4444', padding: '12px 24px', borderRadius: '12px', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Reject Design</button>
                    <button className="btn-submit" onClick={() => openApproveModal(selectedTask)} style={{ background: '#10b981', padding: '12px 24px', borderRadius: '12px', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Approve for Procurement</button>
                </div>
            </div>
        </div>
    );
};

export default DesignPreviewModal;
