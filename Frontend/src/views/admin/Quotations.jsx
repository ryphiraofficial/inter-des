import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, CheckCircle, XCircle, FileText, User, IndianRupee, Clock, Loader, LayoutGrid, List, Eye, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { quotationAPI } from '../../models/api';
import { getRolePermissions } from '../../controllers/hooks/useRoleDashboard';
import './css/Quotations.css';

const Quotations = ({ isStaff, user }) => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // Use role permissions to determine if user can approve
    const canApprove = getRolePermissions(user?.role).canApproveQuotations;

    useEffect(() => {
        fetchQuotations();

        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await quotationAPI.getAll();
            if (response.success) {
                setQuotations(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this quotation?')) return;
        setSubmitting(true);
        try {
            const response = await quotationAPI.approve(id);
            if (response.success) {
                alert('Quotation approved successfully');
                fetchQuotations();
            }
        } catch (err) {
            alert(err.message || 'Failed to approve');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quotation?')) return;
        setSubmitting(true);
        try {
            const response = await quotationAPI.delete(id);
            if (response.success) {
                alert('Quotation deleted successfully');
                fetchQuotations();
            }
        } catch (err) {
            alert(err.message || 'Failed to delete');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredQuotations = quotations.filter(q => {
        const matchesSearch = (
            q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesTab = (
            activeTab === 'All' ||
            (activeTab === 'Under Review' && q.status === 'Under Review') ||
            (activeTab === 'Approved' && q.status === 'Approved')
        );

        return matchesSearch && matchesTab;
    });

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'q-status-approved';
            case 'under review': return 'q-status-pending';
            case 'rejected': return 'q-status-rejected';
            default: return 'q-status-default';
        }
    };

    return (
        <div className={`quotations-wrapper ${isStaff ? 'staff-view' : ''}`}>
            <div className="quotations-content">
                <div className="quotations-header-row">
                    <div className="q-header-left">
                        <div className="q-tabs-list">
                            {['All', 'Under Review', 'Approved'].map(tab => (
                                <button
                                    key={tab}
                                    className={`q-tab-item ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                    <span className="q-tab-badge">
                                        {tab === 'All' ? quotations.length : quotations.filter(q => q.status === tab).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="quotations-controls-row">
                    {/* Search moved to navbar */}
                    <Link to={isStaff ? "/staff/quotations/new" : "/quotations/new"} className="btn-new-quotation">
                        <Plus size={18} />
                        <span>New Quotation</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="skeleton-table">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="skeleton-table-row">
                                <div className="skeleton skeleton-table-cell" style={{ flex: 2 }} />
                                <div className="skeleton skeleton-table-cell" />
                                <div className="skeleton skeleton-table-cell" />
                                <div className="skeleton skeleton-table-cell" />
                            </div>
                        ))}
                    </div>
                ) : filteredQuotations.length === 0 ? (
                    <div className="q-empty-state-card">
                        <FileText size={48} />
                        <h4>No quotations found</h4>
                        <p>Try matching your search or filters to different criteria.</p>
                    </div>
                ) : (
                    <div className="quotations-table-container">
                        <table className="quotations-table">
                            <thead>
                                <tr>
                                    <th>Quote #</th>
                                    <th>Project & Client</th>
                                    <th className="desktop-hide">Amount</th>
                                    <th className="desktop-hide">Date</th>
                                    <th className="desktop-hide">Status</th>
                                    <th className="desktop-hide">Actions</th>
                                    <th className="mobile-show">Amount</th>
                                    <th className="mobile-show"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuotations.map((q) => (
                                    <React.Fragment key={q._id}>
                                        <tr 
                                            className={`q-row ${expandedRow === q._id ? 'expanded' : ''}`}
                                            onClick={() => window.innerWidth <= 768 && toggleRow(q._id)}
                                        >
                                            <td className="quote-number-cell">#{q.quotationNumber}</td>
                                            <td>
                                                <div className="project-client-cell">
                                                    <span className="project-name">{q.projectName}</span>
                                                    <span className="client-name">{q.client?.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="desktop-hide">₹{(q.totalAmount || 0).toLocaleString()}</td>
                                            <td className="desktop-hide">{new Date(q.createdAt).toLocaleDateString()}</td>
                                            <td className="desktop-hide">
                                                <span className={`q-status-badge ${getStatusClass(q.status)}`}>
                                                    {q.status}
                                                </span>
                                            </td>
                                            <td className="desktop-hide">
                                                <div className="q-action-buttons">
                                                    <Link to={`/quotations/view/${q._id}`} className="btn-icon view" title="View">
                                                        <Eye size={18} />
                                                    </Link>
                                                    {!isStaff && canApprove && q.status === 'Under Review' && (
                                                        <button
                                                            className="btn-icon approve"
                                                            onClick={(e) => { e.stopPropagation(); handleApprove(q._id); }}
                                                            disabled={submitting}
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {!isStaff && canApprove && (
                                                        <button
                                                            className="btn-icon delete"
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(q._id); }}
                                                            disabled={submitting}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="mobile-show">
                                                <span className="mobile-amount">₹{(q.totalAmount || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="mobile-show toggle-cell">
                                                <ChevronDown size={18} className={`toggle-icon ${expandedRow === q._id ? 'active' : ''}`} />
                                            </td>
                                        </tr>
                                        {expandedRow === q._id && (
                                            <tr className="mobile-expansion-row mobile-show">
                                                <td colSpan="4">
                                                    <div className="expansion-content">
                                                        <div className="info-grid">
                                                            <div className="info-item">
                                                                <label>Date</label>
                                                                <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Status</label>
                                                                <span className={`q-status-badge ${getStatusClass(q.status)}`}>
                                                                    {q.status}
                                                                </span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Items</label>
                                                                <span>{q.lineItems?.length || 0} Items</span>
                                                            </div>
                                                        </div>
                                                        <div className="expansion-actions">
                                                            <Link to={`/quotations/view/${q._id}`} className="btn-mobile-action primary">
                                                                <Eye size={16} />
                                                                View Detailed Quote
                                                            </Link>
                                                            {!isStaff && canApprove && q.status === 'Under Review' && (
                                                                <button className="btn-mobile-action success" onClick={() => handleApprove(q._id)}>
                                                                    <CheckCircle size={16} />
                                                                    Approve Quotation
                                                                </button>
                                                            )}
                                                            {!isStaff && canApprove && (
                                                                <button className="btn-mobile-action danger" onClick={() => handleDelete(q._id)}>
                                                                    <Trash2 size={16} />
                                                                    Delete Quotation
                                                                </button>
                                                            )}
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
                )}
            </div>
        </div>
    );
};

export default Quotations;
