import React from 'react';
import { ClipboardList } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = { 'On Track': { color: '#065f46', bg: '#d1fae5' }, 'Delayed': { color: '#92400e', bg: '#fef3c7' }, 'Blocked': { color: '#991b1b', bg: '#fee2e2' }, 'Completed': { color: '#5b21b6', bg: '#ede9fe' } };

const DailyReportsTab = ({ dailyReports }) => {
    if (dailyReports.length === 0) {
        return (
            <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                <ClipboardList size={36}/>
                <p>No daily reports found.</p>
            </div>
        );
    }

    return dailyReports.map(r => {
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
    });
};

export default DailyReportsTab;
