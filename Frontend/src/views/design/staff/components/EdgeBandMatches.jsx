import React, { useMemo } from 'react';
import { AlertCircle, CheckSquare, Square } from 'lucide-react';

const MATCH_COLORS = {
    100: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', icon: '✓' },
    90:  { bg: '#fefce8', text: '#854d0e', border: '#fde68a', icon: '⚠' },
    80:  { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa', icon: '⚠' },
    70:  { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', icon: '✗' },
};

const getColor = (match) => {
    if (match >= 100) return MATCH_COLORS[100];
    if (match >= 90)  return MATCH_COLORS[90];
    if (match >= 80)  return MATCH_COLORS[80];
    return MATCH_COLORS[70];
};

/**
 * Simplified flat table, sorted highest-match-first.
 * Props:
 *   matches       — array of match objects
 *   selectedIds   — Set of selected band _id strings
 *   onToggle      — fn(match)
 *   onToggleAll   — fn()
 *   searchStatus  — 'idle' | 'loading' | 'done' | 'error'
 */
const EdgeBandMatches = ({ matches, selectedIds, onToggle, onToggleAll, searchStatus }) => {
    // Sort by match score descending, then by brand name for tie-breaking
    const sorted = useMemo(() =>
        [...(matches || [])].sort((a, b) => (b.match - a.match) || (a.brand || '').localeCompare(b.brand || '')),
    [matches]);

    if (searchStatus === 'loading') {
        return (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                <div style={{
                    display: 'inline-block', width: '22px', height: '22px',
                    border: '2px solid #e2e8f0', borderTopColor: '#4f46e5',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '8px'
                }} />
                <p style={{ margin: 0 }}>Finding matching edge bands…</p>
            </div>
        );
    }
    if (searchStatus === 'error') {
        return (
            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', borderRadius: '12px', color: '#991b1b', fontSize: '0.9rem' }}>
                <AlertCircle size={18} /> Unable to load matching edge bands. Please try again.
            </div>
        );
    }
    if (searchStatus === 'done' && sorted.length === 0) {
        return (
            <div style={{ padding: '2.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                No matching edge band found. Try another code or brand.
            </div>
        );
    }
    if (!sorted.length) return null;

    const allSelected = sorted.every(m => selectedIds.has(m._id));
    const someSelected = sorted.some(m => selectedIds.has(m._id));

    return (
        <div style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', fontSize: '0.74rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                        {/* Header checkbox — select all in current view */}
                        <th style={{ padding: '10px 14px', width: '40px', textAlign: 'center' }}>
                            <button
                                onClick={onToggleAll}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                title={allSelected ? 'Deselect all' : 'Select all'}
                            >
                                {allSelected
                                    ? <CheckSquare size={16} color="#4f46e5" />
                                    : someSelected
                                        ? <CheckSquare size={16} color="#a5b4fc" />
                                        : <Square size={16} color="#94a3b8" />
                                }
                            </button>
                        </th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Code</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Name</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Brand</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Finish / Material</th>
                        <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700 }}>Match</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((m, i) => {
                        const color = getColor(m.match);
                        const isSelected = selectedIds.has(m._id);
                        return (
                            <tr
                                key={m._id}
                                onClick={() => onToggle(m)}
                                style={{
                                    borderTop: '1px solid #f1f5f9',
                                    background: isSelected ? '#f5f3ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'background 0.12s'
                                }}
                            >
                                <td style={{ padding: '10px 14px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => onToggle(m)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                        {isSelected
                                            ? <CheckSquare size={17} color="#4f46e5" />
                                            : <Square size={17} color="#cbd5e1" />
                                        }
                                    </button>
                                </td>
                                <td style={{ padding: '10px 16px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>{m.code}</td>
                                <td style={{ padding: '10px 16px', color: '#475569' }}>{m.name || '—'}</td>
                                <td style={{ padding: '10px 16px' }}>
                                    {m.brand && (
                                        <span style={{
                                            background: '#ede9fe', color: '#5b21b6',
                                            padding: '2px 8px', borderRadius: '6px',
                                            fontSize: '0.78rem', fontWeight: 700
                                        }}>
                                            {m.brand}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '10px 16px', color: '#64748b', fontSize: '0.82rem' }}>
                                    {[m.finish, m.material].filter(Boolean).join(' · ') || '—'}
                                </td>
                                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: '20px',
                                        fontSize: '0.78rem', fontWeight: 800,
                                        background: color.bg, color: color.text,
                                        border: `1px solid ${color.border}`,
                                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                                    }}>
                                        {color.icon} {m.match}%
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default EdgeBandMatches;
