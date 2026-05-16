import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const ProjectTimeline = ({ projects }) => {
    // Sort projects by end date
    const sortedProjects = [...projects].sort((a, b) => {
        if (!a.targetEndDate) return 1;
        if (!b.targetEndDate) return -1;
        return new Date(a.targetEndDate) - new Date(b.targetEndDate);
    });

    return (
        <div className="project-timeline-container">
            <div className="timeline-header">
                <h3>Project Schedule</h3>
                <p>Timeline of ongoing and upcoming project deadlines.</p>
            </div>
            <div className="timeline-list">
                {sortedProjects.map(project => (
                    <div key={project._id} className="timeline-item">
                        <div className="timeline-marker">
                            <CalendarIcon size={16} />
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-date">
                                {project.targetEndDate ? new Date(project.targetEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline set'}
                            </div>
                            <div className="timeline-project">
                                <span className="p-name">{project.name}</span>
                                <span className="p-stage">{project.stage}</span>
                            </div>
                        </div>
                        <div className="timeline-status">
                            <div className="progress-mini">
                                <div className="progress-mini-fill" style={{ width: `${project.progress}%` }}></div>
                            </div>
                            <span>{project.progress}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectTimeline;
