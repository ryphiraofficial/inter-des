import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';

const EdgeBandResultTable = ({ results, onRemove, onSave, saving }) => {
    return (
        <div style={{
            background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
            padding: '1.5rem 2rem', marginTop: '1.5rem',
            boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShoppingBag size={20} color="#4f46e5" />
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        Edge Band Requirements ({results.length} item{results.length !== 1 ? 's' : ''})
                    </h4>
                </div>
                {results.length > 0 && (
                    <button
                        onClick={onSave}
                        disabled={saving}
                        style={{
                            background: saving ? '#94a3b8' : '#4f46e5', color: 'white',
                            border: 'none', borderRadius: '10px', padding: '9px 22px',
                            fontSize: '0.88rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                        }}
                        onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#4338ca'; }}
                        onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#4f46e5'; }}
                    >
                        {saving ? 'Saving to Project…' : 'Save to Project'}
                    </button>
                )}
            </div>

            {results.length === 0 ? (
                <div style={{
                    padding: '2.5rem', textAlign: 'center', background: '#f8fafc',
                    borderRadius: '14px', border: '2px dashed #e2e8f0', color: '#94a3b8',
                    fontSize: '0.88rem', fontWeight: 600
                }}>
                    No edge band requirements added yet. Search above, select bands, enter quantities, and click <strong>+ Add to Requirements</strong>.
                </div>
            ) : (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Brand</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Code</th>
                                <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700 }}>Match</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Dimension</th>
                                <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700 }}>Qty</th>
                                <th style={{ padding: '10px 16px', width: '40px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={`${r.brand}-${r.matchedCode}-${r.dimension}`}
                                    style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : 'none', background: 'white' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>{r.brand}</td>
                                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{r.matchedCode}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5' }}>{r.matchPercentage}%</span>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#475569' }}>{r.dimension.replace('x', ' × ')}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{r.quantity}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => onRemove(i)}
                                            title="Remove"
                                            style={{
                                                background: 'transparent', border: 'none', cursor: 'pointer',
                                                color: '#cbd5e1', borderRadius: '6px', padding: '4px',
                                                transition: 'color 0.15s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EdgeBandResultTable;
