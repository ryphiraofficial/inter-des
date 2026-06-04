import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { LayoutGrid, Target, Clock } from 'lucide-react';

const COLUMN_ORDER = ['Pending', 'In Progress', 'Completed', 'Approved'];
const COLUMN_TITLES = {
    'Pending': 'To Do',
    'In Progress': 'In Progress',
    'Completed': 'Review',
    'Approved': 'Completed'
};

const getPriorityColor = (priority) => {
    const p = priority.toLowerCase();
    const colors = { urgent: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#94a3b8' };
    const bgs = { urgent: '#fee2e2', high: '#fef3c7', medium: '#eff6ff', low: '#f1f5f9' };
    return { color: colors[p] || '#94a3b8', bg: bgs[p] || '#f1f5f9' };
};

const TasksKanbanBoard = ({ tasks, filterTask, onDragEnd }) => {
    return (
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
                                                            <span className="pm-task-id">#{task._id.slice(-5).toUpperCase()}</span>
                                                            <span className="pm-task-priority" style={{ background: prio.bg, color: prio.color }}>
                                                                {task.priority}
                                                            </span>
                                                        </div>
                                                        <h4 className="pm-task-title">{task.title}</h4>
                                                        <p className="pm-task-project">
                                                            <Target size={12} /> {task.projectId ? task.projectId.projectName : 'No Project'}
                                                        </p>
                                                        <div className="pm-kanban-card-footer">
                                                            <div className="pm-task-assignee">
                                                                <div className="pm-team-avatar">
                                                                    {task.assignedTo ? task.assignedTo.fullName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '?'}
                                                                </div>
                                                                <span>{task.assignedTo ? task.assignedTo.fullName : 'Unassigned'}</span>
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
    );
};

export default TasksKanbanBoard;
