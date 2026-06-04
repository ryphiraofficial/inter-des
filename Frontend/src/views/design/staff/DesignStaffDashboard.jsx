import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Bell, Clock, CheckCircle, Briefcase, AlertCircle, PieChart, Check, Upload, Users
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../config/constants';
import { useUpdateTaskMutation } from '../../../store/api/adminApi';


import DesignSkeleton from '../manager/DesignSkeleton';
import Tasks from './Tasks';

import UploadDesignModal from './components/UploadDesignModal';
import MaterialRequestModal from './components/MaterialRequestModal';
import RevisionsTab from './components/RevisionsTab';
import SubmissionsTab from './components/SubmissionsTab';
import MeetingsPage from '../../common/MeetingsPage';

import { useStaffData } from './hooks/useStaffData';
import { useUploadActions } from './hooks/useUploadActions';
import { useMaterialRequest } from './hooks/useMaterialRequest';

import '../css/StaffDashboard.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const DesignStaffDashboard = ({}) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    // ── Data & Actions ──
    const { tasks, notifications, materialRequests, loading, pendingTasks, revisionTasks, dueSoonTasks, fetchData, markNotifRead } = useStaffData(user);
    const uploadActions = useUploadActions(fetchData);
    const materialActions = useMaterialRequest();

    // ── UI State ──
    const [selectedTask, setSelectedTask] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [updateTask] = useUpdateTaskMutation();

    const getPriorityColor = (p) => ({ Critical: '#dc2626', High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' }[p] || '#94a3b8');

    const handleUpdateTaskStatus = async (taskId, currentStatus) => {
        const nextStatus = currentStatus === 'To Do' ? 'In Progress' : currentStatus;
        if (nextStatus === currentStatus) return;
        try { await updateTask({ id: taskId, status: nextStatus }).unwrap(); fetchData(); } catch (err) { console.error(err); }
    };

    const handleNotifClick = async (notif) => {
        if (!notif.isRead) await markNotifRead(notif._id);
        if (notif.relatedModel === 'Task') navigate('?tab=tasks');
        else if (notif.relatedModel === 'MaterialRequest') navigate('?tab=materials');
    };

    if (loading) {
        return (
            <div className="role-dashboard">
                <DesignSkeleton />
            </div>
        );
    }

    const renderContent = () => {
        if (activeTab === 'overview') return (
            <>
                {/* Welcome Banner */}
                <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '2.5rem', borderRadius: '24px', color: 'white', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(79,70,229,0.2)' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Designer Workspace</h3>
                        <p style={{ fontSize: '1rem', opacity: 0.9, marginTop: '8px', maxWidth: '500px' }}>Welcome back! Track your assignments, manage your design pipeline, and collaborate with the team.</p>
                    </div>
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}><PieChart size={200} /></div>
                </div>

                {/* Due Soon Alert */}
                {dueSoonTasks.length > 0 && (
                    <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1px solid #fde68a', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#f59e0b', padding: '10px', borderRadius: '12px' }}><Clock size={24} color="white" /></div>
                        <div style={{ flex: 1 }}>
                            <strong style={{ color: '#92400e', fontSize: '1.1rem', display: 'block' }}>Daily Update Required!</strong>
                            <span style={{ color: '#b45309', fontSize: '0.9rem' }}>You have {dueSoonTasks.length} task(s) due within 3 days.</span>
                        </div>
                        <button className="btn-primary" style={{ background: '#f59e0b', border: 'none' }} onClick={() => navigate('?tab=tasks')}>View Tasks</button>
                    </div>
                )}

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card design"><div className="stat-icon"><Briefcase size={28} /></div><div className="stat-content"><span className="stat-value">{pendingTasks.length}</span><span className="stat-label">Active Tasks</span></div></div>
                    <div className="stat-card procurement" style={{ borderColor: revisionTasks.length > 0 ? '#ef4444' : '#f1f5f9' }}>
                        <div className="stat-icon" style={{ background: revisionTasks.length > 0 ? '#fef2f2' : '#fffbeb', color: revisionTasks.length > 0 ? '#ef4444' : '#f59e0b' }}><AlertCircle size={28} /></div>
                        <div className="stat-content"><span className="stat-value">{revisionTasks.length}</span><span className="stat-label">Revisions Needed</span></div>
                    </div>
                    <div className="stat-card completed"><div className="stat-icon"><CheckCircle size={28} /></div><div className="stat-content"><span className="stat-value">{tasks.filter(t => t.status === 'Approved').length}</span><span className="stat-label">Approved Designs</span></div></div>
                </div>

                {/* Notifications */}
                <div className="card" style={{ marginTop: '1rem' }}>
                    <div className="card-header"><h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={18} /> Recent Notifications</h3></div>
                    <div className="notifications-feed">
                        {notifications.map(n => (
                            <div key={n._id} className={`notif-item ${n.isRead ? 'read' : 'unread'}`} onClick={() => handleNotifClick(n)}>
                                <div className="notif-content">
                                    <p className="notif-title">{n.title}</p>
                                    <p className="notif-desc">{n.description}</p>
                                    <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                                </div>
                                {!n.isRead && (
                                    <button className="action-btn-mini"
                                        onClick={e => { e.stopPropagation(); markNotifRead(n._id); }}
                                        style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer' }}>
                                        <Check size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {notifications.length === 0 && <div className="empty-state">No new notifications</div>}
                    </div>
                </div>
            </>
        );

        if (activeTab === 'tasks') return (
            <Tasks
                myTasks={pendingTasks}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                getPriorityColor={getPriorityColor}
                onOpenUpload={(task) => { setSelectedTask(task); setShowUploadModal(true); }}
                onOpenMaterial={null} onOpenQuotation={null} user={user}
            />
        );

        if (activeTab === 'revisions') return (
            <RevisionsTab 
                revisionTasks={revisionTasks} 
                user={user} 
                setSelectedTask={setSelectedTask} 
                setShowUploadModal={setShowUploadModal} 
            />
        );

        if (activeTab === 'submissions') return (
            <SubmissionsTab tasks={tasks} />
        );

        if (activeTab === 'meetings') return <MeetingsPage user={user} />;

        return null;
    };

    return (
        <div className="role-dashboard">
            {renderContent()}

            <UploadDesignModal
                show={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                selectedTask={selectedTask}
                uploadData={uploadActions.uploadData}
                setUploadData={uploadActions.setUploadData}
                handleFileUpload={uploadActions.handleFileUpload}
                handleAddDesignItem={uploadActions.handleAddDesignItem}
                handleRemoveDesignItem={uploadActions.handleRemoveDesignItem}
                handleDesignItemChange={uploadActions.handleDesignItemChange}
                handleRemoveFile={uploadActions.handleRemoveFile}
                handleSubmitTask={async (task) => { const ok = await uploadActions.handleSubmitTask(task); if (ok) setShowUploadModal(false); }}
                uploading={uploadActions.uploading}
            />

            <MaterialRequestModal
                show={materialActions.showMaterialModal}
                onClose={() => materialActions.setShowMaterialModal(false)}
                selectedTask={selectedTask}
                materialFormData={materialActions.materialFormData}
                setMaterialFormData={materialActions.setMaterialFormData}
                handleAddExtraItem={materialActions.handleAddExtraItem}
                handleRemoveItem={materialActions.handleRemoveItem}
                handleUpdateItem={materialActions.handleUpdateItem}
                handleSubmitMaterialRequest={materialActions.handleSubmitMaterialRequest}
                submittingMaterial={materialActions.submittingMaterial}
            />
        </div>
    );
};

export default DesignStaffDashboard;
