import React from 'react';
import { Users } from 'lucide-react';
import { format } from 'date-fns';

const AttendanceTab = ({ selectedProject, attendance }) => {
    if (selectedProject === 'all') {
        return (
            <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                <Users size={36}/>
                <p>Please select a specific project to view attendance.</p>
            </div>
        );
    }
    
    if (attendance.length === 0) {
        return (
            <div className="eng-empty" style={{ gridColumn: '1 / -1' }}>
                <Users size={36}/>
                <p>No attendance records found for this project.</p>
            </div>
        );
    }

    return attendance.map(a => (
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
    ));
};

export default AttendanceTab;
