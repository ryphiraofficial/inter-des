import React from 'react';
import { Box } from 'lucide-react';
import { format } from 'date-fns';

const SupervisorReportsTab = ({ supervisorReports }) => {
    if (supervisorReports.length === 0) {
        return (
            <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                <Box size={36}/>
                <p>No supervisor logs found.</p>
            </div>
        );
    }

    return supervisorReports.map(r => (
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
    ));
};

export default SupervisorReportsTab;
