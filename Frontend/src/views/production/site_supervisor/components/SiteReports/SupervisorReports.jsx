import React from 'react';
import { Send, Loader2, ClipboardList, Target, CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';
import { ShadSelect, ShadCalendar } from './SharedUI';
import { useSupervisorReports } from '../../hooks/useSupervisorReports';
import { useAppSelector } from '../../../../../store/hooks';
import { selectUser } from '../../../../../store/slices/authSlice';

const SupervisorReports = ({ projects }) => {
    const user = useAppSelector(selectUser);
    const {
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
    } = useSupervisorReports(projects);

    return (
        <div className="site-report-split">
            {submitted && (
                <div className="site-toast" style={{ background: '#10b981' }}>
                    <CheckCircle2 size={16} /> Supervisor report submitted!
                </div>
            )}
            
            <div className="site-card">
                <div className="site-card-header">
                    <div className="site-card-title"><Send size={15} /> New Supervisor Report</div>
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
                        <div className="site-form-group">
                            <label className="shad-form-label">Material Received</label>
                            <textarea className="site-input" rows={2} placeholder="E.g. 100 bags of cement..." value={form.materialReceived} onChange={e => setForm(f => ({ ...f, materialReceived: e.target.value }))} />
                        </div>
                        <div className="site-form-group">
                            <label className="shad-form-label">Material Used</label>
                            <textarea className="site-input" rows={2} placeholder="E.g. 20 bags used for foundation..." value={form.materialUsed} onChange={e => setForm(f => ({ ...f, materialUsed: e.target.value }))} />
                        </div>
                    </div>
 
                    <div className="site-form-group">
                        <label className="shad-form-label">Total Labor Count</label>
                        <input type="number" min={0} className="site-input" placeholder="Number of laborers today" value={form.laborCount} onChange={e => setForm(f => ({ ...f, laborCount: e.target.value }))} />
                    </div>
 
                    <div className="site-form-group">
                        <label className="shad-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Equipment Status</span>
                            <button type="button" onClick={addEquipment} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>+ Add Equipment</button>
                        </label>
                        {form.equipmentStatus.map((eq, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                <input className="site-input" placeholder="Equipment Name" value={eq.equipmentName} onChange={e => updateEquipment(i, 'equipmentName', e.target.value)} style={{ flex: 1 }} />
                                <select className="site-input" value={eq.status} onChange={e => updateEquipment(i, 'status', e.target.value)} style={{ width: 140 }}>
                                    <option value="Working">Working</option>
                                    <option value="Broken">Broken</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                                {form.equipmentStatus.length > 1 && (
                                    <button type="button" onClick={() => removeEquipment(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={18} /></button>
                                )}
                            </div>
                        ))}
                    </div>
 
                    <div className="site-form-group">
                        <label className="shad-form-label">General Comments / Hurdles</label>
                        <textarea className="site-input" rows={3} placeholder="Any general comments..." value={form.comments} onChange={e => setForm(f => ({ ...f, comments: e.target.value }))} />
                    </div>
 
                    <button type="submit" className="site-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', marginTop: '10px' }} disabled={submitting}>
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
                    <div className="site-empty" style={{padding:52}}><Target size={40}/><p>No reports yet</p></div>
                ) : (
                    <div style={{padding:'8px 0'}}>
                        {reports.map(r => (
                            <div key={r._id} className="site-report-card">
                                <div className="site-report-card-top">
                                    <span className="site-report-date">{format(new Date(r.date),'dd MMM yyyy')}</span>
                                    <span className="site-report-project">{r.project?.projectName}</span>
                                </div>
                                {r.laborCount && <p style={{fontSize:13, margin:'6px 0 0'}}><strong>Laborers:</strong> {r.laborCount}</p>}
                                {r.materialReceived && <p style={{fontSize:12, color:'#64748b', margin:'4px 0 0'}}><strong>Received:</strong> {r.materialReceived}</p>}
                                {r.materialUsed && <p style={{fontSize:12, color:'#64748b', margin:'4px 0 0'}}><strong>Used:</strong> {r.materialUsed}</p>}
                                {r.equipmentStatus?.length > 0 && r.equipmentStatus.some(eq => eq.equipmentName) && (
                                    <div style={{marginTop: 8}}>
                                        <strong style={{fontSize:12}}>Equipment:</strong>
                                        <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:4}}>
                                            {r.equipmentStatus.filter(eq => eq.equipmentName).map((eq, i) => (
                                                <span key={i} style={{fontSize: 11, padding: '2px 6px', borderRadius: 4, background: eq.status==='Working'?'#d1fae5':eq.status==='Broken'?'#fee2e2':'#fef3c7', color: eq.status==='Working'?'#065f46':eq.status==='Broken'?'#991b1b':'#92400e'}}>
                                                    {eq.equipmentName}: {eq.status}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {r.comments && <p style={{fontSize:12, fontStyle:'italic', marginTop:8}}>{r.comments}</p>}
                                <span className="site-report-meta" style={{marginTop: 8, display: 'block'}}>Submitted by {r.submittedBy?.fullName} on {format(new Date(r.createdAt),'dd MMM HH:mm')}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupervisorReports;
