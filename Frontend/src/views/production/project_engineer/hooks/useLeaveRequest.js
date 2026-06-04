import { useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { useGetMyLeavesQuery, useSubmitLeaveMutation } from '../../../../store/api/productionApi';

export const useLeaveRequest = () => {
    const [form, setForm] = useState({
        leaveType: '',
        dateRange: { from: null, to: null },
        reason: '',
    });
    const [submitted,  setSubmitted]  = useState(false);
    const [errors,     setErrors]     = useState({});

    const { data: historyRes, isLoading: loadingHistory } = useGetMyLeavesQuery();
    const [submitLeave, { isLoading: submitting }] = useSubmitLeaveMutation();

    const history = historyRes?.success ? historyRes.data : [];

    const validate = () => {
        const e = {};
        if (!form.leaveType)         e.leaveType = 'Please select a leave type';
        if (!form.dateRange?.from)   e.dateRange = 'Please select a date range';
        if (!form.reason.trim())     e.reason    = 'Reason is required';
        return e;
    };

    const calcDays = () => {
        if (!form.dateRange?.from || !form.dateRange?.to) return form.dateRange?.from ? 1 : 0;
        return differenceInCalendarDays(form.dateRange.to, form.dateRange.from) + 1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        
        try {
            const payload = {
                leaveType: form.leaveType,
                fromDate: form.dateRange.from,
                toDate: form.dateRange.to || form.dateRange.from,
                days: calcDays(),
                reason: form.reason
            };
            
            await submitLeave(payload).unwrap();
            
            setForm({ leaveType:'', dateRange:{ from:null, to:null }, reason:'' });
            setErrors({});
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 4000);
        } catch (error) {
            console.error('Failed to submit leave', error);
        }
    };

    return {
        form, setForm,
        submitting, submitted,
        history, errors, setErrors,
        calcDays, handleSubmit,
        loadingHistory
    };
};
