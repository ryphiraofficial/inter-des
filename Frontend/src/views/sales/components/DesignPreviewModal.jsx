import React, { useState } from 'react';
import { X, FileText, Image, ExternalLink, Package, Clock, MessageSquare, Clipboard } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../config/constants';
import DesignAssetsColumn from './DesignAssetsColumn';
import DesignSpecsColumn from './DesignSpecsColumn';

const DesignPreviewModal = ({ selectedTask, onClose }) => {
    const [imageErrors, setImageErrors] = useState({});

    if (!selectedTask) return null;

    const latestSubmission = selectedTask.submissions?.[selectedTask.submissions.length - 1];
    const files = latestSubmission?.files || [];
    const notes = latestSubmission?.designerNotes || 'No notes provided.';
    const items = latestSubmission?.designItems || [];
    const submissionDate = latestSubmission?.createdAt 
        ? new Date(latestSubmission.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : null;

    const handleImageError = (index) => {
        setImageErrors(prev => ({ ...prev, [index]: true }));
    };

    return (
        <div className="modal-overlay" style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(15, 23, 42, 0.45)', 
            backdropFilter: 'blur(12px)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 1200, 
            padding: '20px'
        }}>
            <div className="modal-content" style={{ 
                background: 'white', 
                borderRadius: '32px', 
                width: '100%', 
                maxWidth: '900px', 
                maxHeight: '85vh', 
                overflowY: 'auto', 
                padding: '2.5rem', 
                position: 'relative', 
                boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.3)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                fontFamily: "'Poppins', sans-serif"
            }}>
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    style={{ 
                        position: 'absolute', 
                        top: '28px', 
                        right: '28px', 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '50%', 
                        width: '40px', 
                        height: '40px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer', 
                        color: '#64748b',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
                >
                    <X size={18} />
                </button>
                
                {/* Header */}
                <div style={{ marginBottom: '2.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ background: '#eef2ff', color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Design Review
                        </span>
                        {submissionDate && (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> {submissionDate}
                            </span>
                        )}
                    </div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                        {selectedTask.title}
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 400 }}>
                        Inspect the submitted assets, designer notes, and materials list below.
                    </p>
                </div>

                {/* Two-Column Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
                    <DesignAssetsColumn 
                        files={files} 
                        imageErrors={imageErrors} 
                        handleImageError={handleImageError} 
                    />
                    <DesignSpecsColumn 
                        notes={notes} 
                        items={items} 
                    />
                </div>
            </div>
        </div>
    );
};

export default DesignPreviewModal;
