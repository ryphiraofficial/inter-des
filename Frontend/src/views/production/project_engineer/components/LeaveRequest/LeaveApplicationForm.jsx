import React from 'react';
import { Send, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import DateRangePicker from '../../DateRangePicker';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Annual Leave', 'Work From Home'];

const LeaveApplicationForm = ({ form, setForm, errors, setErrors, calcDays, handleSubmit, submitting }) => {
    const days = calcDays();

    return (
        <div className="eng-section-card">
            <div className="eng-section-header">
                <div className="eng-section-title"><Send size={16}/> New Application</div>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Leave Type */}
                <div className="eng-form-group">
                    <label className="eng-form-label">Leave Type *</label>
                    <div className="eng-leave-type-grid">
                        {LEAVE_TYPES.map(t => (
                            <button type="button" key={t}
                                className={`eng-leave-type-btn ${form.leaveType === t ? 'active' : ''}`}
                                onClick={() => { setForm(f=>({...f, leaveType:t})); setErrors(er=>({...er,leaveType:undefined})); }}>
                                {t}
                            </button>
                        ))}
                    </div>
                    {errors.leaveType && <span className="eng-field-err">{errors.leaveType}</span>}
                </div>

                {/* Date Range Picker */}
                <div className="eng-form-group">
                    <label className="eng-form-label">Date Range *</label>
                    <DateRangePicker
                        value={form.dateRange}
                        onChange={(range) => {
                            setForm(f => ({ ...f, dateRange: range || { from:null, to:null } }));
                            setErrors(er => ({ ...er, dateRange: undefined }));
                        }}
                        placeholder="Select leave dates"
                        minDate={new Date()}
                    />
                    {errors.dateRange && <span className="eng-field-err">{errors.dateRange}</span>}
                </div>

                {/* Duration pill */}
                {days > 0 && (
                    <div className="eng-leave-duration">
                        <Clock size={14}/>
                        Duration: <strong>{days} day{days > 1 ? 's' : ''}</strong>
                        {form.dateRange?.from && (
                            <span style={{ color: '#166534', fontWeight: 400, fontSize: 12, opacity: 0.8 }}>
                                &nbsp;({format(form.dateRange.from,'dd MMM')}
                                {form.dateRange?.to && form.dateRange.to !== form.dateRange.from
                                    ? ` – ${format(form.dateRange.to,'dd MMM yyyy')}`
                                    : ` ${format(form.dateRange.from,'yyyy')}`})
                            </span>
                        )}
                    </div>
                )}

                {/* Reason */}
                <div className="eng-form-group">
                    <label className="eng-form-label">Reason *</label>
                    <textarea
                        className={`eng-input ${errors.reason ? 'eng-input-err' : ''}`}
                        rows={4}
                        placeholder="Briefly describe the reason for your leave…"
                        value={form.reason}
                        onChange={e => { setForm(f=>({...f,reason:e.target.value})); setErrors(er=>({...er,reason:undefined})); }}
                    />
                    {errors.reason && <span className="eng-field-err">{errors.reason}</span>}
                </div>

                <button type="submit" className="eng-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    disabled={submitting}>
                    {submitting
                        ? <><Loader2 size={15} className="eng-spin"/> Submitting…</>
                        : <><Send size={15}/> Submit Leave Request</>}
                </button>
            </form>
        </div>
    );
};

export default LeaveApplicationForm;
