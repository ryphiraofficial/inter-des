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
                {/* Premium Welcome Banner */}
                <div className="welcome-banner-premium" style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    borderRadius: '24px',
                    padding: '2rem',
                    color: 'white',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(79, 70, 229, 0.15)'
                }}>
                    <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', pointerEvents: 'none' }}></div>
                    <div style={{ position: 'absolute', bottom: '-40%', right: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.03)', pointerEvents: 'none' }}></div>
                    
                    <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Welcome back, {user?.fullName || 'Designer'}! ✨
                    </h2>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.95rem', fontWeight: 500 }}>
                        Here is a summary of your workspace activities, assigned tasks, and notifications.
                    </p>
                </div>

                {/* Due Soon Alert */}
                {dueSoonTasks.length > 0 && (
                    <div style={{
                        background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                        border: '1px solid #fde68a',
                        padding: '1.25rem 1.5rem',
                        borderRadius: '16px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#f59e0b', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Clock size={20} color="white" />
                            </div>
                            <div>
                                <strong style={{ color: '#92400e', fontSize: '1.05rem', display: 'block', fontWeight: 700 }}>Action Required: Task Deadlines Approaching</strong>
                                <span style={{ color: '#b45309', fontSize: '0.88rem', fontWeight: 500 }}>You have {dueSoonTasks.length} task(s) due within the next 3 days. Please review and update.</span>
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            style={{
                                background: '#f59e0b',
                                border: 'none',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                            onClick={() => navigate('?tab=tasks')}
                        >
                            View Tasks
                        </button>
                    </div>
                )}

                {/* Stats */}
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="stat-card design" style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                        <div className="stat-icon" style={{
                            background: '#eef2ff',
                            color: '#4f46e5',
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}><Briefcase size={28} /></div>
                        <div className="stat-content">
                            <span className="stat-value" style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{pendingTasks.length}</span>
                            <span className="stat-label" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Tasks</span>
                        </div>
                    </div>
                    
                    <div className="stat-card procurement" style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                        border: revisionTasks.length > 0 ? '1px solid #fee2e2' : '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                        <div className="stat-icon" style={{
                            background: revisionTasks.length > 0 ? '#fef2f2' : '#fff9db',
                            color: revisionTasks.length > 0 ? '#ef4444' : '#f59e0b',
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}><AlertCircle size={28} /></div>
                        <div className="stat-content">
                            <span className="stat-value" style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{revisionTasks.length}</span>
                            <span className="stat-label" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Revisions Needed</span>
                        </div>
                    </div>
                    
                    <div className="stat-card completed" style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                        <div className="stat-icon" style={{
                            background: '#f0fdf4',
                            color: '#10b981',
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}><CheckCircle size={28} /></div>
                        <div className="stat-content">
                            <span className="stat-value" style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{tasks.filter(t => t.status === 'Approved').length}</span>
                            <span className="stat-label" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Approved Designs</span>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card" style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    padding: '1.5rem',
                    marginTop: '1.5rem'
                }}>
                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                            <Bell size={20} color="#4f46e5" /> Recent Notifications
                        </h3>
                    </div>
                    <div className="notifications-feed" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {notifications.map(n => (
                            <div
                                key={n._id}
                                className={`notif-item ${n.isRead ? 'read' : 'unread'}`}
                                onClick={() => handleNotifClick(n)}
                                style={{
                                    padding: '1rem 1.25rem',
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: n.isRead ? '#f8fafc' : '#f5f7ff',
                                    borderLeft: n.isRead ? '1px solid #e2e8f0' : '4px solid #4f46e5'
                                }}
                            >
                                <div className="notif-content" style={{ flex: 1 }}>
                                    <p className="notif-title" style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>{n.title}</p>
                                    <p className="notif-desc" style={{ margin: '4px 0', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>{n.description}</p>
                                    <span className="notif-time" style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{new Date(n.createdAt).toLocaleString()}</span>
                                </div>
                                {!n.isRead && (
                                    <button
                                        className="action-btn-mini"
                                        onClick={e => { e.stopPropagation(); markNotifRead(n._id); }}
                                        style={{
                                            background: '#4f46e5',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '6px 12px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontWeight: 600,
                                            boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
                                        }}
                                    >
                                        <Check size={14} /> Dismiss
                                    </button>
                                )}
                            </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="empty-state" style={{
                                padding: '2.5rem',
                                textAlign: 'center',
                                background: '#f8fafc',
                                borderRadius: '16px',
                                color: '#94a3b8',
                                border: '2px dashed #e2e8f0',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}>
                                No new notifications
                            </div>
                        )}
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
