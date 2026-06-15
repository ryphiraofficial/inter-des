import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    useGetStaffReportsQuery, 
    useSubmitStaffReportMutation,
    useUpdateStaffReportMutation,
    useUpdateStaffReportStatusMutation,
    useUploadImageMutation,
    useForwardWeeklyReportsMutation
} from '../../store/api/sharedApi';
import { useGetProjectsQuery } from '../../store/api/designApi';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';
import { FileText, Send, Clock, CheckCircle, AlertCircle, Plus, X, MessageSquare, Image, Loader, ChevronDown, ChevronUp, Calendar, Briefcase, Pencil, Paperclip, Download } from 'lucide-react';
import { useToast } from '../../models/context/ToastContext';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import './css/StaffReports.css';

const StaffReports = () => {
    const { showToast } = useToast();
    const { data: reportsRes, isLoading, refetch } = useGetStaffReportsQuery();
    const reports = reportsRes?.data || [];
    const { data: projectsRes } = useGetProjectsQuery();
    const projects = projectsRes?.data || [];
    const user = useAppSelector(selectUser);
    const isAdmin = ['admin', 'super admin', 'superadmin', 'manager', 'design manager', 'procurement manager', 'project manager', 'accounts manager'].includes(user?.role?.toLowerCase() || '');
    const isAccounts = user?.role?.toLowerCase().includes('accounts') || user?.department === 'Accounts';

    const [submitReport, { isLoading: isSubmitting }] = useSubmitStaffReportMutation();
    const [updateReport, { isLoading: isUpdating }] = useUpdateStaffReportMutation();
    const [updateReportStatus, { isLoading: isUpdatingStatus }] = useUpdateStaffReportStatusMutation();
    const [forwardReports, { isLoading: isForwarding }] = useForwardWeeklyReportsMutation();
    const [uploadImage] = useUploadImageMutation();
    const [isUploading, setIsUploading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const showForm = searchParams.get('action') === 'new';
    const editId = searchParams.get('editId');
    const isEditMode = Boolean(editId);
    
    useEffect(() => {
        const handleOpenNewReport = () => {
            const p = new URLSearchParams(searchParams);
            p.set('action', 'new');
            setSearchParams(p);
        };
        window.addEventListener('open-new-staff-report', handleOpenNewReport);
        return () => window.removeEventListener('open-new-staff-report', handleOpenNewReport);
    }, [searchParams, setSearchParams]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [expandedReports, setExpandedReports] = useState({});
    const [adminActionState, setAdminActionState] = useState({});
    const [filterDate, setFilterDate] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [viewTab, setViewTab] = useState('Staff Reports'); // 'Staff Reports' or 'Weekly Bundles'
    
    // Bundle Drawer State
    const [isBundleDrawerOpen, setIsBundleDrawerOpen] = useState(false);
    const [bundleStartDate, setBundleStartDate] = useState('');
    const [bundleEndDate, setBundleEndDate] = useState('');

    const toggleReport = (id) => {
        setExpandedReports(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleAdminActionChange = (id, field, value) => {
        setAdminActionState(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleAdminSubmit = async (report) => {
        const state = adminActionState[report._id] || {};
        const status = state.status || report.status;
        const adminNotes = state.adminNotes !== undefined ? state.adminNotes : report.adminNotes;
        
        try {
            await updateReportStatus({ id: report._id, status, adminNotes }).unwrap();
            showToast('Report status updated', 'success');
            refetch();
        } catch (err) {
            showToast(err?.data?.message || 'Failed to update status', 'error');
        }
    };
    
    const [formData, setFormData] = useState({
        title: '',
        type: 'Daily Update',
        priority: 'Low',
        description: '',
        project: '',
        isAssignedToMe: false,
        reportDate: new Date().toISOString().split('T')[0],
        image: '',
        images: []
    });

    const handleEdit = (report) => {
        setFormData({
            title: report.title || '',
            type: report.type || 'Daily Update',
            priority: report.priority || 'Low',
            description: report.description || '',
            project: report.project?._id || '',
            isAssignedToMe: report.isAssignedToMe || false,
            reportDate: report.reportDate ? new Date(report.reportDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            image: report.image || '',
            images: report.images || []
        });
        const p = new URLSearchParams(searchParams);
        p.set('action', 'new');
        p.set('editId', report._id);
        setSearchParams(p);
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => {
                const uploadData = new FormData();
                uploadData.append('image', file);
                return uploadImage(uploadData).unwrap();
            });

            const results = await Promise.all(uploadPromises);
            const urls = results.map(res => res.url).filter(Boolean);
            
            if (urls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    image: prev.image || urls[0],
                    images: [...(prev.images || []), ...urls]
                }));
                showToast(`${urls.length} file(s) uploaded successfully`, 'success');
            }
        } catch (err) {
            showToast(err?.message || err?.data?.message || 'File upload failed', 'error');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const getUserDepartment = (userObj) => {
        if (!userObj) return '';
        if (userObj.department) return userObj.department;
        const role = userObj.role || '';
        if (role.includes('Sales')) return 'Sales';
        if (role.includes('Design')) return 'Design';
        if (role.includes('Procurement')) return 'Procurement';
        if (role.includes('Accounts')) return 'Accounts';
        if (role.includes('Production') || role.includes('Project') || role.includes('Site')) return 'Production';
        return 'Sales';
    };

    const getAssignedManagerForDept = (project, dept) => {
        if (!project) return null;
        switch(dept) {
            case 'Design': return project.assignedDesignManager;
            case 'Procurement': return project.assignedProcurementManager;
            case 'Accounts': return project.assignedAccountsStaff;
            case 'Production': return project.assignedProductionManager;
            default: return null;
        }
    };

    const handleProjectChange = (projectId) => {
        if (!projectId) {
            setFormData(prev => ({ ...prev, project: '', isAssignedToMe: false }));
            return;
        }
        const selectedProj = projects.find(p => p._id === projectId);
        let assigned = false;
        if (selectedProj && user?._id) {
            assigned = (
                (selectedProj.assignedDesignManager?._id || selectedProj.assignedDesignManager) === user._id ||
                (selectedProj.assignedProcurementManager?._id || selectedProj.assignedProcurementManager) === user._id ||
                (selectedProj.assignedProductionManager?._id || selectedProj.assignedProductionManager) === user._id ||
                (selectedProj.assignedAccountsStaff?._id || selectedProj.assignedAccountsStaff) === user._id
            );
        }
        setFormData(prev => ({
            ...prev,
            project: projectId,
            isAssignedToMe: assigned
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.images || formData.images.length === 0) {
            showToast('Please attach at least one file or document', 'error');
            return;
        }

        try {
            if (isEditMode) {
                await updateReport({ id: editId, ...formData }).unwrap();
                showToast('Report updated successfully', 'success');
            } else {
                await submitReport(formData).unwrap();
                showToast('Report submitted successfully', 'success');
            }
            const p = new URLSearchParams(searchParams);
            p.delete('action');
            p.delete('editId');
            setSearchParams(p);
            setFormData({
                title: '',
                type: 'Daily Update',
                priority: 'Low',
                description: '',
                project: '',
                isAssignedToMe: false,
                reportDate: new Date().toISOString().split('T')[0],
                image: '',
                images: []
            });
            refetch();
        } catch (err) {
            showToast(err?.data?.message || `Failed to ${isEditMode ? 'update' : 'submit'} report`, 'error');
        }
    };

    const getStatusBadge = (status) => {
        const className = `status-badge ${status.replace(' ', '-')}`;
        switch(status) {
            case 'Resolved': return <span className={className}><CheckCircle size={14}/> Resolved</span>;
            case 'In Progress': return <span className={className}><Clock size={14}/> In Progress</span>;
            default: return <span className={className}><AlertCircle size={14}/> Pending</span>;
        }
    };

    const exportWeeklyReport = () => {
        const today = new Date();
        // Set to end of today to include all of today
        today.setHours(23, 59, 59, 999);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentReports = reports.filter(r => {
            const rDate = new Date(r.reportDate || r.createdAt);
            return rDate >= sevenDaysAgo && rDate <= today;
        });

        if (recentReports.length === 0) {
            showToast('No reports found in the last 7 days to export', 'error');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Submitted By,Department,Type,Project,Priority,Status,Description,Admin Notes\n";

        recentReports.forEach(r => {
            const date = new Date(r.reportDate || r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const submitter = r.submittedBy?.fullName || 'Unknown';
            const department = r.submittedBy?.department || 'Unknown';
            const type = r.type || '';
            const project = r.project ? `${r.project.projectNumber} - ${r.project.name}` : 'N/A';
            const priority = r.priority || '';
            const status = r.status || '';
            const description = `"${(r.description || '').replace(/"/g, '""')}"`;
            const adminNotes = `"${(r.adminNotes || '').replace(/"/g, '""')}"`;

            const row = `"${date}","${submitter}","${department}","${type}","${project}","${priority}","${status}",${description},${adminNotes}`;
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Weekly_Staff_Reports_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Weekly summary exported successfully', 'success');
    };

    const handleSendToAdmin = async () => {
        if (!bundleStartDate || !bundleEndDate) {
            showToast('Please select both start and end dates', 'error');
            return;
        }
        try {
            const res = await forwardReports({ startDate: bundleStartDate, endDate: bundleEndDate }).unwrap();
            showToast(res.message || 'Reports forwarded to Admin', 'success');
            setIsBundleDrawerOpen(false);
            setBundleStartDate('');
            setBundleEndDate('');
            refetch();
        } catch (err) {
            showToast(err?.data?.message || 'Failed to forward reports', 'error');
        }
    };

    const filteredReports = reports.filter(r => {
        if (isAdmin) {
            if (viewTab === 'Staff Reports' && r.type === 'Weekly Bundle') return false;
            if (viewTab === 'Weekly Bundles' && r.type !== 'Weekly Bundle') return false;

            const managerRole = user?.role?.toLowerCase() || '';
            if (managerRole.includes('manager') && !managerRole.includes('super admin')) {
                const subRole = r.submittedBy?.role?.toLowerCase() || '';
                const subDept = r.submittedBy?.department?.toLowerCase() || '';
                
                if (managerRole.includes('procurement') && !subRole.includes('procurement') && !subDept.includes('procurement')) return false;
                if (managerRole.includes('design') && !subRole.includes('design') && !subDept.includes('design')) return false;
                if (managerRole.includes('accounts') && !subRole.includes('account') && !subDept.includes('account')) return false;
                if (managerRole.includes('project') && !subRole.includes('production') && !subRole.includes('project') && !subRole.includes('site') && !subDept.includes('production')) return false;
            }
        }
        
        if (!isAdmin || !filterDate) return true;
        const reportD = new Date(r.reportDate || r.createdAt);
        const rDate = `${reportD.getFullYear()}-${String(reportD.getMonth() + 1).padStart(2, '0')}-${String(reportD.getDate()).padStart(2, '0')}`;
        return rDate === filterDate;
    });

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderReportExpandedBody = (report) => (
        <div className="report-item-body" style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div className="report-description" style={{ flex: 1, margin: 0 }}>
                    {report.description}
                </div>
                {report.status !== 'Resolved' && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(report);
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, marginLeft: '16px', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                        onMouseLeave={(e) => e.target.style.background = '#f8fafc'}
                    >
                        <Pencil size={14} /> Edit
                    </button>
                )}
            </div>
            {report.images && report.images.length > 0 ? (
                <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {report.images.map((url, index) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', textDecoration: 'none' }}>
                            {url.match(/\.(jpeg|jpg|gif|png|webp|heic|heif)$/i) ? (
                                <img 
                                    src={url} 
                                    alt={`Attachment ${index + 1}`} 
                                    style={{ width: '120px', height: '120px', borderRadius: '8px', border: '1px solid #e2e8f0', objectFit: 'cover', cursor: 'zoom-in' }} 
                                />
                            ) : (
                                <div style={{ width: '120px', height: '120px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#4f46e5', fontWeight: 600, fontSize: '12px', textAlign: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                                    <FileText size={24} /> 
                                    <span style={{ wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>View Document</span>
                                </div>
                            )}
                        </a>
                    ))}
                </div>
            ) : report.image ? (
                <div style={{ marginTop: '14px' }}>
                    <a href={report.image} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        {report.image.match(/\.(jpeg|jpg|gif|png|webp|heic|heif)$/i) ? (
                            <img 
                                src={report.image} 
                                alt="Attachment" 
                                style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', border: '1px solid #e2e8f0', objectFit: 'cover', cursor: 'zoom-in' }} 
                            />
                        ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#4f46e5', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = '#f8fafc'}>
                                <FileText size={18} /> View Attached Document
                            </div>
                        )}
                    </a>
                </div>
            ) : null}
            {report.adminNotes && !isAdmin && (
                <div className="admin-response" style={{ marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #4f46e5' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', marginBottom: '8px', fontSize: '13px' }}><MessageSquare size={14}/> Admin Response</strong>
                    <span style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5' }}>{report.adminNotes}</span>
                </div>
            )}

            {isAdmin && (
                <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={16} color="#4f46e5" /> Admin Actions
                    </h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>Status</label>
                            <select 
                                value={adminActionState[report._id]?.status || report.status}
                                onChange={(e) => handleAdminActionChange(report._id, 'status', e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', outline: 'none' }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>Admin Notes</label>
                            <textarea 
                                value={adminActionState[report._id]?.adminNotes !== undefined ? adminActionState[report._id].adminNotes : (report.adminNotes || '')}
                                onChange={(e) => handleAdminActionChange(report._id, 'adminNotes', e.target.value)}
                                placeholder="Add notes or feedback here..."
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', minHeight: '80px', resize: 'vertical', outline: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => handleAdminSubmit(report)}
                                disabled={isUpdatingStatus}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                            >
                                {isUpdatingStatus ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
        <div className="staff-reports-container">

            {showForm && (
                <div className="drawer-overlay" onClick={(e) => {
                    if (e.target.className === 'drawer-overlay') {
                        const p = new URLSearchParams(searchParams);
                        p.delete('action');
                        setSearchParams(p);
                    }
                }}>
                    <div className="drawer-content">
                        <div className="drawer-header">
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                {isEditMode ? <Pencil size={18} style={{ color: '#4f46e5' }} /> : <FileText size={18} style={{ color: '#4f46e5' }} />} 
                                {isEditMode ? 'Edit Report' : 'Submit New Report'}
                            </h3>
                            <button 
                                type="button"
                                onClick={() => {
                                    const p = new URLSearchParams(searchParams);
                                    p.delete('action');
                                    p.delete('editId');
                                    setSearchParams(p);
                                }}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '50%', transition: 'all 0.2s' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 73px)' }}>
                            <div className="drawer-body" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                                        <div className="report-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>Date</label>
                                            <input 
                                                type="date" 
                                                className="report-input"
                                                required
                                                value={formData.reportDate}
                                                onChange={(e) => setFormData({...formData, reportDate: e.target.value})}
                                            />
                                        </div>
                                        <div className="report-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>
                                                {isAccounts ? 'Report Title / Subject' : 'Title'}
                                            </label>
                                            <input 
                                                type="text" 
                                                className="report-input"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                placeholder="Enter report title..."
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="report-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>Project <span style={{ color: '#ef4444' }}>*</span></label>
                                            <select 
                                                className="report-input"
                                                required
                                                value={formData.project}
                                                onChange={(e) => handleProjectChange(e.target.value)}
                                            >
                                                <option value="">Select a project...</option>
                                                {projects.map(p => (
                                                    <option key={p._id} value={p._id}>
                                                        {p.projectNumber} - {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="report-form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '28px' }}>
                                            {formData.project && (() => {
                                                const selectedProjectObj = projects.find(p => p._id === formData.project);
                                                const userDept = getUserDepartment(user);
                                                const assignedManager = getAssignedManagerForDept(selectedProjectObj, userDept);
                                                return (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={formData.isAssignedToMe}
                                                                onChange={(e) => setFormData({ ...formData, isAssignedToMe: e.target.checked })}
                                                                style={{ cursor: 'pointer', width: '14px', height: '14px' }}
                                                            />
                                                            <span style={{ fontWeight: 600, color: '#45464d', fontSize: '13px' }}>Assigned to me</span>
                                                        </label>
                                                        {assignedManager && (
                                                            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Send size={12} />
                                                                Reporting to: <strong style={{ color: '#4f46e5' }}>{assignedManager.fullName || 'Manager'}</strong>
                                                            </div>
                                                        )}
                                                        {!assignedManager && (
                                                            <div style={{ fontSize: '12px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <AlertCircle size={12} />
                                                                No manager assigned.
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="report-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>Type</label>
                                            <select 
                                                className="report-input"
                                                value={formData.type}
                                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            >
                                                <option value="Daily Update">Daily Update</option>
                                                <option value="Issue">Issue</option>
                                                <option value="Feedback">Feedback</option>
                                                {isAccounts && <option value="Expense Report">Expense Report</option>}
                                                {isAccounts && <option value="Payment Update">Payment Update</option>}
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="report-form-group">
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>Priority</label>
                                            <select 
                                                className="report-input"
                                                value={formData.priority}
                                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Critical">Critical</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="report-form-group">
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>
                                            {isAccounts ? 'Details / Expense Breakdown' : 'Description'}
                                        </label>
                                        <textarea 
                                            className="report-input"
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder={isAccounts ? "Provide detailed breakdown of expenses, amounts, or payment updates..." : "Provide detailed information..."}
                                            style={{ minHeight: '100px' }}
                                        />
                                    </div>

                                    <div className="report-form-group">
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>
                                            Attachments <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#475569', transition: 'all 0.2s' }} className="image-upload-label">
                                                <Paperclip size={16} />
                                                Choose Files
                                                <input 
                                                    type="file" 
                                                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip" 
                                                    onChange={handleFileUpload} 
                                                    style={{ display: 'none' }}
                                                    disabled={isUploading}
                                                    multiple
                                                />
                                            </label>
                                            {isUploading && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b' }}>
                                                    <Loader size={16} className="animate-spin" />
                                                    Uploading...
                                                </div>
                                            )}
                                        </div>
                                        {formData.images && formData.images.length > 0 && (
                                            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                                {formData.images.map((url, index) => (
                                                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                                        {url.match(/\.(jpeg|jpg|gif|png|webp|heic|heif)$/i) ? (
                                                            <img 
                                                                src={url} 
                                                                alt={`Preview ${index + 1}`} 
                                                                style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1', display: 'block' }} 
                                                            />
                                                        ) : (
                                                            <div style={{ width: '90px', height: '90px', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#0f172a', fontWeight: 600, fontSize: '11px', textAlign: 'center' }}>
                                                                <FileText size={24} color="#4f46e5" />
                                                                <span style={{ wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>Document</span>
                                                            </div>
                                                        )}
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const newImages = formData.images.filter((_, i) => i !== index);
                                                                setFormData({ 
                                                                    ...formData, 
                                                                    images: newImages,
                                                                    image: newImages.length > 0 ? newImages[0] : ''
                                                                });
                                                            }}
                                                            style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 1 }}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="drawer-footer">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        const p = new URLSearchParams(searchParams);
                                        p.delete('action');
                                        p.delete('editId');
                                        setSearchParams(p);
                                    }}
                                    style={{ padding: '0.6rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-submit-report"
                                    disabled={isSubmitting || isUpdating || isUploading}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', border: 'none', borderRadius: '6px', cursor: (isSubmitting || isUpdating || isUploading) ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '13px', opacity: (isSubmitting || isUpdating || isUploading) ? 0.7 : 1 }}
                                >
                                    {isSubmitting || isUpdating ? 'Saving...' : <><Send size={14} /> {isEditMode ? 'Update Report' : 'Submit Report'}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="history-section">
                <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', borderTopLeftRadius: '23px', borderTopRightRadius: '23px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#e0f2fe', color: '#0ea5e9', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', fontWeight: 800 }}>{isAdmin ? 'Staff Reports Overview' : 'My Submission History'}</strong>
                            <span style={{ display: 'block', marginTop: '2px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{isAdmin ? 'Review and manage reports submitted by staff.' : 'Track and review all your submitted reports and their status.'}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

                        {isAdmin && (
                            <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
                                <button 
                                    onClick={() => { setViewTab('Staff Reports'); setCurrentPage(1); }}
                                    style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 600, borderRadius: '6px', background: viewTab === 'Staff Reports' ? 'white' : 'transparent', color: viewTab === 'Staff Reports' ? '#0f172a' : '#64748b', boxShadow: viewTab === 'Staff Reports' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                    Staff Reports
                                </button>
                                <button 
                                    onClick={() => { setViewTab('Weekly Bundles'); setCurrentPage(1); }}
                                    style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 600, borderRadius: '6px', background: viewTab === 'Weekly Bundles' ? 'white' : 'transparent', color: viewTab === 'Weekly Bundles' ? '#0f172a' : '#64748b', boxShadow: viewTab === 'Weekly Bundles' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                    Weekly Bundles
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ padding: '24px' }}>
                    {isLoading ? (
                        isAdmin ? (
                            <div className="manager-reports-table-container" style={{ opacity: 0.8, pointerEvents: 'none' }}>
                                <div className="manager-filter-bar" style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', position: 'relative', borderTopLeftRadius: '11px', borderTopRightRadius: '11px' }}>
                                    <div className="skeleton-box" style={{ height: '36px', width: '220px', borderRadius: '6px' }}></div>
                                    <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 8px' }}></div>
                                    <div className="skeleton-box" style={{ height: '36px', width: '140px', borderRadius: '6px' }}></div>
                                    <div className="skeleton-box" style={{ height: '36px', width: '120px', borderRadius: '6px' }}></div>
                                </div>
                                <table className="manager-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Submitted By</th>
                                            <th>Type</th>
                                            <th>Project</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <tr key={i}>
                                                <td><div className="skeleton-box" style={{ height: '20px', width: '80px', borderRadius: '4px' }}></div></td>
                                                <td><div className="skeleton-box" style={{ height: '20px', width: '120px', borderRadius: '4px' }}></div></td>
                                                <td><div className="skeleton-box" style={{ height: '20px', width: '100px', borderRadius: '4px' }}></div></td>
                                                <td><div className="skeleton-box" style={{ height: '20px', width: '150px', borderRadius: '4px' }}></div></td>
                                                <td><div className="skeleton-box" style={{ height: '24px', width: '80px', borderRadius: '12px' }}></div></td>
                                                <td><div className="skeleton-box" style={{ height: '24px', width: '90px', borderRadius: '12px' }}></div></td>
                                                <td><div className="skeleton-box" style={{ height: '20px', width: '40px', borderRadius: '4px' }}></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="reports-grid" style={{ opacity: 0.8, pointerEvents: 'none' }}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="report-card" style={{ height: '220px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div className="skeleton-box" style={{ height: '24px', width: '120px', borderRadius: '4px' }}></div>
                                            <div className="skeleton-box" style={{ height: '24px', width: '80px', borderRadius: '12px' }}></div>
                                        </div>
                                        <div className="skeleton-box" style={{ height: '20px', width: '80px', marginBottom: '16px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-box" style={{ height: '16px', width: '100%', marginBottom: '8px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-box" style={{ height: '16px', width: '80%', marginBottom: 'auto', borderRadius: '4px' }}></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                            <div className="skeleton-box" style={{ height: '20px', width: '90px', borderRadius: '4px' }}></div>
                                            <div className="skeleton-box" style={{ height: '20px', width: '90px', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : reports.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={48} />
                            <p>No reports submitted yet.</p>
                        </div>
                    ) : isAdmin ? (
                        <div className="manager-reports-table-container">
                            <div className="manager-filter-bar" style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', position: 'relative', borderTopLeftRadius: '11px', borderTopRightRadius: '11px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Filter by Date:</span>
                                
                                <div style={{ position: 'relative' }}>
                                    <button 
                                        className="custom-date-picker-btn"
                                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: '8px', 
                                            padding: '8px 12px', background: 'white', border: '1px solid #cbd5e1', 
                                            borderRadius: '6px', fontSize: '13px', color: filterDate ? '#0f172a' : '#64748b',
                                            cursor: 'pointer', minWidth: '180px', justifyContent: 'flex-start'
                                        }}
                                    >
                                        <Calendar size={16} />
                                        {filterDate ? format(new Date(filterDate), 'PPP') : 'Pick a date'}
                                    </button>

                                    {isCalendarOpen && (
                                        <>
                                            <div 
                                                style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
                                                onClick={() => setIsCalendarOpen(false)} 
                                            />
                                            <div style={{ 
                                                position: 'absolute', top: 'calc(100% + 4px)', right: 0, 
                                                background: 'white', border: '1px solid #e2e8f0', 
                                                borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                                                zIndex: 50, padding: '12px' 
                                            }}>
                                                <DayPicker 
                                                    mode="single"
                                                    selected={filterDate ? new Date(filterDate + 'T12:00:00Z') : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                                            setFilterDate(localDateStr);
                                                        } else {
                                                            setFilterDate('');
                                                        }
                                                        setIsCalendarOpen(false);
                                                    }}
                                                    className="custom-day-picker"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {filterDate && (
                                    <button className="btn-clear-filter" onClick={() => setFilterDate('')}>
                                        Clear
                                    </button>
                                )}

                                <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 8px' }}></div>

                                <button 
                                    onClick={exportWeeklyReport}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '8px', 
                                        padding: '8px 16px', background: '#0f172a', color: 'white', 
                                        border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
                                        cursor: 'pointer', transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                                >
                                    <Download size={16} />
                                    Export Last 7 Days
                                </button>

                                <button 
                                    onClick={() => setIsBundleDrawerOpen(true)}
                                    disabled={isForwarding}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '8px', 
                                        padding: '8px 16px', background: '#4f46e5', color: 'white', 
                                        border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
                                        cursor: isForwarding ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s',
                                        opacity: isForwarding ? 0.7 : 1
                                    }}
                                    onMouseOver={(e) => { if (!isForwarding) e.currentTarget.style.backgroundColor = '#4338ca'; }}
                                    onMouseOut={(e) => { if (!isForwarding) e.currentTarget.style.backgroundColor = '#4f46e5'; }}
                                >
                                    <Send size={16} />
                                    {isForwarding ? 'Sending...' : 'Send to Admin'}
                                </button>
                            </div>
                            <table className="manager-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Submitted By</th>
                                        <th>Type</th>
                                        {!isAccounts && <th>Project</th>}
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedReports.map(report => (
                                        <React.Fragment key={report._id}>
                                            <tr className={`row-main ${expandedReports[report._id] ? 'row-expanded' : ''}`} onClick={() => toggleReport(report._id)}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        {new Date(report.reportDate || report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        {report.status === 'Pending' && <span className="badge-new">NEW</span>}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>{report.submittedBy?.fullName || 'Unknown'}</td>
                                                <td>{report.type}</td>
                                                {!isAccounts && <td>{report.project ? `${report.project.projectNumber} - ${report.project.name}` : '-'}</td>}
                                                <td>
                                                    <span className={`meta-priority priority-${report.priority}`}>
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                                        {report.priority}
                                                    </span>
                                                </td>
                                                <td>{getStatusBadge(report.status)}</td>
                                                <td>
                                                    <button className="manager-table-expand-btn" onClick={(e) => { e.stopPropagation(); toggleReport(report._id); }}>
                                                        {expandedReports[report._id] ? 'Close' : 'View'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedReports[report._id] && (
                                                <tr>
                                                    <td colSpan="7" className="expanded-content-cell">
                                                        <div style={{ padding: '20px', background: '#f8fafc' }}>
                                                            {renderReportExpandedBody(report)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="reports-list">
                            {paginatedReports.map((report) => (
                                <div key={report._id} className="report-item-card">
                                    <div 
                                        className="report-item-header" 
                                        onClick={() => toggleReport(report._id)}
                                        style={{ cursor: 'pointer', marginBottom: expandedReports[report._id] ? '12px' : '0', userSelect: 'none' }}
                                    >
                                        <div>
                                            <h3 className="report-title">{report.title}</h3>
                                            <div className="report-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                                                {isAdmin && report.submittedBy && (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#0f172a', fontWeight: 700, fontSize: '12px' }}>
                                                        {report.submittedBy.fullName || 'Unknown User'}
                                                    </span>
                                                )}
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#334155', fontWeight: 600, fontSize: '12px' }}>
                                                    <Calendar size={14} color="#64748b" />
                                                    {new Date(report.reportDate || report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="meta-type">
                                                    <FileText size={14}/> {report.type}
                                                </span>
                                                <span className={`meta-priority priority-${report.priority}`}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                                    {report.priority} Priority
                                                </span>
                                                {report.project && (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4338ca', fontWeight: 700, background: '#e0e7ff', border: '1px solid #c7d2fe', padding: '4px 10px', borderRadius: '6px' }}>
                                                        <Briefcase size={14} />
                                                        {report.project.projectNumber} - {report.project.name}
                                                        {report.isAssignedToMe && (
                                                            <span style={{ fontSize: '10px', color: '#16a34a', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>
                                                                Assigned
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            {getStatusBadge(report.status)}
                                            {expandedReports[report._id] ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                                        </div>
                                    </div>
                                    
                                    {expandedReports[report._id] && renderReportExpandedBody(report)}
                                </div>
                            ))}
                            
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: currentPage === 1 ? '#f1f5f9' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, color: currentPage === 1 ? '#94a3b8' : '#475569' }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: currentPage === totalPages ? '#f1f5f9' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, color: currentPage === totalPages ? '#94a3b8' : '#475569' }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
            
            {/* Bundle Drawer */}
            {isBundleDrawerOpen && (
                <div className="drawer-overlay" onClick={() => setIsBundleDrawerOpen(false)}>
                    <div className="drawer-content" onClick={e => e.stopPropagation()} style={{ width: '450px' }}>
                        <div className="drawer-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ background: '#e0f2fe', padding: '6px', borderRadius: '6px', color: '#0ea5e9' }}>
                                    <Send size={18} />
                                </div>
                                <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a' }}>Send Reports to Admin</h2>
                            </div>
                            <button className="drawer-close" onClick={() => setIsBundleDrawerOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="drawer-body">
                            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
                                Select a date range. All reports submitted by your staff within these dates will be bundled into a single weekly report and sent to the Admin.
                            </p>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>Start Date</label>
                                <input 
                                    type="date" 
                                    value={bundleStartDate} 
                                    onChange={e => setBundleStartDate(e.target.value)} 
                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#45464d', fontSize: '13px' }}>End Date</label>
                                <input 
                                    type="date" 
                                    value={bundleEndDate} 
                                    onChange={e => setBundleEndDate(e.target.value)} 
                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                />
                            </div>
                        </div>
                        <div className="drawer-footer">
                            <button 
                                type="button" 
                                onClick={() => setIsBundleDrawerOpen(false)}
                                style={{ padding: '0.6rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                onClick={handleSendToAdmin}
                                disabled={isForwarding || !bundleStartDate || !bundleEndDate}
                                className="btn-submit-report"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', opacity: (!bundleStartDate || !bundleEndDate || isForwarding) ? 0.7 : 1 }}
                            >
                                {isForwarding ? 'Sending...' : <><Send size={14} /> Send Bundle</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StaffReports;
