import React, { useState } from 'react';
import { Layers, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle, Link2 } from 'lucide-react';

const LaminateTable = ({
    items,
    handleEdit,
    handleDelete,
    onViewDetail
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    if (!items || items.length === 0) {
        return (
            <div className="empty-state-card" style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Layers size={48} className="empty-icon" style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>No Laminates Found</h4>
                <p style={{ color: '#64748b', margin: 0 }}>Add laminates to cross-reference them with edge bands.</p>
            </div>
        );
    }

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = items.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    return (
        <div className="inventory-table-card">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th style={{ width: '4%' }}>No.</th>
                        <th style={{ width: '22%' }}>Laminate Code & Name</th>
                        <th style={{ width: '15%' }}>Brand & Supplier</th>
                        <th style={{ width: '16%' }}>Color / Finish</th>
                        <th style={{ width: '12%' }}>Thickness & Size</th>
                        <th style={{ width: '12%' }}>Stock (Sheets)</th>
                        <th style={{ width: '19%', textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item, index) => {
                        const isLowStock = item.stockQty <= item.reorderLevel;
                        const isOutStock = item.stockQty === 0;

                        return (
                            <tr key={item._id} className="inv-row">
                                <td className="row-number-cell" style={{ fontWeight: '600', color: '#64748b' }}>
                                    {startIndex + index + 1}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{item.code}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#475569' }}>{item.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '600', color: '#334155' }}>{item.brandName || item.brandId?.name || 'Generic'}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.supplier || '—'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.color || 'Standard'}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.finish || 'Normal'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{item.thicknessMm || 1.0} mm</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.sheetSize || '8x4 ft'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{
                                            fontWeight: '700',
                                            fontSize: '0.9rem',
                                            color: isOutStock ? '#ef4444' : isLowStock ? '#d97706' : '#16a34a'
                                        }}>
                                            {item.stockQty} sheets
                                        </span>
                                        {isLowStock && (
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '3px',
                                                background: isOutStock ? '#fef2f2' : '#fffbeb',
                                                color: isOutStock ? '#dc2626' : '#b45309',
                                                border: `1px solid ${isOutStock ? '#fca5a5' : '#fde68a'}`,
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: '700'
                                            }}>
                                                <AlertTriangle size={10} />
                                                {isOutStock ? 'Out' : 'Low'}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div className="table-actions" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                                        <button
                                            className="btn-match"
                                            onClick={(e) => { e.stopPropagation(); onViewDetail(item); }}
                                            style={{
                                                padding: '5px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #c7d2fe',
                                                background: '#eef2ff',
                                                color: '#4f46e5',
                                                fontWeight: '700',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <Link2 size={14} />
                                            Matched Edge Bands
                                        </button>
                                        <button
                                            className="action-btn edit"
                                            title="Edit Laminate"
                                            onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            title="Delete Laminate"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 10px 20px 10px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, items.length)} of {items.length} laminates
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === 1 ? '#f8fafc' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === totalPages ? '#f8fafc' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaminateTable;
