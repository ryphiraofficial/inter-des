import React from 'react';
import { Building2, Edit, Trash2 } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';

const VendorTable = ({ loading, filtered, onEdit, onDelete }) => {
    if (loading) return <TableSkeleton rows={8} cols={6} />;

    if (filtered.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <Building2 size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p>No vendors found.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                    <tr style={{ background: '#f8fafc' }}>
                        {['Vendor', 'Category', 'Email', 'Phone', 'GST', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((v, i) => (
                        <tr key={v._id || i} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Building2 size={16} color="#94a3b8" />
                                    </div>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{v.name}</span>
                                </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                                {v.category && <span className="category-badge">{v.category}</span>}
                            </td>
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{v.email || '—'}</td>
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{v.phone || '—'}</td>
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{v.gstNumber || '—'}</td>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => onEdit(v)} className="action-btn-sm edit"><Edit size={14} /></button>
                                    <button onClick={() => onDelete(v._id)} className="action-btn-sm delete"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VendorTable;
