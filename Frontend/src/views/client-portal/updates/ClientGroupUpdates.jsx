import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquareText, AlertTriangle, Clock } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import { selectToken } from '../../../store/slices/authSlice';
import { useToast } from '../../../models/context/ToastContext';
import './ClientGroupUpdates.css';

const ClientGroupUpdates = () => {
    const token = useAppSelector(selectToken);
    const { showToast } = useToast();
    
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectedProjectId = useAppSelector(state => state.clientPortal.selectedProjectId);

    useEffect(() => {
        const fetchUpdates = async () => {
            if (!selectedProjectId) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/client/updates?projectId=${selectedProjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setUpdates(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching updates:", error);
                showToast('Failed to load project updates', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchUpdates();
    }, [token, showToast, selectedProjectId]);

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const formatFullDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading) {
        return (
            <div className="client-updates-page">
                <div className="client-page-header">
                    <h1 className="client-page-title">Group Updates</h1>
                    <p className="client-page-subtitle">Loading project feed...</p>
                </div>
                <div className="client-updates-feed">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="client-update-item">
                            <div className="client-update-avatar-wrapper" style={{ background: '#e2e8f0' }}></div>
                            <div className="client-skeleton-box client-update-card" style={{ height: '120px' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="client-updates-page">
            <div className="client-page-header">
                <h1 className="client-page-title">Group Updates</h1>
                <p className="client-page-subtitle">Real-time daily progress from your project team</p>
            </div>

            {updates.length === 0 ? (
                <div className="client-empty-state">
                    <div className="client-empty-icon">
                        <MessageSquareText size={32} />
                    </div>
                    <h3 className="client-empty-title">No Updates Yet</h3>
                    <p className="client-empty-desc">When your team posts daily progress or notes, they will appear here in a live feed.</p>
                </div>
            ) : (
                <div className="client-updates-feed">
                    {updates.map(update => (
                        <div key={update._id} className="client-update-item">
                            <div className="client-update-avatar-wrapper">
                                {update.staff?.avatar ? (
                                    <img src={update.staff.avatar} alt={update.staff.fullName} className="client-update-avatar" />
                                ) : (
                                    <span className="client-update-initials">{getInitials(update.staff?.fullName || 'System')}</span>
                                )}
                            </div>
                            
                            <div className="client-update-card">
                                <div className="client-update-header">
                                    <div>
                                        <div className="client-update-author-name">{update.staff?.fullName || 'System'}</div>
                                        <div className="client-update-time" title={formatFullDate(update.createdAt)}>
                                            <Clock size={10} style={{ display: 'inline', marginRight: '3px' }} />
                                            {formatTimeAgo(update.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                <div className="client-update-task-badge">
                                    {update.taskTitle}
                                </div>

                                <div className="client-update-text">
                                    {update.updateText}
                                </div>

                                {update.emergencies && (
                                    <div className="client-update-emergency">
                                        <div className="client-update-emergency-label">
                                            <AlertTriangle size={14} /> Critical Notice
                                        </div>
                                        <div className="client-update-emergency-text">
                                            {update.emergencies}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientGroupUpdates;
