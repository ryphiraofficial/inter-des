import React from 'react';
import { BASE_IMAGE_URL } from '../../../../../../config/constants';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const CompletedWorkPhotos = ({ localTask }) => {
    if (!localTask.updates?.some(up => up.images?.length > 0)) {
        return null;
    }

    return (
        <div className="site-card" style={{ marginBottom: 20 }}>
            <div className="site-card-header">
                <div className="site-card-title">📸 Completed Work Photos</div>
            </div>
            <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {localTask.updates.flatMap((up, uIdx) => 
                        (up.images || []).map((img, imgIdx) => (
                            <div key={`${uIdx}-${imgIdx}`} style={{ width: 140, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                <img src={getImageUrl(img)} alt="Completed Site Photo" style={{ width: '100%', height: 100, objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(getImageUrl(img), '_blank')} title="Click to view full size" />
                                <div style={{ padding: '6px 10px', fontSize: 10.5, background: '#f8fafc', color: '#64748b', borderTop: '1px solid #f1f5f9' }}>
                                    {up.note || 'Site Photo'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompletedWorkPhotos;
