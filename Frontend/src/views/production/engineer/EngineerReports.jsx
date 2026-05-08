import React, { useState, useEffect } from 'react';
import { ClipboardList, Users, ShieldAlert, CheckCircle2, Clock, AlertTriangle, Target, Box } from 'lucide-react';
import { engineerAPI, siteManagementAPI } from '../../../models/api';
import { format } from 'date-fns';
import './Engineer.css';

const STATUS_COLORS = { 'On Track': { color: '#065f46', bg: '#d1fae5' }, 'Delayed': { color: '#92400e', bg: '#fef3c7' }, 'Blocked': { color: '#991b1b', bg: '#fee2e2' }, 'Completed': { color: '#5b21b6', bg: '#ede9fe' } };
const SEVERITY_COLORS = { 'Low': '#3b82f6', 'Medium': '#f59e0b', 'High': '#ef4444', 'Critical': '#7f1d1d' };
const LOG_STATUS_COLORS = { 'Open': '#f59e0b', 'Resolved': '#10b981' };

const EngineerReports = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('all');
    
    const [dailyReports, setDailyReports] = useState([]);
    const [supervisorReports, setSupervisorReports] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [safetyLogs, setSafetyLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        engineerAPI.getMyProjects().then(res => {
            if (res.success) setProjects(res.data);
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [activeTab, selectedProject]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'daily') {
                const res = await siteManagementAPI.getProjectReports(selectedProject);
                if (res.success) setDailyReports(res.data);
            } else if (activeTab === 'supervisor') {
                const res = await siteManagementAPI.getSupervisorReports(selectedProject);
                if (res.success) setSupervisorReports(res.data);
            } else if (activeTab === 'attendance') {
                if (selectedProject !== 'all') {
                    const res = await siteManagementAPI.getProjectAttendance(selectedProject);
                    if (res.success) setAttendance(res.data);
                } else {
                    setAttendance([]); // Attendance requires a specific project
                }
            } else if (activeTab === 'safety') {
                // If "all", we might need to fetch logs for all projects, but the API currently supports specific projectId.
                // For simplicity, we assume 'all' isn't supported by the generic route if we used :projectId without 'all' handler.
                // Wait, I updated getProjectReports to handle 'all'. Did I do that for Safety? No. Let's just require project selection for safety & attendance, or fetch for the first project if 'all'.
                if (selectedProject !== 'all') {
                    const res = await siteManagementAPI.getProjectSafetyLogs(selectedProject);
                    if (res.success) setSafetyLogs(res.data);
                } else {
                    setSafetyLogs([]);
                }
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

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
                {[
                    { id: 'daily', label: 'Daily Reports', icon: <ClipboardList size={15}/> },
                    { id: 'supervisor', label: 'Supervisor Logs', icon: <Box size={15}/> },
                    { id: 'attendance', label: 'Attendance', icon: <Users size={15}/> },
                    { id: 'safety', label: 'Safety Logs', icon: <ShieldAlert size={15}/> }
                ].map(t => (
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
                            {dailyReports.length === 0 ? (
                                <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                                    <ClipboardList size={36}/>
                                    <p>No daily reports found.</p>
                                </div>
                            ) : dailyReports.map(r => {
                                const sc = STATUS_COLORS[r.workStatus] || { color: '#374151', bg: '#f3f4f6' };
                                return (
                                    <div key={r._id} className="eng-report-card">
                                        <div className="eng-report-header">
                                            <span className="eng-report-title">{format(new Date(r.date), 'dd MMM yyyy')}</span>
                                            <span className="eng-badge" style={{ background: sc.bg, color: sc.color }}>{r.workStatus}</span>
                                        </div>
                                        <div className="eng-report-meta">
                                            <span><strong>Project:</strong> {r.project?.projectName}</span>
                                            <span><strong>Weather:</strong> {r.weather}</span>
                                            {r.workersPresent && <span><strong>Workers:</strong> {r.workersPresent}</span>}
                                        </div>
                                        <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.5 }}>
                                            <strong>Work Done:</strong><br/>
                                            <div style={{ marginTop: 4 }}>{r.workDone}</div>
                                        </div>
                                        {r.issues && (
                                            <div style={{ fontSize: 13, color: '#ef4444' }}>
                                                <strong>Issues:</strong> {r.issues}
                                            </div>
                                        )}
                                        {r.nextDayPlan && (
                                            <div style={{ fontSize: 13, color: '#6366f1' }}>
                                                <strong>Tomorrow:</strong> {r.nextDayPlan}
                                            </div>
                                        )}
                                        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#94a3b8' }}>
                                            By {r.submittedBy?.fullName} ({r.submittedBy?.role})
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* SUPERVISOR REPORTS TAB */}
                    {activeTab === 'supervisor' && (
                        <div className="eng-reports-grid">
                            {supervisorReports.length === 0 ? (
                                <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                                    <Box size={36}/>
                                    <p>No supervisor logs found.</p>
                                </div>
                            ) : supervisorReports.map(r => (
                                <div key={r._id} className="eng-report-card">
                                    <div className="eng-report-header">
                                        <span className="eng-report-title">{format(new Date(r.date), 'dd MMM yyyy')}</span>
                                        <span className="eng-badge" style={{ background: '#f8fafc', color: '#475569' }}>Log</span>
                                    </div>
                                    <div className="eng-report-meta">
                                        <span><strong>Project:</strong> {r.project?.projectName}</span>
                                        {r.laborCount && <span><strong>Laborers:</strong> {r.laborCount}</span>}
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {r.materialReceived && <div style={{ fontSize: 13, background: '#f8fafc', padding: '8px', borderRadius: 8 }}><strong>Received:</strong> {r.materialReceived}</div>}
                                        {r.materialUsed && <div style={{ fontSize: 13, background: '#f8fafc', padding: '8px', borderRadius: 8 }}><strong>Used:</strong> {r.materialUsed}</div>}
                                    </div>

                                    {r.equipmentStatus?.length > 0 && r.equipmentStatus.some(eq => eq.equipmentName) && (
                                        <div>
                                            <strong style={{ fontSize: 13, color: '#334155' }}>Equipment Status:</strong>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                                                {r.equipmentStatus.filter(eq => eq.equipmentName).map((eq, i) => (
                                                    <span key={i} className="eng-badge" style={{ background: eq.status==='Working'?'#d1fae5':eq.status==='Broken'?'#fee2e2':'#fef3c7', color: eq.status==='Working'?'#065f46':eq.status==='Broken'?'#991b1b':'#92400e' }}>
                                                        {eq.equipmentName}: {eq.status}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {r.comments && <p style={{ fontSize: 13, color: '#475569', fontStyle: 'italic', margin: 0 }}>"{r.comments}"</p>}
                                    
                                    <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#94a3b8' }}>
                                        By {r.submittedBy?.fullName} ({r.submittedBy?.role})
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ATTENDANCE TAB */}
                    {activeTab === 'attendance' && (
                        <div className="eng-reports-grid">
                            {selectedProject === 'all' ? (
                                <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                                    <Users size={36}/>
                                    <p>Please select a specific project to view attendance.</p>
                                </div>
                            ) : attendance.length === 0 ? (
                                <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                                    <Users size={36}/>
                                    <p>No attendance records found for this project.</p>
                                </div>
                            ) : (
                                attendance.map(a => (
                                    <div key={a._id} className="eng-section-card" style={{ marginBottom: 0 }}>
                                        <div className="eng-section-header">
                                            <div className="eng-section-title">
                                                <Users size={16}/> Attendance: {format(new Date(a.date), 'dd MMM yyyy')}
                                            </div>
                                            <div className="eng-task-count">By {a.submittedBy?.fullName}</div>
                                        </div>
                                        <div className="eng-table-wrapper">
                                            <table className="eng-table eng-table-scrollable">
                                                <thead>
                                                    <tr>
                                                        <th>Worker Name</th>
                                                        <th>Role</th>
                                                        <th>Status</th>
                                                        <th>Time In/Out</th>
                                                        <th>Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {a.records.map((r, i) => (
                                                        <tr key={i}>
                                                            <td style={{ fontWeight: 600 }}>{r.workerName}</td>
                                                            <td>{r.role}</td>
                                                            <td>
                                                                <span style={{ color: r.status === 'Present' ? '#10b981' : r.status === 'Absent' ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                                                                    {r.status}
                                                                </span>
                                                            </td>
                                                            <td>{r.status === 'Absent' ? '—' : `${r.checkInTime} - ${r.checkOutTime}`}</td>
                                                            <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.notes || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* SAFETY TAB */}
                    {activeTab === 'safety' && (
                        <div className="eng-reports-grid">
                            {selectedProject === 'all' ? (
                                <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                                    <ShieldAlert size={36}/>
                                    <p>Please select a specific project to view safety logs.</p>
                                </div>
                            ) : safetyLogs.length === 0 ? (
                                <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                                    <ShieldAlert size={36}/>
                                    <p>No safety logs found for this project.</p>
                                </div>
                            ) : (
                                safetyLogs.map(log => (
                                    <div key={log._id} className="eng-report-card" style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <div style={{ padding: 10, background: SEVERITY_COLORS[log.severity] + '15', borderRadius: 10, color: SEVERITY_COLORS[log.severity] }}>
                                            <ShieldAlert size={22} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div className="eng-report-header" style={{ marginBottom: 4 }}>
                                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                    <span className="eng-report-title">{log.type}</span>
                                                    <span className="eng-badge" style={{ background: SEVERITY_COLORS[log.severity] + '20', color: SEVERITY_COLORS[log.severity] }}>{log.severity}</span>
                                                </div>
                                                <span className="eng-badge" style={{ display: 'flex', alignItems: 'center', gap: 4, background: LOG_STATUS_COLORS[log.status] + '15', color: LOG_STATUS_COLORS[log.status] }}>
                                                    {log.status === 'Resolved' ? <CheckCircle2 size={12}/> : <Clock size={12}/>} {log.status}
                                                </span>
                                            </div>
                                            <p style={{ margin: '8px 0', fontSize: 14, color: '#475569', lineHeight: 1.5 }}>{log.description}</p>
                                            {log.actionTaken && (
                                                <div style={{ fontSize: 13, background: '#f8fafc', padding: '10px 14px', borderRadius: 8, color: '#334155', border: '1px solid #f1f5f9', marginBottom: 10 }}>
                                                    <strong>Action Taken:</strong> {log.actionTaken}
                                                </div>
                                            )}
                                            <div style={{ fontSize: 12, color: '#94a3b8' }}>
                                                By {log.reportedBy?.fullName} · {format(new Date(log.date), 'dd MMM yyyy')}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EngineerReports;
