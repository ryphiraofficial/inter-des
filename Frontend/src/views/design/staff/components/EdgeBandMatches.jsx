import React from 'react';
import { AlertCircle, CheckSquare, Square } from 'lucide-react';

const MATCH_COLORS = {
    100: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
    90:  { bg: '#fefce8', text: '#854d0e', border: '#fde68a' },
    80:  { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
    70:  { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
};

/**
 * Multi-select matches table.
 * Props:
 *   matches       — array of match objects
 *   selectedIds   — Set of selected band _id strings
 *   onToggle      — fn(match) — toggle one band in/out of selection
 *   onToggleAll   — fn() — select all / deselect all
 *   searchStatus  — 'idle' | 'loading' | 'done' | 'error'
 */
const EdgeBandMatches = ({ matches, selectedIds, onToggle, onToggleAll, searchStatus }) => {
    if (searchStatus === 'loading') {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '8px' }} />
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
    if (searchStatus === 'done' && matches.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                No matching edge band found. Try another code.
            </div>
        );
    }
    if (!matches.length) return null;

    const allSelected = matches.every(m => selectedIds.has(m._id));
    const someSelected = matches.some(m => selectedIds.has(m._id));

    return (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            {/* Selection count hint */}
            {someSelected && (
                <div style={{
                    background: '#f0f3ff', borderBottom: '1px solid #e0e7ff',
                    padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4f46e5' }}>
                        {selectedIds.size} band{selectedIds.size > 1 ? 's' : ''} selected
                    </span>
                    <button
                        onClick={() => { matches.forEach(m => { if (selectedIds.has(m._id)) onToggle(m); }); }}
                        style={{ fontSize: '0.78rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Clear all
                    </button>
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                        {/* Select-all checkbox */}
                        <th style={{ padding: '10px 14px', width: '40px', textAlign: 'center' }}>
                            <button
                                onClick={onToggleAll}
                                title={allSelected ? 'Deselect all' : 'Select all'}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: someSelected ? '#4f46e5' : '#94a3b8', display: 'flex', alignItems: 'center' }}
                            >
                                {allSelected
                                    ? <CheckSquare size={16} color="#4f46e5" />
                                    : someSelected
                                        ? <CheckSquare size={16} color="#a5b4fc" />
                                        : <Square size={16} />
                                }
                            </button>
                        </th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Code</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Name</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Finish / Material</th>
                        <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700 }}>Match</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((m, i) => {
                        const color = MATCH_COLORS[m.match] || MATCH_COLORS[70];
                        const isSelected = selectedIds.has(m._id);
                        return (
                            <tr
                                key={m._id}
                                onClick={() => onToggle(m)}
                                style={{
                                    borderTop: i > 0 ? '1px solid #f1f5f9' : 'none',
                                    background: isSelected ? '#f5f3ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'background 0.12s',
                                    outline: isSelected ? '2px solid #e0e7ff' : 'none',
                                    outlineOffset: '-1px'
                                }}
                            >
                                {/* Per-row checkbox */}
                                <td style={{ padding: '12px 14px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
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
                                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>{m.code}</td>
                                <td style={{ padding: '12px 16px', color: '#475569' }}>{m.name}</td>
                                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.82rem' }}>
                                    {[m.finish, m.material].filter(Boolean).join(' • ') || '—'}
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800,
                                        background: color.bg, color: color.text, border: `1px solid ${color.border}`
                                    }}>
                                        {m.match}%
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
