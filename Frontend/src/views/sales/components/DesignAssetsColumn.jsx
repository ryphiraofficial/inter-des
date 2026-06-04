import React from 'react';
import { Image, ExternalLink } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../config/constants';

const DesignAssetsColumn = ({ files, imageErrors, handleImageError }) => {
    return (
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
    );
};

export default DesignAssetsColumn;
