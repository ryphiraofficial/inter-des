import React, { useState, useEffect, useCallback } from 'react';
import { X, Star, Trash2, Plus, Check, Link2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api/inventory';

const LaminateDetailModal = ({
    showModal,
    closeModal,
    laminate,
    edgeBands = []
}) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedEdgeBandId, setSelectedEdgeBandId] = useState('');
    const [matchPercentInput, setMatchPercentInput] = useState(90);
    const [isPrimaryInput, setIsPrimaryInput] = useState(false);
    const [addingMatch, setAddingMatch] = useState(false);

    const token = localStorage.getItem('token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchMatches = useCallback(async () => {
        if (!laminate?._id) return;
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_BASE}/laminates/${laminate._id}/matches`, authHeaders);
            if (res.data.success) {
                setMatches(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching matches:', err);
            setError(err.response?.data?.message || 'Failed to load matches');
        } finally {
            setLoading(false);
        }
    }, [laminate?._id]);

    useEffect(() => {
        if (showModal && laminate) {
            fetchMatches();
        }
    }, [showModal, laminate, fetchMatches]);

    if (!showModal || !laminate) return null;

    const handleAddMatch = async (e) => {
        e.preventDefault();
        if (!selectedEdgeBandId) return;

        setAddingMatch(true);
        try {
            const res = await axios.post(
                `${API_BASE}/laminates/${laminate._id}/matches`,
                {
                    edgeBandId: selectedEdgeBandId,
                    matchPercent: Number(matchPercentInput),
                    isPrimary: isPrimaryInput
                },
                authHeaders
            );
            if (res.data.success) {
                setSelectedEdgeBandId('');
                setMatchPercentInput(90);
                setIsPrimaryInput(false);
                fetchMatches();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding match');
        } finally {
            setAddingMatch(false);
        }
    };

    const handleSetPrimary = async (matchId) => {
        try {
            const res = await axios.patch(
                `${API_BASE}/laminates/${laminate._id}/matches/${matchId}/primary`,
                {},
                authHeaders
            );
            if (res.data.success) {
                fetchMatches();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error setting primary match');
        }
    };

    const handleDeleteMatch = async (matchId) => {
        if (!window.confirm('Remove this Edge Band match?')) return;
        try {
            const res = await axios.delete(
                `${API_BASE}/laminates/${laminate._id}/matches/${matchId}`,
                authHeaders
            );
            if (res.data.success) {
                fetchMatches();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting match');
        }
    };

    // Filter out edge bands that are already matched
    const matchedEbIds = matches.map(m => m.edgeBandId?._id || m.edgeBandId);
    const availableEdgeBands = edgeBands.filter(eb => !matchedEbIds.includes(eb._id));

    return (
        <div className="modal-overlay" onClick={closeModal} style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, padding: '1.5rem'
        }}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '850px',
                    maxHeight: '90vh',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    background: 'linear-gradient(to right, #1e1b4b, #312e81)',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{laminate.code}</span>
                            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                {laminate.brandName || 'Generic Brand'}
                            </span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: '0.9rem' }}>
                            {laminate.name} — {laminate.color || 'Standard'} ({laminate.finish || 'Finish'}, {laminate.thicknessMm || 1.0}mm)
                        </p>
                    </div>
                    <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div style={{ padding: '1.75rem 2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Specs Summary Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Sheet Stock</span>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: laminate.stockQty <= laminate.reorderLevel ? '#d97706' : '#16a34a' }}>
                                {laminate.stockQty} sheets
                            </span>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Sheet Size</span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>{laminate.sheetSize || '8x4 ft'}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Supplier</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{laminate.supplier || '—'}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Location</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{laminate.location || '—'}</span>
                        </div>
                    </div>

                    {/* Matched Edge Bands Panel */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Link2 size={18} style={{ color: '#4f46e5' }} />
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                    Matched Edge Bands ({matches.length})
                                </h4>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading matched edge bands...</div>
                        ) : error ? (
                            <div style={{ padding: '1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={18} /> {error}
                            </div>
                        ) : matches.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                <p style={{ color: '#64748b', margin: 0, fontWeight: 500 }}>No Edge Bands matched yet for this laminate.</p>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Use the form below to link a matching edge band.</span>
                            </div>
                        ) : (
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', fontWeight: 700 }}>
                                            <th style={{ padding: '10px 14px' }}>Edge Band Code</th>
                                            <th style={{ padding: '10px 14px' }}>Brand / Color</th>
                                            <th style={{ padding: '10px 14px' }}>Dimensions</th>
                                            <th style={{ padding: '10px 14px' }}>Match %</th>
                                            <th style={{ padding: '10px 14px' }}>Stock (m)</th>
                                            <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matches.map(m => {
                                            const eb = m.edgeBandId || {};
                                            return (
                                                <tr key={m._id} style={{ borderTop: '1px solid #e2e8f0', background: m.isPrimary ? '#eef2ff' : '#ffffff' }}>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {m.isPrimary && (
                                                                <span style={{ background: '#4f46e5', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                                    <Star size={10} fill="#fff" /> PRIMARY
                                                                </span>
                                                            )}
                                                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{eb.code || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                                                        {eb.brandName || eb.brandId?.name || 'Generic'} ({eb.color || 'Default'})
                                                    </td>
                                                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                                                        {eb.widthMm || 22} × {eb.thicknessMm || 0.8} mm
                                                    </td>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <span style={{
                                                            fontWeight: 800,
                                                            color: m.matchPercent >= 90 ? '#16a34a' : m.matchPercent >= 75 ? '#d97706' : '#64748b',
                                                            background: m.matchPercent >= 90 ? '#f0fdf4' : m.matchPercent >= 75 ? '#fffbeb' : '#f1f5f9',
                                                            padding: '3px 8px',
                                                            borderRadius: '6px'
                                                        }}>
                                                            {m.matchPercent}%
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 14px', fontWeight: 600, color: (eb.stockQtyM || 0) <= (eb.reorderLevelM || 10) ? '#d97706' : '#16a34a' }}>
                                                        {eb.stockQtyM ?? 0} m
                                                    </td>
                                                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                                            {!m.isPrimary && (
                                                                <button
                                                                    onClick={() => handleSetPrimary(m._id)}
                                                                    style={{
                                                                        padding: '4px 8px',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid #c7d2fe',
                                                                        background: '#ffffff',
                                                                        color: '#4f46e5',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 700,
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Set Primary
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteMatch(m._id)}
                                                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', cursor: 'pointer' }}
                                                                title="Remove Match"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Add Match Form */}
                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                        <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>
                            + Link New Edge Band Match
                        </h5>
                        <form onSubmit={handleAddMatch} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                    Select Edge Band
                                </label>
                                <select
                                    value={selectedEdgeBandId}
                                    onChange={e => setSelectedEdgeBandId(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                >
                                    <option value="">-- Choose Edge Band --</option>
                                    {availableEdgeBands.map(eb => (
                                        <option key={eb._id} value={eb._id}>
                                            {eb.code} ({eb.brandName || 'Generic'}) - {eb.color || 'Standard'} [{eb.widthMm}x{eb.thicknessMm}mm] ({eb.stockQtyM}m stock)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                    Match % (0-100)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={matchPercentInput}
                                    onChange={e => setMatchPercentInput(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px' }}>
                                <input
                                    type="checkbox"
                                    id="isPrimaryCheck"
                                    checked={isPrimaryInput}
                                    onChange={e => setIsPrimaryInput(e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <label htmlFor="isPrimaryCheck" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                                    Is Primary Pick
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={addingMatch || !selectedEdgeBandId}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#4f46e5',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <Plus size={16} />
                                {addingMatch ? 'Linking...' : 'Add Link'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '1rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={closeModal} style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LaminateDetailModal;
