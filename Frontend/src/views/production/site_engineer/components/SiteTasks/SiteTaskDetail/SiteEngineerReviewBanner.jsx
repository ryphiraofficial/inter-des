import React from 'react';
import { Loader2 } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../../../config/constants';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const SiteEngineerReviewBanner = ({ 
    localTask, user, reviewNote, setReviewNote, 
    reviewImages, uploadImage, removeImage, 
    uploadingReviewFile, statusSaving, handleReviewAction 
}) => {
    if (!(user?.role === 'Site Engineer' && localTask.status === 'Completed' && localTask.stage === 'SE')) {
        return null;
    }

    return (
        <div className="site-review-card" style={{ borderLeft: '4px solid #10b981', marginBottom: 20 }}>
            <div className="site-card-header" style={{ background: '#d1fae5', color: '#065f46', borderBottom: '1px solid #a7f3d0' }}>
                <div className="site-card-title">🛡 Site Engineer Review Portal</div>
            </div>
            <div style={{ padding: 20 }}>
                <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}>
                    <strong>Site Supervisor</strong> has submitted this task as completed. Please review the completion note, comments, and uploaded photos below. Select to Approve and promote to Project Engineer review, or Send Back with feedback.
                </p>
                
                <div style={{ background: '#f0fdf4', border: '1px dashed #6ee7b7', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                        📋 Supervisor Completion Details
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '3px' }}>Completion Note:</span>
                        <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', fontStyle: 'italic', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                            "{localTask.updates?.slice().reverse().find(u => !u.note?.includes('by Site Engineer') && !u.note?.includes('by Project Engineer') && !u.note?.includes('by Project Manager'))?.note || 'No completion note provided.'}"
                        </p>
                    </div>
                    {localTask.updates?.some(up => up.images?.length > 0 && !up.note?.includes('by Site Engineer')) ? (
                        <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Attached Completion Photos:</span>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {localTask.updates.flatMap((up) => 
                                    (!up.note?.includes('by Site Engineer') ? (up.images || []) : []).map((img, imgIdx) => (
                                        <div key={imgIdx} style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', background: '#fff' }}>
                                            <img src={getImageUrl(img)} alt="Supervisor completion snap" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(getImageUrl(img), '_blank')} title="Click to view full size" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: '12.5px', color: '#6b7280', fontStyle: 'italic' }}>No photos uploaded.</div>
                    )}
                </div>
                
                <div className="site-form-group" style={{ marginBottom: 16 }}>
                    <label className="site-label" style={{ fontWeight: 600, color: '#475569', fontSize: 12 }}>FEEDBACK / REVIEW NOTE</label>
                    <textarea 
                        className="site-input" rows={2} value={reviewNote} onChange={e => setReviewNote(e.target.value)}
                        placeholder="Add approval comments or feedback for rejection..."
                    />
                </div>
                
                <div className="site-form-group" style={{ marginBottom: 16 }}>
                    <label className="site-label" style={{ fontWeight: 600, color: '#475569', fontSize: 12 }}>ADD REVIEW / INSPECTION PHOTOS</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                        <input 
                            id="se-review-image-upload" type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], true)}
                        />
                        <label 
                            htmlFor="se-review-image-upload" className="site-btn-secondary"
                            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12.5px', fontWeight: 600, border: '1.5px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', color: '#475569' }}
                        >
                            {uploadingReviewFile ? <Loader2 size={13} className="site-spin" /> : '📁 Select inspection Photo File'}
                        </label>
                    </div>
                    {reviewImages.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Selected review photos ({reviewImages.length}):</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {reviewImages.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: 50, height: 50, borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                        <img src={getImageUrl(url)} alt="Attached review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => removeImage(url, true)} style={{ position: 'absolute', top: 1, right: 1, background: 'rgba(239, 68, 68, 0.95)', color: '#fff', border: 'none', borderRadius: '50%', width: 14, height: 14, fontSize: 8, cursor: 'pointer' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="site-btn-primary" disabled={statusSaving} onClick={() => handleReviewAction('Completed', 'Approved')}>✔ Approve & Elevate to PE</button>
                    <button className="site-btn-danger" disabled={statusSaving} onClick={() => handleReviewAction('In Progress', 'Rejected')}>✘ Send Back to Supervisor</button>
                </div>
            </div>
        </div>
    );
};

export default SiteEngineerReviewBanner;
