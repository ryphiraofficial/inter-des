import React, { useState, useEffect, useCallback } from 'react';
import { Package, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, XCircle, Clock, User } from 'lucide-react';
import { getProcurementQueue, selectProcurementCandidate, markGroupNeedsPurchase, assignProcurementStaff, getProcurementStaff } from '../../../design/staff/components/edgeBandApi';

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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
            <XCircle size={14} /> 0m
        </span>
    );
    if (stockQtyM < quantityNeededM) return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem' }}>
            <AlertTriangle size={14} /> {stockQtyM}m
        </span>
    );
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
            <CheckCircle2 size={14} /> {stockQtyM}m
        </span>
    );
}

// ── Group Panel ─────────────────────────────────────────────────
function GroupPanel({ group, onSelect, onNeedsPurchase, saving }) {
    const [selected, setSelected] = useState(group.selectedEdgeBandId || '');
    const gCfg = GROUP_STATUS[group.status] || GROUP_STATUS.pending;
    const hasEnoughStock = group.candidates.some(c => (c.stockQtyM || 0) >= group.quantityNeededM);

    return (
        <div style={{
            border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden',
            background: gCfg.bg, marginBottom: '1rem'
        }}>
            {/* Group header */}
            <div style={{
                padding: '10px 16px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
                borderBottom: '1px solid #e2e8f0', background: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    {group.requestedBrand && (
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginRight: '8px' }}>
                            {group.requestedBrand}
                        </span>
                    )}
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#475569', fontFamily: 'monospace' }}>
                        {group.edgeBandCode}
                    </span>
                    <span style={{ marginLeft: '12px', fontSize: '0.82rem', color: '#64748b' }}>
                        Qty needed: <strong>{group.quantityNeededM}m</strong>
                    </span>
                    {group.matchPercent && (
                        <span style={{ marginLeft: '10px', fontSize: '0.78rem', color: '#4f46e5', fontWeight: 700 }}>
                            {group.matchPercent}% match
                        </span>
                    )}
                </div>
                <span style={{
                    padding: '3px 10px', borderRadius: '10px', fontSize: '0.78rem',
                    fontWeight: 700, background: gCfg.bg, color: gCfg.color, border: `1px solid ${gCfg.color}22`
                }}>
                    {gCfg.label}
                </span>
            </div>

            {/* Candidates table */}
            {group.status === 'pending' && (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', fontSize: '0.73rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                                <th style={{ padding: '8px 14px', width: '40px' }}></th>
                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Brand</th>
                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Code</th>
                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Color / Finish</th>
                                <th style={{ padding: '8px 16px', textAlign: 'right' }}>Stock (m)</th>
                                <th style={{ padding: '8px 16px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.candidates.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        No edge bands found in inventory for this code. Needs purchase.
                                    </td>
                                </tr>
                            ) : group.candidates.map((c) => {
                                const id = String(c.edgeBandId);
                                const sufficient = (c.stockQtyM || 0) >= group.quantityNeededM;
                                return (
                                    <tr key={id} style={{
                                        borderTop: '1px solid #f1f5f9',
                                        background: selected === id ? '#f5f3ff' : 'white',
                                        cursor: 'pointer'
                                    }} onClick={() => setSelected(id)}>
                                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                                            <input
                                                type="radio"
                                                name={`group-${group._id}`}
                                                value={id}
                                                checked={selected === id}
                                                onChange={() => setSelected(id)}
                                                style={{ cursor: 'pointer', accentColor: '#4f46e5' }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px 16px', fontWeight: 700, color: '#1e293b' }}>{c.brandName || '—'}</td>
                                        <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#475569' }}>{c.code || group.edgeBandCode}</td>
                                        <td style={{ padding: '10px 16px', color: '#64748b', fontSize: '0.82rem' }}>
                                            {[c.color, c.finish].filter(Boolean).join(' · ') || '—'}
                                        </td>
                                        <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                                            <StockIndicator stockQtyM={c.stockQtyM} quantityNeededM={group.quantityNeededM} />
                                        </td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                                                background: c.status === 'In Stock' ? '#dcfce7' : c.status === 'Low Stock' ? '#fef9c3' : '#fee2e2',
                                                color: c.status === 'In Stock' ? '#166534' : c.status === 'Low Stock' ? '#854d0e' : '#991b1b'
                                            }}>
                                                {c.status || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Actions */}
                    <div style={{
                        display: 'flex', gap: '10px', padding: '12px 16px',
                        borderTop: '1px solid #e2e8f0', justifyContent: 'flex-end',
                        background: 'white'
                    }}>
                        <button
                            onClick={() => onNeedsPurchase(group._id)}
                            disabled={saving}
                            style={{
                                padding: '8px 18px', borderRadius: '10px',
                                border: '1.5px solid #f97316', background: 'white',
                                color: '#ea580c', fontWeight: 700, fontSize: '0.85rem',
                                cursor: saving ? 'not-allowed' : 'pointer'
                            }}
                        >
                            🛒 Mark Needs Purchase
                        </button>
                        <button
                            onClick={() => onSelect(group._id, selected)}
                            disabled={saving || !selected || !hasEnoughStock}
                            title={!hasEnoughStock ? 'No candidate has sufficient stock — use "Mark Needs Purchase"' : ''}
                            style={{
                                padding: '8px 20px', borderRadius: '10px', border: 'none',
                                background: (saving || !selected || !hasEnoughStock) ? '#e2e8f0' : '#4f46e5',
                                color: (saving || !selected || !hasEnoughStock) ? '#94a3b8' : 'white',
                                fontWeight: 700, fontSize: '0.85rem',
                                cursor: (saving || !selected || !hasEnoughStock) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            ✓ Confirm Selection
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// ── Request Row ─────────────────────────────────────────────────
function RequestRow({ req, staffMembers, onGroupAction }) {
    const [expanded, setExpanded] = useState(false);
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
            overflow: 'hidden', marginBottom: '1rem',
            boxShadow: '0 2px 8px -4px rgba(0,0,0,0.06)'
        }}>
            {/* Row header */}
            <div
                style={{
                    padding: '14px 20px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', cursor: 'pointer',
                    gap: '12px', flexWrap: 'wrap'
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
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                            {req.taskLabel || 'Untitled Task'}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                            {req.groups.length} group{req.groups.length !== 1 ? 's' : ''} ·{' '}
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
                    {/* Staff Assign Selector */}
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

                    <StatusBadge status={req.status} small />
                    <div onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {expanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                    </div>
                </div>
            </div>

            {/* Expanded groups */}
            {expanded && (
                <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ margin: '16px 0 12px', fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Shortlisted Groups
                    </p>
                    {req.groups.map(group => (
                        <GroupPanel
                            key={group._id}
                            group={group}
                            onSelect={handleSelect}
                            onNeedsPurchase={handleNeedsPurchase}
                            saving={saving}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────
const EdgeBandProcurementQueue = () => {
    const [docs, setDocs] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const [res, staffRes] = await Promise.all([
                getProcurementQueue(statusFilter ? { status: statusFilter } : {}),
                getProcurementStaff().catch(() => ({ data: { users: [] } }))
            ]);
            setDocs(res.docs || []);
            setStaffMembers(staffRes?.data?.users || staffRes?.users || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { load(); }, [load]);

    return (
        <div style={{ padding: '1.5rem 2rem', maxWidth: '1100px' }}>
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
                            Resolve shortlisted edge bands from approved design requests
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
                    <RequestRow key={req._id} req={req} staffMembers={staffMembers} onGroupAction={load} />
                ))
            )}
        </div>
    );
};

export default EdgeBandProcurementQueue;
