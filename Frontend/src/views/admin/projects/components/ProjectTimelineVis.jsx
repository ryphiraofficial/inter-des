import React, { useEffect, useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import './ProjectTimelineVis.css';

const ProjectTimelineVis = ({ tasks = [] }) => {
    const timelineRef = useRef(null);
    const timelineInstance = useRef(null);

    useEffect(() => {
        if (!timelineRef.current) return;

        // Helper to format dates
        const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        // Map tasks to vis-timeline items format
        const items = tasks.map(task => {
            const start = new Date(task.createdAt);
            // Default to due date or complete date. If neither, fallback to start + 1 day
            let end = task.dueDate ? new Date(task.dueDate) : new Date(start.getTime() + 24 * 60 * 60 * 1000);
            
            // If the task is completed, maybe show it ended early if completedAt exists
            if (task.status === 'Completed' && task.completedAt) {
                end = new Date(task.completedAt);
            }

            const baseClass = task.status === 'Completed' ? 'completed' : task.status === 'To Do' ? 'to-do' : 'in-progress';

            return {
                id: task._id,
                content: `<div class="task-content"><strong>${task.title}</strong><span class="task-dates">${formatDate(start)} - ${formatDate(end)}</span></div>`,
                start: start,
                end: end,
                className: `vis-item-${baseClass}`,
                title: `${task.title}\nStatus: ${task.status}` // Tooltip
            };
        });

        // Setup timeline options
        const options = {
            width: '100%',
            height: '400px',
            stack: true,
            showCurrentTime: true,
            zoomMin: 1000 * 60 * 60 * 24 * 3,         // 3 days
            zoomMax: 1000 * 60 * 60 * 24 * 31 * 3,    // 3 months
            margin: {
                item: 12,
                axis: 8
            },
            orientation: 'top',
            timeAxis: { scale: 'day', step: 1 },
            format: {
                minorLabels: { day: 'D', month: 'MMM', year: 'YYYY' },
                majorLabels: { day: 'dddd, MMMM YYYY', month: 'YYYY', year: '' }
            }
        };

        // Initialize timeline
        if (!timelineInstance.current) {
            timelineInstance.current = new Timeline(timelineRef.current, items, options);
        } else {
            // Update items if data changes
            timelineInstance.current.setItems(items);
        }

        // Cleanup
        return () => {
            if (timelineInstance.current) {
                timelineInstance.current.destroy();
                timelineInstance.current = null;
            }
        };
    }, [tasks]);

    return (
        <div className="project-timeline-container">
            <div className="info-card-header" style={{ marginBottom: '16px' }}>
                <h4>Task Timeline</h4>
            </div>
            <div ref={timelineRef} className="vis-timeline-wrapper"></div>
            
            <div className="timeline-legend">
                <div className="legend-item"><span className="legend-color to-do"></span> To Do</div>
                <div className="legend-item"><span className="legend-color in-progress"></span> In Progress</div>
                <div className="legend-item"><span className="legend-color completed"></span> Completed</div>
            </div>
        </div>
    );
};

export default ProjectTimelineVis;
