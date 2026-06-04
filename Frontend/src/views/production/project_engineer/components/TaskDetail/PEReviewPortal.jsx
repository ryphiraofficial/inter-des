import React from 'react';
import { Loader2 } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const PEReviewPortal = ({ 
    task, user, reviewNote, setReviewNote, 
    reviewImages, uploadImage, removeImage, uploadingReviewFile,
    statusSaving, handlePEReviewAction 
}) => {
    if (!(user?.role === 'Project Engineer' && task.status === 'Completed' && task.stage === 'PE')) return null;

    return (
        <div className="eng-section-card" style={{ borderLeft: '4px solid #10b981', marginBottom: 20 }}>
            <div className="eng-section-header" style={{ background: '#d1fae5', color: '#065f46', borderBottom: '1px solid #a7f3d0' }}>
                <div className="eng-section-title">🛡 Project Engineer Review Portal</div>
            </div>
            <div style={{ padding: 20 }}>
                <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}>
                    <strong>Site Engineer</strong> has reviewed and approved this task's completion. Please inspect the completion note, update logs, and attached photo gallery, then choose to elevate to Project Manager for final sign-off, or reject back to the Site Engineer.
                </p>
                
                {/* Submission Verification Details for PE */}
                <div style={{ background: '#f0fdf4', border: '1px dashed #10b981', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                        📋 Review & Submission Trail
                    </div>
                    
                    {/* Site Supervisor Completion details */}
                    <div style={{ marginBottom: '12px', borderBottom: '1px solid #d1fae5', paddingBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Site Supervisor Note:</span>
                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#4b5563', fontStyle: 'italic', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                            "{task.updates?.slice().reverse().find(u => u.note && !u.note.includes('Approved by') && !u.note.includes('Rejected by'))?.note || 'No completion note provided.'}"
                        </p>
                    </div>

                    {/* Site Engineer Review details */}
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Site Engineer Feedback:</span>
                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#4b5563', fontStyle: 'italic', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                            "{task.updates?.slice().reverse().find(u => u.note && u.note.includes('Approved by Site Engineer'))?.note || 'No site engineer notes provided.'}"
                        </p>
                    </div>

                    {/* All Submission & Review Gallery */}
                    {task.updates?.some(up => up.images?.length > 0) ? (
                        <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>All Verification Photos:</span>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {task.updates.flatMap((up) => 
                                    (up.images || []).map((img, imgIdx) => (
                                        <div key={imgIdx} style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', background: '#fff' }}>
                                            <img src={getImageUrl(img)} alt="Verification snap" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(getImageUrl(img), '_blank')} title="Click to view full size" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: '12.5px', color: '#6b7280', fontStyle: 'italic' }}>No photos uploaded.</div>
                    )}
                </div>
                
                <div className="eng-form-group" style={{ marginBottom: 16 }}>
                    <label className="eng-label" style={{ fontWeight: 600, color: '#475569', fontSize: 12, display: 'block', marginBottom: 6 }}>PE REVIEW COMMENTS / FEEDBACK</label>
                    <textarea 
                        className="eng-input" rows={2} 
                        value={reviewNote} onChange={e => setReviewNote(e.target.value)}
                        placeholder="Provide PE feedback or approval notes..."
                    />
                </div>

                <div className="eng-form-group" style={{ marginBottom: 20 }}>
                    <label className="eng-label" style={{ fontWeight: 600, color: '#475569', fontSize: 12, display: 'block', marginBottom: 6 }}>ATTACH INSPECTION PHOTOS (OPTIONAL)</label>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div
                            style={{
                                width: '100px', height: '80px',
                                border: '2px dashed #cbd5e1', borderRadius: '8px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                background: uploadingReviewFile ? '#f8fafc' : '#ffffff',
                                cursor: uploadingReviewFile ? 'default' : 'pointer',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {uploadingReviewFile ? (
                                <Loader2 size={24} className="eng-spin" style={{ color: '#10b981' }} />
                            ) : (
                                <>
                                    <span style={{ fontSize: '24px', color: '#94a3b8' }}>+</span>
                                    <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Upload</span>
                                    <input
                                        type="file" accept="image/*"
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                        onChange={e => {
                                            if (e.target.files[0]) uploadImage(e.target.files[0]);
                                            e.target.value = '';
                                        }}
                                    />
                                </>
                            )}
                        </div>
                        {reviewImages && reviewImages.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {reviewImages.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                        <img src={getImageUrl(url)} alt="Review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(url)}
                                            style={{
                                                position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.9)',
                                                color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18,
                                                fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', padding: 0
                                            }}
                                        >×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="eng-btn-primary" disabled={statusSaving} onClick={() => handlePEReviewAction('Completed', 'Approved')}>
                        {statusSaving ? 'Processing...' : '✔ Approve & Elevate to PM'}
                    </button>
                    <button className="eng-btn-danger" disabled={statusSaving} onClick={() => handlePEReviewAction('In Progress', 'Rejected')}>
                        {statusSaving ? 'Processing...' : '✘ Send Back to Site Engineer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PEReviewPortal;
