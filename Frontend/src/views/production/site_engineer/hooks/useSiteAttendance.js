import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { 
    useGetEngineerProjectsQuery, 
    useGetProjectAttendanceQuery, 
    useSubmitAttendanceMutation 
} from '../../../../store/api/productionApi';

export const useSiteAttendance = () => {
    const [selectedProject, setSelectedProject] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [records, setRecords] = useState([
        { id: 1, workerName: '', role: 'Laborer', status: 'Present', checkInTime: '09:00', checkOutTime: '18:00', notes: '' }
    ]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const { data: projectsRes } = useGetEngineerProjectsQuery();
    const projects = useMemo(() => projectsRes?.success ? projectsRes.data : [], [projectsRes]);

    useEffect(() => {
        if (projects.length > 0 && !selectedProject) {
            setSelectedProject(projects[0]._id);
        }
    }, [projects, selectedProject]);

    const { data: attendanceRes, isLoading: loadingAttendance } = useGetProjectAttendanceQuery(selectedProject, { skip: !selectedProject || !date });
    const [submitAttendance, { isLoading: submitting }] = useSubmitAttendanceMutation();

    useEffect(() => {
        let timer;
        if (submitted) {
            timer = setTimeout(() => setSubmitted(false), 3000);
        }
        return () => clearTimeout(timer);
    }, [submitted]);

    useEffect(() => {
        if (attendanceRes?.success) {
            const todayRecord = attendanceRes.data.find(a => format(new Date(a.date), 'yyyy-MM-dd') === date);
            if (todayRecord && todayRecord.records.length > 0) {
                setRecords(todayRecord.records.map((r, i) => ({ ...r, id: i })));
            } else {
                setRecords([{ id: Date.now(), workerName: '', role: 'Laborer', status: 'Present', checkInTime: '09:00', checkOutTime: '18:00', notes: '' }]);
            }
        }
    }, [attendanceRes, date]);

    const handleAddRow = () => {
        setRecords([...records, { id: Date.now(), workerName: '', role: 'Laborer', status: 'Present', checkInTime: '09:00', checkOutTime: '18:00', notes: '' }]);
    };

    const handleRemoveRow = (id) => {
        setRecords(records.filter(r => r.id !== id));
    };

    const handleChange = (id, field, value) => {
        setRecords(records.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const markAllPresent = () => {
        setRecords(records.map(r => ({ ...r, status: 'Present' })));
    };

    const handleSubmit = async () => {
        if (!selectedProject) {
            setError('Please select a project');
            return;
        }

        const validRecords = records.filter(r => r.workerName.trim() !== '');
        if (validRecords.length === 0) {
            setError('Please enter at least one worker name');
            return;
        }

        setError(null);
        try {
            await submitAttendance({
                projectId: selectedProject,
                date: new Date(date).toISOString(),
                records: validRecords
            }).unwrap();
            
            setSubmitted(true);
        } catch (err) {
            setError(err.data?.message || err.message || 'An error occurred while saving attendance');
        }
    };

    return {
        projects, selectedProject, setSelectedProject,
        date, setDate,
        records,
        submitting, submitted, loading: loadingAttendance, error,
        handleAddRow, handleRemoveRow, handleChange, markAllPresent, handleSubmit
    };
};
