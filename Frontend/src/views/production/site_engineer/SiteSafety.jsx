import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Plus, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import './Site.css';
import { 
    useGetEngineerProjectsQuery, 
    useGetProjectSafetyLogsQuery, 
    useReportSafetyIssueMutation, 
    useUpdateSafetyLogStatusMutation 
} from '../../../store/api/productionApi';

const STATUS_COLORS = { 'Open': '#f59e0b', 'Resolved': '#10b981' };
const SEVERITY_COLORS = { 'Low': '#3b82f6', 'Medium': '#f59e0b', 'High': '#ef4444', 'Critical': '#7f1d1d' };

const SiteSafety = () => {
    const [showForm, setShowForm] = useState(false);
    
    const [form, setForm] = useState({
        projectId: '',
        type: 'Daily Check',
        severity: 'Low',
        description: '',
        actionTaken: '',
    });

    const { data: projectsRes } = useGetEngineerProjectsQuery();
    const projects = useMemo(() => projectsRes?.success ? projectsRes.data : [], [projectsRes]);

    useEffect(() => {
        if (projects.length > 0 && !form.projectId) {
            setForm(f => ({ ...f, projectId: projects[0]._id }));
        }
    }, [projects, form.projectId]);

    const { data: logsRes, isLoading: loadingLogs } = useGetProjectSafetyLogsQuery(form.projectId, { skip: !form.projectId });
    const logs = logsRes?.success ? logsRes.data : [];

    const [reportSafetyIssue] = useReportSafetyIssueMutation();
    const [updateSafetyLogStatus] = useUpdateSafetyLogStatusMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await reportSafetyIssue(form).unwrap();
            setShowForm(false);
            setForm(f => ({ ...f, description: '', actionTaken: '', severity: 'Low', type: 'Daily Check' }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleResolve = async (logId) => {
        try {
            await updateSafetyLogStatus({ logId, status: 'Resolved' }).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="site-safety-container">
            <div className="site-safety-header">
                <div className="site-form-group" style={{ margin: 0, minWidth: 200 }}>
                    <select className="site-input" value={form.projectId} onChange={(e) => {
                        setForm({...form, projectId: e.target.value});
                    }} style={{ height: 42 }}>
                        <option value="">Select Project</option>
                        {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                    </select>
                </div>
                <button className="site-btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={16} /> Log Incident / Check
                </button>
            </div>

            {showForm && (
                <div className="site-card" style={{ marginBottom: 24, borderLeft: '4px solid #ef4444' }}>
                    <div className="site-card-header">
                        <div className="site-card-title"><ShieldAlert size={18} color="#ef4444" /> New Safety Log</div>
                    </div>
                    <form onSubmit={handleSubmit} className="site-report-form">
                        <div className="site-form-row">
                            <div className="site-form-group">
                                <label className="shad-form-label">Log Type</label>
                                <select className="site-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                    <option value="Daily Check">Daily Check</option>
                                    <option value="Incident">Incident</option>
                                    <option value="Hazard">Hazard Warning</option>
                                </select>
                            </div>
                            <div className="site-form-group">
                                <label className="shad-form-label">Severity</label>
                                <select className="site-input" value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>
                        <div className="site-form-group">
                            <label className="shad-form-label">Description</label>
                            <textarea className="site-input" required rows={3} placeholder="Describe the incident or safety check..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                        </div>
                        <div className="site-form-group">
                            <label className="shad-form-label">Action Taken (Optional)</label>
                            <input className="site-input" type="text" placeholder="What was done to address this?" value={form.actionTaken} onChange={e => setForm({...form, actionTaken: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                            <button type="button" className="site-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="site-btn-primary">Submit Log</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="site-safety-list">
                {loadingLogs ? <div className="site-loading">Loading safety logs...</div> : 
                 logs.length === 0 ? (
                     <div className="site-empty" style={{ padding: '60px 24px' }}>
                        <ShieldAlert size={40} style={{ opacity: 0.3 }} />
                        <p>No safety logs yet</p>
                        <span>Logs for this project will appear here.</span>
                     </div>
                 ) : (
                 logs.map(log => (
                    <div key={log._id} className="site-safety-card">
                        <div className="site-safety-icon" style={{ background: SEVERITY_COLORS[log.severity] + '15', color: SEVERITY_COLORS[log.severity] }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="site-safety-top">
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <h4 className="site-safety-type">{log.type}</h4>
                                    <span className="site-badge" style={{ background: SEVERITY_COLORS[log.severity] + '20', color: SEVERITY_COLORS[log.severity] }}>{log.severity}</span>
                                </div>
                                <span className="site-badge" style={{ color: STATUS_COLORS[log.status], background: STATUS_COLORS[log.status] + '15', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {log.status === 'Resolved' ? <CheckCircle2 size={12}/> : <Clock size={12}/>} {log.status}
                                </span>
                            </div>
                            <p className="site-safety-desc">{log.description}</p>
                            {log.actionTaken && (
                                <div className="site-safety-action">
                                    <strong>Action Taken:</strong> {log.actionTaken}
                                </div>
                            )}
                            <div className="site-safety-footer">
                                <span>Reported by {log.reportedBy?.fullName || 'User'} on {format(new Date(log.date), 'MMM dd, yyyy')}</span>
                                {log.status === 'Open' && (
                                    <button onClick={() => handleResolve(log._id)} className="site-resolve-btn">Mark Resolved</button>
                                )}
                            </div>
                        </div>
                    </div>
                 )))}
            </div>
        </div>
    );
};

export default SiteSafety;
