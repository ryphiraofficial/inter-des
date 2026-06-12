import React, { useState, useEffect } from 'react';
import { 
    useGetStaffReportsQuery,
    useUpdateStaffReportStatusMutation
} from '../../store/api/sharedApi';
import { FileText, Clock, CheckCircle, Filter, Download, ArrowLeft } from 'lucide-react';
import { useToast } from '../../models/context/ToastContext';
import DateRangePicker from '../../components/DateRangePicker';
import './css/AdminStaffReports.css';


const AdminStaffReports = () => {
    const { showToast } = useToast();
    const { data: reportsRes, isLoading, refetch } = useGetStaffReportsQuery();
    const allReports = reportsRes?.data || [];

    const [updateStatus, { isLoading: isUpdating }] = useUpdateStaffReportStatusMutation();
    const [selectedReport, setSelectedReport] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');


    useEffect(() => {
        const handleSearch = (e) => setSearchQuery(e.detail || '');
        window.addEventListener('header-search', handleSearch);
        return () => window.removeEventListener('header-search', handleSearch);
    }, []);

    const handleUpdateStatus = async (reportId, newStatus) => {
        try {
            await updateStatus({ id: reportId, status: newStatus, adminNotes }).unwrap();
            showToast('Report status updated', 'success');
            setSelectedReport(null);
            setAdminNotes('');
            refetch();
        } catch (err) {
            showToast(err?.data?.message || 'Failed to update status', 'error');
        }
    };

    const handleUpdateIndividualStatus = async (originalReportId, newStatus) => {
        try {
            await updateStatus({ id: originalReportId, status: newStatus }).unwrap();
            showToast('Individual entry approved', 'success');
            // Update local state so UI reflects immediately without closing the modal
            if (selectedReport) {
                const updatedEntries = selectedReport.dailyEntries?.map(entry => 
                    entry.originalReportId === originalReportId ? { ...entry, status: newStatus } : entry
                );
                setSelectedReport({ ...selectedReport, dailyEntries: updatedEntries });
            }
            refetch();
        } catch (err) {
            showToast(err?.data?.message || 'Failed to approve entry', 'error');
        }
    };

    const filteredReports = allReports.filter(r => {
        const matchesSearch = searchQuery === '' ||
            r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.submittedBy?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
        const reportDate = new Date(r.reportDate || r.createdAt);
        const matchesFrom = !dateFrom || reportDate >= new Date(dateFrom);
        const matchesTo   = !dateTo   || reportDate <= new Date(dateTo + 'T23:59:59');
        return matchesSearch && matchesFrom && matchesTo;
    });


    const getReportDept = (report) => {
        if (report.department) return report.department;
        const dept = report.submittedBy?.department;
        if (dept) return dept;
        const role = report.submittedBy?.role || '';
        if (role.includes('Sales')) return 'Sales';
        if (role.includes('Procurement')) return 'Procurement';
        if (role.includes('Accounts')) return 'Accounts';
        if (role.includes('Design')) return 'Design';
        if (role.includes('Production') || role.includes('Project') || role.includes('Site')) return 'Production';
        return 'Sales';
    };

    const getReportsByDept = (deptName) =>
        filteredReports.filter(r => getReportDept(r) === deptName);

    const getStatusBadge = (status) => {
        if (status === 'Resolved' || status === 'Approved')
            return <span className="asr-status approved"><CheckCircle size={12}/> Approved</span>;
        if (status === 'In Progress')
            return <span className="asr-status progress"><Clock size={12}/> In Progress</span>;
        return <span className="asr-status pending">Pending Review</span>;
    };

    // Build daily entries from real data — supports a dailyEntries array or falls back to the report itself
    const getDailyUpdatesForReport = (report) => {
        if (report.dailyEntries?.length > 0) {
            return report.dailyEntries.map(e => ({
                date: new Date(e.date || report.reportDate || report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                name: e.submittedBy?.fullName || report.submittedBy?.fullName || 'Staff Member',
                role: e.submittedBy?.role || report.submittedBy?.role || 'Staff',
                content: e.content || e.description || '',
                originalReportId: e.originalReportId,
                status: e.status || 'Pending',
                image: e.image || ''
            }));
        }
        return [{
            date: new Date(report.reportDate || report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            name: report.submittedBy?.fullName || 'Staff Member',
            role: report.submittedBy?.role || 'Staff',
            content: report.description || 'No details provided.',
            originalReportId: report._id,
            status: report.status || 'Pending',
            image: report.image || ''
        }];
    };

    const getDeptColorClass = (dept) => {
        const map = { Sales: 'sales', Procurement: 'procurement', Accounts: 'accounts', Design: 'design', Production: 'production' };
        return map[dept] || '';
    };

    const renderListItem = (report) => {
        const dept = getReportDept(report);
        return (
            <div key={report._id} className="asr-list-item">
                <div className="asr-item-left">
                    <div className={`asr-item-icon-box ${getDeptColorClass(dept)}`}>
                        <FileText size={18} />
                    </div>
                    <div className="asr-item-title-desc">
                        <h3 className="asr-item-title">{report.title}</h3>
                        {report.project && (
                            <span className="asr-project-badge" style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', marginTop: '4px', display: 'inline-block', fontWeight: 600 }}>
                                PRJ: {report.project.projectNumber} {report.isAssignedToMe ? '(Assigned)' : ''}
                            </span>
                        )}
                    </div>
                </div>

                <div className="asr-item-meta">
                    <div className="asr-item-date">
                        {new Date(report.reportDate || report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="asr-item-user">
                        <div className="asr-item-avatar">{report.submittedBy?.fullName?.charAt(0) || 'U'}</div>
                        <span className="asr-item-username">{report.submittedBy?.fullName}</span>
                    </div>
                </div>

                <div className="asr-item-right">
                    {getStatusBadge(report.status)}
                    <button
                        className="asr-open-btn"
                        onClick={() => { setSelectedReport(report); setAdminNotes(report.adminNotes || ''); }}
                    >
                        Open
                    </button>
                </div>
            </div>
        );
    };

    // ── Full-page detail view (early return) ───────────────────────────────────
    if (selectedReport) {
        const dailyUpdates = getDailyUpdatesForReport(selectedReport);
        const dept = selectedReport.department || getReportDept(selectedReport);
        const deptColorMap = {
            Sales:       { primary: '#b45309', bg: '#ffedd5' },
            Procurement: { primary: '#059669', bg: '#d1fae5' },
            Accounts:    { primary: '#475569', bg: '#f1f5f9' },
            Design:      { primary: '#7e22ce', bg: '#f3e8ff' },
            Production:  { primary: '#1d4ed8', bg: '#dbeafe' }
        };
        const colors = deptColorMap[dept] || deptColorMap.Sales;

        return (
            <div className="asr-container">
                <div className="asr-wrapper">

                    <div className="asr-detail-header">
                        <button className="asr-back-btn" onClick={() => setSelectedReport(null)}>
                            <ArrowLeft size={16} /> Back to Reports
                        </button>
                        <div className="asr-detail-title-row">
                            <div>
                                <div className="asr-detail-dept-tag" style={{ backgroundColor: colors.bg, color: colors.primary }}>
                                    {dept} Department
                                </div>
                                <h1 className="asr-detail-title">{selectedReport.title}</h1>
                                <p className="asr-detail-subtitle">
                                    Submitted by <span className="highlight">{selectedReport.submittedBy?.fullName}</span>
                                    {selectedReport.submittedBy?.role ? ` · ${selectedReport.submittedBy.role}` : ''}
                                    {' · '}{dailyUpdates.length} daily {dailyUpdates.length === 1 ? 'entry' : 'entries'}
                                </p>
                            </div>
                            <div className="asr-detail-badges">
                                {getStatusBadge(selectedReport.status)}
                                {selectedReport.priority && (
                                    <span className={`asr-priority-badge ${selectedReport.priority.toLowerCase()}`}>
                                        {selectedReport.priority} Priority
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="asr-detail-grid">

                        {/* Daily Reports List */}
                        <div>
                            <div className="asr-daily-list-header">
                                <h2 className="asr-daily-list-title">Daily Reports</h2>
                                <span className="asr-daily-count">
                                    {dailyUpdates.length} {dailyUpdates.length === 1 ? 'entry' : 'entries'} this week
                                </span>
                            </div>

                            <div className="asr-daily-list">
                                {dailyUpdates.map((update, index) => (
                                    <div key={index} className="asr-daily-card">
                                        <div className="asr-daily-date-strip" style={{ backgroundColor: colors.bg }}>
                                            <div className="asr-daily-date-left">
                                                <div className="asr-daily-date-dot" style={{ backgroundColor: colors.primary }} />
                                                <span className="asr-daily-date-text" style={{ color: colors.primary }}>{update.date}</span>
                                            </div>
                                            <span className="asr-daily-entry-label">Day {dailyUpdates.length - index}</span>
                                        </div>
                                        <div className="asr-daily-card-body">
                                            <div className="asr-daily-sender" style={{ justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="asr-daily-avatar" style={{ backgroundColor: colors.bg, color: colors.primary }}>
                                                        {update.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="asr-daily-sender-info">
                                                        <span className="asr-daily-sender-name">{update.name}</span>
                                                        <span className="asr-daily-sender-role">{update.role}</span>
                                                    </div>
                                                </div>
                                                {update.originalReportId && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {update.status === 'Resolved' || update.status === 'Approved' ? (
                                                            <span style={{ fontSize: '11px', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                <CheckCircle size={12} /> Verified by {selectedReport?.submittedBy?.fullName?.split(' ')[0] || 'Manager'} ({selectedReport?.submittedBy?.role || 'Manager'})
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleUpdateIndividualStatus(update.originalReportId, 'Resolved'); }}
                                                                disabled={isUpdating}
                                                                style={{ fontSize: '11px', color: colors.primary, background: colors.bg, border: `1px solid ${colors.primary}40`, padding: '4px 10px', borderRadius: '6px', fontWeight: 600, cursor: isUpdating ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: isUpdating ? 0.7 : 1 }}
                                                            >
                                                                Approve Entry
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', marginTop: '12px' }}>
                                                {update.type && (
                                                    <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                                        {update.type}
                                                    </span>
                                                )}
                                                {update.priority && (
                                                    <span className={`asr-priority-badge ${update.priority.toLowerCase()}`} style={{ margin: 0, padding: '3px 8px' }}>
                                                        {update.priority}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="asr-daily-content">{update.content}</p>

                                            {(selectedReport.project || update.projectStr) && (
                                                <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Associated Project</span>
                                                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                                                            {update.projectStr || (selectedReport.project ? `${selectedReport.project.projectNumber} - ${selectedReport.project.name}` : '')}
                                                        </div>
                                                    </div>
                                                    {selectedReport.isAssignedToMe && (
                                                        <span style={{ fontSize: '11px', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                                                            Assigned to Staff
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {update.image && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attached Image</span>
                                                    <a href={update.image} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                                                        <img 
                                                            src={update.image} 
                                                            alt="Report attachment" 
                                                            style={{ maxWidth: '100%', maxHeight: '320px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'zoom-in' }} 
                                                        />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Admin Action Panel */}
                        <div className="asr-admin-panel">
                            <h3>Admin Action Center</h3>

                            <div className="asr-panel-field">
                                <label>Report Status</label>
                                <div className="asr-status-actions">
                                    <button className={`asr-status-opt pending ${selectedReport.status === 'Pending' ? 'active' : ''}`} onClick={() => handleUpdateStatus(selectedReport._id, 'Pending')} disabled={isUpdating}>Pending</button>
                                    <button className={`asr-status-opt progress ${selectedReport.status === 'In Progress' ? 'active' : ''}`} onClick={() => handleUpdateStatus(selectedReport._id, 'In Progress')} disabled={isUpdating}>In Progress</button>
                                    <button className={`asr-status-opt approved ${selectedReport.status === 'Resolved' || selectedReport.status === 'Approved' ? 'active' : ''}`} onClick={() => handleUpdateStatus(selectedReport._id, 'Resolved')} disabled={isUpdating}>Approved</button>
                                </div>
                            </div>

                            <div className="asr-panel-field">
                                <label>Resolution Notes</label>
                                <textarea
                                    className="asr-panel-textarea"
                                    placeholder="Add response, notes or follow-up feedback..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                />
                            </div>

                            <button className="asr-save-notes-btn" onClick={() => handleUpdateStatus(selectedReport._id, selectedReport.status)} disabled={isUpdating}>
                                {isUpdating ? 'Saving...' : 'Save Notes & Response'}
                            </button>

                            <div className="asr-panel-summary">
                                <div className="asr-panel-summary-row"><span>Total Entries</span><strong>{dailyUpdates.length}</strong></div>
                                <div className="asr-panel-summary-row"><span>Department</span><strong>{dept}</strong></div>
                                <div className="asr-panel-summary-row"><span>Submitted By</span><strong>{selectedReport.submittedBy?.fullName || '—'}</strong></div>
                                <div className="asr-panel-summary-row"><span>Type</span><strong>{selectedReport.type || 'Weekly Report'}</strong></div>
                                {selectedReport.project && (
                                    <div className="asr-panel-summary-row"><span>Project</span><strong>{selectedReport.project.projectNumber}</strong></div>
                                )}
                                {selectedReport.isAssignedToMe && (
                                    <div className="asr-panel-summary-row"><span>Assigned Status</span><strong style={{ color: '#16a34a' }}>Assigned</strong></div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // ── Main list view ──────────────────────────────────────────────────────────
    return (
        <div className="asr-container">
            <div className="asr-wrapper">

                {/* Stats */}
                <div className="asr-stats-bar">
                    <div className="asr-stat-card">
                        <div className="asr-stat-card-icon total"><FileText size={20} /></div>
                        <div className="asr-stat-card-info">
                            <span className="asr-stat-card-label">Total Reports</span>
                            <h3 className="asr-stat-card-value">{allReports.length}</h3>
                        </div>
                    </div>
                    <div className="asr-stat-card">
                        <div className="asr-stat-card-icon pending"><Clock size={20} /></div>
                        <div className="asr-stat-card-info">
                            <span className="asr-stat-card-label">Pending Review</span>
                            <h3 className="asr-stat-card-value">
                                {allReports.filter(r => !r.status || r.status === 'Pending' || r.status === 'Pending Review').length}
                            </h3>
                        </div>
                    </div>
                    <div className="asr-stat-card">
                        <div className="asr-stat-card-icon progress"><Clock size={20} /></div>
                        <div className="asr-stat-card-info">
                            <span className="asr-stat-card-label">In Progress</span>
                            <h3 className="asr-stat-card-value">{allReports.filter(r => r.status === 'In Progress').length}</h3>
                        </div>
                    </div>
                    <div className="asr-stat-card">
                        <div className="asr-stat-card-icon approved"><CheckCircle size={20} /></div>
                        <div className="asr-stat-card-info">
                            <span className="asr-stat-card-label">Resolved Reports</span>
                            <h3 className="asr-stat-card-value">{allReports.filter(r => r.status === 'Resolved' || r.status === 'Approved').length}</h3>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="asr-filters-bar">
                    <div className="asr-pills">
                        {['All', 'Sales', 'Procurement', 'Accounts', 'Design', 'Production'].map(tab => (
                            <button
                                key={tab}
                                className={`asr-pill ${activeTab === tab ? 'black' : 'gray'}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'All' ? 'All Departments' : tab}
                            </button>
                        ))}
                    </div>
                    <div className="asr-actions">
                        <DateRangePicker
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            onFromChange={setDateFrom}
                            onToChange={setDateTo}
                        />
                        <button className="asr-icon-btn"><Filter size={16} /></button>
                        <button className="asr-icon-btn brown"><Download size={16} /></button>
                    </div>

                </div>


                {/* Loading state */}
                {isLoading && <div className="no-reports-msg">Loading reports...</div>}

                {/* Empty state */}
                {!isLoading && allReports.length === 0 && (
                    <div className="no-reports-msg">No reports have been submitted yet.</div>
                )}

                {/* Department sections */}
                {['Sales', 'Procurement', 'Accounts', 'Design', 'Production'].map(dept => {
                    if (activeTab !== 'All' && activeTab !== dept) return null;
                    const deptReports = getReportsByDept(dept);
                    if (deptReports.length === 0) return null;
                    const lineColors = { Sales: '#b45309', Procurement: '#059669', Accounts: '#475569', Design: '#7e22ce', Production: '#1d4ed8' };
                    const pillClasses = { Sales: '', Procurement: 'green', Accounts: 'gray', Design: 'purple', Production: 'blue' };
                    return (
                        <div key={dept} className="asr-section">
                            <div className="asr-section-header">
                                <div className="asr-section-line" style={{ backgroundColor: lineColors[dept] }} />
                                <h2>{dept} Department</h2>
                                <span className={`asr-badge-pill ${pillClasses[dept]}`}>
                                    {deptReports.filter(r => r.status === 'Pending').length} PENDING
                                </span>
                            </div>
                            <div className="asr-list">{deptReports.map(renderListItem)}</div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default AdminStaffReports;
