import React, { useState, useEffect } from 'react';
import { Target, User, Clock, AlertTriangle, Filter, LayoutGrid, X, ChevronDown, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../css/ProductionManagement.css';
import { kanbanAPI } from '../../../models/api';

const COLUMN_ORDER = ['todo', 'in-progress', 'review', 'completed'];
const COLUMN_TITLES = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'review': 'Review',
    'completed': 'Completed'
};

const TasksBoard = () => {
    const [tasks, setTasks] = useState({
        'todo': [],
        'in-progress': [],
        'review': [],
        'completed': []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filterPriority, setFilterPriority] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [newTask, setNewTask] = useState({
        title: '',
        projectName: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: ''
    });

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await kanbanAPI.getTasks();
            if (res.success) {
                const grouped = {
                    'todo': [],
                    'in-progress': [],
                    'review': [],
                    'completed': []
                };
                res.data.forEach(task => {
                    if (grouped[task.status]) {
                        grouped[task.status].push(task);
                    }
                });
                setTasks(grouped);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const openCreateTaskModal = () => setIsModalOpen(true);
        window.addEventListener('open-create-production-task-modal', openCreateTaskModal);
        return () => window.removeEventListener('open-create-production-task-modal', openCreateTaskModal);
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await kanbanAPI.createTask(newTask);
            if (res.success) {
                setIsModalOpen(false);
                setNewTask({ title: '', projectName: '', assignedTo: '', priority: 'Medium', dueDate: '' });
                fetchTasks();
            }
        } catch (err) {
            console.error("Error creating task", err);
        }
    };

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceCol = [...tasks[source.droppableId]];
        const destCol = source.droppableId === destination.droppableId ? sourceCol : [...tasks[destination.droppableId]];
        
        const [removed] = sourceCol.splice(source.index, 1);
        removed.status = destination.droppableId;
        destCol.splice(destination.index, 0, removed);

        setTasks({
            ...tasks,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol
        });

        try {
            await kanbanAPI.updateTask(removed._id, { status: destination.droppableId });
        } catch (err) {
            console.error("Failed to update task status", err);
            fetchTasks(); // Revert on failure
        }
    };

    const getPriorityColor = (priority) => {
        const p = priority.toLowerCase();
        const colors = { urgent: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#94a3b8' };
        const bgs = { urgent: '#fee2e2', high: '#fef3c7', medium: '#eff6ff', low: '#f1f5f9' };
        return { color: colors[p] || '#94a3b8', bg: bgs[p] || '#f1f5f9' };
    };

    const PRIORITY_OPTIONS = ['All', 'Low', 'Medium', 'High', 'Urgent'];
    const activeFilterCount = (filterPriority !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0);

    // Apply front-end filters to the tasks
    const filterTask = (task) => {
        if (filterPriority !== 'All' && task.priority !== filterPriority) return false;
        if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && !task.projectName?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    };

    return (
        <div className="pm-dashboard pm-tasks-board">
            {/* Toolbar */}
            <div className="pm-toolbar">
                <div className="pm-toolbar-left">
                    <button
                        onClick={() => setFiltersOpen(o => !o)}
                        className={`pm-filter-toggle-btn ${filtersOpen ? 'active' : ''}`}
                    >
                        <Filter size={15} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="pm-filter-count">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown size={14} className={`pm-chevron ${filtersOpen ? 'open' : ''}`} />
                    </button>
                    {filterPriority !== 'All' && (
                        <div className="pm-filter-chip">
                            {filterPriority}
                            <button onClick={() => setFilterPriority('All')} className="pm-filter-chip-close">
                                <X size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Collapsible Filter Panel */}
            <div className={`pm-filter-panel-wrapper ${filtersOpen ? 'open' : ''}`}>
                <div className="pm-filter-panel">
                    <div className="pm-search-input-container">
                        <Search size={15} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pm-search-input"
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="pm-search-clear"><X size={14} /></button>}
                    </div>
                    <div className="pm-status-chips">
                        <span className="pm-status-label">Priority:</span>
                        <div className="pm-status-chips-scroll">
                            {PRIORITY_OPTIONS.map(p => (
                                <button key={p} onClick={() => setFilterPriority(p)} className={`pm-status-chip-btn ${filterPriority === p ? 'active' : ''}`}>
                                    {p === 'All' ? 'All Priorities' : p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="pm-kanban-container">
                        {COLUMN_ORDER.map(columnId => (
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided) => (
                                    <div 
                                        className="pm-kanban-column"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <div className="pm-kanban-column-header">
                                            <h3>
                                                <LayoutGrid size={16} color="#64748b" />
                                                {COLUMN_TITLES[columnId]}
                                                <span className="pm-column-count">
                                                    {tasks[columnId].filter(filterTask).length}
                                                </span>
                                            </h3>
                                        </div>
                                        
                                        <div className="pm-kanban-cards">
                                            {tasks[columnId].filter(filterTask).map((task, index) => {
                                                const prio = getPriorityColor(task.priority);
                                                return (
                                                    <Draggable draggableId={task._id} index={index} key={task._id}>
                                                        {(provided, snapshot) => (
                                                            <div 
                                                                className={`pm-kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style
                                                                }}
                                                            >
                                                                <div className="pm-kanban-card-top">
                                                                    <span className="pm-task-id">{task.taskId}</span>
                                                                    <span className="pm-task-priority" style={{ background: prio.bg, color: prio.color }}>
                                                                        {task.priority}
                                                                    </span>
                                                                </div>
                                                                <h4 className="pm-task-title">{task.title}</h4>
                                                                <p className="pm-task-project">
                                                                    <Target size={12} /> {task.projectName}
                                                                </p>
                                                                <div className="pm-kanban-card-footer">
                                                                    <div className="pm-task-assignee">
                                                                        <div className="pm-team-avatar">
                                                                            {task.assignedTo ? task.assignedTo.split(' ').map(n=>n[0]).join('') : '?'}
                                                                        </div>
                                                                        <span>{task.assignedTo || 'Unassigned'}</span>
                                                                    </div>
                                                                    <div className={`pm-task-date ${task.priority === 'Urgent' ? 'urgent' : ''}`}>
                                                                        <Clock size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'No Date'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            )}

            {isModalOpen && (
                <div className="pm-modal-overlay">
                    <div className="pm-modal">
                        <div className="pm-modal-header">
                            <h2>Create New Task</h2>
                            <button onClick={() => setIsModalOpen(false)} className="pm-modal-close"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateTask} className="pm-modal-form">
                            <div className="pm-form-group">
                                <label>Title *</label>
                                <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Task title" />
                            </div>
                            <div className="pm-form-group">
                                <label>Project Name *</label>
                                <input required type="text" value={newTask.projectName} onChange={e => setNewTask({...newTask, projectName: e.target.value})} placeholder="Project name" />
                            </div>
                            <div className="pm-form-group">
                                <label>Assigned To</label>
                                <input type="text" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} placeholder="Staff name" />
                            </div>
                            <div className="pm-form-group">
                                <label>Priority</label>
                                <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="pm-form-group">
                                <label>Due Date</label>
                                <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                            </div>
                            <button type="submit" className="pm-modal-submit-btn">
                                Create Task
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksBoard;
