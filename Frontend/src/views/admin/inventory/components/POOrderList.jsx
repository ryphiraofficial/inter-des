import React, { useState, useEffect, useCallback } from 'react';
import { Download, ShoppingBag, RefreshCw, Star, Layers, Package, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api/inventory';

const POOrderList = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [neededQty, setNeededQty] = useState({});

    const token = localStorage.getItem('token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchPOList = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all laminates
            const lamRes = await axios.get(`${API_BASE}/laminates?limit=1000`, authHeaders);
            if (!lamRes.data.success) return;

            const laminates = lamRes.data.data;
            const poRows = [];

            // For each laminate, fetch its primary match
            for (const lam of laminates) {
                try {
                    const matchRes = await axios.get(`${API_BASE}/laminates/${lam._id}/matches`, authHeaders);
                    if (matchRes.data.success) {
                        const primaryMatch = matchRes.data.data.find(m => m.isPrimary);
                        if (primaryMatch) {
                            const eb = primaryMatch.edgeBandId || {};
                            poRows.push({
                                laminateId: lam._id,
                                laminateCode: lam.code,
                                laminateName: lam.name,
                                laminateBrand: lam.brandName || lam.brandId?.name || 'Generic',
                                laminateStock: lam.stockQty,
                                edgeBandId: eb._id,
                                edgeBandCode: eb.code || 'N/A',
                                edgeBandBatch: eb.batch || 'N/A',
                                edgeBandColor: eb.color || 'Standard',
                                edgeBandFinish: eb.finish || 'Matt',
                                widthMm: eb.widthMm || 22,
                                thicknessMm: eb.thicknessMm || 0.8,
                                edgeBandStockM: eb.stockQtyM ?? 0,
                                reorderLevelM: eb.reorderLevelM ?? 10,
                                matchPercent: primaryMatch.matchPercent,
                                supplier: eb.supplier || lam.supplier || 'N/A'
                            });
                        }
                    }
                } catch (err) {
                    console.error('Error fetching matches for laminate:', lam.code, err);
                }
            }

            setOrderItems(poRows);

            // Initialize default needed quantities (e.g. 50 meters default or reorder shortfall)
            const initialQty = {};
            poRows.forEach(item => {
                const shortfall = Math.max(0, (item.reorderLevelM || 10) - (item.edgeBandStockM || 0));
                initialQty[item.laminateId] = shortfall > 0 ? shortfall : 50;
            });
            setNeededQty(initialQty);

        } catch (err) {
            console.error('Error loading PO Order list:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPOList();
    }, [fetchPOList]);

    const handleQtyChange = (laminateId, value) => {
        setNeededQty(prev => ({
            ...prev,
            [laminateId]: Math.max(0, parseFloat(value) || 0)
        }));
    };

    const handleExportCSV = () => {
        if (orderItems.length === 0) return;

        const headers = [
            'Laminate Code',
            'Laminate Name',
            'Laminate Brand',
            'Laminate Stock (Sheets)',
            'Primary Edge Band Code',
            'Edge Band Batch',
            'Color',
            'Finish',
            'Width (mm)',
            'Thickness (mm)',
            'Match %',
            'Edge Band Stock (m)',
            'Qty Needed (m)',
            'Supplier'
        ];

        const csvRows = [headers.join(',')];

        orderItems.forEach(item => {
            const qty = neededQty[item.laminateId] || 50;
            const row = [
                `"${item.laminateCode}"`,
                `"${item.laminateName}"`,
                `"${item.laminateBrand}"`,
                item.laminateStock,
                `"${item.edgeBandCode}"`,
                `"${item.edgeBandBatch}"`,
                `"${item.edgeBandColor}"`,
                `"${item.edgeBandFinish}"`,
                item.widthMm,
                item.thicknessMm,
                `${item.matchPercent}%`,
                item.edgeBandStockM,
                qty,
                `"${item.supplier}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Procurement_PO_EdgeBand_List_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header / Actions Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#ffffff',
                padding: '1.25rem 1.75rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShoppingBag size={20} style={{ color: '#4f46e5' }} />
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            PO / Procurement Order List
                        </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                        Auto-generated procurement list for Laminates with finalized Primary Edge Band picks
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={fetchPOList}
                        disabled={loading}
                        style={{
                            padding: '0.65rem 1.25rem',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                        Refresh List
                    </button>

                    <button
                        onClick={handleExportCSV}
                        disabled={orderItems.length === 0}
                        style={{
                            padding: '0.65rem 1.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#16a34a',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: orderItems.length === 0 ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)'
                        }}
                    >
                        <Download size={16} /> Export PO (CSV)
                    </button>
                </div>
            </div>

            {/* List Table */}
            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    Loading PO Order list...
                </div>
            ) : orderItems.length === 0 ? (
                <div style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <Package size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>No Primary Edge Band Matches Found</h4>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                        Go to the <strong>Laminates</strong> tab, open a laminate detail view, and mark a matched Edge Band as <strong>PRIMARY</strong>.
                    </p>
                </div>
            ) : (
                <div className="inventory-table-card">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th style={{ width: '4%' }}>No.</th>
                                <th style={{ width: '22%' }}>Laminate Details</th>
                                <th style={{ width: '25%' }}>Primary Matched Edge Band</th>
                                <th style={{ width: '12%' }}>Dimensions</th>
                                <th style={{ width: '12%' }}>Edge Band Stock</th>
                                <th style={{ width: '15%' }}>Qty Needed (Meters)</th>
                                <th style={{ width: '10%' }}>Supplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item, index) => {
                                const isLowStock = item.edgeBandStockM <= item.reorderLevelM;

                                return (
                                    <tr key={item.laminateId} className="inv-row">
                                        <td className="row-number-cell" style={{ fontWeight: '600', color: '#64748b' }}>
                                            {index + 1}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{item.laminateCode}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#475569' }}>{item.laminateName}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.laminateBrand}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ background: '#4f46e5', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                                        <Star size={9} fill="#fff" /> PRIMARY
                                                    </span>
                                                    <span style={{ fontWeight: '700', color: '#1e1b4b' }}>{item.edgeBandCode}</span>
                                                </div>
                                                <span style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                                                    Batch: {item.edgeBandBatch} | {item.edgeBandColor} ({item.edgeBandFinish})
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>
                                                {item.widthMm} × {item.thicknessMm} mm
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ fontWeight: '700', color: isLowStock ? '#d97706' : '#16a34a' }}>
                                                    {item.edgeBandStockM} m
                                                </span>
                                                {isLowStock && (
                                                    <AlertTriangle size={14} style={{ color: '#d97706' }} title="Low Edge Band Stock" />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                step="5"
                                                value={neededQty[item.laminateId] ?? 50}
                                                onChange={e => handleQtyChange(item.laminateId, e.target.value)}
                                                style={{
                                                    width: '100px',
                                                    padding: '0.45rem 0.7rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #cbd5e1',
                                                    fontWeight: 700,
                                                    color: '#0f172a',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.supplier}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default POOrderList;
