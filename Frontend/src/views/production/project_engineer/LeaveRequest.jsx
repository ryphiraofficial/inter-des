import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import './Engineer.css';
import { useLeaveRequest } from './hooks/useLeaveRequest';
import LeaveApplicationForm from './components/LeaveRequest/LeaveApplicationForm';
import LeaveHistoryList from './components/LeaveRequest/LeaveHistoryList';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const LeaveRequest = ({}) => {
    const user = useAppSelector(selectUser);
    const {
        form, setForm,
        submitting, submitted,
        history, errors, setErrors,
        calcDays, handleSubmit
    } = useLeaveRequest();

    return (
        <div className="eng-dashboard">
            {submitted && (
                <div className="eng-toast" style={{ background: '#10b981' }}>
                    <CheckCircle2 size={16}/> Leave request submitted successfully!
                </div>
            )}

            <div className="eng-leave-grid">
                {/* ── Form ── */}
                <LeaveApplicationForm 
                    form={form} 
                    setForm={setForm} 
                    errors={errors} 
                    setErrors={setErrors} 
                    calcDays={calcDays} 
                    handleSubmit={handleSubmit} 
                    submitting={submitting} 
                />

                {/* ── History ── */}
                <LeaveHistoryList history={history} />
            </div>
        </div>
    );
};

export default LeaveRequest;
