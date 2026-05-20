import React, { useState } from 'react';
import { X, FileText, Image, ExternalLink, Package, Clock, MessageSquare, Clipboard } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../models/api';

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
                    {/* Left Column: Design Assets */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.2px' }}>
                            <Image size={18} color="#6366f1" /> Design Drawings
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {files.map((file, i) => {
                                const isImg = file.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                const hasError = imageErrors[i];
                                
                                return (
                                    <div key={i} style={{ 
                                        background: '#ffffff', 
                                        borderRadius: '20px', 
                                        border: '1px solid #e2e8f0', 
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.006)'
                                    }}>
                                        {isImg && (
                                            <div style={{ height: '220px', background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {!hasError ? (
                                                    <img 
                                                        src={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} 
                                                        alt={file.name || "Design drawing"} 
                                                        onError={() => handleImageError(i)}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    />
                                                ) : (
                                                    <div style={{ 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                                                        color: '#6366f1', 
                                                        gap: '8px' 
                                                    }}>
                                                        <Image size={36} strokeWidth={1.5} />
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Design Asset File</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 700 }}>
                                                    {file.name || `Asset Option ${i + 1}`}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                    {isImg ? 'Image Drawing' : 'Document File'}
                                                </span>
                                            </div>
                                            <a 
                                                href={file.url.startsWith('http') ? file.url : `${BASE_IMAGE_URL}${file.url}`} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                style={{ 
                                                    width: '36px', 
                                                    height: '36px', 
                                                    borderRadius: '10px', 
                                                    background: '#f8fafc', 
                                                    border: '1px solid #e2e8f0', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    color: '#6366f1', 
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                            {files.length === 0 && (
                                <div style={{ 
                                    padding: '3rem 2rem', 
                                    textAlign: 'center', 
                                    background: '#f8fafc', 
                                    borderRadius: '20px', 
                                    border: '1px dashed #cbd5e1', 
                                    color: '#94a3b8', 
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Image size={28} />
                                    <span>No design documents attached.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Notes & Specifications */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        {/* Designer Notes */}
                        <div style={{ 
                            background: '#ffffff', 
                            borderRadius: '20px', 
                            padding: '1.5rem', 
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                        }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', letterSpacing: '-0.1px' }}>
                                <MessageSquare size={16} /> Designer Notes
                            </h3>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '0.875rem', 
                                color: '#475569', 
                                lineHeight: '1.6', 
                                background: '#f8fafc', 
                                padding: '12px 16px', 
                                borderRadius: '12px',
                                borderLeft: '3px solid #6366f1' 
                            }}>
                                {notes}
                            </p>
                        </div>

                        {/* Item Specifications */}
                        <div style={{ 
                            background: '#ffffff', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '20px', 
                            padding: '1.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                        }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', letterSpacing: '-0.1px' }}>
                                <Package size={16} color="#6366f1" /> Item Specifications
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {items.map((item, i) => (
                                    <div key={i} style={{ 
                                        background: '#f8fafc', 
                                        padding: '12px 16px', 
                                        borderRadius: '12px', 
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clipboard size={14} color="#94a3b8" />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span style={{ 
                                            background: '#eef2ff', 
                                            color: '#6366f1', 
                                            fontSize: '0.8rem', 
                                            fontWeight: 700, 
                                            padding: '3px 10px', 
                                            borderRadius: '8px',
                                            border: '1px solid #c7d2fe'
                                        }}>
                                            {item.quantity} {item.unit}
                                        </span>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <div style={{ 
                                        color: '#94a3b8', 
                                        fontSize: '0.85rem', 
                                        textAlign: 'center', 
                                        padding: '2rem 1rem', 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '6px',
                                        border: '1px dashed #cbd5e1',
                                        borderRadius: '12px'
                                    }}>
                                        <Package size={20} strokeWidth={1.5} />
                                        <span>No item list provided.</span>
                                    </div>
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
