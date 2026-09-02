import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../models/context/ToastContext';

// Hooks
import { useTasksState } from './tasks/hooks/useTasksState';
import { useTasksData } from './tasks/hooks/useTasksData';
import { useTasksActions } from './tasks/hooks/useTasksActions';
import { useTasksDetails } from './tasks/hooks/useTasksDetails';

// Components
import TasksStatsGrid from './tasks/components/TasksStatsGrid';
import TasksTable from './tasks/components/TasksTable';
import TaskFormModal from './tasks/components/TaskFormModal';
import TaskDetailsModal from './tasks/components/TaskDetailsModal';
import DesignPreviewModal from './tasks/components/DesignPreviewModal';
import CustomSelect from './components/CustomSelect';
import { TableSkeleton, StatsSkeleton } from './components/Skeleton';

import './css/Tasks.css';
import './css/TaskDetails.css';

const Tasks = ({ isStaff, user }) => {
    const { showToast } = useToast();
    const [searchParams] = useSearchParams();

    // Logic Hooks
    const state = useTasksState(searchParams);
    
    const data = useTasksData({
        setTasks: state.setTasks, setStaff: state.setStaff, setClients: state.setClients,
        setQuotations: state.setQuotations, setLoading: state.setLoading,
        setError: state.setError, showToast, setShowTaskModal: state.setShowTaskModal,
        setFormData: state.setFormData, setSearchTerm: state.setSearchTerm
    });

    const details = useTasksDetails({
        setSelectedTask: state.setSelectedTask, setShowDetailsModal: state.setShowDetailsModal,
        setVisitsLoading: state.setVisitsLoading, setTaskVisits: state.setTaskVisits, document
    });

    const actions = useTasksActions({
        editingTask: state.editingTask, formData: state.formData, fetchTasks: data.fetchTasks,
        showToast, closeModal: () => {
            state.setShowTaskModal(false); state.setShowDetailsModal(false);
            state.setEditingTask(null); state.setFormData(state.initialFormData);
            document.body.style.overflow = 'unset';
        },
        setTasks: state.setTasks, setSubmitting: state.setSubmitting
    });

    // Priority Colors
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return '#dc2626';
            case 'High': return '#ef4444';
            case 'Medium': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    // Filter & Sort Logic (Newest created tasks stacked at the top)
    const filteredTasks = state.tasks
        .filter(task => {
            if (isStaff && task.assignedTo?.email !== user?.email) return false;
            const matchesSearch = task.title?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(state.searchTerm.toLowerCase());
            const matchesStatus = state.filterStatus === 'All' || task.status === state.filterStatus;
            const matchesPriority = state.filterPriority === 'All' || task.priority === state.filterPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        })
        .sort((a, b) => {
            const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
            if (timeA !== timeB) return timeB - timeA;
            return (b._id || '').localeCompare(a._id || '');
        });

    const filteredQuotationsForForm = state.formData.client
        ? state.quotations.filter(q => (q.client?._id === state.formData.client || q.client === state.formData.client))
        : [];

    if (state.loading) {
        return (
            <div className={`tasks-container ${isStaff ? 'staff-view' : ''}`}>
                <div className="tasks-wrapper">
                    <StatsSkeleton count={4} />
                    <div style={{ marginTop: '2rem' }}>
                        <TableSkeleton rows={10} cols={6} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`tasks-container ${isStaff ? 'staff-view' : ''}`}>
            <div className="tasks-wrapper">
                <TasksStatsGrid tasks={state.tasks} />

                <div className="tasks-controls">
                    <div className="tasks-filter-group" style={{ display: 'flex', gap: '0.75rem', width: '100%', flexWrap: 'wrap' }}>
                        <CustomSelect
                            options={[
                                { value: 'All', label: 'All Statuses' },
                                { value: 'To Do', label: 'To Do' },
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Pending Admin Review', label: 'Design Approvals' },
                                { value: 'Completed', label: 'Completed' }
                            ]}
                            value={state.filterStatus}
                            onChange={(e) => state.setFilterStatus(e.target.value)}
                            searchable={false}
                        />
                        <CustomSelect
                            options={[
                                { value: 'All', label: 'All Priority' },
                                { value: 'Critical', label: 'Critical' },
                                { value: 'High', label: 'High' },
                                { value: 'Medium', label: 'Medium' },
                                { value: 'Low', label: 'Low' }
                            ]}
                            value={state.filterPriority}
                            onChange={(e) => state.setFilterPriority(e.target.value)}
                            searchable={false}
                        />
                    </div>
                </div>

                {filteredTasks.length === 0 ? (
                    <div className="empty-state-card">
                        <h4>No tasks found</h4>
                        <p>Assign your first task to get started</p>
                    </div>
                ) : (
                    <TasksTable 
                        tasks={filteredTasks}
                        isStaff={isStaff}
                        expandedRow={state.expandedRow}
                        toggleRow={(id) => state.setExpandedRow(state.expandedRow === id ? null : id)}
                        getPriorityColor={getPriorityColor}
                        handleStatusChange={actions.handleStatusChange}
                        handleProgressChange={actions.handleProgressChange}
                        handleSalesReview={actions.handleSalesReview}
                        handleAdminReview={actions.handleAdminReview}
                        handleViewDetails={details.handleViewDetails}
                        handleEdit={(task) => {
                            state.setEditingTask(task);
                            state.setFormData({
                                title: task.title || '',
                                description: task.description || '',
                                status: task.status || 'To Do',
                                priority: task.priority || 'Medium',
                                assignedTo: task.assignedTo?._id || '',
                                client: task.client?._id || '',
                                quotation: task.quotation?._id || '',
                                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                                estimatedDuration: task.estimatedDuration || '',
                                project: task.project || '',
                                progress: task.progress || 0
                            });
                            state.setShowTaskModal(true);
                        } }
                        handleDelete={actions.handleDelete}
                        setShowDesignModal={state.setShowDesignModal}
                        setSelectedTask={state.setSelectedTask}
                    />
                )}
            </div>

            <TaskFormModal 
                show={state.showTaskModal}
                closeModal={() => { state.setShowTaskModal(false); state.setEditingTask(null); state.setFormData(state.initialFormData); }}
                editingTask={state.editingTask}
                handleSubmit={actions.handleSubmit}
                formData={state.formData}
                handleInputChange={state.handleInputChange}
                setFormData={state.setFormData}
                staff={state.staff}
                clients={state.clients}
                filteredQuotations={filteredQuotationsForForm}
                submitting={state.submitting}
            />

            <TaskDetailsModal 
                show={state.showDetailsModal}
                setShow={state.setShowDetailsModal}
                selectedTask={state.selectedTask}
                visitsLoading={state.visitsLoading}
                taskVisits={state.taskVisits}
            />

            <DesignPreviewModal 
                show={state.showDesignModal}
                setShow={state.setShowDesignModal}
                selectedTask={state.selectedTask}
                handleAdminReview={actions.handleAdminReview}
            />
        </div>
    );
};

export default Tasks;
