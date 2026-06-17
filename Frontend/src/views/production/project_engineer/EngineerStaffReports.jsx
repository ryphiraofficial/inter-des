import React, { useState } from 'react';
import { ClipboardList, Users, X } from 'lucide-react';
import { format } from 'date-fns';
import '../site_engineer/Site.css';
import './Engineer.css';
import { useEngineerReports } from './hooks/useEngineerReports';
import DailyReportsTab from './components/EngineerReports/DailyReportsTab';

const STATUS_COLORS = { 'On Track': { color: '#065f46', bg: '#d1fae5' }, 'Delayed': { color: '#92400e', bg: '#fef3c7' }, 'Blocked': { color: '#991b1b', bg: '#fee2e2' }, 'Completed': { color: '#5b21b6', bg: '#ede9fe' } };

const EngineerStaffReports = () => {
    const {
        activeTab, setActiveTab,
        projects,
        selectedProject, setSelectedProject,
        dailyReports,
        loading
    } = useEngineerReports();

    const [selectedReport, setSelectedReport] = useState(null);

    const TABS = [
        { id: 'site_supervisor', label: 'Site Supervisor', icon: <ClipboardList size={15}/> },
        { id: 'site_engineer', label: 'Site Engineer', icon: <Users size={15}/> }
    ];

    // Filter reports based on the active tab's role
    const filteredReports = dailyReports.filter(r => {
        if (activeTab === 'site_supervisor') return r.submittedBy?.role === 'Site Supervisor';
        if (activeTab === 'site_engineer') return r.submittedBy?.role === 'Site Engineer';
        return true;
    });

    const handleCardClick = (report) => {
        setSelectedReport(report);
    };

    const closeDrawer = () => {
        setSelectedReport(null);
    };

    return (
        <div className="site-page">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #f1f5f9', marginBottom: 20 }}>
                <div className="pm-tabs" style={{ borderBottom: 'none', marginBottom: 0 }}>
                    {TABS.map(t => (
                        <button 
                            key={t.id}
                            className={`pm-tab-btn ${activeTab === t.id ? 'active' : ''}`} 
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.icon} <span style={{ marginLeft: 6 }}>{t.label}</span>
                        </button>
                    ))}
                </div>
                <div style={{ marginBottom: 6 }}>
                    <select className="site-input" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={{ minWidth: 200, padding: '8px 12px', height: 'auto' }}>
                        <option value="all">All Projects</option>
                        {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="eng-loading">Loading data...</div>
            ) : (
                <div className="eng-tab-content">
                    <div className="eng-reports-grid">
                        <DailyReportsTab dailyReports={filteredReports} onCardClick={handleCardClick} />
                    </div>
                </div>
            )}

            {/* Report Detail Drawer */}
            {selectedReport && (
                <div className="drawer-overlay" onClick={closeDrawer} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 }}>
                    <div className="drawer-content" onClick={e => e.stopPropagation()} style={{ background: 'white', width: '500px', maxWidth: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div className="drawer-header" style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 600 }}>Report Details</h2>
                                <span style={{ fontSize: '13px', color: '#64748b' }}>{format(new Date(selectedReport.date), 'dd MMMM yyyy')}</span>
                            </div>
                            <button onClick={closeDrawer} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="drawer-body" style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Project</div>
                                    <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>{selectedReport.project?.projectName}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Status</div>
                                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: STATUS_COLORS[selectedReport.workStatus]?.bg || '#f3f4f6', color: STATUS_COLORS[selectedReport.workStatus]?.color || '#374151' }}>
                                        {selectedReport.workStatus}
                                    </span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Weather</div>
                                    <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>{selectedReport.weather}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Workers Present</div>
                                    <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>{selectedReport.workersPresent || '-'}</div>
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '14px', color: '#334155', marginBottom: '8px', fontWeight: 600 }}>Work Done</h3>
                                <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, background: 'white', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}>
                                    {selectedReport.workDone}
                                </div>
                            </div>

                            {selectedReport.issues && (
                                <div>
                                    <h3 style={{ fontSize: '14px', color: '#991b1b', marginBottom: '8px', fontWeight: 600 }}>Issues / Blockers</h3>
                                    <div style={{ fontSize: '14px', color: '#b91c1c', lineHeight: 1.6, background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px' }}>
                                        {selectedReport.issues}
                                    </div>
                                </div>
                            )}

                            {selectedReport.nextDayPlan && (
                                <div>
                                    <h3 style={{ fontSize: '14px', color: '#4338ca', marginBottom: '8px', fontWeight: 600 }}>Next Day Plan</h3>
                                    <div style={{ fontSize: '14px', color: '#4f46e5', lineHeight: 1.6, background: '#e0e7ff', border: '1px solid #c7d2fe', padding: '16px', borderRadius: '12px' }}>
                                        {selectedReport.nextDayPlan}
                                    </div>
                                </div>
                            )}

                            {selectedReport.materialsRequested && selectedReport.materialsRequested.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: '14px', color: '#334155', marginBottom: '8px', fontWeight: 600 }}>Materials Requested</h3>
                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                            <thead style={{ background: '#f8fafc' }}>
                                                <tr>
                                                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Item Name</th>
                                                    <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedReport.materialsRequested.map((m, idx) => (
                                                    <tr key={idx}>
                                                        <td style={{ padding: '10px 16px', borderBottom: idx === selectedReport.materialsRequested.length - 1 ? 'none' : '1px solid #e2e8f0', color: '#334155' }}>{m.itemName}</td>
                                                        <td style={{ padding: '10px 16px', textAlign: 'right', borderBottom: idx === selectedReport.materialsRequested.length - 1 ? 'none' : '1px solid #e2e8f0', color: '#0f172a', fontWeight: 500 }}>{m.quantity} {m.unit}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: '14px', color: '#334155', marginBottom: '8px', fontWeight: 600 }}>Attachments</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                                        {selectedReport.attachments.map((att, idx) => (
                                            <a 
                                                key={idx} 
                                                href={att.url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #e2e8f0', transition: 'all 0.2s', ':hover': { borderColor: '#cbd5e1' } }}
                                            >
                                                <div style={{ width: '100%', aspectRatio: '1', borderRadius: '6px', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {att.resourceType === 'image' ? (
                                                        <img src={att.url} alt="attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : att.resourceType === 'video' ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                                            </div>
                                                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 500, padding: '0 4px', textAlign: 'center', wordBreak: 'break-all' }}>Video</span>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                                            </div>
                                                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 500, padding: '0 4px', textAlign: 'center', wordBreak: 'break-all' }}>Document</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#475569', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={att.originalName}>
                                                    {att.originalName}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 600, fontSize: '14px' }}>
                                    {selectedReport.submittedBy?.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>{selectedReport.submittedBy?.fullName}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedReport.submittedBy?.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EngineerStaffReports;
