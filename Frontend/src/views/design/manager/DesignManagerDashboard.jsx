import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

import DesignLayout from '../layout/DesignLayout';
import DesignOverview from './DesignOverview';
import Projects from './Projects';
import Tasks from './Tasks';
import DesignSkeleton from './DesignSkeleton';
import MaterialReviewHub from './MaterialReviewHub';
import PipelineTab from './components/PipelineTab';
import TaskAssignModal from './components/TaskAssignModal';
import SubmissionReviewModal from './components/SubmissionReviewModal';
import TaskUpdatesModal from './components/TaskUpdatesModal';
import SplitTaskModal from './components/SplitTaskModal';

import { useManagerData } from './hooks/useManagerData';
import { useTaskActions } from './hooks/useTaskActions';
import { useMaterialActions } from './hooks/useMaterialActions';

import '../css/ManagerDashboard.css';

const DesignManagerDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    // ── Data ──
    const {
        stats, projects, tasks, quotations, teamStats,
        notifications, staffList, materialRequests, loading,
        fetchData, getImageUrl
    } = useManagerData();

    // ── Actions ──
    const taskActions = useTaskActions(fetchData);
    const { handleApproveMaterialRequest } = useMaterialActions(fetchData);

    // ── UI State ──
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [showTaskUpdatesModal, setShowTaskUpdatesModal] = useState(false);
    const [showSplitModal, setShowSplitModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const getPriorityColor = (priority) => {
        const map = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
        return map[priority?.toLowerCase()] || '#64748b';
    };

    const formatCurrency = (amount) => amount ? `₹${amount.toLocaleString('en-IN')}` : '₹0';

    if (loading) {
        return (
            <DesignLayout role="manager" user={user} isLoading={true}>
                <DesignSkeleton />
            </DesignLayout>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'pipeline':
            case 'project_status':
                return (
                    <PipelineTab
                        tasks={tasks}
                        getImageUrl={getImageUrl}
                        onOpenAssignModal={() => { taskActions.resetTaskForm(); setShowAssignModal(true); }}
                        onReviewTask={(task) => { setSelectedTask(task); setShowSubmissionModal(true); }}
                        onSendToAdmin={taskActions.handleSendToAdmin}
                    />
                );
            case 'project_details':
                return (
                    <div className="section-card">
                        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                            <h3>Approved Project Specifications</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                            {quotations.filter(q => q.status === 'Approved').map(quote => (
                                <div key={quote._id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{quote.projectName}</h4>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Quote #: {quote.quotationNumber}</span>
                                        </div>
                                        <span style={{ padding: '4px 12px', background: '#dcfce7', color: '#15803d', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>APPROVED</span>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569' }}>
                                        {quote.items?.map((item, i) => (
                                            <li key={i} style={{ marginBottom: '6px' }}><strong>{item.itemName}</strong> - {item.description}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'project_management':
                return (
                    <Projects
                        projects={projects} tasks={tasks} getImageUrl={getImageUrl}
                        materialRequests={materialRequests}
                        onReviewRequest={(pid) => navigate(`/material-review?project=${pid}`)}
                        onUpdateStatus={(pid, stat) => projectAPI.update(pid, { status: stat }).then(fetchData)}
                        onHandoffInitiate={(proj) => taskActions.handleProjectHandoff(proj._id)}
                    />
                );
            case 'tasks':
                return (
                    <Tasks
                        tasks={tasks} teamStats={teamStats} staffList={staffList}
                        onOpenAssignModal={() => setShowAssignModal(true)}
                        onOpenEditTask={(task) => { setSelectedTask(task); setShowAssignModal(true); }}
                        getPriorityColor={getPriorityColor}
                        onReassign={taskActions.handleReassignTask}
                        onViewUpdates={(task) => { setSelectedTask(task); setShowTaskUpdatesModal(true); }}
                        onSplit={(task) => {
                            setSelectedTask(task);
                            taskActions.setSplitTaskData({ title: `${task.title} - Part 2`, assignedTo: [] });
                            setShowSplitModal(true);
                        }}
                    />
                );
            case 'staff_overview':
                return (
                    <div className="section-card">
                        <div className="section-header"><h3>Staff Workload & Availability</h3></div>
                        <div className="team-performance-list">
                            {staffList.map(member => {
                                const activeCount = tasks.filter(t => t.assignedTo?.some(s => s._id === member._id) && t.status !== 'Completed').length;
                                return (
                                    <div key={member._id} className="member-row" style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9', padding: '1rem 0.5rem' }}>
                                        <div className="member-info">
                                            <div className="member-name">{member.name}</div>
                                            <div className="member-role">{member.role}</div>
                                        </div>
                                        <div className="member-load" style={{ flex: 1, padding: '0 2rem' }}>
                                            <div className="load-bar">
                                                <div className="load-fill" style={{ width: `${Math.min((activeCount / 5) * 100, 100)}%`, backgroundColor: activeCount > 3 ? '#ef4444' : '#10b981' }}></div>
                                            </div>
                                            <span className="load-text">{activeCount} active tasks</span>
                                        </div>
                                        <span className={`status-badge-inline ${member.status?.toLowerCase()}`}>{member.status}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'material_review':
                return <MaterialReviewHub materialRequests={materialRequests} onApprove={handleApproveMaterialRequest} />;
            default:
                return (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <DesignOverview stats={stats} tasks={tasks} quotations={quotations} teamStats={teamStats} />
                        <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Bell size={20} color="#6366f1" />
                                <h3 style={{ margin: 0, fontWeight: 800 }}>Studio Activity Feed</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {notifications.length > 0 ? notifications.map(notif => (
                                    <div key={notif._id} style={{ padding: '12px', background: notif.notifRead ? '#f8fafc' : '#f5f3ff', borderRadius: '16px', border: `1px solid ${notif.notifRead ? '#e2e8f0' : '#e0e7ff'}` }}>
                                        <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{notif.title}</p>
                                        <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#64748b' }}>{notif.description}</p>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                                    </div>
                                )) : <div style={{ textAlign: 'center', color: '#94a3b8' }}>No recent activity</div>}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <DesignLayout role="manager" user={user} onRefresh={fetchData} isLoading={loading}>
            {renderContent()}

            <TaskAssignModal
                show={showAssignModal} onClose={() => setShowAssignModal(false)}
                editingTaskId={taskActions.editingTaskId}
                taskFormData={taskActions.taskFormData} setTaskFormData={taskActions.setTaskFormData}
                staffList={staffList} quotations={quotations}
                onSubmit={async (e) => { const ok = await taskActions.handleAssignTask(e); if (ok) setShowAssignModal(false); }}
                submittingTask={taskActions.submittingTask}
            />

            <SubmissionReviewModal
                show={showSubmissionModal} onClose={() => setShowSubmissionModal(false)}
                selectedTask={selectedTask} getImageUrl={getImageUrl}
                reviewStatus={taskActions.reviewStatus} setReviewStatus={taskActions.setReviewStatus}
                managerFeedback={taskActions.managerFeedback} setManagerFeedback={taskActions.setManagerFeedback}
                onSubmitReview={async () => { const ok = await taskActions.handleReviewSubmission(selectedTask); if (ok) setShowSubmissionModal(false); }}
            />

            <TaskUpdatesModal
                show={showTaskUpdatesModal} onClose={() => setShowTaskUpdatesModal(false)}
                selectedTask={selectedTask}
            />

            <SplitTaskModal
                show={showSplitModal} onClose={() => setShowSplitModal(false)}
                selectedTask={selectedTask}
                splitTaskData={taskActions.splitTaskData} setSplitTaskData={taskActions.setSplitTaskData}
                staffList={staffList}
                onConfirm={async () => { const ok = await taskActions.handleSplitTask(selectedTask); if (ok) setShowSplitModal(false); }}
            />
        </DesignLayout>
    );
};

export default DesignManagerDashboard;
