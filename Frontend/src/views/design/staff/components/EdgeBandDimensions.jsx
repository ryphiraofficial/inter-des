import React from 'react';
import { X } from 'lucide-react';

const ALL_DIMENSIONS = ['22x0.8', '22x2', '45x0.8', '45x2'];

/**
 * Shows one dimension-quantity block per selected band.
 * Props:
 *   selectedBands  — array of band objects (from matches)
 *   quantities     — { [bandId]: { [dim]: number } }
 *   setQuantities  — setter
 *   onDeselect     — fn(bandId) — remove a band from selection
 */
const EdgeBandDimensions = ({ selectedBands, quantities, setQuantities, onDeselect }) => {
    if (!selectedBands || selectedBands.length === 0) return null;

    const handleQtyChange = (bandId, dim, val) => {
        const n = parseInt(val, 10);
        setQuantities(prev => ({
            ...prev,
            [bandId]: {
                ...(prev[bandId] || {}),
                [dim]: isNaN(n) || n < 0 ? '' : n
            }
        }));
    };

    return (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Dimensions & Quantities — {selectedBands.length} band{selectedBands.length > 1 ? 's' : ''} selected
            </h4>

            {selectedBands.map(band => {
                const availableSet = new Set(
                    (band.dimensions || []).filter(d => d.available).map(d => d.dimension)
                );
                const bandQtys = quantities[band._id] || {};

                return (
                    <div key={band._id} style={{
                        border: '1.5px solid #e0e7ff', borderRadius: '14px', overflow: 'hidden',
                        background: 'white'
                    }}>
                        {/* Band header */}
                        <div style={{
                            background: '#f5f3ff', padding: '10px 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            borderBottom: '1px solid #e0e7ff'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4f46e5', fontSize: '0.95rem' }}>
                                    {band.code}
                                </span>
                                <span style={{ color: '#6366f1', fontSize: '0.82rem', fontWeight: 500 }}>{band.name}</span>
                                {band.finish && (
                                    <span style={{
                                        background: '#ede9fe', color: '#7c3aed', borderRadius: '20px',
                                        padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700
                                    }}>
                                        {band.finish}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => onDeselect(band._id)}
                                title="Remove this band"
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#a5b4fc', display: 'flex', alignItems: 'center',
                                    borderRadius: '6px', padding: '2px'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                onMouseLeave={e => e.currentTarget.style.color = '#a5b4fc'}
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Dimension rows */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                            <tbody>
                                {ALL_DIMENSIONS.map((dim, i) => {
                                    const avail = availableSet.has(dim);
                                    return (
                                        <tr key={dim} style={{
                                            borderTop: i > 0 ? '1px solid #f1f5f9' : 'none',
                                            background: avail ? 'white' : '#fafafa'
                                        }}>
                                            <td style={{
                                                padding: '10px 16px', fontWeight: 600,
                                                color: avail ? '#1e293b' : '#94a3b8',
                                                fontFamily: 'monospace', width: '140px'
                                            }}>
                                                {dim.replace('x', ' × ')}
                                            </td>
                                            <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                                                {avail ? (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        value={bandQtys[dim] ?? ''}
                                                        onChange={e => handleQtyChange(band._id, dim, e.target.value)}
                                                        placeholder="0"
                                                        style={{
                                                            width: '90px', padding: '6px 10px', textAlign: 'right',
                                                            borderRadius: '8px', border: '1.5px solid #e2e8f0',
                                                            fontSize: '0.88rem', outline: 'none',
                                                            transition: 'border-color 0.2s'
                                                        }}
                                                        onFocus={e => e.target.style.borderColor = '#4f46e5'}
                                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                                    />
                                                ) : (
                                                    <span style={{
                                                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                                                        background: '#f1f5f9', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600
                                                    }}>
                                                        Not Available
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
};

export default EdgeBandDimensions;
