import React from 'react';
import { Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskRow from './TaskRow';

const Section = ({ icon, title, color, tasks, empty }) => {
    const navigate = useNavigate();
    return (
        <div className="site-card">
            <div className="site-card-header">
                <div className="site-card-title" style={{color}}>{icon}{title}</div>
                <span className="site-count">{tasks?.length||0}</span>
            </div>
            {!tasks?.length ? (
                <div className="site-empty" style={{padding:'24px'}}><Target size={28}/><p style={{fontSize:13}}>{empty}</p></div>
            ) : (
                <div>
                    {tasks.slice(0,4).map(t=><TaskRow key={t._id} task={t}/>)}
                    {tasks.length>4 && (
                        <div style={{padding:'12px 24px',fontSize:13,color:'#10b981',fontWeight:600,cursor:'pointer',borderTop:'1px solid #f1f5f9'}}
                            onClick={()=>navigate('/site/tasks')}>
                            See all {tasks.length} →
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Section;
