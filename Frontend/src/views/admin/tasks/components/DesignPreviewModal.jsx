import React from 'react';
import { X, Image as ImageIcon, ExternalLink, FileText } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../config/constants';

const DesignPreviewModal = ({ show, setShow, selectedTask, handleAdminReview }) => {
    if (!show || !selectedTask) return null;
    return (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content-wide design-preview-admin" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#6366f1', color: 'white', padding: '10px', borderRadius: '14px' }}><ImageIcon size={24} /></div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Design Final Review</h2>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{selectedTask.title}</p>
                        </div>
                    </div>
                    <button className="btn-close" onClick={() => setShow(false)}><X size={20} /></button>
                </div>
                <div className="modal-body" style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                        <div className="preview-assets">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ImageIcon size={18} color="#6366f1" /> Submitted Files
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                                {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.files?.map((file, i) => {
                                    const isImg = file.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                    return (
                                        <div key={i} style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                            {isImg ? (
                                                <div style={{ height: '120px' }}>
                                                    <img src={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ) : (
                                                <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0' }}><FileText size={36} color="#64748b" /></div>
                                            )}
                                            <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name || `Asset ${i+1}`}</span>
                                                <a href={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}><ExternalLink size={14} /></a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="preview-details">
                            <div style={{ background: '#f1f5f9', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0' }}>Designer's Vision</h3>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>{selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designerNotes || 'No specific notes.'}</p>
                            </div>
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0' }}>Material List (BOQ)</h3>
                                {selectedTask.submissions?.[selectedTask.submissions.length - 1]?.designItems?.map((item, i) => (
                                    <div key={i} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600 }}>{item.name}</span><span style={{ color: '#6366f1' }}>{item.quantity} {item.unit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={() => setShow(false)}>Close</button>
                    <button className="btn-submit" onClick={() => { handleAdminReview(selectedTask._id, false); setShow(false); }} style={{ background: '#ef4444' }}>Request Redo</button>
                    <button className="btn-submit" onClick={() => { handleAdminReview(selectedTask._id, true); setShow(false); }} style={{ background: '#10b981' }}>Approve & Finalize</button>
                </div>
            </div>
        </div>
    );
};

export default DesignPreviewModal;
