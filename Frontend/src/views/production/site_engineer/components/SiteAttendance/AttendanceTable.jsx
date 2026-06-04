import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import CustomSelect from '../../../../common/CustomSelect';

const ROLE_OPTIONS = [
    { value: 'Laborer', label: 'Laborer' },
    { value: 'Carpenter', label: 'Carpenter' },
    { value: 'Electrician', label: 'Electrician' },
    { value: 'Plumber', label: 'Plumber' },
    { value: 'Painter', label: 'Painter' },
    { value: 'Supervisor', label: 'Supervisor' },
];

const STATUS_OPTIONS = [
    { value: 'Present', label: 'Present' },
    { value: 'Half-Day', label: 'Half-Day' },
    { value: 'Absent', label: 'Absent' },
];

const AttendanceTable = ({ records, handleChange, handleRemoveRow, handleAddRow }) => {
    return (
        <>
            <div className="site-table-wrapper">
                <table className="site-table site-table-scrollable">
                    <thead>
                        <tr>
                            <th>Worker Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>In / Out Time</th>
                            <th>Notes</th>
                            <th style={{ width: 48 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r, index) => (
                            <tr key={r.id || index}>
                                <td>
                                    <input
                                        type="text"
                                        className="site-form-input"
                                        placeholder="e.g. John Doe"
                                        value={r.workerName}
                                        onChange={(e) => handleChange(r.id, 'workerName', e.target.value)}
                                    />
                                </td>
                                <td style={{ minWidth: 160 }}>
                                    <CustomSelect
                                        options={ROLE_OPTIONS}
                                        value={r.role}
                                        onChange={(e) => handleChange(r.id, 'role', e.target.value)}
                                    />
                                </td>
                                <td style={{ minWidth: 140 }}>
                                    <CustomSelect
                                        options={STATUS_OPTIONS}
                                        value={r.status}
                                        onChange={(e) => handleChange(r.id, 'status', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <input
                                            type="time"
                                            className="site-form-input"
                                            value={r.checkInTime}
                                            onChange={(e) => handleChange(r.id, 'checkInTime', e.target.value)}
                                            disabled={r.status === 'Absent'}
                                            style={{ width: 120 }}
                                        />
                                        <span style={{ color: '#94a3b8', flexShrink: 0 }}>–</span>
                                        <input
                                            type="time"
                                            className="site-form-input"
                                            value={r.checkOutTime}
                                            onChange={(e) => handleChange(r.id, 'checkOutTime', e.target.value)}
                                            disabled={r.status === 'Absent'}
                                            style={{ width: 120 }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="site-form-input"
                                        placeholder="Notes (optional)"
                                        value={r.notes}
                                        onChange={(e) => handleChange(r.id, 'notes', e.target.value)}
                                    />
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="site-row-del-btn" onClick={() => handleRemoveRow(r.id)}>
                                        <Trash2 size={13} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="site-add-row-btn" onClick={handleAddRow}>
                <Plus size={14} /> Add Worker
            </button>
        </>
    );
};

export default AttendanceTable;
