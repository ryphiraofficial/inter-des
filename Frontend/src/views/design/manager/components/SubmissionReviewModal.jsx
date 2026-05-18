import React from 'react';
import { X, FileText, Package, RefreshCw } from 'lucide-react';

const SubmissionReviewModal = ({
    show, onClose,
    selectedTask, getImageUrl,
    reviewStatus, setReviewStatus,
    managerFeedback, setManagerFeedback,
    onSubmitReview
}) => {
    if (!show || !selectedTask) return null;

    const latestSub = selectedTask.submissions?.[selectedTask.submissions.length - 1];

    return (
        <div className="modal-overlay">
            <div className="modal-content-styled">
                <div className="modal-header">
                    <h3>Review Design Submission: {selectedTask.title}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="submission-details">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5>Current Submission (Latest):</h5>
                            {selectedTask.submissions.length > 1 && (
                                <span style={{ padding: '4px 10px', background: '#fee2e2', color: '#ef4444', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                    Revision #{selectedTask.submissions.length - 1}
                                </span>
                            )}
                        </div>

                        {/* File Gallery */}
                        <div className="files-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                            {latestSub?.files?.map((f, i) => (
                                <a key={i} href={getImageUrl(f.url)} target="_blank" rel="noopener noreferrer" className="file-item"
                                    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', background: '#f8fafc' }}>
                                    <div style={{ height: '90px', width: '100%', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {f.url?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                                            <img src={getImageUrl(f.url)} alt={f.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <FileText size={32} color="#94a3b8" />
                                        )}
                                    </div>
                                    <div style={{ padding: '8px', fontSize: '0.7rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {f.filename}
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Design Items Table */}
                        <div className="design-items" style={{ marginBottom: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                            <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={18} color="#10b981" />
                                <h6 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>Required Items & Materials</h6>
                            </div>
                            <div>
                                {latestSub?.designItems?.length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', background: '#fcfdfe', borderBottom: '1px solid #f1f5f9' }}>
                                                <th style={{ padding: '10px 16px', color: '#64748b', fontWeight: 700 }}>Item Name</th>
                                                <th style={{ padding: '10px 16px', color: '#64748b', fontWeight: 700 }}>Size/Specs</th>
                                                <th style={{ padding: '10px 16px', color: '#64748b', fontWeight: 700 }}>Qty</th>
                                                <th style={{ padding: '10px 16px', color: '#64748b', fontWeight: 700 }}>Unit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {latestSub.designItems.map((item, idx) => (
                                                <tr key={idx} style={{ borderBottom: idx < latestSub.designItems.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                                    <td style={{ padding: '10px 16px', color: '#1e293b', fontWeight: 600 }}>{item.name}</td>
                                                    <td style={{ padding: '10px 16px', color: '#64748b' }}>{item.size || 'N/A'}</td>
                                                    <td style={{ padding: '10px 16px', color: '#1e293b', fontWeight: 700 }}>{item.quantity}</td>
                                                    <td style={{ padding: '10px 16px', color: '#64748b' }}>
                                                        <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{item.unit}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No specific items listed.</div>
                                )}
                            </div>
                        </div>

                        {/* Staff Notes */}
                        <div className="staff-notes" style={{ marginBottom: '1.5rem', padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                            <h6 style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b' }}>Staff Notes:</h6>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{latestSub?.staffNotes || 'No notes provided'}</p>
                        </div>

                        {/* Previous Submissions History */}
                        {selectedTask.submissions.length > 1 && (
                            <div className="history-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                                <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                                    <RefreshCw size={16} /> Previous Submissions & Redo History
                                </h5>
                                <div style={{ marginTop: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                                    {selectedTask.submissions.slice(0, -1).reverse().map((sub, idx) => (
                                        <div key={idx} style={{ marginBottom: '1rem', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <strong style={{ fontSize: '0.8rem' }}>Version {selectedTask.submissions.length - 1 - idx}</strong>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#ef4444', background: '#fff1f2', padding: '6px', borderRadius: '4px' }}>
                                                <strong>Redo Feedback:</strong> {sub.managerFeedback || 'Revision requested'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Review Form */}
                        <div className="review-form">
                            <div className="form-group">
                                <label>Decision</label>
                                <select value={reviewStatus} onChange={e => setReviewStatus(e.target.value)}>
                                    <option value="Approved">Approve & Forward to Sales</option>
                                    <option value="Revision Required">Request Revision (Redo)</option>
                                    <option value="Rejected">Reject</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Feedback / Comments</label>
                                <textarea
                                    placeholder="Add comments for the staff..."
                                    value={managerFeedback}
                                    onChange={e => setManagerFeedback(e.target.value)}
                                    required={reviewStatus === 'Revision Required'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="action-btn" onClick={onClose}>Cancel</button>
                    <button className="action-btn primary" onClick={onSubmitReview}>Submit Review</button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionReviewModal;
