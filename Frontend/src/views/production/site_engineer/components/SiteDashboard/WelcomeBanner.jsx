import React from 'react';
import { Wrench } from 'lucide-react';
import { useAppSelector } from '../../../../../store/hooks';
import { selectUser } from '../../../../../store/slices/authSlice';

const WelcomeBanner = ({ myProjects, stats, overdue, doneRate }) => {
    const user = useAppSelector(selectUser);
    return (
        <div className="site-banner site-banner-light">
            <div className="site-banner-left">
                <div className="site-banner-badge site-banner-badge-light"><Wrench size={13}/>{user?.role}</div>
                <h1 className="site-welcome-title-light">
                    Good {new Date().getHours()<12?'Morning':new Date().getHours()<17?'Afternoon':'Evening'},{' '}
                    <span className="site-name-highlight-light">{user?.fullName?.split(' ')[0]}</span> 👷
                </h1>
                <p className="site-welcome-sub-light">
                    {myProjects.length > 0
                        ? <><strong>{myProjects.length}</strong> active project{myProjects.length !== 1 ? 's' : ''} · <strong>{stats.inProgress}</strong> task{stats.inProgress!==1?'s':''} in progress</>
                        : 'No projects assigned yet. Check back soon.'
                    }
                    {overdue?.length>0 && <span style={{color:'#ef4444'}}> · <strong>{overdue.length}</strong> overdue</span>}
                </p>
            </div>
            <div className="site-ring-wrapper site-ring-light">
                <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r="37" fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                    <circle cx="45" cy="45" r="37" fill="none" stroke="#10b981" strokeWidth="8"
                        strokeDasharray={`${2*Math.PI*37}`}
                        strokeDashoffset={`${2*Math.PI*37*(1-doneRate/100)}`}
                        strokeLinecap="round" transform="rotate(-90 45 45)"
                        style={{transition:'stroke-dashoffset 1s ease'}}/>
                </svg>
                <div className="site-ring-label site-ring-label-light">
                    <span className="site-ring-pct">{doneRate}%</span>
                    <span className="site-ring-sub">Done</span>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBanner;
