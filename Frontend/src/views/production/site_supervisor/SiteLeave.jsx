import React, { useState, useEffect } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import { CalendarOff, Send, CheckCircle2, Clock, XCircle, Loader2, Paperclip } from 'lucide-react';
import DateRangePicker from '../project_engineer/DateRangePicker';
import './Site.css';
import { useGetMyLeavesQuery, useSubmitLeaveMutation } from '../../../store/api/productionApi';
import { useUploadImageMutation } from '../../../store/api/sharedApi';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Annual Leave', 'Work From Home'];
const STATUS_STYLE = {
    Pending:  { color:'#92400e', bg:'#fef3c7', icon:<Clock size={13}/> },
    Approved: { color:'#065f46', bg:'#d1fae5', icon:<CheckCircle2 size={13}/> },
    Rejected: { color:'#991b1b', bg:'#fee2e2', icon:<XCircle size={13}/> },
};

const SiteLeave = () => {
    const [form, setForm] = useState({ leaveType:'', dateRange:{ from:null, to:null }, reason:'' });
    const [submitted,  setSubmitted]  = useState(false);
    const [errors,     setErrors]     = useState({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data: historyRes, isLoading: loadingHistory } = useGetMyLeavesQuery();
    const [submitLeave, { isLoading: submitting }] = useSubmitLeaveMutation();
    const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
    const [attachmentFile, setAttachmentFile] = useState(null);

    const history = historyRes?.success ? historyRes.data : [];

    useEffect(() => {
        const handleOpenDrawer = () => setIsDrawerOpen(true);
        window.addEventListener('open-new-leave-drawer', handleOpenDrawer);
        return () => window.removeEventListener('open-new-leave-drawer', handleOpenDrawer);
    }, []);

    const validate = () => {
        const e = {};
        if (!form.leaveType)       e.leaveType = 'Select a leave type';
        if (!form.dateRange?.from) e.dateRange = 'Select a date range';
        if (!form.reason.trim())   e.reason    = 'Reason is required';
        return e;
    };

    const calcDays = () => {
        if (!form.dateRange?.from) return 0;
        if (!form.dateRange?.to)   return 1;
        return differenceInCalendarDays(form.dateRange.to, form.dateRange.from) + 1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        
        try {
            let attachmentUrl = '';
            if (attachmentFile) {
                const formData = new FormData();
                formData.append('image', attachmentFile);
                const res = await uploadImage(formData).unwrap();
                if (res.success) attachmentUrl = res.url;
            }

            const payload = {
                leaveType: form.leaveType,
                fromDate: form.dateRange.from,
                toDate: form.dateRange.to || form.dateRange.from,
                days: calcDays(),
                reason: form.reason,
                ...(attachmentUrl && { attachment: attachmentUrl })
            };
            await submitLeave(payload).unwrap();
            
            setForm({ leaveType:'', dateRange:{ from:null, to:null }, reason:'' });
            setAttachmentFile(null);
            setErrors({});
            setSubmitted(true);
            setIsDrawerOpen(false);
            setTimeout(() => setSubmitted(false), 4000);
        } catch (error) {
            console.error('Failed to submit leave', error);
        }
    };

    const days = calcDays();

    return (
        <div className="site-page">
            {submitted && (
                <div className="site-toast" style={{background:'#10b981',display:'flex',alignItems:'center',gap:8}}>
                    <CheckCircle2 size={16}/> Leave request submitted!
                </div>
            )}

            {/* History */}
            <div className="site-card">
                    <div className="site-card-header">
                        <div className="site-card-title"><Clock size={15}/>My Applications</div>
                        <span className="site-count">{history.length}</span>
                    </div>
                    {loadingHistory ? (
                        <div style={{padding:40, textAlign:'center', color:'#64748b'}}>Loading history...</div>
                    ) : history.length===0 ? (
                        <div className="site-empty" style={{padding:52}}>
                            <CalendarOff size={36}/><p>No applications yet</p><span>Submitted requests will appear here.</span>
                        </div>
                    ) : (
                        <div style={{padding:'8px 0'}}>
                            {history.map(h=>{
                                const st=STATUS_STYLE[h.status]||STATUS_STYLE.Pending;
                                return (
                                    <div key={h._id || h.id} className="site-leave-card">
                                        <div className="site-leave-card-top">
                                            <span className="site-leave-type-chip">{h.leaveType}</span>
                                            <span className="site-badge" style={{color:st.color,background:st.bg,display:'flex',alignItems:'center',gap:4}}>
                                                {st.icon}{h.status}
                                            </span>
                                        </div>
                                        <div className="site-leave-dates">
                                            <CalendarOff size={12}/>
                                            {format(new Date(h.fromDate),'dd MMM yyyy')}
                                            {h.toDate&&h.toDate!==h.fromDate&&<> → {format(new Date(h.toDate),'dd MMM yyyy')}</>}
                                            <span className="site-leave-days">· {h.days} day{h.days>1?'s':''}</span>
                                        </div>
                                        <p className="site-leave-reason">{h.reason}</p>
                                        {h.managerComments && (
                                            <div style={{ marginTop: 8, fontSize: 12, padding: 8, background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                                                <strong>Manager Note:</strong> {h.managerComments}
                                            </div>
                                        )}
                                        {h.attachment && (
                                            <div style={{ marginTop: 8 }}>
                                                <a href={h.attachment.startsWith('http') ? h.attachment : `http://localhost:5000${h.attachment}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#3b82f6', textDecoration: 'none', background: '#eff6ff', padding: '4px 8px', borderRadius: 4, border: '1px solid #bfdbfe' }}>
                                                    <Paperclip size={12}/> View Attachment
                                                </a>
                                            </div>
                                        )}
                                        <span className="site-leave-applied">Applied: {format(new Date(h.createdAt || h.appliedOn || Date.now()),'dd MMM yyyy')}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {isDrawerOpen && (
                    <div className="site-drawer-overlay" onClick={(e) => { if(e.target.className === 'site-drawer-overlay') setIsDrawerOpen(false); }}>
                        <div className="site-drawer">
                            <div className="site-drawer-header">
                                <div className="site-drawer-title"><Send size={15}/>New Application</div>
                                <button className="site-drawer-close" type="button" onClick={() => setIsDrawerOpen(false)}><XCircle size={18}/></button>
                            </div>
                            <div className="site-drawer-body">
                                <form onSubmit={handleSubmit} className="site-leave-form">
                                    <div className="site-form-group">
                                        <label>Leave Type *</label>
                                        <div className="site-leave-type-grid">
                                            {LEAVE_TYPES.map(t=>(
                                                <button type="button" key={t}
                                                    className={`site-leave-type-btn${form.leaveType===t?' active':''}`}
                                                    onClick={()=>{ setForm(f=>({...f,leaveType:t})); setErrors(er=>({...er,leaveType:undefined})); }}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.leaveType && <span className="site-field-err">{errors.leaveType}</span>}
                                    </div>

                                    <div className="site-form-group">
                                        <label>Date Range *</label>
                                        <DateRangePicker
                                            value={form.dateRange}
                                            onChange={range=>{ setForm(f=>({...f,dateRange:range||{from:null,to:null}})); setErrors(er=>({...er,dateRange:undefined})); }}
                                            placeholder="Select leave dates"
                                            minDate={new Date()}
                                        />
                                        {errors.dateRange && <span className="site-field-err">{errors.dateRange}</span>}
                                    </div>

                                    {days>0 && (
                                        <div className="site-leave-duration">
                                            <Clock size={14}/>Duration: <strong>{days} day{days>1?'s':''}</strong>
                                            {form.dateRange?.from && (
                                                <span style={{color:'#64748b',fontWeight:400,fontSize:12}}>
                                                    &nbsp;({format(form.dateRange.from,'dd MMM')}{form.dateRange?.to&&form.dateRange.to!==form.dateRange.from?` – ${format(form.dateRange.to,'dd MMM yyyy')}`:` ${format(form.dateRange.from,'yyyy')}`})
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="site-form-group">
                                        <label>Reason *</label>
                                        <textarea className={`site-input${errors.reason?' site-input-err':''}`} rows={4}
                                            placeholder="Reason for leave…" value={form.reason}
                                            onChange={e=>{ setForm(f=>({...f,reason:e.target.value})); setErrors(er=>({...er,reason:undefined})); }}/>
                                        {errors.reason && <span className="site-field-err">{errors.reason}</span>}
                                    </div>

                                    <div className="site-form-group">
                                        <label>Attachment (Optional)</label>
                                        <input type="file" className="site-input" style={{padding: '8px'}} 
                                            onChange={e => setAttachmentFile(e.target.files[0])} />
                                    </div>

                                    <button type="submit" className="site-btn-primary"
                                        style={{width:'100%',justifyContent:'center',padding:12, marginTop: 10}} disabled={submitting || uploading}>
                                        {(submitting || uploading)?<><Loader2 size={15} className="site-spin"/>{uploading ? 'Uploading...' : 'Submitting…'}</>:<><Send size={15}/>Submit Leave Request</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default SiteLeave;
