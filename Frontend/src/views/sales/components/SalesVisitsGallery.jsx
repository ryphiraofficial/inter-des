import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../config/constants';
import Skeleton from './Skeleton';

const SalesVisitsGallery = ({ recentVisits, loading, navigate }) => {
    return (
        <div className="visits-card">
            <div className="section-header">
                <h2 className="section-title">Last Site Visits</h2>
                {!loading && (
                    <button onClick={() => navigate('/staff/site-visits')} className="view-all">
                        Log New <ArrowRight size={14} />
                    </button>
                )}
            </div>
            <div className="visits-grid">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="visit-item">
                            <Skeleton width="100%" height="120px" />
                        </div>
                    ))
                ) : recentVisits.length > 0 ? (
                    recentVisits.map((visit) => (
                        <div key={visit._id} className="visit-item" onClick={() => navigate('/staff/site-visits')}>
                            <div className="visit-image-wrapper">
                                {visit.images && visit.images.length > 0 ? (
                                    <img src={`${BASE_IMAGE_URL}${visit.images[0]}`} alt="Site" onError={(e) => { e.target.style.display = 'none'; }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                                )}
                                <div className="visit-overlay">
                                    <h4>{visit.client?.name || 'Site Visit'}</h4>
                                    <p><Calendar size={10} /> {new Date(visit.visitDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1' }} className="empty-state">
                        <p>No recent site visits logged.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesVisitsGallery;
