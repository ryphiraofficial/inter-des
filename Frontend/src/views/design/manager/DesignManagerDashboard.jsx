import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';


import DesignOverview from './DesignOverview';
import Projects from './Projects';
import Tasks from './Tasks';
import DesignSkeleton from './DesignSkeleton';
import MaterialReviewHub from './MaterialReviewHub';
import StaffReports from '../../common/StaffReports';
import PipelineTab from './components/PipelineTab';
import TaskAssignModal from './components/TaskAssignModal';
import SubmissionReviewModal from './components/SubmissionReviewModal';
import TaskUpdatesModal from './components/TaskUpdatesModal';
import SplitTaskModal from './components/SplitTaskModal';
import StaffTasksModal from './components/StaffTasksModal';
import StaffOverviewTab from './components/StaffOverviewTab';
import ActivityFeed from './components/ActivityFeed';
import DashboardLoading from './components/DashboardLoading';
import MeetingsPage from '../../common/MeetingsPage';

import { useManagerData } from './hooks/useManagerData';
import { useTaskActions } from './hooks/useTaskActions';
import { useMaterialActions } from './hooks/useMaterialActions';

import '../css/ManagerDashboard.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const DesignManagerDashboard = ({}) => {
    const user = useAppSelector(selectUser);
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
        return <DashboardLoading activeTab={activeTab} />;
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
                    <StaffOverviewTab 
                        staffList={staffList} 
                        tasks={tasks} 
                        setSelectedStaff={setSelectedStaff} 
                        setShowStaffTasksModal={setShowStaffTasksModal} 
                    />
                );
            case 'material_review':
                return <MaterialReviewHub materialRequests={materialRequests} onApprove={handleApproveMaterialRequest} />;
            case 'meetings':
                return <MeetingsPage user={user} />;
            case 'reports':
                return (
                    <StaffReports />
                );
            default:
                return (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <DesignOverview stats={stats} tasks={tasks} quotations={quotations} teamStats={teamStats} />
                        <ActivityFeed notifications={notifications} />
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
