import React from 'react';
import { Target, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TaskRow } from './TaskRow';

const Section = ({ icon, title, accentColor, tasks, empty }) => {
    const navigate = useNavigate();
    return (
        <div className="eng-section-card">
            <div className="eng-section-header">
                <div className="eng-section-title" style={{ color: accentColor }}>
                    {icon} {title}
                </div>
                <span className="eng-task-count">{tasks?.length ?? 0}</span>
            </div>
            {!tasks?.length ? (
                <div className="eng-empty" style={{ padding:'28px 24px' }}>
                    <Target size={28} />
                    <p style={{ fontSize:14 }}>{empty}</p>
                </div>
            ) : (
                <div className="eng-task-list">
                    {tasks.slice(0, 5).map(t => (
                        <TaskRow key={t._id} task={t} onClick={() => navigate(`/engineer/tasks/${t._id}`)} />
                    ))}
                    {tasks.length > 5 && (
                        <div className="eng-see-all" onClick={() => navigate('/engineer/tasks')}>
                            See all {tasks.length} tasks <ChevronRight size={14} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Section;
