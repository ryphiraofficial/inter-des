import React from 'react';
import { Users, Edit, Trash2 } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';

const ClientTable = ({ loading, filtered, onEdit, onDelete }) => {
    if (loading) return <TableSkeleton rows={8} cols={5} />;

    if (filtered.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <Users size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p>No clients found.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive-wrapper" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                    <tr style={{ background: '#f8fafc' }}>
                        {['Client', 'Email', 'Phone', 'GST Number', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((c, i) => (
                        <tr key={c._id || i} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                                        {c.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{c.name}</span>
                                </div>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>{c.email || '—'}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>{c.phone || '—'}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>{c.gstNumber || '—'}</td>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => onEdit(c)} className="action-btn-sm edit"><Edit size={14} /></button>
                                    <button onClick={() => onDelete(c._id)} className="action-btn-sm delete"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientTable;
