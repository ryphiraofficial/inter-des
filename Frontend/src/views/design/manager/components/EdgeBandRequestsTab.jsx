import React, { useState, useEffect, useMemo } from 'react';
import { Layers, CheckCircle2, XCircle, Edit3, MessageSquare, Tag, ShieldCheck, ArrowRight, User } from 'lucide-react';
import * as api from '../../staff/components/edgeBandApi';

const EdgeBandRequestsTab = ({ userRole = 'manager' }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRequestId, setEditingRequestId] = useState(null);
    const [editItems, setEditItems] = useState([]);
    const [managerNote, setManagerNote] = useState({});
    const [adminNote, setAdminNote] = useState({});
    const [actionLoading, setActionLoading] = useState(null);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const res = await api.getRequests();
            setRequests(res.requests || []);
        } catch (err) {
            console.error('Failed loading edge band requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        if (userRole === 'admin') {
            return requests.filter(r => r.status === 'pending_admin' || r.status === 'approved');
        }
        if (userRole === 'procurement') {
            return requests.filter(r => r.status === 'approved');
        }
        return requests;
    }, [requests, userRole]);

    const handleStartEdit = (req) => {
        setEditingRequestId(req._id);
        setEditItems(req.items.map(item => ({ ...item })));
    };

    const handleQuantityChange = (index, newQty) => {
        const val = parseInt(newQty, 10);
        setEditItems(prev => {
            const next = [...prev];
            next[index] = { ...next[index], quantity: isNaN(val) ? 0 : val };
            return next;
        });
    };

    const handleManagerReview = async (reqId, status) => {
        try {
            setActionLoading(reqId);
            const note = managerNote[reqId] || '';
            const payload = {
                status,
                managerNote: note,
                ...(editingRequestId === reqId ? { items: editItems } : {})
            };
            await api.managerReviewRequest(reqId, payload);
            setEditingRequestId(null);
            loadRequests();
        } catch (err) {
            alert('Failed to submit review: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAdminReview = async (reqId, status) => {
        try {
            setActionLoading(reqId);
            const note = adminNote[reqId] || '';
            await api.adminReviewRequest(reqId, { status, adminNote: note });
            loadRequests();
        } catch (err) {
            alert('Failed to submit review: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                <p>Loading Edge Band Approval Requests...</p>
            </div>
        );
    }

    if (!filteredRequests.length) {
        return (
            <div style={{
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
                padding: '3rem', textAlign: 'center', color: '#64748b'
            }}>
                <Layers size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>No Edge Band Requests Found</h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>
                    {userRole === 'admin'
                        ? 'Manager-approved edge band requests awaiting final superadmin sign-off will appear here.'
                        : userRole === 'procurement'
                        ? 'Approved edge band requests released to procurement will appear here.'
                        : 'Edge band requests submitted by design staff will appear here for manager review.'}
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Edge Band Approval & Handoff</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                        {userRole === 'admin'
                            ? 'Review manager-approved edge band requests and release to procurement.'
                            : userRole === 'procurement'
                            ? 'View approved edge band lists released for purchasing.'
                            : 'Review staff edge band selections, edit quantities if needed, and approve for procurement.'}
                    </p>
                </div>
                <button
                    onClick={loadRequests}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                    🔄 Refresh List
                </button>
            </div>

            {filteredRequests.map((req) => {
                const isEditing = editingRequestId === req._id;
                const itemsToDisplay = isEditing ? editItems : req.items;

                return (
                    <div key={req._id} style={{
                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
                        overflow: 'hidden', boxShadow: '0 4px 12px -4px rgba(0,0,0,0.04)'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                                        {req.project?.name || req.project?.projectNumber || 'Project Edge Bands'}
                                    </span>
                                    {req.task && (
                                        <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                            Task: {req.task.title}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span>Submitted by: <strong>{req.submittedBy?.fullName || req.submittedBy?.name || 'Staff Member'}</strong></span>
                                    <span>• {new Date(req.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                                {req.status === 'pending_manager' && (
                                    <span style={{ padding: '6px 14px', background: '#fef3c7', color: '#92400e', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>
                                        ⏳ Pending Manager Review
                                    </span>
                                )}
                                {req.status === 'pending_admin' && (
                                    <span style={{ padding: '6px 14px', background: '#e0e7ff', color: '#3730a3', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>
                                        🛡️ Manager Approved — Pending Admin
                                    </span>
                                )}
                                {req.status === 'approved' && (
                                    <span style={{ padding: '6px 14px', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>
                                        ✅ Approved (Ready for Procurement)
                                    </span>
                                )}
                                {req.status === 'rejected' && (
                                    <span style={{ padding: '6px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>
                                        ❌ Recheck Requested
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Items Table */}
                        <div style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#334155' }}>
                                    Selected Edge Band Details ({itemsToDisplay.length} items):
                                </span>
                                {req.status === 'pending_manager' && !isEditing && (
                                    <button
                                        onClick={() => handleStartEdit(req)}
                                        style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <Edit3 size={14} /> Edit Quantities
                                    </button>
                                )}
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Brand</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Entered Code</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Matched Code</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'center' }}>Match</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Dimension</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsToDisplay.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{item.brand}</td>
                                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#64748b' }}>{item.enteredCode}</td>
                                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{item.matchedCode}</td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>{item.matchPercentage}%</span>
                                            </td>
                                            <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{item.dimension.replace('x', ' × ')}</td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={e => handleQuantityChange(idx, e.target.value)}
                                                        style={{ width: '70px', padding: '4px 8px', border: '1px solid #4f46e5', borderRadius: '6px', textAlign: 'right', fontWeight: 700 }}
                                                    />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Manager Review Controls */}
                        {req.status === 'pending_manager' && (
                            <div style={{ padding: '1rem 1.5rem', background: '#fafafa', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Add feedback or recheck instructions for staff (optional for approval)..."
                                    value={managerNote[req._id] || ''}
                                    onChange={e => setManagerNote(prev => ({ ...prev, [req._id]: e.target.value }))}
                                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', width: '100%' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button
                                        onClick={() => handleManagerReview(req._id, 'rejected')}
                                        disabled={actionLoading === req._id}
                                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                                    >
                                        ❌ Request Staff Recheck
                                    </button>
                                    <button
                                        onClick={() => handleManagerReview(req._id, 'pending_admin')}
                                        disabled={actionLoading === req._id}
                                        style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                                    >
                                        {actionLoading === req._id ? 'Saving...' : '✅ Approve & Send to Admin'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Admin Review Controls */}
                        {req.status === 'pending_admin' && userRole === 'admin' && (
                            <div style={{ padding: '1rem 1.5rem', background: '#eff6ff', borderTop: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Admin review notes..."
                                    value={adminNote[req._id] || ''}
                                    onChange={e => setAdminNote(prev => ({ ...prev, [req._id]: e.target.value }))}
                                    style={{ padding: '8px 12px', border: '1px solid #93c5fd', borderRadius: '8px', fontSize: '0.85rem', width: '100%' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button
                                        onClick={() => handleAdminReview(req._id, 'rejected')}
                                        disabled={actionLoading === req._id}
                                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                                    >
                                        ❌ Reject
                                    </button>
                                    <button
                                        onClick={() => handleAdminReview(req._id, 'approved')}
                                        disabled={actionLoading === req._id}
                                        style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                                    >
                                        {actionLoading === req._id ? 'Processing...' : '🛡️ Approve & Release to Procurement'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default EdgeBandRequestsTab;
