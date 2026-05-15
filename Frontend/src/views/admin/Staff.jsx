import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    X,
    Edit,
    Trash2,
    Loader,
    Phone,
    Mail,
    Calendar,
    BarChart2,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Briefcase,
    ChevronDown,
    IndianRupee
} from 'lucide-react';
import { staffAPI } from '../../models/api';
import { useToast } from '../../models/context/ToastContext';
import CustomSelect from '../common/CustomSelect';
import './css/Staff.css';
import Skeleton from '../common/Skeleton';
import DatePicker from '../common/DatePicker';


const Staff = () => {
    const { showToast } = useToast();
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [selectedAnalytics, setSelectedAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    // --- Salary Modal State ---
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [salaryStaff, setSalaryStaff] = useState(null);
    const [salaryLoading, setSalaryLoading] = useState(false);
    const [salarySubmitting, setSalarySubmitting] = useState(false);
    const [salaryEditMode, setSalaryEditMode] = useState(false);
    const [salaryForm, setSalaryForm] = useState({
        baseSalary: '', hra: '', travelAllowance: '', otherAllowances: '',
        providentFund: '', taxDeduction: '', otherDeductions: '',
        effectiveFrom: '', notes: ''
    });

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const calcGross = (f) =>
        (Number(f.baseSalary)||0) + (Number(f.hra)||0) + (Number(f.travelAllowance)||0) + (Number(f.otherAllowances)||0);

    const calcDeductions = (f) =>
        (Number(f.providentFund)||0) + (Number(f.taxDeduction)||0) + (Number(f.otherDeductions)||0);

    const fmtINR = (n) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

    const initialFormData = {
        name: '',
        email: '',
        phone: '',
        role: '',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        password: '',
        confirmPassword: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchStaff();

        const handleOpenStaffModal = () => setShowModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-staff-modal', handleOpenStaffModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('open-create-staff-modal', handleOpenStaffModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await staffAPI.getAll();
            if (response.success) {
                setStaffList(response.data);
            }
        } catch (err) {
            setError(err.message);
            showToast('Failed to load staff list', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // For phone: only allow digits, max 10
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, phone: digits }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend Validation
        if (!formData.name || formData.name.trim().length < 2) {
            showToast('Name must be at least 2 characters', 'error');
            return;
        }
        if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
            showToast('Phone number must be exactly 10 digits', 'error');
            return;
        }
        if (!formData.role || formData.role.trim().length < 2) {
            showToast('Role must be at least 2 characters', 'error');
            return;
        }
        if (formData.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            showToast('Please provide a valid email address', 'error');
            return;
        }
        if (!editingStaff) {
            if (!formData.password || formData.password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
        }

        setSubmitting(true);

        try {
            if (editingStaff) {
                const response = await staffAPI.update(editingStaff._id, formData);
                if (response.success) {
                    await fetchStaff();
                    showToast('Staff member updated successfully');
                    closeModal();
                }
            } else {
                const response = await staffAPI.create(formData);
                if (response.success) {
                    await fetchStaff();
                    showToast(`New staff member added! Staff ID: ${response.data.staffId}`, 'success');
                    closeModal();
                }
            }
        } catch (err) {
            showToast(err.message || 'Failed to save staff information', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (staff) => {
        setEditingStaff(staff);
        setFormData({
            name: staff.name || '',
            email: staff.email || '',
            phone: staff.phone || '',
            role: staff.role || '',
            joiningDate: staff.joiningDate ? staff.joiningDate.split('T')[0] : '',
            status: staff.status || 'Active'
        });
        setShowModal(true);
    };

    const handleViewAnalytics = async (staff) => {
        setSelectedAnalytics(null);
        setAnalyticsLoading(true);
        setShowAnalytics(true);
        try {
            const response = await staffAPI.getAnalytics(staff._id);
            if (response.success) {
                setSelectedAnalytics(response.data);
            }
        } catch (err) {
            showToast('Failed to load performance analytics', 'error');
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const handleViewSalary = async (staff) => {
        setSalaryStaff(null);
        setSalaryEditMode(false);
        setSalaryLoading(true);
        setShowSalaryModal(true);
        try {
            const res = await staffAPI.getSalary(staff._id);
            if (res.success) {
                setSalaryStaff(res.data);
                const s = res.data.salary || {};
                setSalaryForm({
                    baseSalary: s.baseSalary || '',
                    hra: s.hra || '',
                    travelAllowance: s.travelAllowance || '',
                    otherAllowances: s.otherAllowances || '',
                    providentFund: s.providentFund || '',
                    taxDeduction: s.taxDeduction || '',
                    otherDeductions: s.otherDeductions || '',
                    effectiveFrom: s.effectiveFrom ? s.effectiveFrom.split('T')[0] : '',
                    notes: s.notes || ''
                });
            }
        } catch (err) {
            showToast('Failed to load salary information', 'error');
        } finally {
            setSalaryLoading(false);
        }
    };

    const handleSalarySubmit = async (e) => {
        e.preventDefault();
        if (!salaryStaff) return;
        setSalarySubmitting(true);
        try {
            const res = await staffAPI.updateSalary(salaryStaff._id, salaryForm);
            if (res.success) {
                setSalaryStaff(res.data);
                const s = res.data.salary || {};
                setSalaryForm({
                    baseSalary: s.baseSalary || '',
                    hra: s.hra || '',
                    travelAllowance: s.travelAllowance || '',
                    otherAllowances: s.otherAllowances || '',
                    providentFund: s.providentFund || '',
                    taxDeduction: s.taxDeduction || '',
                    otherDeductions: s.otherDeductions || '',
                    effectiveFrom: s.effectiveFrom ? s.effectiveFrom.split('T')[0] : '',
                    notes: s.notes || ''
                });
                setSalaryEditMode(false);
                showToast('Salary updated successfully', 'success');
            }
        } catch (err) {
            showToast('Failed to update salary', 'error');
        } finally {
            setSalarySubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        try {
            const response = await staffAPI.delete(id);
            if (response.success) {
                await fetchStaff();
                showToast('Staff member removed successfully');
            }
        } catch (err) {
            showToast('Failed to delete staff member', 'error');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingStaff(null);
        setFormData(initialFormData);
        setError(null);
    };

    const filteredStaff = staffList.filter(staff =>
        staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone?.includes(searchTerm) ||
        staff.staffId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="staff-container">
            <div className="staff-wrapper">
                {/* Search moved to navbar */}

                {loading ? (
                    <div className="skeleton-table">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton-table-row">
                                <div className="skeleton skeleton-avatar" />
                                <div className="skeleton skeleton-table-cell" style={{ flex: 2 }} />
                                <div className="skeleton skeleton-table-cell" />
                                <div className="skeleton skeleton-table-cell" />
                            </div>
                        ))}
                    </div>
                ) : filteredStaff.length === 0 ? (
                    <div className="empty-state">
                        <h4>No staff members found</h4>
                        <p>Add a new staff member to get started</p>
                    </div>
                ) : (
                    <>
                        <div className="staff-table-container">
                            <table className="staff-table">
                                <thead>
                                    <tr>
                                        <th className="desktop-hide">Staff ID</th>
                                        <th>Staff Member</th>
                                        <th className="desktop-hide">Role</th>
                                        <th className="desktop-hide">Contact</th>
                                        <th className="desktop-hide">Joining Date</th>
                                        <th className="desktop-hide">Status</th>
                                        <th className="desktop-hide">Actions</th>
                                        <th className="mobile-show">Status</th>
                                        <th className="mobile-show"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStaff.map((staff) => (
                                        <React.Fragment key={staff._id}>
                                            <tr 
                                                className={`staff-row ${expandedRow === staff._id ? 'expanded' : ''}`}
                                                onClick={() => window.innerWidth <= 768 && toggleRow(staff._id)}
                                            >
                                                <td className="desktop-hide">
                                                    <span className="staff-id-badge">{staff.staffId || '—'}</span>
                                                </td>
                                                <td>
                                                    <div className="staff-info-cell">
                                                        <div className="staff-avatar">
                                                            {staff.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="staff-details">
                                                            <span className="staff-name">{staff.name}</span>
                                                            <span className="staff-phone desktop-hide">{staff.phone}</span>
                                                            <div className="mobile-staff-meta mobile-show">
                                                                <span className="mobile-role">{staff.role}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="desktop-hide">
                                                    <div className="role-cell">
                                                        <Briefcase size={14} />
                                                        <span>{staff.role}</span>
                                                    </div>
                                                </td>
                                                <td className="desktop-hide">
                                                    <div className="contact-cell">
                                                        <div className="contact-item">
                                                            <Mail size={12} />
                                                            <span>{staff.email || '—'}</span>
                                                        </div>
                                                        <div className="contact-item">
                                                            <Phone size={12} />
                                                            <span>{staff.phone || '—'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="desktop-hide">
                                                    <div className="date-cell">
                                                        <Calendar size={14} />
                                                        <span>{staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="desktop-hide">
                                                    <span className={`status-badge ${staff.status?.toLowerCase().replace(' ', '-')}`}>
                                                        {staff.status}
                                                    </span>
                                                </td>
                                                <td className="desktop-hide">
                                                    <div className="actions-cell">
                                                        <button className="btn-icon salary" onClick={() => handleViewSalary(staff)} title="Salary Management">
                                                            <IndianRupee size={16} />
                                                        </button>
                                                        <button className="btn-icon analytics" onClick={() => handleViewAnalytics(staff)} title="Performance Analytics">
                                                            <BarChart2 size={16} />
                                                        </button>
                                                        <button className="btn-icon edit" onClick={() => handleEdit(staff)} title="Edit Staff">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="btn-icon delete" onClick={() => handleDelete(staff._id)} title="Remove Staff">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="mobile-show">
                                                    <span className={`mobile-status-badge ${staff.status?.toLowerCase().replace(' ', '-')}`}>
                                                        {staff.status}
                                                    </span>
                                                </td>
                                                <td className="mobile-show toggle-cell">
                                                    <ChevronDown size={18} className={`toggle-icon ${expandedRow === staff._id ? 'active' : ''}`} />
                                                </td>
                                            </tr>
                                            {expandedRow === staff._id && (
                                                <tr className="mobile-expansion-row mobile-show">
                                                    <td colSpan="3">
                                                        <div className="expansion-content">
                                                            <div className="info-grid">
                                                                <div className="info-item">
                                                                    <label>Staff ID</label>
                                                                    <span>{staff.staffId || '—'}</span>
                                                                </div>
                                                                <div className="info-item">
                                                                    <label>Role</label>
                                                                    <span>{staff.role}</span>
                                                                </div>
                                                                <div className="info-item">
                                                                    <label>Email</label>
                                                                    <span>{staff.email || '—'}</span>
                                                                </div>
                                                                <div className="info-item">
                                                                    <label>Joining Date</label>
                                                                    <span>{staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : '—'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="expansion-actions">
                                                                <button className="btn-mobile-action salary" onClick={() => handleViewSalary(staff)}>
                                                                    <IndianRupee size={16} />
                                                                    View Salary
                                                                </button>
                                                                <button className="btn-mobile-action primary" onClick={() => handleViewAnalytics(staff)}>
                                                                    <BarChart2 size={16} />
                                                                    Performance Analytics
                                                                </button>
                                                                <button className="btn-mobile-action secondary" onClick={() => handleEdit(staff)}>
                                                                    <Edit size={16} />
                                                                    Edit Staff
                                                                </button>
                                                                <button className="btn-mobile-action danger" onClick={() => handleDelete(staff._id)}>
                                                                    <Trash2 size={16} />
                                                                    Remove Staff
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</h3>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body" data-lenis-prevent>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Role / Job Title *</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Carpenter, Supervisor"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number * <small style={{ color: '#9ca3af', fontWeight: 400 }}>(10 digits)</small></label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter 10-digit phone number"
                                            required
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            title="Phone number must be exactly 10 digits"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>

                                    {!editingStaff && (
                                        <>
                                            <div className="form-group">
                                                <label>Login Password * <small style={{ color: '#9ca3af', fontWeight: 400 }}>(min 6 chars)</small></label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Set login password (min 6 characters)"
                                                    required
                                                    minLength={6}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Confirm Password *</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm password"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="form-group">
                                        <CustomSelect
                                            label="Status"
                                            name="status"
                                            options={[
                                                { value: 'Active', label: 'Active' },
                                                { value: 'On Leave', label: 'On Leave' },
                                                { value: 'Inactive', label: 'Inactive' }
                                            ]}
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            searchable={false}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Joining Date</label>
                                        <input
                                            type="date"
                                            name="joiningDate"
                                            value={formData.joiningDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal} disabled={submitting}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit" disabled={submitting}>
                                    {submitting ? <Loader size={16} className="spinner" /> : 'Save Staff Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAnalytics && (
                <div className="modal-overlay">
                    <div className="modal-content analytics-modal">
                        <div className="modal-header">
                            <div className="header-title">
                                <BarChart2 size={24} />
                                <h3>Staff Performance Analytics</h3>
                            </div>
                            <button className="modal-close" onClick={() => setShowAnalytics(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {analyticsLoading ? (
                                <div className="analytics-skeleton">
                                    <div className="staff-overview skeleton">
                                        <Skeleton width="60px" height="60px" borderRadius="50%" />
                                        <div style={{ flex: 1, marginLeft: '1rem' }}>
                                            <Skeleton width="150px" height="24px" />
                                            <div style={{ height: '8px' }} />
                                            <Skeleton width="100px" height="16px" />
                                        </div>
                                    </div>
                                    <div className="analytics-grid">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="analytics-card skeleton">
                                                <Skeleton width="40px" height="40px" borderRadius="10px" />
                                                <div style={{ marginTop: '1rem' }}>
                                                    <Skeleton width="80px" height="14px" />
                                                    <div style={{ height: '8px' }} />
                                                    <Skeleton width="100%" height="32px" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="performance-chart-skeleton" style={{ marginTop: '2rem' }}>
                                        <Skeleton width="100%" height="200px" borderRadius="16px" />
                                    </div>
                                </div>
                            ) : selectedAnalytics ? (
                                <div className="analytics-grid">
                                    <div className="analytics-card main">
                                        <div className="staff-overview">
                                            <div className="staff-avatar large">
                                                {selectedAnalytics.staffName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="staff-info">
                                                <h4>{selectedAnalytics.staffName}</h4>
                                                <span>{selectedAnalytics.role}</span>
                                            </div>
                                        </div>
                                        <div className="performance-score">
                                            <div className="circular-progress">
                                                <span className="score">{selectedAnalytics.performanceScore}%</span>
                                                <span className="label">Completion Rate</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="analytics-stats-grid">
                                        <div className="stat-card">
                                            <div className="stat-icon completions">
                                                <CheckCircle size={20} />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value">{selectedAnalytics.tasksCompleted}</span>
                                                <span className="stat-label">Tasks Completed</span>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon trend">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value text-capitalize">{selectedAnalytics.efficiencyTrend}</span>
                                                <span className="stat-label">Efficiency Trend</span>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon on-time">
                                                <Clock size={20} />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value">{selectedAnalytics.onTimeCompletionRate}%</span>
                                                <span className="stat-label">On-Time Rate</span>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon pending">
                                                <AlertCircle size={20} />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-value">{selectedAnalytics.pendingTasks}</span>
                                                <span className="stat-label">Pending Tasks</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="current-assignment">
                                        <h5>Current Assignment</h5>
                                        <div className="assignment-details">
                                            <div className="detail-item">
                                                <Briefcase size={16} />
                                                <div>
                                                    <label>Client</label>
                                                    <span>{selectedAnalytics.currentClient}</span>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <Briefcase size={16} />
                                                <div>
                                                    <label>Project</label>
                                                    <span>{selectedAnalytics.currentProject}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="analytics-note">
                                            <p>💡 <strong>Note:</strong> Assign tasks to this staff member from the <strong>Task Management</strong> section.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>No analytics data available for this staff member.</p>
                                    <p>Assign tasks from the Task Management section to track performance.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── SALARY MODAL ─────────────────────────────────────── */}
            {showSalaryModal && (
                <div className="modal-overlay" onClick={() => { setShowSalaryModal(false); setSalaryEditMode(false); }}>
                    <div className="modal-content salary-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-title">
                                <IndianRupee size={22} color="#10b981" />
                                <h3>Salary Management</h3>
                            </div>
                            <button className="modal-close" onClick={() => { setShowSalaryModal(false); setSalaryEditMode(false); }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body" data-lenis-prevent>
                            {salaryLoading ? (
                                <div className="salary-skeleton">
                                    <div className="salary-skeleton-header" />
                                    <div className="salary-skeleton-grid">
                                        {[...Array(6)].map((_, i) => <div key={i} className="salary-skeleton-cell" />)}
                                    </div>
                                </div>
                            ) : salaryStaff ? (
                                <>
                                    {/* Staff Info Banner */}
                                    <div className="salary-staff-banner">
                                        <div className="staff-avatar" style={{ width: 48, height: 48, fontSize: '1.2rem', flexShrink: 0 }}>
                                            {salaryStaff.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="salary-staff-name">{salaryStaff.name}</div>
                                            <div className="salary-staff-meta">{salaryStaff.staffId} · {salaryStaff.role}</div>
                                        </div>
                                        {!salaryEditMode && (
                                            <button className="salary-edit-trigger" onClick={() => setSalaryEditMode(true)}>
                                                <Edit size={15} /> Edit Salary
                                            </button>
                                        )}
                                    </div>

                                    {salaryEditMode ? (
                                        /* ── EDIT FORM ── */
                                        <form onSubmit={handleSalarySubmit}>
                                            <div className="salary-section-title">Earnings</div>
                                            <div className="salary-form-grid">
                                                {[
                                                    { key: 'baseSalary', label: 'Basic Salary' },
                                                    { key: 'hra', label: 'HRA' },
                                                    { key: 'travelAllowance', label: 'Travel Allowance' },
                                                    { key: 'otherAllowances', label: 'Other Allowances' },
                                                ].map(({ key, label }) => (
                                                    <div className="salary-form-group" key={key}>
                                                        <label>{label}</label>
                                                        <div className="salary-input-wrap">
                                                            <span className="salary-prefix">₹</span>
                                                            <input
                                                                type="number" min="0"
                                                                value={salaryForm[key]}
                                                                onChange={e => setSalaryForm(p => ({ ...p, [key]: e.target.value }))}
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="salary-section-title" style={{ marginTop: '1.25rem' }}>Deductions</div>
                                            <div className="salary-form-grid">
                                                {[
                                                    { key: 'providentFund', label: 'Provident Fund (PF)' },
                                                    { key: 'taxDeduction', label: 'TDS / Income Tax' },
                                                    { key: 'otherDeductions', label: 'Other Deductions' },
                                                ].map(({ key, label }) => (
                                                    <div className="salary-form-group" key={key}>
                                                        <label>{label}</label>
                                                        <div className="salary-input-wrap">
                                                            <span className="salary-prefix">₹</span>
                                                            <input
                                                                type="number" min="0"
                                                                value={salaryForm[key]}
                                                                onChange={e => setSalaryForm(p => ({ ...p, [key]: e.target.value }))}
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="salary-form-grid" style={{ marginTop: '1.25rem' }}>
                                                <div className="salary-form-group">
                                                    <label>Effective From</label>
                                                    <DatePicker
                                                        value={salaryForm.effectiveFrom}
                                                        onChange={(val) => setSalaryForm(p => ({ ...p, effectiveFrom: val }))}
                                                        placeholder="Select date"
                                                    />
                                                </div>
                                                <div className="salary-form-group">
                                                    <label>Notes</label>
                                                    <input
                                                        type="text"
                                                        className="salary-date-input"
                                                        placeholder="e.g. Annual increment"
                                                        value={salaryForm.notes}
                                                        onChange={e => setSalaryForm(p => ({ ...p, notes: e.target.value }))}
                                                    />
                                                </div>
                                            </div>

                                            {/* Live Summary */}
                                            <div className="salary-summary-bar">
                                                <div className="salary-summary-item green">
                                                    <span>Gross Pay</span>
                                                    <strong>{fmtINR(calcGross(salaryForm))}</strong>
                                                </div>
                                                <div className="salary-summary-item red">
                                                    <span>Deductions</span>
                                                    <strong>- {fmtINR(calcDeductions(salaryForm))}</strong>
                                                </div>
                                                <div className="salary-summary-item blue">
                                                    <span>Net Pay</span>
                                                    <strong>{fmtINR(calcGross(salaryForm) - calcDeductions(salaryForm))}</strong>
                                                </div>
                                            </div>

                                            <div className="modal-footer" style={{ paddingTop: 0 }}>
                                                <button type="button" className="btn-cancel" onClick={() => setSalaryEditMode(false)} disabled={salarySubmitting}>Cancel</button>
                                                <button type="submit" className="btn-submit" disabled={salarySubmitting}>
                                                    {salarySubmitting ? <Loader size={16} className="spinner" /> : 'Save Salary'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        /* ── VIEW MODE ── */
                                        <>
                                            {salaryStaff.salary?.effectiveFrom ? (
                                                <>
                                                    <div className="salary-view-section">
                                                        <div className="salary-view-title">Earnings</div>
                                                        <div className="salary-view-grid">
                                                            {[
                                                                { label: 'Basic Salary', val: salaryStaff.salary?.baseSalary },
                                                                { label: 'HRA', val: salaryStaff.salary?.hra },
                                                                { label: 'Travel Allowance', val: salaryStaff.salary?.travelAllowance },
                                                                { label: 'Other Allowances', val: salaryStaff.salary?.otherAllowances },
                                                            ].map(({ label, val }) => (
                                                                <div className="salary-view-row" key={label}>
                                                                    <span>{label}</span>
                                                                    <span className="salary-view-val green">{fmtINR(val)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="salary-view-section">
                                                        <div className="salary-view-title">Deductions</div>
                                                        <div className="salary-view-grid">
                                                            {[
                                                                { label: 'Provident Fund (PF)', val: salaryStaff.salary?.providentFund },
                                                                { label: 'TDS / Income Tax', val: salaryStaff.salary?.taxDeduction },
                                                                { label: 'Other Deductions', val: salaryStaff.salary?.otherDeductions },
                                                            ].map(({ label, val }) => (
                                                                <div className="salary-view-row" key={label}>
                                                                    <span>{label}</span>
                                                                    <span className="salary-view-val red">{fmtINR(val)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="salary-summary-bar" style={{ marginTop: '1rem' }}>
                                                        <div className="salary-summary-item green">
                                                            <span>Gross Pay</span>
                                                            <strong>{fmtINR(calcGross(salaryStaff.salary || {}))}</strong>
                                                        </div>
                                                        <div className="salary-summary-item red">
                                                            <span>Deductions</span>
                                                            <strong>- {fmtINR(calcDeductions(salaryStaff.salary || {}))}</strong>
                                                        </div>
                                                        <div className="salary-summary-item blue">
                                                            <span>Net Pay</span>
                                                            <strong>{fmtINR(calcGross(salaryStaff.salary || {}) - calcDeductions(salaryStaff.salary || {}))}</strong>
                                                        </div>
                                                    </div>

                                                    <div className="salary-effective-note">
                                                        <Calendar size={14} />
                                                        Effective from {new Date(salaryStaff.salary.effectiveFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        {salaryStaff.salary.notes && <> · <em>{salaryStaff.salary.notes}</em></>}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="salary-not-set">
                                                    <IndianRupee size={32} strokeWidth={1.5} />
                                                    <p>Salary not configured yet</p>
                                                    <span>Click "Edit Salary" to set up the salary structure for this staff member.</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="empty-state"><p>Failed to load salary information.</p></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
