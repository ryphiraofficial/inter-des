import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    X,
    FileText,
    Download,
    Mail,
    Edit,
    Trash2,
    MoreVertical,
    CreditCard,
    Clock,
    CheckCircle,
    AlertCircle,
    Printer,
    Loader,
    ChevronDown,
    SlidersHorizontal
} from 'lucide-react';
import { invoiceAPI, clientAPI } from '../../models/api';
import './css/Invoice.css';

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // Filtered Invoices
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Form State
    const [formData, setFormData] = useState({
        client: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: 'Design Consultation', quantity: 1, rate: 5000, tax: 18 }]
    });

    useEffect(() => {
        fetchInvoices();
        fetchClients();

        const handleOpenModal = () => setShowCreateModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-invoice-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('open-create-invoice-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await invoiceAPI.getAll();
            if (response.success) setInvoices(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await clientAPI.getAll();
            if (response.success) setClients(response.data);
        } catch (err) {
            console.error('Error fetching clients:', err);
        }
    };

    const handleCreateInvoice = async () => {
        if (!formData.client || formData.items.length === 0) {
            alert('Please select a client and add at least one item.');
            return;
        }

        try {
            setSubmitting(true);
            const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
            const totalTax = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate * item.tax / 100), 0);

            // Add amount field to each item as required by backend
            const preparedItems = formData.items.map(item => ({
                ...item,
                amount: item.quantity * item.rate
            }));

            const response = await invoiceAPI.create({
                ...formData,
                items: preparedItems,
                subtotal,
                totalTax,
                grandTotal: subtotal + totalTax,
                status: 'Unpaid'
            });

            if (response.success) {
                setShowCreateModal(false);
                fetchInvoices();
                setFormData({ client: '', invoiceDate: '', dueDate: '', items: [] });
            }
        } catch (err) {
            alert('Error creating invoice: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this invoice?')) return;
        try {
            await invoiceAPI.delete(id);
            setInvoices(invoices.filter(inv => inv._id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
        }
    };

    const handleUpdatePayment = async (id, status, amountToPay) => {
        try {
            await invoiceAPI.recordPayment(id, {
                amount: amountToPay,
                paymentMethod: 'Bank Transfer',
                paymentDate: new Date()
            });
            fetchInvoices();
        } catch (err) {
            alert('Error updating payment: ' + err.message);
        }
    };

    // Stats Calculation
    const unpaidTotal = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const overdueTotal = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const paidTotal = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.grandTotal || 0), 0);

    const statsData = [
        { label: 'Outstanding', value: `₹${unpaidTotal.toLocaleString()}`, icon: <CreditCard size={24} />, color: 'blue' },
        { label: 'Overdue', value: `₹${overdueTotal.toLocaleString()}`, icon: <AlertCircle size={24} />, color: 'red' },
        { label: 'Paid (Total)', value: `₹${paidTotal.toLocaleString()}`, icon: <CheckCircle size={24} />, color: 'green' },
        { label: 'Total Invoices', value: invoices.length, icon: <FileText size={24} />, color: 'purple' },
    ];

    return (
        <div className="invoice-container">
            <div className="invoice-wrapper">
                <div className="invoice-stats-grid">
                    {statsData.map((stat, i) => (
                        <div key={i} className="invoice-stat-card">
                            <div className="stat-content">
                                <h4>{stat.label}</h4>
                                <h2>{stat.value}</h2>
                            </div>
                            <div className={`stat-icon-wrapper ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="invoice-filter-bar">
                    {/* Search moved to navbar */}
                    {/* Shadcn-style Filter Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowFilterDropdown(p => !p)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 14px', borderRadius: '8px',
                                border: '1px solid #e2e8f0', background: statusFilter === 'All' ? '#fff' : '#eef2ff',
                                color: statusFilter === 'All' ? '#64748b' : '#4f46e5',
                                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                                transition: 'all 0.15s', whiteSpace: 'nowrap',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <SlidersHorizontal size={15} />
                            {statusFilter === 'All' ? 'All Status' : statusFilter}
                            <ChevronDown size={14} style={{ opacity: 0.6, transform: showFilterDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        {showFilterDropdown && (
                            <>
                                {/* Backdrop to close */}
                                <div
                                    style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                                    onClick={() => setShowFilterDropdown(false)}
                                />
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                    background: '#fff', borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                    zIndex: 50, minWidth: '160px', padding: '4px', overflow: 'hidden'
                                }}>
                                    <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Filter by status</p>
                                    {[
                                        { value: 'All',    label: 'All Status',  dot: '#94a3b8' },
                                        { value: 'Draft',  label: 'Draft',       dot: '#94a3b8' },
                                        { value: 'Sent',   label: 'Sent',        dot: '#3b82f6' },
                                        { value: 'Unpaid', label: 'Unpaid',      dot: '#f59e0b' },
                                        { value: 'Paid',   label: 'Paid',        dot: '#10b981' },
                                        { value: 'Overdue',label: 'Overdue',     dot: '#ef4444' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setStatusFilter(opt.value); setShowFilterDropdown(false); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                width: '100%', padding: '8px 10px', borderRadius: '7px',
                                                border: 'none', background: statusFilter === opt.value ? '#f1f5f9' : 'transparent',
                                                color: statusFilter === opt.value ? '#0f172a' : '#475569',
                                                fontWeight: statusFilter === opt.value ? 700 : 500,
                                                fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
                                                transition: 'background 0.1s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = statusFilter === opt.value ? '#f1f5f9' : 'transparent'}
                                        >
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0, display: 'inline-block' }} />
                                            {opt.label}
                                            {statusFilter === opt.value && (
                                                <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <div className="invoice-table-card">
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
                    ) : filteredInvoices.length === 0 ? (
                        <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                            <FileText size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                            <h3>No invoices found</h3>
                        </div>
                    ) : (
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Client</th>
                                    <th className="desktop-hide">Date</th>
                                    <th className="desktop-hide">Due Date</th>
                                    <th className="desktop-hide">Amount</th>
                                    <th className="desktop-hide">Status</th>
                                    <th className="desktop-hide">Actions</th>
                                    <th className="mobile-show">Amount</th>
                                    <th className="mobile-show"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((inv) => (
                                    <React.Fragment key={inv._id}>
                                        <tr 
                                            className={`inv-row ${expandedRow === inv._id ? 'expanded' : ''}`}
                                            onClick={() => window.innerWidth <= 768 && toggleRow(inv._id)}
                                        >
                                            <td className="inv-id">{inv.invoiceNumber}</td>
                                            <td className="client-name-cell">
                                                <div className="client-info">
                                                    <span className="name">{inv.client?.name || 'Unknown'}</span>
                                                    <span className="mobile-status-hint mobile-show">
                                                        <span className={`status-dot ${inv.status?.toLowerCase()}`}></span>
                                                        {inv.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="desktop-hide">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                                            <td className="desktop-hide">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                            <td className="amount-cell desktop-hide">₹{inv.grandTotal?.toLocaleString()}</td>
                                            <td className="desktop-hide">
                                                <span className={`status-badge ${inv.status?.toLowerCase()}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="desktop-hide">
                                                <div className="invoice-actions">
                                                    <button className="btn-inv-action primary" title="Download"><Download size={16} /></button>
                                                    {inv.status !== 'Paid' && (
                                                        <button
                                                            className="btn-inv-action success"
                                                            title="Mark Paid"
                                                            onClick={(e) => { e.stopPropagation(); handleUpdatePayment(inv._id, 'Paid', inv.grandTotal - (inv.amountPaid || 0)); }}
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn-inv-action danger"
                                                        title="Delete"
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(inv._id); }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="mobile-show amount-cell">₹{inv.grandTotal?.toLocaleString()}</td>
                                            <td className="mobile-show toggle-cell">
                                                <ChevronDown size={18} className={`toggle-icon ${expandedRow === inv._id ? 'active' : ''}`} />
                                            </td>
                                        </tr>
                                        {/* Mobile Expansion Row */}
                                        {expandedRow === inv._id && (
                                            <tr className="mobile-expansion-row mobile-show">
                                                <td colSpan="4">
                                                    <div className="expansion-content">
                                                        <div className="info-grid">
                                                            <div className="info-item">
                                                                <label>Invoice Date</label>
                                                                <span>{new Date(inv.invoiceDate).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Due Date</label>
                                                                <span>{new Date(inv.dueDate).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Status</label>
                                                                <span className={`status-badge ${inv.status?.toLowerCase()}`}>{inv.status}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Paid Amount</label>
                                                                <span>₹{(inv.amountPaid || 0).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="expansion-actions">
                                                            <button className="btn-mobile-action primary" onClick={() => {/* handle download */}}>
                                                                <Download size={16} />
                                                                Download PDF
                                                            </button>
                                                            {inv.status !== 'Paid' && (
                                                                <button 
                                                                    className="btn-mobile-action success"
                                                                    onClick={() => handleUpdatePayment(inv._id, 'Paid', inv.grandTotal - (inv.amountPaid || 0))}
                                                                >
                                                                    <CheckCircle size={16} />
                                                                    Mark as Paid
                                                                </button>
                                                            )}
                                                            <button 
                                                                className="btn-mobile-action danger"
                                                                onClick={() => handleDelete(inv._id)}
                                                            >
                                                                <Trash2 size={16} />
                                                                Delete
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
                    )}
                </div>
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content-invoice" data-lenis-prevent>
                        <div className="modal-header">
                            <h3>Create New Invoice</h3>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="inv-form-grid">
                                <div className="inv-field">
                                    <label>Client *</label>
                                    <select
                                        className="inv-input"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    >
                                        <option value="">Select Client</option>
                                        {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="inv-form-grid">
                                    <div className="inv-field">
                                        <label>Invoice Date</label>
                                        <input
                                            type="date"
                                            className="inv-input"
                                            value={formData.invoiceDate}
                                            onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="inv-field">
                                        <label>Due Date</label>
                                        <input
                                            type="date"
                                            className="inv-input"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700 }}>Items</span>
                                <button
                                    className="btn-add-item"
                                    onClick={() => setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, rate: 0, tax: 18 }] })}
                                >
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>

                            <table className="inv-items-table" style={{ width: '100%', marginTop: '1rem' }}>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Tax (%)</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <input
                                                    className="inv-input"
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const newItems = [...formData.items];
                                                        newItems[idx].description = e.target.value;
                                                        setFormData({ ...formData, items: newItems });
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="inv-input"
                                                    style={{ width: '60px' }}
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const newItems = [...formData.items];
                                                        newItems[idx].quantity = parseInt(e.target.value) || 0;
                                                        setFormData({ ...formData, items: newItems });
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="inv-input"
                                                    style={{ width: '100px' }}
                                                    value={item.rate}
                                                    onChange={(e) => {
                                                        const newItems = [...formData.items];
                                                        newItems[idx].rate = parseInt(e.target.value) || 0;
                                                        setFormData({ ...formData, items: newItems });
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="inv-input"
                                                    style={{ width: '60px' }}
                                                    value={item.tax}
                                                    onChange={(e) => {
                                                        const newItems = [...formData.items];
                                                        newItems[idx].tax = parseInt(e.target.value) || 0;
                                                        setFormData({ ...formData, items: newItems });
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={() => {
                                                    const newItems = formData.items.filter((_, i) => i !== idx);
                                                    setFormData({ ...formData, items: newItems });
                                                }} style={{ color: '#ef4444', border: 'none', background: 'none' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className="btn-save-inv" onClick={handleCreateInvoice} disabled={submitting}>
                                {submitting ? 'Generating...' : 'Generate Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoice;
