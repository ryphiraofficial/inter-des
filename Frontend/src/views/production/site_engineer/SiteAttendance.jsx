import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSiteAttendance } from './hooks/useSiteAttendance';
import AttendanceHeader from './components/SiteAttendance/AttendanceHeader';
import AttendanceTable from './components/SiteAttendance/AttendanceTable';
import './Site.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const SiteAttendance = ({}) => {
    const user = useAppSelector(selectUser);
    const {
        projects, selectedProject, setSelectedProject,
        date, setDate,
        records,
        submitting, submitted, loading, error,
        handleAddRow, handleRemoveRow, handleChange, markAllPresent, handleSubmit
    } = useSiteAttendance();

    return (
        <div className="site-attendance-container">
            {submitted && (
                <div className="site-toast" style={{ background: '#10b981' }}>
                    <CheckCircle2 size={16} /> Attendance saved successfully!
                </div>
            )}
            
            <AttendanceHeader 
                projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject}
                date={date} setDate={setDate} markAllPresent={markAllPresent} 
                handleSubmit={handleSubmit} submitting={submitting}
            />

            {error && (
                <div style={{ color: '#ef4444', marginBottom: 15, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <AlertTriangle size={14}/> {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading records...</div>
            ) : (
                <AttendanceTable 
                    records={records} handleChange={handleChange} 
                    handleRemoveRow={handleRemoveRow} handleAddRow={handleAddRow}
                />
            )}
        </div>
    );
};

export default SiteAttendance;
