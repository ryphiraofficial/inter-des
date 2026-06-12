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
import StaffReports from '../../common/StaffReports';

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
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem', marginBottom: '2.5rem' }}>
                    <div className="stat-card design" style={{
                        background: 'white',
                        padding: '1.75rem',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        border: '1px solid #e2e8f0',
                        borderTop: '5px solid #4f46e5',
                        boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.04), 0 8px 10px -6px rgba(79, 70, 229, 0.04)',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div className="stat-icon" style={{
                            background: '#f0f3ff',
                            color: '#4f46e5',
                            width: '60px',
                            height: '60px',
                            borderRadius: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px -6px rgba(79, 70, 229, 0.2)'
                        }}><Briefcase size={28} /></div>
                        <div className="stat-content">
                            <span className="stat-value" style={{ display: 'block', fontSize: '2.2rem', fontWeight: 850, color: '#0f172a', letterSpacing: '-0.03em' }}>{pendingTasks.length}</span>
                            <span className="stat-label" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Tasks</span>
                        </div>
                    </div>
                    
                    <div className="stat-card procurement" style={{
                        background: 'white',
                        padding: '1.75rem',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        border: '1px solid #e2e8f0',
                        borderTop: revisionTasks.length > 0 ? '5px solid #ef4444' : '5px solid #f59e0b',
                        boxShadow: revisionTasks.length > 0
                            ? '0 10px 25px -5px rgba(239, 68, 68, 0.04), 0 8px 10px -6px rgba(239, 68, 68, 0.04)'
                            : '0 10px 25px -5px rgba(245, 158, 11, 0.04), 0 8px 10px -6px rgba(245, 158, 11, 0.04)',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div className="stat-icon" style={{
                            background: revisionTasks.length > 0 ? '#fef2f2' : '#fff9db',
                            color: revisionTasks.length > 0 ? '#ef4444' : '#f59e0b',
                            width: '60px',
                            height: '60px',
                            borderRadius: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: revisionTasks.length > 0
                                ? '0 8px 20px -6px rgba(239, 68, 68, 0.2)'
                                : '0 8px 20px -6px rgba(245, 158, 11, 0.2)'
                        }}><AlertCircle size={28} /></div>
                        <div className="stat-content">
                            <span className="stat-value" style={{ display: 'block', fontSize: '2.2rem', fontWeight: 850, color: '#0f172a', letterSpacing: '-0.03em' }}>{revisionTasks.length}</span>
                            <span className="stat-label" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revisions Needed</span>
                        </div>
                    </div>
                    
                    <div className="stat-card completed" style={{
                        background: 'white',
                        padding: '1.75rem',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        border: '1px solid #e2e8f0',
                        borderTop: '5px solid #10b981',
                        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.04), 0 8px 10px -6px rgba(16, 185, 129, 0.04)',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div className="stat-icon" style={{
                            background: '#f0fdf4',
                            color: '#10b981',
                            width: '60px',
                            height: '60px',
                            borderRadius: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.2)'
                        }}><CheckCircle size={28} /></div>
                        <div className="stat-content">
                            <span className="stat-value" style={{ display: 'block', fontSize: '2.2rem', fontWeight: 850, color: '#0f172a', letterSpacing: '-0.03em' }}>{tasks.filter(t => t.status === 'Approved').length}</span>
                            <span className="stat-label" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approved Designs</span>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card" style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.06)',
                    padding: '2rem',
                    marginTop: '2rem'
                }}>
                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                            <Bell size={22} color="#4f46e5" /> Recent Workspace Activity
                        </h3>
                    </div>
                    <div className="notifications-feed" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map(n => {
                            const isReassigned = n.title?.toLowerCase().includes('reassigned') || n.description?.toLowerCase().includes('reassign');
                            const isApproved = n.title?.toLowerCase().includes('approved') || n.description?.toLowerCase().includes('approve');
                            const isRejected = n.title?.toLowerCase().includes('rejected') || n.description?.toLowerCase().includes('reject');
                            
                            let borderLeftColor = '#e2e8f0';
                            let iconBg = '#f1f5f9';
                            let iconColor = '#64748b';
                            let IconComponent = Bell;

                            if (!n.isRead) {
                                if (isReassigned || isRejected) {
                                    borderLeftColor = '#ef4444';
                                    iconBg = '#fef2f2';
                                    iconColor = '#ef4444';
                                    IconComponent = AlertCircle;
                                } else if (isApproved) {
                                    borderLeftColor = '#10b981';
                                    iconBg = '#f0fdf4';
                                    iconColor = '#10b981';
                                    IconComponent = CheckCircle;
                                } else {
                                    borderLeftColor = '#4f46e5';
                                    iconBg = '#f0f3ff';
                                    iconColor = '#4f46e5';
                                    IconComponent = Briefcase;
                                }
                            }

                            return (
                                <div
                                    key={n._id}
                                    className={`notif-item ${n.isRead ? 'read' : 'unread'}`}
                                    onClick={() => handleNotifClick(n)}
                                    style={{
                                        padding: '1.25rem 1.5rem',
                                        borderRadius: '20px',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        gap: '1.25rem',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        background: n.isRead ? '#ffffff' : '#f8faff',
                                        borderLeft: n.isRead ? '1px solid #e2e8f0' : `5px solid ${borderLeftColor}`,
                                        boxShadow: n.isRead ? 'none' : '0 4px 15px -3px rgba(79, 70, 229, 0.05)'
                                    }}
                                >
                                    <div style={{
                                        background: iconBg,
                                        color: iconColor,
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <IconComponent size={22} />
                                    </div>
                                    <div className="notif-content" style={{ flex: 1 }}>
                                        <p className="notif-title" style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>{n.title}</p>
                                        <p className="notif-desc" style={{ margin: '6px 0 8px 0', fontSize: '0.9rem', color: '#334155', fontWeight: 500, lineHeight: '1.5' }}>{n.description}</p>
                                        <span className="notif-time" style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{new Date(n.createdAt).toLocaleString()}</span>
                                    </div>
                                    {!n.isRead && (
                                        <button
                                            className="action-btn-mini"
                                            onClick={e => { e.stopPropagation(); markNotifRead(n._id); }}
                                            style={{
                                                background: '#f1f5f9',
                                                color: '#475569',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                padding: '8px 14px',
                                                fontSize: '0.78rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontWeight: 700,
                                                transition: 'all 0.2s',
                                                whiteSpace: 'nowrap'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                                        >
                                            <Check size={14} /> Mark Read
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {notifications.length === 0 && (
                            <div className="empty-state" style={{
                                padding: '3.5rem 2rem',
                                textAlign: 'center',
                                background: '#f8fafc',
                                borderRadius: '20px',
                                color: '#94a3b8',
                                border: '2px dashed #e2e8f0',
                                fontSize: '0.92rem',
                                fontWeight: 600
                            }}>
                                No recent notifications. All caught up!
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
        
        if (activeTab === 'reports') return <StaffReports />;

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
