import React from 'react';
import { Tally4, Table, Calendar, Archive } from 'lucide-react';

const ProjectTabs = ({ activeView, setActiveView }) => {
    const tabs = [
        { id: 'kanban', label: 'Kanban Board', icon: Tally4 },
        { id: 'table', label: 'Project List', icon: Table },
        { id: 'timeline', label: 'Timeline View', icon: Calendar },
        { id: 'archive', label: 'Archived', icon: Archive }
    ];

    return (
        <div className="project-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeView === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveView(tab.id)}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default ProjectTabs;
