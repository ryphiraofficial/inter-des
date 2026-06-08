import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageCircle, User } from 'lucide-react';
import './ProjectTimeline.css';

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000';

const ProjectTimeline = ({ timelineEvents }) => {
    const [selectedStaff, setSelectedStaff] = useState(null);
    const navigate = useNavigate();

    if (!timelineEvents || timelineEvents.length === 0) {
        return null;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`) : null;

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const handleStaffClick = (staff) => {
        if (staff) setSelectedStaff(staff);
    };

    const closeStaffModal = () => setSelectedStaff(null);

    const handleInternalChatClick = (staff) => {
        // Navigate to the internal chat/messages route (you can change this route as needed)
        navigate(`/client/messages?staffId=${staff._id}`);
        closeStaffModal();
    };

    return (
        <div className="client-timeline-container">
            <h3 className="client-timeline-title">Project Progress</h3>
            <div className="client-timeline">
                {timelineEvents.map((event, index) => (
                    <div 
                        key={event.id || index} 
                        className={`client-timeline-item ${event.status} ${event.assignedStaff ? 'has-staff' : ''}`}
                        onClick={() => event.assignedStaff && handleStaffClick(event.assignedStaff)}
                    >
                        <div className="client-timeline-content">
                            <div className="client-timeline-item-title">{event.title}</div>
                            <div className="client-timeline-item-desc">{event.description}</div>
                            {event.date && (
                                <div className="client-timeline-item-date">
                                    {event.status === 'completed' ? 'Completed on: ' : 'Updated: '} 
                                    {formatDate(event.date)}
                                </div>
                            )}
                            
                            {/* Assigned Staff Mini Profile */}
                            {event.assignedStaff && (
                                <div className="client-timeline-staff-mini">
                                    <div className="client-staff-mini-avatar">
                                        {event.assignedStaff.avatar ? (
                                            <img src={getImageUrl(event.assignedStaff.avatar)} alt={event.assignedStaff.fullName} />
                                        ) : (
                                            <span>{getInitials(event.assignedStaff.fullName)}</span>
                                        )}
                                    </div>
                                    <div className="client-staff-mini-info">
                                        <span className="client-staff-mini-label">Assigned to:</span>
                                        <span className="client-staff-mini-name">{event.assignedStaff.fullName}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Staff Details Modal */}
            {selectedStaff && (
                <div className="client-staff-modal-overlay" onClick={closeStaffModal}>
                    <div className="client-staff-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="client-staff-modal-close" onClick={closeStaffModal}>
                            <X size={20} />
                        </button>
                        
                        <div className="client-staff-modal-header">
                            <div className="client-staff-modal-avatar-large">
                                {selectedStaff.avatar ? (
                                    <img src={getImageUrl(selectedStaff.avatar)} alt={selectedStaff.fullName} />
                                ) : (
                                    <User size={36} color="#94a3b8" />
                                )}
                            </div>
                            <h4 className="client-staff-modal-name">{selectedStaff.fullName}</h4>
                            <span className="client-staff-modal-role">{selectedStaff.role}</span>
                        </div>

                        <div className="client-staff-modal-body">
                            <button 
                                className="client-chat-btn"
                                onClick={() => handleInternalChatClick(selectedStaff)}
                            >
                                <MessageCircle size={20} />
                                Message {selectedStaff.fullName.split(' ')[0]}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectTimeline;
