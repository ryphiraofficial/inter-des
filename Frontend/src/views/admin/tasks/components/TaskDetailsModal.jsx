import React from 'react';
import { X, Calendar, MapPin, Camera } from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import { BASE_IMAGE_URL } from '../../../../config/constants';

const TaskDetailsModal = ({ show, setShow, selectedTask, visitsLoading, taskVisits }) => {
    if (!show || !selectedTask) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content task-details-modal">
                <div className="modal-header">
                    <div className="header-title">
                        <h2>Task Evidence & Progress</h2>
                        <p>{selectedTask.title}</p>
                    </div>
                    <button className="btn-close" onClick={() => setShow(false)}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="task-summary-strip">
                        <div className="summary-item"><span className="label">Assigned To</span><span className="value">{selectedTask.assignedTo?.name || 'Unassigned'}</span></div>
                        <div className="summary-item"><span className="label">Status</span><span className="value-badge">{selectedTask.status}</span></div>
                        <div className="summary-item"><span className="label">Current Progress</span><span className="value">{selectedTask.progress}%</span></div>
                    </div>
                    <section className="evidence-section">
                        <h3 className="section-subtitle">Site Visit Logs & Photos</h3>
                        {visitsLoading ? (
                            <div className="visits-skeleton">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="visit-log-item card skeleton" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                                        <Skeleton width="100%" height="60px" borderRadius="12px" />
                                    </div>
                                ))}
                            </div>
                        ) : taskVisits.length > 0 ? (
                            <div className="visits-timeline">
                                {taskVisits.map((visit) => (
                                    <div key={visit._id} className="visit-log-item card">
                                        <div className="visit-log-header">
                                            <div className="uploader-info">
                                                <div className="avatar">{visit.staff?.name?.charAt(0) || 'S'}</div>
                                                <div className="name-box">
                                                    <span className="staff-name">{visit.staff?.name || 'Staff member'}</span>
                                                    <span className="visit-time">{new Date(visit.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="visit-date-badge"><Calendar size={12} /><span>{new Date(visit.visitDate).toLocaleDateString()}</span></div>
                                        </div>
                                        <div className="visit-log-notes">
                                            <p>{visit.notes || 'No notes provided.'}</p>
                                            {visit.location && <div className="visit-loc"><MapPin size={12} /><span>{visit.location}</span></div>}
                                        </div>
                                        {visit.images && visit.images.length > 0 && (
                                            <div className="visit-log-gallery">
                                                {visit.images.map((img, i) => (
                                                    <div key={i} className="gallery-img">
                                                        <img src={`${BASE_IMAGE_URL}${img}`} alt="Evidence" className="evidence-image" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-evidence-state"><Camera size={40} /><p>No site visit logs uploaded yet.</p></div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
