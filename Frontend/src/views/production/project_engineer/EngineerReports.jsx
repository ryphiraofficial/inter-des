import React from 'react';
import { ClipboardList, Users, ShieldAlert, Box } from 'lucide-react';
import './Engineer.css';
import { useEngineerReports } from './hooks/useEngineerReports';
import DailyReportsTab from './components/EngineerReports/DailyReportsTab';
import SupervisorReportsTab from './components/EngineerReports/SupervisorReportsTab';
import AttendanceTab from './components/EngineerReports/AttendanceTab';
import SafetyTab from './components/EngineerReports/SafetyTab';

const EngineerReports = () => {
    const {
        activeTab, setActiveTab,
        projects,
        selectedProject, setSelectedProject,
        dailyReports,
        supervisorReports,
        attendance,
        safetyLogs,
        loading
    } = useEngineerReports();

    const TABS = [
        { id: 'daily', label: 'Daily Reports', icon: <ClipboardList size={15}/> },
        { id: 'supervisor', label: 'Supervisor Logs', icon: <Box size={15}/> },
        { id: 'attendance', label: 'Attendance', icon: <Users size={15}/> },
        { id: 'safety', label: 'Safety Logs', icon: <ShieldAlert size={15}/> }
    ];

    return (
        <div className="eng-dashboard">
            <div className="eng-page-header" style={{ justifyContent: 'flex-end', marginBottom: 20 }}>
                <div>
                    <select className="eng-input" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={{ minWidth: 200 }}>
                        <option value="all">All Projects</option>
                        {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                    </select>
                </div>
            </div>

            <div className="eng-tabs">
                {TABS.map(t => (
                    <button 
                        key={t.id}
                        className={`eng-tab ${activeTab === t.id ? 'active' : ''}`} 
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.icon}{t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="eng-loading">Loading data...</div>
            ) : (
                <div className="eng-tab-content">
                    {/* DAILY REPORTS TAB */}
                    {activeTab === 'daily' && (
                        <div className="eng-reports-grid">
                            <DailyReportsTab dailyReports={dailyReports} />
                        </div>
                    )}

                    {/* SUPERVISOR REPORTS TAB */}
                    {activeTab === 'supervisor' && (
                        <div className="eng-reports-grid">
                            <SupervisorReportsTab supervisorReports={supervisorReports} />
                        </div>
                    )}

                    {/* ATTENDANCE TAB */}
                    {activeTab === 'attendance' && (
                        <div className="eng-reports-grid">
                            <AttendanceTab selectedProject={selectedProject} attendance={attendance} />
                        </div>
                    )}

                    {/* SAFETY TAB */}
                    {activeTab === 'safety' && (
                        <div className="eng-reports-grid">
                            <SafetyTab selectedProject={selectedProject} safetyLogs={safetyLogs} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EngineerReports;
