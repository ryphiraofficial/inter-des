import React from 'react';
import { Send, Loader2, ClipboardList, Target, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ShadSelect, ShadCalendar } from './SharedUI';
import { useSiteReports } from '../../hooks/useSiteReports';

const WORK_STATUS = ['On Track', 'Delayed', 'Blocked', 'Completed'];
const WEATHER = ['Clear', 'Cloudy', 'Rainy', 'Windy'];
const STATUS_COLORS = { 'On Track': { color: '#065f46', bg: '#d1fae5' }, 'Delayed': { color: '#92400e', bg: '#fef3c7' }, 'Blocked': { color: '#991b1b', bg: '#fee2e2' }, 'Completed': { color: '#5b21b6', bg: '#ede9fe' } };

const DailyReports = () => {
    const {
        projects,
        reports,
        submitting,
        submitted,
        errors, setErrors,
        form, setForm,
        handleProjectChange,
        handleSubmit,
        roleUsers,
        fetchingUsers
    } = useSiteReports();

    return (
        <div className="site-report-split">
            {submitted && (
                <div className="site-toast" style={{ background: '#10b981' }}>
                    <CheckCircle2 size={16} /> Site report submitted!
                </div>
            )}
            
            <div className="site-card">
                <div className="site-card-header">
                    <div className="site-card-title"><Send size={15} /> New Report</div>
                </div>
                <form onSubmit={handleSubmit} className="site-report-form">
                    <div className="site-form-row">
                        <ShadSelect
                            label="Project *"
                            placeholder="Select project..."
                            value={form.projectId}
                            options={projects.map(p => ({ id: p._id, name: p.projectName }))}
                            onChange={handleProjectChange}
                            error={errors.projectId}
                        />
                        <ShadCalendar
                            label="Report Date"
                            value={form.reportDate}
                            onChange={v => setForm(f => ({ ...f, reportDate: v }))}
                        />
                    </div>

                    <div className="site-form-row">
                        <ShadSelect
                            label="Send To Role"
                            value={form.sendToRole}
                            options={['Project Manager', 'Admin', 'Manager', 'Design Manager', 'Procurement Manager', 'Accounts Manager']}
                            onChange={v => setForm(f => ({ ...f, sendToRole: v }))}
                        />
                        <div className="site-form-group">
                            <label className="shad-form-label">Assigned Person</label>
                            {fetchingUsers ? (
                                <div style={{ fontSize: '13px', color: '#64748b', padding: '10px 0' }}>Loading users...</div>
                            ) : (
                                <ShadSelect
                                    value={form.sendToUser}
                                    options={roleUsers.map(u => ({ id: u._id, name: u.fullName || u.email }))}
                                    onChange={v => setForm(f => ({ ...f, sendToUser: v }))}
                                    placeholder={`Select ${form.sendToRole}...`}
                                />
                            )}
                        </div>
                    </div>

                    <div className="site-form-row" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                        <div className="site-form-group">
                            <label className="shad-form-label">Work Status</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {WORK_STATUS.map(s => (
                                    <button
                                        type="button"
                                        key={s}
                                        className={`site-status-chip ${form.workStatus === s ? 'active' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, workStatus: s }))}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ShadSelect
                            label="Weather"
                            value={form.weather}
                            options={WEATHER}
                            onChange={v => setForm(f => ({ ...f, weather: v }))}
                        />
                    </div>

                    <div className="site-form-group">
                        <label className="shad-form-label">Workers Present</label>
                        <input type="number" min={0} className="site-input" placeholder="Number of workers on site"
                            value={form.workersPresent} onChange={e => setForm(f => ({ ...f, workersPresent: e.target.value }))} />
                    </div>

                    <div className="site-form-group">
                        <label className="shad-form-label">Work Done Today *</label>
                        <textarea className={`site-input ${errors.workDone ? 'site-input-err' : ''}`} rows={4}
                            placeholder="Describe the work completed today…"
                            value={form.workDone} onChange={e => { setForm(f => ({ ...f, workDone: e.target.value })); setErrors(er => ({ ...er, workDone: undefined })); }} />
                        {errors.workDone && <span className="site-field-err">{errors.workDone}</span>}
                    </div>

                    <div className="site-form-row">
                        <div className="site-form-group">
                            <label className="shad-form-label">Issues / Blockers</label>
                            <textarea className="site-input" rows={3} placeholder="Any issues encountered…"
                                value={form.issues} onChange={e => setForm(f => ({ ...f, issues: e.target.value }))} />
                        </div>
                        <div className="site-form-group">
                            <label className="shad-form-label">Next Day Plan</label>
                            <textarea className="site-input" rows={3} placeholder="Plan for tomorrow…"
                                value={form.nextDayPlan} onChange={e => setForm(f => ({ ...f, nextDayPlan: e.target.value }))} />
                        </div>
                    </div>

                    <button type="submit" className="site-btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', marginTop: '10px' }} disabled={submitting}>
                        {submitting ? <><Loader2 size={15} className="site-spin" /> Submitting…</> : <><Send size={15} /> Submit Report</>}
                    </button>
                </form>
            </div>

            <div className="site-card">
                <div className="site-card-header">
                    <div className="site-card-title"><ClipboardList size={15}/> Report History</div>
                    <span className="site-count">{reports.length}</span>
                </div>
                {reports.length === 0 ? (
                    <div className="site-empty" style={{padding:52}}>
                        <Target size={40}/><p>No reports yet</p><span>Submitted reports will appear here.</span>
                    </div>
                ) : (
                    <div style={{padding:'8px 0'}}>
                        {reports.map(r=>{
                            const sc = STATUS_COLORS[r.workStatus]||{color:'#374151',bg:'#f3f4f6'};
                            return (
                                <div key={r._id || r.id} className="site-report-card">
                                    <div className="site-report-card-top">
                                        <span className="site-report-date">{format(new Date(r.date || r.reportDate),'dd MMM yyyy')}</span>
                                        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                                            <span className="site-report-project">{r.project?.projectName || r.projectName}</span>
                                            <span className="site-badge" style={{color:sc.color,background:sc.bg}}>{r.workStatus}</span>
                                            <span style={{fontSize:11,color:'#94a3b8'}}>{r.weather}</span>
                                            {r.workersPresent && <span style={{fontSize:11,color:'#64748b'}}>👷 {r.workersPresent}</span>}
                                        </div>
                                    </div>
                                    <p className="site-report-body">{r.workDone}</p>
                                    {r.issues && <p style={{fontSize:12,color:'#ef4444',margin:'2px 0 0'}}><strong>Issue:</strong> {r.issues}</p>}
                                    {r.nextDayPlan && <p style={{fontSize:12,color:'#6366f1',margin:'2px 0 0'}}><strong>Tomorrow:</strong> {r.nextDayPlan}</p>}
                                    <span className="site-report-meta">Submitted by {r.submittedBy?.fullName || r.submittedBy} on {format(new Date(r.createdAt),'dd MMM yyyy, HH:mm')}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyReports;
