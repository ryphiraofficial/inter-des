import React from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import CustomSelect from '../../../../common/CustomSelect';
import DatePicker from '../../../../common/DatePicker';

const AttendanceHeader = ({ 
    projects, selectedProject, setSelectedProject, 
    date, setDate, markAllPresent, handleSubmit, submitting 
}) => {
    return (
        <div className="site-attendance-header" style={{ marginBottom: 20, display: 'flex', gap: 15, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="site-form-group" style={{ margin: 0, minWidth: 220 }}>
                <label className="shad-form-label">Project</label>
                <CustomSelect
                    options={[{ value: '', label: 'Select Project...' }, ...projects.map(p => ({ value: p._id, label: p.projectName }))]}
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    placeholder="Select Project..."
                />
            </div>
            <div className="site-form-group" style={{ margin: 0, minWidth: 190 }}>
                <label className="shad-form-label">Date</label>
                <DatePicker
                    value={date}
                    onChange={(val) => setDate(val)}
                />
            </div>
            <button className="site-btn-secondary" onClick={markAllPresent} style={{ marginLeft: 'auto' }}>
                <CheckCircle2 size={16} /> Mark All Present
            </button>
            <button className="site-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : <><Save size={16} /> Save Attendance</>}
            </button>
        </div>
    );
};

export default AttendanceHeader;
