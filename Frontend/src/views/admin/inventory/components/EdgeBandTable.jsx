import React, { useState } from 'react';
import { Package, Edit2, Trash2, Sliders, ChevronLeft, ChevronRight, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const EdgeBandTable = ({
    items,
    handleEdit,
    handleDelete,
    handleStockAdjust
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('code'); // 'code' | 'brand' | 'stock'
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
    const itemsPerPage = 15;

    if (!items || items.length === 0) {
        return (
            <div className="empty-state-card" style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Package size={48} className="empty-icon" style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>No Edge Bands Found</h4>
                <p style={{ color: '#64748b', margin: 0 }}>Add edge bands to manage stock in meters and link them with laminates.</p>
            </div>
        );
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedItems = [...items].sort((a, b) => {
        let valA = '';
        let valB = '';

        if (sortField === 'code') {
            valA = (a.code || '').toLowerCase();
            valB = (b.code || '').toLowerCase();
        } else if (sortField === 'brand') {
            valA = (a.brandName || a.brandId?.name || '').toLowerCase();
            valB = (b.brandName || b.brandId?.name || '').toLowerCase();
        } else if (sortField === 'stock') {
            valA = a.stockQtyM ?? 0;
            valB = b.stockQtyM ?? 0;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedItems.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    const renderSortIcon = (field) => {
        if (sortField !== field) return <ArrowUpDown size={13} style={{ opacity: 0.4, marginLeft: '4px' }} />;
        return sortDirection === 'asc' ?
            <ArrowUp size={13} style={{ color: '#2563eb', marginLeft: '4px' }} /> :
            <ArrowDown size={13} style={{ color: '#2563eb', marginLeft: '4px' }} />;
    };

    return (
        <div className="inventory-table-card">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th style={{ width: '4%' }}>No.</th>
                        <th style={{ width: '16%', cursor: 'pointer' }} onClick={() => handleSort('code')}>
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                Code / Batch {renderSortIcon('code')}
                            </div>
                        </th>
                        <th style={{ width: '16%', cursor: 'pointer' }} onClick={() => handleSort('brand')}>
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                Brand & Supplier {renderSortIcon('brand')}
                            </div>
                        </th>
                        <th style={{ width: '16%' }}>Color / Finish</th>
                        <th style={{ width: '12%' }}>Dimensions</th>
                        <th style={{ width: '14%', cursor: 'pointer' }} onClick={() => handleSort('stock')}>
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                Stock (Meters) {renderSortIcon('stock')}
                            </div>
                        </th>
                        <th style={{ width: '10%' }}>Location</th>
                        <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item, index) => {
                        const isLowStock = item.stockQtyM <= item.reorderLevelM;
                        const isOutStock = item.stockQtyM === 0;

                        return (
                            <tr key={item._id} className="inv-row">
                                <td className="row-number-cell" style={{ fontWeight: '600', color: '#64748b' }}>
                                    {startIndex + index + 1}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{item.code}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Batch: {item.batch || 'N/A'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '600', color: '#334155' }}>{item.brandName || item.brandId?.name || 'Generic'}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.supplier || 'No Supplier'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.color || 'Standard'}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.finish || 'Normal'}</span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>
                                        {item.widthMm || 22} × {item.thicknessMm || 0.8} mm
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{
                                            fontWeight: '700',
                                            fontSize: '0.9rem',
                                            color: isOutStock ? '#ef4444' : isLowStock ? '#d97706' : '#16a34a'
                                        }}>
                                            {item.stockQtyM} m
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
                                                {isOutStock ? 'Out of Stock' : `Reorder (${item.reorderLevelM}m)`}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.location || '—'}</span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div className="table-actions" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                                        <button
                                            className="action-btn edit"
                                            title="Adjust Stock"
                                            onClick={(e) => { e.stopPropagation(); handleStockAdjust(item); }}
                                            style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
                                        >
                                            <Sliders size={15} />
                                        </button>
                                        <button
                                            className="action-btn edit"
                                            title="Edit Edge Band"
                                            onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            title="Delete Edge Band"
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
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, items.length)} of {items.length} edge bands
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

export default EdgeBandTable;
