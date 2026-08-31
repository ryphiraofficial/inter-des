import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';

const StockAdjustModal = ({
    showModal,
    closeModal,
    item,
    onAdjustStock
}) => {
    const [adjustment, setAdjustment] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!showModal || !item) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const adj = parseFloat(adjustment);
        if (isNaN(adj) || adj === 0) return;

        setSubmitting(true);
        try {
            await onAdjustStock(item._id, adj, reason);
            setAdjustment('');
            setReason('');
            closeModal();
        } catch (err) {
            console.error('Error adjusting stock:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const newStock = Math.max(0, (item.stockQtyM || 0) + (parseFloat(adjustment) || 0));

    return (
        <div className="modal-overlay" onClick={closeModal} style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1150, padding: '1rem'
        }}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '480px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '1.75rem'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '8px', borderRadius: '10px' }}>
                            <Sliders size={20} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Adjust Stock</h4>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.code} ({item.brandName || 'Generic'})</span>
                        </div>
                    </div>
                    <button onClick={closeModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Current Stock</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155' }}>{item.stockQtyM || 0} m</span>
                    </div>
                    <div style={{ borderRight: '1px solid #e2e8f0' }} />
                    <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>New Calculated Stock</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: newStock <= item.reorderLevelM ? '#d97706' : '#16a34a' }}>
                            {newStock} m
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Stock Adjustment (Meters)
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            placeholder="Enter +10 to add or -5 to deduct"
                            value={adjustment}
                            onChange={e => setAdjustment(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                            Use positive numbers (e.g. 50) for received rolls, negative numbers (e.g. -15) for used rolls.
                        </span>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Reason / Reference Note
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. PO #1024 audit or Project X usage"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={closeModal} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !adjustment}
                            style={{
                                padding: '0.65rem 1.4m',
                                borderRadius: '10px',
                                border: 'none',
                                background: '#0284c7',
                                color: '#fff',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Check size={16} />
                            {submitting ? 'Updating...' : 'Confirm Stock Adjustment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockAdjustModal;
