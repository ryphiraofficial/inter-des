import React from 'react';
import { Zap, CheckSquare, ClipboardCheck, FolderOpen, CloudRain, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../../store/hooks';
import { selectUser } from '../../../../../store/slices/authSlice';

const SiteSupervisorWidgets = ({}) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const isSS = user?.role === 'Site Supervisor';

    if (!isSS) return null;

    return (
        <div className="ss-widgets-grid" style={{ marginTop: 24 }}>
            {/* Quick Actions */}
            <div className="ss-widget-card">
                <div className="ss-widget-header">
                    <h3 className="ss-widget-title"><Zap size={18}/> Quick Actions</h3>
                </div>
                <div className="ss-actions-grid">
                    <button className="ss-action-btn" onClick={() => navigate('/site/tasks')}>
                        <div className="ss-action-icon" style={{background: '#eff6ff', color: '#3b82f6'}}><CheckSquare size={20}/></div>
                        <span>Tasks</span>
                    </button>
                    <button className="ss-action-btn" onClick={() => navigate('/site/reports')}>
                        <div className="ss-action-icon" style={{background: '#fef3c7', color: '#d97706'}}><ClipboardCheck size={20}/></div>
                        <span>Daily Report</span>
                    </button>
                    <button className="ss-action-btn" onClick={() => navigate('/site/projects')}>
                        <div className="ss-action-icon" style={{background: '#f3e8ff', color: '#9333ea'}}><FolderOpen size={20}/></div>
                        <span>Drawings</span>
                    </button>
                </div>
            </div>

            {/* Weather Widget (Mock) */}
            <div className="ss-widget-card ss-weather-widget">
                <div className="ss-weather-info">
                    <CloudRain size={42} className="ss-weather-icon"/>
                    <div>
                        <h3 className="ss-weather-temp">24°C</h3>
                        <p className="ss-weather-desc">Light Rain · Moderate Wind</p>
                    </div>
                </div>
                <div className="ss-weather-alert">
                    <TriangleAlert size={16}/> <span>Outdoor concreting not recommended today.</span>
                </div>
            </div>
        </div>
    );
};

export default SiteSupervisorWidgets;
