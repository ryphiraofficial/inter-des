import React from 'react';
import { Eye } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../config/constants';

const ProjectRequestsTable = ({ projectRequests, setSelectedRequest, setShowReviewModal }) => {
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="requests-table-container">
            <table className="requests-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#fcfcfc', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                        <th style={{ padding: '1rem 1.5rem' }}>Request ID</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Designer</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Items</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Created</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projectRequests.map(req => (
                        <tr key={req._id} className="responsive-tr">
                            <td data-label="Request ID" className="responsive-td id-cell">{req.requestNumber}</td>
                            <td data-label="Designer" className="responsive-td">
                                <div className="designer-info-small">
                                    <div className="avatar-mini">
                                        {req.requestedBy?.avatar ? <img src={getImageUrl(req.requestedBy.avatar)} alt="" /> : (req.requestedBy?.fullName?.[0] || 'S')}
                                    </div>
                                    <span>{req.requestedBy?.fullName || 'Staff'}</span>
                                </div>
                            </td>
                            <td data-label="Items" className="responsive-td">
                                <span className="items-count">{req.items?.length || 0} materials</span>
                            </td>
                            <td data-label="Status" className="responsive-td">
                                <span className={`status-pill ${req.status.toLowerCase()}`}>{req.status}</span>
                            </td>
                            <td data-label="Created" className="responsive-td date-cell">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                            <td className="responsive-td action-cell">
                                <button 
                                    className="btn-icon" 
                                    onClick={() => { setSelectedRequest(req); setShowReviewModal(true); }}
                                >
                                    <Eye size={18} /> Review Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectRequestsTable;
