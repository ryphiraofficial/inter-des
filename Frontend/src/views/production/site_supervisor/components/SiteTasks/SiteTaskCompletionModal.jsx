import React from 'react';
import { Loader2 } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const SiteTaskCompletionModal = ({
    show, onClose,
    completionNote, setCompletionNote,
    selectedImages, 
    uploadingFile, uploadImage, removeImage,
    qaChecked, setQaChecked,
    submitCompletion, statusSaving
}) => {
    if (!show) return null;

    return (
        <div className="site-modal-overlay">
            <div className="site-modal">
                <div className="site-modal-header">
                    <h3>Submit Task Completion & Photos</h3>
                    <button className="site-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="site-modal-body">
                    <div className="site-form-group" style={{ marginBottom: 14 }}>
                        <label className="site-label" style={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>Completion Notes</label>
                        <textarea
                            className="site-input"
                            rows={3}
                            value={completionNote}
                            onChange={e => setCompletionNote(e.target.value)}
                            placeholder="Describe the final status of this task for the Site Engineer's review..."
                        />
                    </div>
                    
                    <div className="site-form-group" style={{ marginBottom: 20 }}>
                        <label className="site-label" style={{ fontWeight: 600, color: '#374151', fontSize: 13, marginBottom: 10, display: 'block' }}>Upload Site Photos</label>
                        <div
                            style={{
                                border: '2px dashed #cbd5e1',
                                borderRadius: '12px',
                                padding: '32px 20px',
                                textAlign: 'center',
                                background: uploadingFile ? '#f8fafc' : '#ffffff',
                                cursor: uploadingFile ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                overflow: 'hidden'
                            }}
                            onDragOver={(e) => { e.preventDefault(); if (!uploadingFile) { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = '#ecfdf5'; } }}
                            onDragLeave={(e) => { e.preventDefault(); if (!uploadingFile) { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff'; } }}
                            onDrop={async (e) => {
                                e.preventDefault();
                                if (uploadingFile) return;
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.background = '#ffffff';
                                const file = e.dataTransfer.files[0];
                                if (file) uploadImage(file, false);
                            }}
                        >
                            {uploadingFile ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
                                    <Loader2 size={36} className="site-spin" style={{ color: '#10b981' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ color: '#334155', fontSize: '14px', fontWeight: 600 }}>Uploading image...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s ease' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ color: '#334155', fontSize: '15px', fontWeight: 600 }}>Click or drag image to upload</span>
                                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>Supports JPG, PNG, WEBP (Max 10MB)</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                        onChange={e => {
                                            if (e.target.files[0]) uploadImage(e.target.files[0], false);
                                            e.target.value = '';
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {selectedImages.length > 0 && (
                        <div style={{ marginTop: 15 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Attached Photos ({selectedImages.length}):</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {selectedImages.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: 54, height: 54, borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                        <img src={getImageUrl(url)} alt="Attached" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(url, false)}
                                            style={{
                                                position: 'absolute', top: 1, right: 1, background: 'rgba(239, 68, 68, 0.95)',
                                                color: '#fff', border: 'none', borderRadius: '50%', width: 15, height: 15,
                                                fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', padding: 0
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <input
                            type="checkbox"
                            id="qa-check"
                            checked={qaChecked}
                            onChange={(e) => setQaChecked(e.target.checked)}
                            style={{ marginTop: 4, width: 16, height: 16, cursor: 'pointer', accentColor: '#10b981' }}
                        />
                        <label htmlFor="qa-check" style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, cursor: 'pointer', userSelect: 'none' }}>
                            <strong style={{ color: '#334155', display: 'block' }}>Quality Assurance Confirmation</strong>
                            I confirm that all work associated with this task has been completed and meets the required quality standards.
                        </label>
                    </div>

                </div>
                <div className="site-modal-footer">
                    <button className="site-btn-secondary" onClick={onClose}>Cancel</button>
                    <button
                        className="site-btn-primary"
                        onClick={submitCompletion}
                        disabled={statusSaving || selectedImages.length === 0 || !qaChecked}
                    >
                        {statusSaving ? 'Submitting...' : 'Submit Completion'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SiteTaskCompletionModal;
