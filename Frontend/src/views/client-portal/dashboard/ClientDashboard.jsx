import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '../../../store/hooks';
import { selectUser, selectToken } from '../../../store/slices/authSlice';
import ProjectTimeline from '../components/ProjectTimeline';
import { useToast } from '../../../models/context/ToastContext';
import './ClientDashboard.css';

const ClientDashboard = () => {
    const user = useAppSelector(selectUser);
    const token = useAppSelector(selectToken);
    const { showToast } = useToast();
    
    const [projectData, setProjectData] = useState(null);
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectedProjectId = useAppSelector(state => state.clientPortal.selectedProjectId);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!selectedProjectId) return; // Wait until a project is selected

            setLoading(true);
            try {
                const response = await axios.get(`/api/client/project?projectId=${selectedProjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setProjectData(response.data.data.project);
                    setTimelineEvents(response.data.data.timeline);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                if (error.response?.status === 404) {
                    setProjectData(null);
                } else {
                    showToast('Failed to load project details', 'error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [token, showToast, selectedProjectId]);

    if (loading) {
        return (
            <div className="client-dashboard">
                <div className="client-skeleton-box client-skeleton-banner"></div>
                <div className="client-skeleton-box client-skeleton-card"></div>
                <div className="client-skeleton-box client-skeleton-timeline"></div>
            </div>
        );
    }

    if (!projectData) {
        return (
            <div className="client-dashboard">
                <div className="client-welcome-section">
                    <h1 className="client-welcome-title">Welcome, {user?.name}</h1>
                    <p className="client-welcome-subtitle">We don't have any active projects linked to your number yet.</p>
                </div>
            </div>
        );
    }

    const getStatusClass = (status) => {
        if (status === 'Completed') return 'status-completed';
        if (status === 'Not Started') return 'status-not-started';
        return 'status-in-progress';
    };

    return (
        <div className="client-dashboard">
            <div className="client-welcome-section">
                <h1 className="client-welcome-title">Welcome, {user?.name}</h1>
                <p className="client-welcome-subtitle">Here is the latest status of your interior project.</p>
            </div>

            <div className="client-project-summary">
                <h2 className="client-project-name">{projectData.name}</h2>
                <span className={`client-status-badge ${getStatusClass(projectData.status)}`}>
                    {projectData.status}
                </span>

                <div className="client-progress-wrapper">
                    <div className="client-progress-header">
                        <span>Overall Progress</span>
                        <span>{projectData.progress}%</span>
                    </div>
                    <div className="client-progress-bar-bg">
                        <div 
                            className="client-progress-bar-fill" 
                            style={{ width: `${projectData.progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="client-project-details-grid">
                    <div className="client-detail-item">
                        <span className="client-detail-label">Current Stage</span>
                        <span className="client-detail-value">{projectData.stage || 'Initial'}</span>
                    </div>
                    <div className="client-detail-item">
                        <span className="client-detail-label">Est. Completion</span>
                        <span className="client-detail-value">
                            {projectData.targetEndDate 
                                ? new Date(projectData.targetEndDate).toLocaleDateString() 
                                : 'TBD'}
                        </span>
                    </div>
                </div>
            </div>

            <ProjectTimeline timelineEvents={timelineEvents} />
        </div>
    );
};

export default ClientDashboard;
