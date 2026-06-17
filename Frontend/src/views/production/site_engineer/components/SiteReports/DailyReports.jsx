import React from 'react';
import { Send, Loader2, ClipboardList, Target, CheckCircle2, UploadCloud, X, FileText, Image as ImageIcon, Video } from 'lucide-react';
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
        uploadingFile,
        handleFileUpload,
        removeAttachment,
        loadingReports
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
                            options={['Project Manager', 'Project Engineer', 'Site Engineer']}
                            onChange={v => setForm(f => ({ ...f, sendToRole: v }))}
                        />
                        <div className="site-form-group">
                            <label className="site-label">Assigned Person</label>
                            <select 
                                className="site-input" 
                                value={form.sendToUser} 
                                onChange={e => setForm(f => ({ ...f, sendToUser: e.target.value }))}
                                disabled={roleUsers.length === 0}
                            >
                                {roleUsers.map(u => (
                                    <option key={u._id} value={u._id}>{u.fullName}</option>
                                ))}
                            </select>
                            {errors.sendToUser && <div className="site-error">{errors.sendToUser}</div>}
                        </div>
                    </div>

                    <div className="site-form-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
                        <div className="site-form-group">
                            <label className="site-label">Work Status</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {WORK_STATUS.map(st => (
                                    <button 
                                        type="button"
                                        key={st}
                                        className={`site-status-chip ${form.workStatus === st ? 'active' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, workStatus: st }))}
                                        style={form.workStatus === st ? { background: STATUS_COLORS[st].color, color: 'white', border: 'none' } : {}}
                                    >
                                        {st}
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
                        <label className="site-label">Workers Present</label>
                        <input 
                            type="number" 
                            className="site-input" 
                            placeholder="Number of workers on site"
                            value={form.workersPresent}
                            onChange={e => setForm(f => ({ ...f, workersPresent: e.target.value }))}
                        />
                    </div>

                    <div className="site-form-group">
                        <label className="site-label">Work Done Today *</label>
                        <textarea 
                            className={`site-input ${errors.workDone ? 'error' : ''}`}
                            placeholder="Describe the work completed today..."
                            rows={4}
                            value={form.workDone}
                            onChange={e => {
                                setForm(f => ({ ...f, workDone: e.target.value }));
                                if (errors.workDone) setErrors(e => ({ ...e, workDone: null }));
                            }}
                        />
                        {errors.workDone && <div className="site-error">{errors.workDone}</div>}
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

                    {/* ATTACHMENTS SECTION */}
                    <div className="site-form-group" style={{ marginTop: 10 }}>
                        <label className="shad-form-label">Attachments (Images, Videos, Docs)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginBottom: form.attachments?.length ? 12 : 0 }}>
                            {form.attachments && form.attachments.map((att, idx) => (
                                <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                                    <button type="button" onClick={() => removeAttachment(idx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                                        <X size={12} />
                                    </button>
                                    {att.resourceType === 'image' ? (
                                        <img src={att.url} alt="attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : att.resourceType === 'video' ? (
                                        <>
                                            <Video size={24} color="#64748b" />
                                            <span style={{ fontSize: 10, color: '#64748b', textAlign: 'center', padding: '0 4px', wordBreak: 'break-all' }}>{att.originalName}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={24} color="#64748b" />
                                            <span style={{ fontSize: 10, color: '#64748b', textAlign: 'center', padding: '0 4px', wordBreak: 'break-all' }}>{att.originalName}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                            
                            <label style={{ width: '100%', aspectRatio: '1', borderRadius: 8, border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, cursor: uploadingFile ? 'default' : 'pointer', background: '#f8fafc', transition: 'all 0.2s', opacity: uploadingFile ? 0.7 : 1 }}>
                                {uploadingFile ? <Loader2 size={24} className="site-spin" color="#64748b" /> : <UploadCloud size={24} color="#64748b" />}
                                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500, textAlign: 'center', padding: '0 4px' }}>{uploadingFile ? 'Uploading...' : 'Upload File'}</span>
                                <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploadingFile} accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx" />
                            </label>
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
                                    <span className="site-report-meta">
                                        Submitted by {r.submittedBy?.fullName || r.submittedBy} on {format(new Date(r.createdAt),'dd MMM yyyy, HH:mm')}
                                        {r.attachments && r.attachments.length > 0 && <span style={{marginLeft: 8, color: '#64748b'}}>• {r.attachments.length} attachment(s)</span>}
                                    </span>
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
