import React from 'react';
import { ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

const SEVERITY_COLORS = { 'Low': '#3b82f6', 'Medium': '#f59e0b', 'High': '#ef4444', 'Critical': '#7f1d1d' };
const LOG_STATUS_COLORS = { 'Open': '#f59e0b', 'Resolved': '#10b981' };

const SafetyTab = ({ selectedProject, safetyLogs }) => {
    if (selectedProject === 'all') {
        return (
            <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                <ShieldAlert size={36}/>
                <p>Please select a specific project to view safety logs.</p>
            </div>
        );
    }
    
    if (safetyLogs.length === 0) {
        return (
            <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                <ShieldAlert size={36}/>
                <p>No safety logs found for this project.</p>
            </div>
        );
    }

    return safetyLogs.map(log => (
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
    ));
};

export default SafetyTab;
