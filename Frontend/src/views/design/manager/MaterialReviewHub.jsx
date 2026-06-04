import React, { useState, useEffect } from 'react';
import { 
    Tag, Package, Eye, Check, X, 
    ArrowRight, Clock, User, Briefcase,
    FileText, AlertCircle, CheckCircle, List
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../config/constants';
import { useGetProjectsQuery, useGetStaffQuery } from '../../../store/api/adminApi';
import { useGetMaterialRequestsQuery, useUpdateMaterialRequestMutation } from '../../../store/api/procurementApi';
import { useCreateNotificationMutation } from '../../../store/api/sharedApi';
import DesignSkeleton from './DesignSkeleton';
import MaterialReviewModal from './components/MaterialReviewModal';
import ProjectRequestsTable from './components/ProjectRequestsTable';
import '../css/Dashboard.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const MaterialReviewHub = ({}) => {
    const user = useAppSelector(selectUser);
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };
    const { data: projRes, isLoading: projLoading } = useGetProjectsQuery({ limit: 100 });
    const { data: staffRes, isLoading: staffLoading } = useGetStaffQuery();
    const { data: matRes, isLoading: matLoading } = useGetMaterialRequestsQuery({ limit: 100 });
    
    const [updateMaterialRequest] = useUpdateMaterialRequestMutation();
    const [createNotification] = useCreateNotificationMutation();

    const projects = projRes?.data || [];
    const staffList = staffRes?.data || [];
    const materialRequests = matRes?.data || [];
    const loading = projLoading || staffLoading || matLoading;

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRemarks, setReviewRemarks] = useState('');
    const isManager = user?.role?.toLowerCase().includes('manager') || user?.role?.toLowerCase().includes('admin');

    const handleReviewRequest = async (status) => {
        if (!selectedRequest) return;
        try {
            await updateMaterialRequest({
                id: selectedRequest._id,
                status,
                managerRemarks: reviewRemarks
            }).unwrap();

            // Notify the Designer
            await createNotification({
                title: `Material Request ${status}`,
                description: `Your request ${selectedRequest.requestNumber} for "${selectedRequest.project?.name}" has been ${status}. ${reviewRemarks}`,
                type: status === 'Approved' ? 'Success' : 'Error',
                recipient: selectedRequest.requestedBy?._id || selectedRequest.requestedBy,
                relatedModel: 'MaterialRequest',
                relatedId: selectedRequest._id
            }).unwrap();

            setShowReviewModal(false);
            setSelectedRequest(null);
            setReviewRemarks('');
        } catch (err) {
            alert('Failed to review request: ' + err.message);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        return `₹${amount.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="role-dashboard fade-in">
                <main style={{ flex: 1 }}>
                    <DesignSkeleton />
                </main>
            </div>
        );
    }

    // Filter requests for staff to see only their own, or manager to see all
    const filteredRequests = isManager 
        ? materialRequests 
        : materialRequests.filter(r => (r.requestedBy?._id || r.requestedBy) === user?._id);

    return (
        <div className="review-hub-page">
            <div className="hub-page-header">
                <div className="hub-header-left">
                    <h1>
                        <div className="hub-icon-wrapper">
                            <Package size={24} color="#4f46e5" />
                        </div>
                        Material Review Hub
                    </h1>
                    <p>
                        {isManager 
                            ? 'Approve or reject material requests from the design team' 
                            : 'Track the status of your material submissions'}
                    </p>
                </div>
                <div className="hub-stats">
                    <div className="hub-stat-item pending">
                        <span className="stat-value">{filteredRequests.filter(r => r.status === 'Pending').length}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="hub-stat-item approved">
                        <span className="stat-value">{filteredRequests.filter(r => r.status === 'Approved').length}</span>
                        <span className="stat-label">Approved</span>
                    </div>
                </div>
            </div>

            <div className="grouped-content">
                {(() => {
                    // Group requests by project
                    const groups = filteredRequests.reduce((acc, req) => {
                        const projectId = (req.project?._id || req.project || 'unassigned').toString();
                        if (!acc[projectId]) {
                            acc[projectId] = {
                                project: req.project && typeof req.project === 'object' ? req.project : projects.find(p => p._id === projectId),
                                requests: []
                            };
                        }
                        acc[projectId].requests.push(req);
                        return acc;
                    }, {});

                    return Object.entries(groups).map(([projectId, group]) => {
                        const project = group.project;
                        const projectName = project?.name || 'Unknown Project';
                        const projectRequests = group.requests;

                        return (
                            <div key={projectId} className="project-review-group" style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '2rem', overflow: 'hidden' }}>
                                <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ background: '#eef2ff', padding: '8px', borderRadius: '8px' }}>
                                            <Briefcase size={18} color="#4f46e5" />
                                        </div>
                                        <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{projectName}</strong>
                                    </div>
                                    <span className="badge-outline">{projectRequests.length} Requests</span>
                                </div>
                                
                                <ProjectRequestsTable 
                                    projectRequests={projectRequests} 
                                    setSelectedRequest={setSelectedRequest} 
                                    setShowReviewModal={setShowReviewModal} 
                                />
                            </div>
                        );
                    });
                })()}
            </div>

            {/* ── Modal for Details & Review ── */}
            {showReviewModal && selectedRequest && (
                <MaterialReviewModal 
                    selectedRequest={selectedRequest}
                    isManager={isManager}
                    reviewRemarks={reviewRemarks}
                    setReviewRemarks={setReviewRemarks}
                    handleReviewRequest={handleReviewRequest}
                    setShowReviewModal={setShowReviewModal}
                />
            )}
        </div>
    );
};

export default MaterialReviewHub;
