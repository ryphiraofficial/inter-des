import React, { useState } from 'react';
import { ClipboardList, Users, ShieldAlert, Package } from 'lucide-react';
import SiteAttendance from '../site_engineer/SiteAttendance';
import SiteSafety from '../site_engineer/SiteSafety';
import DailyReports from '../site_engineer/components/SiteReports/DailyReports';
import SupervisorReports from '../site_engineer/components/SiteReports/SupervisorReports';
import { useSiteReports } from '../site_engineer/hooks/useSiteReports'; 
import '../site_engineer/Site.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const EngineerReports = () => {
    const user = useAppSelector(selectUser);
    const [activeTab, setActiveTab] = useState('daily');
    const { projects } = useSiteReports();

    return (
        <div className="site-page">
            <div className="pm-tabs">
                <button className={`pm-tab-btn ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>
                    <ClipboardList size={16}/> Daily Reports
                </button>
                {user?.role === 'Site Supervisor' && (
                    <button className={`pm-tab-btn ${activeTab === 'supervisor' ? 'active' : ''}`} onClick={() => setActiveTab('supervisor')}>
                        <Package size={16}/> Supervisor Report
                    </button>
                )}
                <button className={`pm-tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
                    <Users size={16}/> Attendance
                </button>
                <button className={`pm-tab-btn ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>
                    <ShieldAlert size={16}/> Safety Logs
                </button>
            </div>

            {activeTab === 'daily' && <DailyReports />}
            {activeTab === 'supervisor' && user?.role === 'Site Supervisor' && <SupervisorReports user={user} projects={projects} />}
            {activeTab === 'attendance' && <SiteAttendance user={user} />}
            {activeTab === 'safety' && <SiteSafety user={user} />}
        </div>
    );
};

export default EngineerReports;
