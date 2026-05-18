import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Bell, Clock, CheckCircle, Briefcase, AlertCircle, PieChart, Check, Upload, Users
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../models/api';
import { taskAPI } from '../../../models/api';


import DesignSkeleton from '../manager/DesignSkeleton';
import Tasks from './Tasks';

import UploadDesignModal from './components/UploadDesignModal';
import MaterialRequestModal from './components/MaterialRequestModal';

import { useStaffData } from './hooks/useStaffData';
import { useUploadActions } from './hooks/useUploadActions';
import { useMaterialRequest } from './hooks/useMaterialRequest';

import '../css/StaffDashboard.css';

const DesignStaffDashboard = ({ user }) => {
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

    const getPriorityColor = (p) => ({ Critical: '#dc2626', High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' }[p] || '#94a3b8');

    const handleUpdateTaskStatus = async (taskId, currentStatus) => {
        const nextStatus = currentStatus === 'To Do' ? 'In Progress' : currentStatus;
        if (nextStatus === currentStatus) return;
        try { await taskAPI.update(taskId, { status: nextStatus }); fetchData(); } catch (err) { console.error(err); }
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
                taskAPI={taskAPI}
                onOpenUpload={(task) => { setSelectedTask(task); setShowUploadModal(true); }}
                onOpenMaterial={null} onOpenQuotation={null} user={user}
            />
        );

        if (activeTab === 'revisions') return (
            <div>
                <div className="task-board-header"><h2>Revision Requests</h2></div>
                <div className="board-lists" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
                    <div className="board-column">
                        <div className="col-header"><span>Needs Revision</span><span className="count">{revisionTasks.length}</span></div>
                        <div className="queue-list">
                            {revisionTasks.map(task => {
                                const isReassigned = task.timeline?.some(t => t.action === 'reassigned');
                                const isSplit = task.assignedTo?.length > 1;
                                const splitWith = task.assignedTo?.filter(s => s.email !== user?.email).map(s => s.name).join(', ');
                                return (
                                    <div key={task._id} className="queue-item" style={{ borderColor: '#ef4444' }}>
                                        <div className="queue-info">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                <strong className="text-error">{task.title}</strong>
                                                {isReassigned && <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #ffedd5' }}>REASSIGNED</span>}
                                                {isSplit && <span style={{ background: '#f0f9ff', color: '#0369a1', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #e0f2fe' }}>SPLIT</span>}
                                            </div>
                                            {task.project && <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}><Briefcase size={12} /> {task.project.projectName}</div>}
                                            {isSplit && splitWith && <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}><Users size={12} /> Split with: <strong>{splitWith}</strong></div>}
                                            <div style={{ marginTop: '0.8rem', background: '#fff', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px' }}>
                                                <strong>Manager Feedback:</strong>
                                                <p style={{ margin: '4px 0 0 0' }}>{task.submissions?.[task.submissions.length - 1]?.managerFeedback || 'Redo carefully'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                                            <button className="btn-save-boq" style={{ backgroundColor: '#ef4444', border: 'none' }} onClick={() => { setSelectedTask(task); setShowUploadModal(true); }}>
                                                <Upload size={16} /> Re-submit
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );

        if (activeTab === 'submissions') {
            const finalizedStatuses = ['Approved', 'Completed', 'Pushed to Procurement', 'Pending Sales Review', 'Sales Approved', 'Pending Admin Review', 'Admin Rejected'];
            const getStatusStyle = (status) => {
                const map = {
                    'Pending Sales Review': { background: '#dbeafe', color: '#1e40af' },
                    'Sales Approved': { background: '#f0fdf4', color: '#15803d' },
                    'Pending Admin Review': { background: '#fef3c7', color: '#92400e' },
                    'Admin Rejected': { background: '#fee2e2', color: '#b91c1c' },
                    'Pushed to Procurement': { background: '#dcfce7', color: '#15803d' },
                    'Approved': { background: '#f0f9ff', color: '#0369a1' },
                };
                return map[status] || { background: '#f1f5f9', color: '#475569' };
            };
            const getStatusLabel = (status) => ({
                'Pushed to Procurement': 'Procurement Ready',
                'Pending Sales Review': 'Sales Review',
                'Pending Admin Review': 'With Superadmin',
            }[status] || status);

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Finalized */}
                    <div className="project-detail-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div className="pd-header" style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <div className="pd-title">
                                <strong style={{ color: '#15803d' }}><CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Finalized Designs & Approvals</strong>
                                <span style={{ display: 'block', marginTop: '4px' }}>Track your designs through Manager, Sales, and Superadmin review.</span>
                            </div>
                        </div>
                        <table className="tag-table" style={{ margin: 0 }}>
                            <thead><tr><th>Task Title</th><th>Approved Date</th><th>Status</th><th>Designs</th><th>Notes</th></tr></thead>
                            <tbody>
                                {tasks.filter(t => finalizedStatuses.includes(t.status)).length === 0 && <tr><td colSpan="5" className="empty-mini">No designs in pipeline yet.</td></tr>}
                                {tasks.filter(t => finalizedStatuses.includes(t.status)).map(task => (
                                    <tr key={task._id}>
                                        <td><strong>{task.title}</strong>{task.quotation && <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 600 }}>{task.quotation.projectName}</div>}</td>
                                        <td>{new Date(task.submissions?.[task.submissions.length - 1]?.submittedAt || task.updatedAt).toLocaleDateString()}</td>
                                        <td><span className="status-pill" style={getStatusStyle(task.status)}>{getStatusLabel(task.status)}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', maxWidth: '150px', padding: '5px 0' }}>
                                                {task.submissions?.[task.submissions.length - 1]?.files?.map((f, idx) => (
                                                    <a key={idx} href={f.url?.startsWith('http') ? f.url : `${BASE_IMAGE_URL}${f.url}`} target="_blank" rel="noreferrer">
                                                        <img src={f.url?.startsWith('http') ? f.url : `${BASE_IMAGE_URL}${f.url}`} alt="Design" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                                                            onError={e => { e.target.src = 'https://via.placeholder.com/40?text=File'; }} />
                                                    </a>
                                                ))}
                                            </div>
                                        </td>
                                        <td>{task.submissions?.[task.submissions.length - 1]?.managerFeedback || 'Great work!'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

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
