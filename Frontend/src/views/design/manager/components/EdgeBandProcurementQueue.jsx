import React, { useState, useEffect, useCallback } from 'react';
import { Package, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, XCircle, Clock, User } from 'lucide-react';
import { getProcurementQueue, selectProcurementCandidate, markGroupNeedsPurchase, assignProcurementStaff, getProcurementStaff } from '../../../design/staff/components/edgeBandApi';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/authSlice';

// ── Status helpers ──────────────────────────────────────────────
const REQUEST_STATUS = {
    pending:              { label: 'Pending',              bg: '#fef9c3', color: '#854d0e', icon: Clock },
    partially_fulfilled:  { label: 'Partially Fulfilled',  bg: '#dbeafe', color: '#1e40af', icon: CheckCircle2 },
    fulfilled:            { label: 'Fulfilled',            bg: '#dcfce7', color: '#166534', icon: CheckCircle2 },
    needs_purchase:       { label: 'Needs Purchase',       bg: '#fee2e2', color: '#991b1b', icon: XCircle }
};

const GROUP_STATUS = {
    pending:              { label: 'Pending',              bg: '#fafafa', color: '#64748b' },
    fulfilled_from_stock: { label: '✅ Fulfilled',         bg: '#f0fdf4', color: '#166534' },
    needs_purchase:       { label: '🛒 Needs Purchase',   bg: '#fef2f2', color: '#991b1b' }
};

function StatusBadge({ status, small }) {
    const cfg = REQUEST_STATUS[status] || REQUEST_STATUS.pending;
    const Icon = cfg.icon;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: small ? '3px 10px' : '5px 14px',
            background: cfg.bg, color: cfg.color,
            borderRadius: '20px', fontSize: small ? '0.75rem' : '0.82rem',
            fontWeight: 700, whiteSpace: 'nowrap'
        }}>
            <Icon size={small ? 13 : 15} /> {cfg.label}
        </span>
    );
}

function StockIndicator({ stockQtyM, quantityNeededM }) {
    if (stockQtyM === undefined) return <span style={{ color: '#94a3b8' }}>—</span>;
    if (stockQtyM === 0) return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: 700, fontSize: '0.82rem' }}>
            <XCircle size={13} /> 0m
        </span>
    );
    if (stockQtyM < quantityNeededM) return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '0.82rem' }}>
            <AlertTriangle size={13} /> {stockQtyM}m stock
        </span>
    );
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700, fontSize: '0.82rem' }}>
            <CheckCircle2 size={13} /> {stockQtyM}m stock
        </span>
    );
}

// ── Single Item Row in Table List ───────────────────────────────
function ItemRow({ group, onSelect, onNeedsPurchase, saving, isStaff }) {
    const [selectedCandId, setSelectedCandId] = useState(group.selectedEdgeBandId || (group.candidates?.[0]?.edgeBandId || ''));
    const gCfg = GROUP_STATUS[group.status] || GROUP_STATUS.pending;

    const selectedCand = group.candidates.find(c => String(c.edgeBandId) === String(selectedCandId)) || group.candidates[0];
    const hasSufficientStock = selectedCand && (selectedCand.stockQtyM || 0) >= group.quantityNeededM;

    return (
        <tr style={{ borderBottom: '1px solid #f1f5f9', background: group.status !== 'pending' ? '#fafafa' : 'white' }}>
            <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                {group.requestedBrand || '—'}
            </td>
            <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#475569' }}>
                {group.edgeBandCode}
            </td>
            <td style={{ padding: '12px 14px' }}>
                <span style={{ fontSize: '0.78rem', background: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontFamily: 'monospace' }}>
                    {group.dimension ? group.dimension.replace('x', ' × ') : 'Standard'}
                </span>
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                {group.quantityNeededM}m
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: '#10b981' }}>
                {group.matchPercent ? `${group.matchPercent}%` : '—'}
            </td>
            <td style={{ padding: '12px 14px' }}>
                {group.candidates.length > 1 && !isStaff ? (
                    <select
                        value={selectedCandId}
                        onChange={e => setSelectedCandId(e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                    >
                        {group.candidates.map(c => (
                            <option key={c.edgeBandId} value={c.edgeBandId}>
                                {c.brandName} {c.code} ({c.stockQtyM || 0}m stock)
                            </option>
                        ))}
                    </select>
                ) : selectedCand ? (
                    <StockIndicator stockQtyM={selectedCand.stockQtyM} quantityNeededM={group.quantityNeededM} />
                ) : (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>No inventory match</span>
                )}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                <span style={{
                    padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem',
                    fontWeight: 700, background: gCfg.bg, color: gCfg.color, border: `1px solid ${gCfg.color}22`
                }}>
                    {gCfg.label}
                </span>
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                {isStaff ? (
                    /* Read-only status indicator for staff (no active buttons) */
                    group.status === 'needs_purchase' ? (
                        <span style={{ padding: '4px 10px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', fontWeight: 800, fontSize: '0.78rem' }}>
                            🛒 Needs Purchase
                        </span>
                    ) : group.status === 'fulfilled_from_stock' ? (
                        <span style={{ padding: '4px 10px', borderRadius: '8px', background: '#dcfce7', color: '#166534', fontWeight: 800, fontSize: '0.78rem' }}>
                            ✅ Fulfilled from Stock
                        </span>
                    ) : (
                        <span style={{ padding: '4px 10px', borderRadius: '8px', background: '#fef3c7', color: '#92400e', fontWeight: 800, fontSize: '0.78rem' }}>
                            ⏳ Pending Resolution
                        </span>
                    )
                ) : group.status === 'pending' ? (
                    /* Manager resolution buttons */
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => onNeedsPurchase(group._id)}
                            disabled={saving}
                            style={{
                                padding: '5px 12px', borderRadius: '6px', border: '1.5px solid #f97316',
                                background: 'white', color: '#ea580c', fontWeight: 700, fontSize: '0.78rem',
                                cursor: saving ? 'not-allowed' : 'pointer'
                            }}
                        >
                            🛒 Needs Purchase
                        </button>
                        <button
                            onClick={() => onSelect(group._id, selectedCandId)}
                            disabled={saving || !selectedCandId || !hasSufficientStock}
                            title={!hasSufficientStock ? 'Insufficient stock in inventory' : ''}
                            style={{
                                padding: '5px 14px', borderRadius: '6px', border: 'none',
                                background: (saving || !selectedCandId || !hasSufficientStock) ? '#cbd5e1' : '#4f46e5',
                                color: 'white', fontWeight: 800, fontSize: '0.78rem',
                                cursor: (saving || !selectedCandId || !hasSufficientStock) ? 'not-allowed' : 'pointer',
                                boxShadow: (saving || !selectedCandId || !hasSufficientStock) ? 'none' : '0 2px 6px rgba(79,70,229,0.2)'
                            }}
                        >
                            ✓ Confirm Stock
                        </button>
                    </div>
                ) : (
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Resolved</span>
                )}
            </td>
        </tr>
    );
}

// ── Unified Items Table List ────────────────────────────────────
function ItemsTable({ groups, onSelect, onNeedsPurchase, saving, isStaff }) {
    return (
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', fontSize: '0.73rem', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left' }}>Brand</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left' }}>Code</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left' }}>Dimension</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right' }}>Qty Needed</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>Match</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left' }}>Stock (Inventory)</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right' }}>
                            {isStaff ? 'Purchase Status' : 'Resolution Action'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group) => (
                        <ItemRow
                            key={group._id}
                            group={group}
                            onSelect={onSelect}
                            onNeedsPurchase={onNeedsPurchase}
                            saving={saving}
                            isStaff={isStaff}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Request Row ─────────────────────────────────────────────────
function RequestRow({ req, staffMembers, onGroupAction, isStaff }) {
    const [expanded, setExpanded] = useState(true);
    const [saving, setSaving] = useState(false);
    const [assigning, setAssigning] = useState(false);

    const handleAssign = async (staffId) => {
        try {
            setAssigning(true);
            await assignProcurementStaff(req._id, staffId || null);
            onGroupAction();
        } catch (err) {
            alert('Failed assigning staff: ' + err.message);
        } finally {
            setAssigning(false);
        }
    };

    const handleSelect = async (groupId, selectedEdgeBandId) => {
        if (!selectedEdgeBandId) return;
        try {
            setSaving(true);
            await selectProcurementCandidate(groupId, selectedEdgeBandId);
            onGroupAction(); // refresh
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleNeedsPurchase = async (groupId) => {
        try {
            setSaving(true);
            await markGroupNeedsPurchase(groupId);
            onGroupAction();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const pendingCount = req.groups.filter(g => g.status === 'pending').length;

    return (
        <div style={{
            background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
            overflow: 'hidden', marginBottom: '1.25rem',
            boxShadow: '0 2px 8px -4px rgba(0,0,0,0.06)'
        }}>
            {/* Row header */}
            <div
                style={{
                    padding: '14px 20px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', cursor: 'pointer',
                    gap: '12px', flexWrap: 'wrap', background: '#f8fafc', borderBottom: expanded ? '1px solid #e2e8f0' : 'none'
                }}
            >
                <div
                    onClick={() => setExpanded(e => !e)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}
                >
                    <div style={{
                        background: '#f0f3ff', color: '#4f46e5', width: '38px', height: '38px',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Package size={18} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            {req.taskLabel || 'Untitled Task'}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                            {req.groups.length} requested item{req.groups.length !== 1 ? 's' : ''} ·{' '}
                            Requested by {req.requestedBy?.fullName || req.requestedBy?.name || '—'} ·{' '}
                            {new Date(req.createdAt).toLocaleDateString()}
                            {pendingCount > 0 && (
                                <span style={{ marginLeft: '8px', color: '#f59e0b', fontWeight: 700 }}>
                                    · {pendingCount} pending
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Staff Assign Selector for Manager vs Read-only badge for Staff */}
                    {!isStaff ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={e => e.stopPropagation()}>
                            <User size={15} color="#64748b" />
                            <select
                                value={req.assignedTo?._id || req.assignedTo || ''}
                                onChange={e => handleAssign(e.target.value)}
                                disabled={assigning}
                                style={{
                                    padding: '4px 10px', borderRadius: '8px',
                                    border: '1px solid #cbd5e1', fontSize: '0.78rem',
                                    fontWeight: 600, color: req.assignedTo ? '#1e293b' : '#64748b',
                                    background: req.assignedTo ? '#f0f9ff' : 'white',
                                    outline: 'none', cursor: 'pointer'
                                }}
                            >
                                <option value="">-- Assign Procurement Staff --</option>
                                {staffMembers.map(staff => (
                                    <option key={staff._id} value={staff._id}>
                                        {staff.fullName || staff.name || staff.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : req.assignedTo ? (
                        <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} color="#64748b" /> {req.assignedTo?.fullName || req.assignedTo?.name}
                        </span>
                    ) : null}

                    <StatusBadge status={req.status} small />
                    <div onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {expanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                    </div>
                </div>
            </div>

            {/* Expanded items list table */}
            {expanded && (
                <div style={{ padding: '1rem 1.25rem 1.25rem 1.25rem' }}>
                    <ItemsTable
                        groups={req.groups}
                        onSelect={handleSelect}
                        onNeedsPurchase={handleNeedsPurchase}
                        saving={saving}
                        isStaff={isStaff}
                    />
                </div>
            )}
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────
const EdgeBandProcurementQueue = ({ userRole }) => {
    const user = useAppSelector(selectUser);
    const [docs, setDocs] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const isStaff = userRole === 'staff' || (user?.role && user.role.includes('Staff'));

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const [res, staffRes] = await Promise.all([
                getProcurementQueue(statusFilter ? { status: statusFilter } : {}),
                getProcurementStaff().catch(() => ({ data: [] }))
            ]);
            setDocs(res.docs || []);
            setStaffMembers(Array.isArray(staffRes?.data) ? staffRes.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { load(); }, [load]);

    return (
        <div style={{ padding: '1.5rem 2rem', maxWidth: '1400px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        background: '#f0f3ff', color: '#4f46e5', width: '44px', height: '44px',
                        borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Package size={22} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Edge Band Procurement Queue</h2>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                            {isStaff ? 'View edge band items and purchase status from approved design requests' : 'Resolve shortlisted edge bands from approved design requests'}
                        </p>
                    </div>
                </div>

                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{
                        padding: '8px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                        fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: 'white',
                        outline: 'none', cursor: 'pointer'
                    }}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="partially_fulfilled">Partially Fulfilled</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="needs_purchase">Needs Purchase</option>
                </select>
            </div>

            {/* Summary chips */}
            {!loading && docs.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {Object.entries(REQUEST_STATUS).map(([key, cfg]) => {
                        const count = docs.filter(d => d.status === key).length;
                        if (!count) return null;
                        return (
                            <span key={key} style={{
                                padding: '4px 12px', borderRadius: '20px',
                                background: cfg.bg, color: cfg.color,
                                fontSize: '0.78rem', fontWeight: 700
                            }}>
                                {cfg.label}: {count}
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{
                        width: '24px', height: '24px', border: '2px solid #e2e8f0',
                        borderTopColor: '#4f46e5', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
                    }} />
                    Loading queue…
                </div>
            ) : docs.length === 0 ? (
                <div style={{
                    padding: '3rem', textAlign: 'center', background: '#f8fafc',
                    borderRadius: '16px', border: '2px dashed #e2e8f0', color: '#94a3b8'
                }}>
                    <Package size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No edge band requests in the procurement queue yet.</p>
                    <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>They'll appear here once a designer sends an approved request to procurement.</p>
                </div>
            ) : (
                docs.map(req => (
                    <RequestRow key={req._id} req={req} staffMembers={staffMembers} onGroupAction={load} isStaff={isStaff} />
                ))
            )}
        </div>
    );
};

export default EdgeBandProcurementQueue;
