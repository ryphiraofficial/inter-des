import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';


import DesignOverview from './DesignOverview';
import Projects from './Projects';
import Tasks from './Tasks';
import DesignSkeleton, { 
    PipelineSkeleton, 
    ProjectsSkeleton, 
    TasksSkeleton, 
    StaffOverviewSkeleton, 
    MaterialReviewSkeleton,
    MeetingsSkeleton
} from './DesignSkeleton';
import MaterialReviewHub from './MaterialReviewHub';
import PipelineTab from './components/PipelineTab';
import TaskAssignModal from './components/TaskAssignModal';
import SubmissionReviewModal from './components/SubmissionReviewModal';
import TaskUpdatesModal from './components/TaskUpdatesModal';
import SplitTaskModal from './components/SplitTaskModal';
import StaffTasksModal from './components/StaffTasksModal';
import MeetingsPage from '../../common/MeetingsPage';

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
    const [showStaffTasksModal, setShowStaffTasksModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    useEffect(() => {
        const handleOpen = () => {
            taskActions.resetTaskForm();
            setShowAssignModal(true);
        };
        window.addEventListener('open-assign-modal', handleOpen);
        return () => window.removeEventListener('open-assign-modal', handleOpen);
    }, [taskActions]);

    const getPriorityColor = (priority) => {
        const map = { high: '#ef4444', medium: '#3b82f6', low: '#10b981' };
        return map[priority?.toLowerCase()] || '#64748b';
    };

    const formatCurrency = (amount) => amount ? `₹${amount.toLocaleString('en-IN')}` : '₹0';

    if (loading) {
        let SkeletonComponent = DesignSkeleton;
        switch (activeTab) {
            case 'pipeline':
            case 'project_status':
                SkeletonComponent = PipelineSkeleton;
                break;
            case 'project_management':
                SkeletonComponent = ProjectsSkeleton;
                break;
            case 'tasks':
                SkeletonComponent = TasksSkeleton;
                break;
            case 'staff_overview':
                SkeletonComponent = StaffOverviewSkeleton;
                break;
            case 'material_review':
                SkeletonComponent = MaterialReviewSkeleton;
                break;
            case 'meetings':
                SkeletonComponent = MeetingsSkeleton;
                break;
            default:
                SkeletonComponent = DesignSkeleton;
        }

        return (
            <div className="role-dashboard">
                <SkeletonComponent />
            </div>
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

            case 'project_management':
                return (
                    <Projects
                        projects={projects} tasks={tasks} getImageUrl={getImageUrl}
                        materialRequests={materialRequests}
                        onReviewRequest={(pid) => navigate(`/material-review?project=${pid}`)}
                        onUpdateStatus={(pid, stat) => projectAPI.update(pid, { status: stat }).then(fetchData)}
                        onHandoffInitiate={(proj) => taskActions.handleProjectHandoff(proj._id)}
                        onAssignStaff={(project) => {
                            taskActions.resetTaskForm();
                            taskActions.setTaskFormData(prev => ({
                                ...prev,
                                project: project.quotation?._id || project.quotation || '',
                                title: `Design deliverables for ${project.name}`
                            }));
                            setShowAssignModal(true);
                        }}
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
                    <div className="fade-in" style={{ paddingTop: '1rem' }}>
                        <div className="card-premium" style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {staffList.map(member => {
                                    const activeCount = tasks.filter(t => t.assignedTo?.some(s => s._id === member._id) && !['Completed', 'Approved', 'Pushed to Procurement'].includes(t.status)).length;
                                    const isOverloaded = activeCount > 3;
                                    
                                    return (
                                        <div 
                                            key={member._id} 
                                            style={{ 
                                                background: '#f8fafc', 
                                                borderRadius: '16px', 
                                                padding: '1.5rem', 
                                                border: `1px solid ${isOverloaded ? '#fee2e2' : '#e2e8f0'}`,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 12px 25px -10px rgba(0,0,0,0.08)';
                                                e.currentTarget.style.borderColor = isOverloaded ? '#fca5a5' : '#cbd5e1';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.borderColor = isOverloaded ? '#fee2e2' : '#e2e8f0';
                                            }}
                                            onClick={() => { setSelectedStaff(member); setShowStaffTasksModal(true); }}
                                        >
                                            {/* Status Indicator */}
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: isOverloaded ? '#ef4444' : '#10b981' }}></div>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                                {/* Avatar */}
                                                <div style={{ 
                                                    width: '48px', height: '48px', 
                                                    borderRadius: '14px', 
                                                    background: isOverloaded ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
                                                    color: isOverloaded ? '#ef4444' : '#10b981', 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                    fontSize: '1.2rem', fontWeight: 800,
                                                    border: `1px solid ${isOverloaded ? '#fecaca' : '#bbf7d0'}`
                                                }}>
                                                    {(member.name || 'S').charAt(0).toUpperCase()}
                                                </div>
                                                
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{member.name}</h4>
                                                        <span style={{ 
                                                            fontSize: '0.7rem', fontWeight: 800, 
                                                            padding: '4px 8px', borderRadius: '8px', 
                                                            background: member.status?.toLowerCase() === 'active' ? '#dcfce7' : '#f1f5f9',
                                                            color: member.status?.toLowerCase() === 'active' ? '#15803d' : '#64748b'
                                                        }}>
                                                            {member.status || 'Active'}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{member.role}</div>
                                                </div>
                                            </div>

                                            {/* Workload Indicator */}
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Active Projects</span>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isOverloaded ? '#ef4444' : '#10b981' }}>{activeCount} <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>/ 5 max</span></span>
                                                </div>
                                                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ 
                                                        height: '100%', 
                                                        width: `${Math.min((activeCount / 5) * 100, 100)}%`, 
                                                        background: isOverloaded ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #10b981, #34d399)',
                                                        borderRadius: '10px',
                                                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                                    }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            case 'material_review':
                return <MaterialReviewHub materialRequests={materialRequests} onApprove={handleApproveMaterialRequest} />;
            case 'meetings':
                return <MeetingsPage user={user} />;
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
        <div className="role-dashboard">
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

            <StaffTasksModal
                show={showStaffTasksModal}
                onClose={() => { setShowStaffTasksModal(false); setSelectedStaff(null); }}
                staffMember={selectedStaff}
                tasks={tasks}
            />
        </div>
    );
};

export default DesignManagerDashboard;
