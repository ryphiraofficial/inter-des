import React from 'react';
import { Zap } from 'lucide-react';
import { useAppSelector } from '../../../../../store/hooks';
import { selectUser } from '../../../../../store/slices/authSlice';

const WelcomeBanner = ({ stats, overdueCount, doneRate }) => {
    const user = useAppSelector(selectUser);
    return (
        <div className="eng-welcome-banner eng-welcome-banner-light">
            <div className="eng-welcome-left">
                <div className="eng-welcome-badge eng-welcome-badge-light">
                    <Zap size={14} />{user?.role}
                </div>
                <h1 className="eng-welcome-title eng-welcome-title-light">
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
                    <span className="eng-name-highlight eng-name-highlight-light">{user?.fullName?.split(' ')[0]}</span> 👋
                </h1>
                <p className="eng-welcome-sub eng-welcome-sub-light">
                    You have <strong>{Number(stats?.inProgress || 0)}</strong> task{Number(stats?.inProgress || 0) !== 1 ? 's' : ''} in progress
                    {Number(overdueCount) > 0 ? <span style={{ color:'#ef4444' }}> · <strong>{Number(overdueCount)}</strong> overdue</span> : null}
                </p>
            </div>
            <div className="eng-welcome-right">
                <div className="eng-progress-ring-wrapper eng-progress-ring-light">
                    <svg width="96" height="96" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                        <circle cx="48" cy="48" r="40" fill="none" stroke="#3b82f6" strokeWidth="8"
                            strokeDasharray={`${2*Math.PI*40}`}
                            strokeDashoffset={`${2*Math.PI*40*(1-doneRate/100)}`}
                            strokeLinecap="round" transform="rotate(-90 48 48)"
                            style={{ transition:'stroke-dashoffset 1s ease' }}/>
                    </svg>
                    <div className="eng-ring-label eng-ring-label-light">
                        <span className="eng-ring-pct">{doneRate}%</span>
                        <span className="eng-ring-sub">Done</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBanner;
