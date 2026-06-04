import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
    useGetSupervisorReportsQuery, 
    useSubmitSupervisorReportMutation 
} from '../../../../store/api/productionApi';

export const useSupervisorReports = (projects) => {
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        projectId: '',
        reportDate: format(new Date(), 'yyyy-MM-dd'),
        materialReceived: '',
        materialUsed: '',
        laborCount: '',
        equipmentStatus: [{ equipmentName: '', status: 'Working' }],
        comments: ''
    });

    useEffect(() => {
        if (projects && projects.length > 0 && !form.projectId) {
            setForm(f => ({ ...f, projectId: projects[0]._id }));
        }
    }, [projects, form.projectId]);

    const { data: reportsRes } = useGetSupervisorReportsQuery(form.projectId, { skip: !form.projectId });
    const reports = reportsRes?.success ? reportsRes.data : [];

    const [submitSupervisorReport, { isLoading: submitting }] = useSubmitSupervisorReportMutation();

    const handleProjectChange = (projectId) => {
        setForm(f => ({ ...f, projectId }));
        setErrors(er => ({ ...er, projectId: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.projectId) e.projectId = 'Select a project';
        return e;
    };

    const addEquipment = () => setForm(f => ({ ...f, equipmentStatus: [...f.equipmentStatus, { equipmentName: '', status: 'Working' }] }));
    
    const updateEquipment = (index, field, value) => {
        const newEq = [...form.equipmentStatus];
        newEq[index][field] = value;
        setForm(f => ({ ...f, equipmentStatus: newEq }));
    };
    
    const removeEquipment = (index) => {
        const newEq = form.equipmentStatus.filter((_, i) => i !== index);
        setForm(f => ({ ...f, equipmentStatus: newEq }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        
        try {
            // Clean empty equipment
            const cleanEq = form.equipmentStatus.filter(eq => eq.equipmentName.trim() !== '');
            const payload = { ...form, equipmentStatus: cleanEq };
            
            await submitSupervisorReport(payload).unwrap();
            
            setForm({ 
                ...form, 
                reportDate: format(new Date(), 'yyyy-MM-dd'), 
                materialReceived: '', 
                materialUsed: '', 
                laborCount: '', 
                equipmentStatus: [{ equipmentName: '', status: 'Working' }], 
                comments: '' 
            });
            setErrors({});
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 4000);
        } catch (error) { 
            console.error('Failed to submit supervisor report', error); 
        }
    };

    return {
        reports,
        submitting,
        submitted,
        errors, setErrors,
        form, setForm,
        handleProjectChange,
        addEquipment,
        updateEquipment,
        removeEquipment,
        handleSubmit
    };
};
