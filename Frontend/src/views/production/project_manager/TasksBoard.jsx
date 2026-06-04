import React from 'react';
import '../css/ProductionManagement.css';
import { useTasksBoard } from './hooks/useTasksBoard';
import TasksFilterPanel from './components/TasksBoard/TasksFilterPanel';
import TasksKanbanBoard from './components/TasksBoard/TasksKanbanBoard';
import CreateTaskModal from './components/TasksBoard/CreateTaskModal';

const COLUMN_ORDER = ['Pending', 'In Progress', 'Completed', 'Approved'];

const TasksBoard = () => {
    const {
        tasks,
        projects,
        staff,
        loading,
        error,
        isModalOpen, setIsModalOpen,
        filtersOpen, setFiltersOpen,
        filterPriority, setFilterPriority,
        searchTerm, setSearchTerm,
        newTask, setNewTask,
        handleCreateTask,
        onDragEnd,
        filterTask
    } = useTasksBoard();

    return (
        <div className="pm-dashboard pm-tasks-board">
            <TasksFilterPanel 
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {error && <div className="pm-error-message">{error}</div>}

            {loading ? (
                <div className="pm-kanban-container">
                    {COLUMN_ORDER.map((columnId) => (
                        <div key={`skeleton-${columnId}`} className="pm-kanban-column">
                            <div className="pm-kanban-column-header">
                                <div className="pm-skeleton-line" style={{ width: '52%', height: '20px' }} />
                            </div>
                            <div className="pm-kanban-cards">
                                {Array.from({ length: 2 }).map((_, idx) => (
                                    <div key={idx} className="pm-kanban-card">
                                        <div className="pm-skeleton-line" style={{ width: '35%', marginBottom: '10px' }} />
                                        <div className="pm-skeleton-line" style={{ width: '78%', marginBottom: '8px' }} />
                                        <div className="pm-skeleton-line" style={{ width: '58%', marginBottom: '14px' }} />
                                        <div className="pm-skeleton-line" style={{ width: '92%' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <TasksKanbanBoard 
                    tasks={tasks}
                    filterTask={filterTask}
                    onDragEnd={onDragEnd}
                />
            )}

            <CreateTaskModal 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                newTask={newTask}
                setNewTask={setNewTask}
                handleCreateTask={handleCreateTask}
                projects={projects}
                staff={staff}
            />
        </div>
    );
};

export default TasksBoard;
