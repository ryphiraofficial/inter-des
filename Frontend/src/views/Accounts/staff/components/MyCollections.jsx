import React, { useState, useEffect } from 'react';
import { Search, Wallet, Calendar, User, Phone, CheckCircle, CreditCard, ArrowRight, Clock, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { accountsAPI } from '../../../../models/api';

const MyCollections = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [collectingProject, setCollectingProject] = useState(null);
    
    // Modal Form State
    const [formData, setFormData] = useState({
        collectedAmount: '',
        paymentMode: 'Bank Transfer',
        referenceNumber: '',
        paymentNotes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await accountsAPI.getPendingAccountsProjects();
            if (res?.success) {
                // Filter projects assigned to this logged in staff
                const assigned = (res.data || []).filter(p => {
                    const assignedStaff = p.assignedAccountsStaff;
                    if (!assignedStaff) return false;
                    
                    const assignedStaffId = assignedStaff._id || assignedStaff;
                    const loggedInUserId = user?._id || user?.id;
                    
                    // 1. Match by user ID
                    if (loggedInUserId && assignedStaffId === loggedInUserId) return true;
                    
                    // 2. Fallback to match by email
                    const assignedEmail = assignedStaff.email;
                    const loggedInEmail = user?.email;
                    if (assignedEmail && loggedInEmail && assignedEmail.toLowerCase() === loggedInEmail.toLowerCase()) return true;
                    
                    // 3. Fallback to match by staffId
                    const assignedStaffIdVal = assignedStaff.staffId;
                    const loggedInStaffIdVal = user?.staffId;
                    if (assignedStaffIdVal && loggedInStaffIdVal && assignedStaffIdVal === loggedInStaffIdVal) return true;

                    return false;
                });
                setProjects(assigned);
            }
        } catch (err) {
            console.error('Error fetching assigned collections:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCollect = (project) => {
        setCollectingProject(project);
        setFormData({
            collectedAmount: project.advanceAmount || '',
            paymentMode: 'Bank Transfer',
            referenceNumber: '',
            paymentNotes: ''
        });
    };

    const handleSubmitCollection = async (e) => {
        e.preventDefault();
        if (!formData.collectedAmount || Number(formData.collectedAmount) <= 0) {
            return alert('Please enter a valid collected amount.');
        }

        try {
            setSubmitting(true);
            const res = await accountsAPI.submitPaymentCollection({
                projectId: collectingProject._id,
                collectedAmount: Number(formData.collectedAmount),
                paymentMode: formData.paymentMode,
                referenceNumber: formData.referenceNumber,
                paymentNotes: formData.paymentNotes
            });

            if (res?.success) {
                alert('Payment collection details submitted successfully! Assigned Accounts Manager will verify it shortly.');
                setCollectingProject(null);
                fetchData();
            } else {
                alert(res?.message || 'Error recording payment.');
            }
        } catch (err) {
            alert('Failed to submit: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate dynamic stats
    const pendingCollections = projects.filter(p => p.paymentCollectionStatus === 'Assigned');
    const collectedCollections = projects.filter(p => p.paymentCollectionStatus === 'Collected');
    const totalPendingAmount = pendingCollections.reduce((acc, p) => acc + (p.advanceAmount || 0), 0);

    const filtered = projects.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.projectNumber?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '0 8px' }}>
            {/* Header section with Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>My Collections</h2>
                    <p style={{ margin: '4px 0 0', color: '#64748b' }}>Track and record advance payment collections assigned to you.</p>
                </div>
                <button onClick={fetchData} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#fff' }}>
                    <RefreshCw size={15} className={loading ? 'spin-anim' : ''} /> Refresh
                </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Total Pending Value</div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>₹{totalPendingAmount.toLocaleString('en-IN')}</div>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Pending Collections</div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{pendingCollections.length} Tasks</div>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Awaiting Verification</div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{collectedCollections.length} Projects</div>
                    </div>
                </div>
            </div>

            {/* Filter and Content Card */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Search project name, ID, or client..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', height: '40px', padding: '0 16px 0 36px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} 
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
                        <RefreshCw className="spin-anim" style={{ color: '#6366f1', marginBottom: '12px' }} size={32} />
                        <div style={{ color: '#64748b', fontWeight: 500 }}>Loading assigned collection tasks...</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', textClassName: 'text-center' }}>
                        <AlertCircle size={44} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>No Collection Tasks Found</h3>
                        <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px', maxWidth: '360px', textAlign: 'center', lineHeight: 1.5 }}>
                            {search ? "No projects match your current search terms." : "You do not have any active payment collection assignments right now."}
                        </p>
                    </div>
                ) : (
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                        {filtered.map(p => {
                            const isCollected = p.paymentCollectionStatus === 'Collected';
                            
                            return (
                                <div key={p._id} style={{ 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '12px', 
                                    background: '#fff',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                                }}>
                                    {/* Top status bar */}
                                    <div style={{ 
                                        padding: '12px 18px', 
                                        borderBottom: '1px solid #f1f5f9', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        background: isCollected ? '#f0fdf4' : '#fef3c7',
                                        borderTopLeftRadius: '11px',
                                        borderTopRightRadius: '11px'
                                    }}>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                                            {p.projectNumber || 'PROJ'}
                                        </span>
                                        <span style={{ 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '12px', 
                                            fontWeight: 700, 
                                            color: isCollected ? '#166534' : '#92400e',
                                        }}>
                                            {isCollected ? (
                                                <>
                                                    <CheckCircle size={12} /> Collected
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={12} /> Pending Collection
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Details Area */}
                                    <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{p.name}</h4>
                                            <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                                                Total Budget: ₹{p.budget?.toLocaleString('en-IN')}
                                            </span>
                                        </div>

                                        {/* Client Info Widget */}
                                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>CLIENT DETAILS</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <User size={13} style={{ color: '#64748b' }} />
                                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{p.client?.name || 'Client'}</span>
                                            </div>
                                            {p.client?.phone && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Phone size={13} style={{ color: '#64748b' }} />
                                                    <span style={{ fontSize: '13px', color: '#64748b' }}>{p.client.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Target Amount */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px dashed #e2e8f0' }}>
                                            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Advance Due (50%):</span>
                                            <span style={{ fontSize: '18px', fontWeight: 800, color: '#6366f1' }}>₹{p.advanceAmount?.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    {/* Action footer */}
                                    <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', borderBottomLeftRadius: '11px', borderBottomRightRadius: '11px' }}>
                                        {isCollected ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '13px', fontWeight: 600, padding: '8px 0', justifyContent: 'center' }}>
                                                <AlertCircle size={15} /> Awaiting Manager Verification
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleOpenCollect(p)}
                                                style={{ 
                                                    width: '100%', 
                                                    height: '40px',
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    background: '#6366f1',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: 600,
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseOver={e => e.currentTarget.style.background = '#4f46e5'}
                                                onMouseOut={e => e.currentTarget.style.background = '#6366f1'}
                                            >
                                                <CreditCard size={15} /> Collect Payment <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Collection Input Wizard Modal */}
            {collectingProject && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 
                }}>
                    <div style={{ 
                        background: '#fff', 
                        width: '100%', 
                        maxWidth: '480px', 
                        borderRadius: '16px', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        overflow: 'hidden'
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', background: '#6366f1', color: '#fff' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Record Payment Collection</h3>
                            <span style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px', display: 'block' }}>
                                Project: {collectingProject.name} ({collectingProject.projectNumber})
                            </span>
                        </div>

                        <form onSubmit={handleSubmitCollection} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {/* Target advance info card */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f5f3ff', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                                <span style={{ fontSize: '13px', color: '#5b21b6', fontWeight: 600 }}>Target Advance Amount:</span>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: '#5b21b6' }}>₹{collectingProject.advanceAmount?.toLocaleString('en-IN')}</span>
                            </div>

                            {/* Input: Collected Amount */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Amount Collected (₹) *</label>
                                <input 
                                    type="number" 
                                    required
                                    placeholder="Enter amount"
                                    value={formData.collectedAmount} 
                                    onChange={e => setFormData(prev => ({ ...prev, collectedAmount: e.target.value }))}
                                    style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px' }} 
                                />
                            </div>

                            {/* Input: Mode of Payment */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Payment Mode *</label>
                                <select 
                                    value={formData.paymentMode}
                                    onChange={e => setFormData(prev => ({ ...prev, paymentMode: e.target.value }))}
                                    style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#fff' }}
                                >
                                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            {/* Input: Reference / Txn Number */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Reference / Txn ID</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. UTR number, Cheque no, or Receipt ID"
                                    value={formData.referenceNumber} 
                                    onChange={e => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                                    style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px' }} 
                                />
                            </div>

                            {/* Input: Notes */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Remarks / Collection Notes</label>
                                <textarea 
                                    placeholder="Add any extra notes or payment remarks..."
                                    value={formData.paymentNotes} 
                                    onChange={e => setFormData(prev => ({ ...prev, paymentNotes: e.target.value }))}
                                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px', minHeight: '80px', resize: 'vertical' }} 
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setCollectingProject(null)}
                                    disabled={submitting}
                                    style={{ 
                                        padding: '10px 18px', border: '1px solid #cbd5e1', borderRadius: '8px', 
                                        background: '#fff', color: '#475569', fontWeight: 600, fontSize: '14px', cursor: 'pointer' 
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    style={{ 
                                        padding: '10px 22px', border: 'none', borderRadius: '8px', 
                                        background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    {submitting ? 'Saving...' : 'Record Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCollections;
