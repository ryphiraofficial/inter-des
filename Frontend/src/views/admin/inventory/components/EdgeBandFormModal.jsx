import React, { useState, useEffect } from 'react';
import { X, Save, Layers, Plus, Trash2, Zap, FileText, Check } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api/inventory';

const EdgeBandFormModal = ({
    showModal,
    closeModal,
    editingItem,
    formData,
    handleInputChange,
    handleSubmit,
    submitting,
    brands = [],
    onSuccess
}) => {
    const [mode, setMode] = useState('single'); // 'single' | 'bulk'

    // Shared default fields for bulk add
    const [bulkShared, setBulkShared] = useState({
        brandName: '',
        supplier: '',
        rollLengthM: 50,
        reorderLevelM: 10,
        location: ''
    });

    // Bulk Rows
    const [bulkRows, setBulkRows] = useState([
        { code: '', batch: '', color: '', finish: 'Matt', widthMm: 22, thicknessMm: 0.8, stockQtyM: 100, pricePerMeter: 18 },
        { code: '', batch: '', color: '', finish: 'Matt', widthMm: 22, thicknessMm: 2.0, stockQtyM: 50, pricePerMeter: 35 }
    ]);

    const [bulkSubmitting, setBulkSubmitting] = useState(false);
    const [showTextScan, setShowTextScan] = useState(false);
    const [rawText, setRawText] = useState('');

    useEffect(() => {
        if (editingItem) {
            setMode('single');
        }
    }, [editingItem]);

    if (!showModal) return null;

    const handleAddBulkRow = () => {
        setBulkRows(prev => [
            ...prev,
            { code: '', batch: '', color: '', finish: 'Matt', widthMm: 22, thicknessMm: 0.8, stockQtyM: 100, pricePerMeter: 18 }
        ]);
    };

    const handleRemoveBulkRow = (index) => {
        if (bulkRows.length <= 1) return;
        setBulkRows(prev => prev.filter((_, i) => i !== index));
    };

    const handleBulkRowChange = (index, field, value) => {
        setBulkRows(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleBulkSharedChange = (e) => {
        const { name, value } = e.target;
        setBulkShared(prev => ({ ...prev, [name]: value }));
    };

    const handleParseRawText = () => {
        if (!rawText.trim()) return;
        const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
        const parsedRows = [];

        for (const line of lines) {
            if (line.toLowerCase().startsWith('code') || line.toLowerCase().startsWith('item')) continue;

            // Split by comma, tab (\t), or pipe (|)
            const parts = line.split(/,|\t|\|/).map(p => p.trim());
            if (parts.length === 0 || !parts[0]) continue;

            parsedRows.push({
                code: parts[0] || '',
                batch: parts[1] || 'BATCH-001',
                color: parts[2] || 'Standard',
                finish: parts[3] || 'Matt',
                widthMm: !isNaN(parseFloat(parts[4])) ? parseFloat(parts[4]) : 22,
                thicknessMm: !isNaN(parseFloat(parts[5])) ? parseFloat(parts[5]) : 0.8,
                stockQtyM: !isNaN(parseFloat(parts[6])) ? parseFloat(parts[6]) : 100,
                pricePerMeter: !isNaN(parseFloat(parts[7])) ? parseFloat(parts[7]) : 18
            });
        }

        if (parsedRows.length > 0) {
            setBulkRows(parsedRows);
            setShowTextScan(false);
            setRawText('');
        } else {
            alert('Could not parse any valid rows. Please ensure lines have at least an Edge Band Code.');
        }
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        const validRows = bulkRows.filter(r => r.code && r.code.trim());
        if (validRows.length === 0) {
            alert('Please enter at least one Edge Band Code in the bulk table');
            return;
        }

        setBulkSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const items = validRows.map(r => ({
                ...bulkShared,
                ...r,
                widthMm: Number(r.widthMm || 22),
                thicknessMm: Number(r.thicknessMm || 0.8),
                stockQtyM: Number(r.stockQtyM || 0),
                pricePerMeter: Number(r.pricePerMeter || 0),
                rollLengthM: Number(bulkShared.rollLengthM || 50),
                reorderLevelM: Number(bulkShared.reorderLevelM || 10)
            }));

            const res = await axios.post(
                `${API_BASE}/edge-bands/bulk`,
                { items },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                if (onSuccess) onSuccess();
                closeModal();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error executing bulk add');
        } finally {
            setBulkSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={closeModal} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, padding: '1rem'
        }}>
            <div
                className="modal-container"
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: mode === 'bulk' ? '940px' : '650px',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease'
                }}
            >
                {/* Modal Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.75rem',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8fafc'
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                            {editingItem ? 'Edit Edge Band' : mode === 'bulk' ? '⚡ Bulk Add Edge Bands' : 'Add Single Edge Band'}
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {mode === 'bulk' ? 'Add multiple edge band series or scan/paste raw text CSV data' : 'Manage single stock entry'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {!editingItem && (
                            <div style={{ display: 'flex', gap: '4px', background: '#cbd5e1', padding: '3px', borderRadius: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setMode('single')}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        background: mode === 'single' ? '#ffffff' : 'transparent',
                                        color: mode === 'single' ? '#0f172a' : '#475569',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Single Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('bulk')}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        background: mode === 'bulk' ? '#0284c7' : 'transparent',
                                        color: mode === 'bulk' ? '#ffffff' : '#475569',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <Zap size={13} /> Bulk Add
                                </button>
                            </div>
                        )}

                        <button onClick={closeModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Single Mode Form */}
                {mode === 'single' ? (
                    <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Edge Band Code *
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. EB-MER-001"
                                    required
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Roll / Batch Reference
                                </label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. BATCH-2026-A"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    name="brandName"
                                    value={formData.brandName || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Merino / Rehau / Stylam"
                                    list="brand-options"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                                <datalist id="brand-options">
                                    {brands.map(b => (
                                        <option key={b._id || b.name} value={b.name} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Supplier
                                </label>
                                <input
                                    type="text"
                                    name="supplier"
                                    value={formData.supplier || ''}
                                    onChange={handleInputChange}
                                    placeholder="Supplier or Vendor Name"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Color / Shade
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Natural Walnut"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Finish
                                </label>
                                <input
                                    type="text"
                                    name="finish"
                                    value={formData.finish || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Matt / High Gloss"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Width (mm)
                                </label>
                                <input
                                    type="number"
                                    name="widthMm"
                                    value={formData.widthMm ?? 22}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.5"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Thickness (mm)
                                </label>
                                <input
                                    type="number"
                                    name="thicknessMm"
                                    value={formData.thicknessMm ?? 0.8}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.1"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Roll Length (m)
                                </label>
                                <input
                                    type="number"
                                    name="rollLengthM"
                                    value={formData.rollLengthM ?? 50}
                                    onChange={handleInputChange}
                                    min="0"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Stock Qty (Meters) *
                                </label>
                                <input
                                    type="number"
                                    name="stockQtyM"
                                    value={formData.stockQtyM ?? 0}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Reorder Level (m)
                                </label>
                                <input
                                    type="number"
                                    name="reorderLevelM"
                                    value={formData.reorderLevelM ?? 10}
                                    onChange={handleInputChange}
                                    min="0"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                    Price / Meter (₹)
                                </label>
                                <input
                                    type="number"
                                    name="pricePerMeter"
                                    value={formData.pricePerMeter ?? 0}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.5"
                                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Storage Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Shelf E-04 / Rack 2"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <button type="button" onClick={closeModal} style={{ padding: '0.7rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Save size={16} />
                                {submitting ? 'Saving...' : editingItem ? 'Update Edge Band' : 'Add Edge Band'}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Bulk Mode Form */
                    <form onSubmit={handleBulkSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Shared Header Controls */}
                        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.75rem' }}>
                                Shared Default Properties (Applies to all bulk entries)
                            </span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Brand</label>
                                    <input
                                        type="text"
                                        name="brandName"
                                        value={bulkShared.brandName}
                                        onChange={handleBulkSharedChange}
                                        placeholder="e.g. Merino"
                                        list="brand-options"
                                        style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Supplier</label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        value={bulkShared.supplier}
                                        onChange={handleBulkSharedChange}
                                        placeholder="Vendor Name"
                                        style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Roll Length (m)</label>
                                    <input
                                        type="number"
                                        name="rollLengthM"
                                        value={bulkShared.rollLengthM}
                                        onChange={handleBulkSharedChange}
                                        style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Reorder Level (m)</label>
                                    <input
                                        type="number"
                                        name="reorderLevelM"
                                        value={bulkShared.reorderLevelM}
                                        onChange={handleBulkSharedChange}
                                        style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={bulkShared.location}
                                        onChange={handleBulkSharedChange}
                                        placeholder="Shelf E-01"
                                        style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text Scan / CSV Paste Accordion Drawer */}
                        <div style={{ background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={18} style={{ color: '#2563eb' }} />
                                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e40af' }}>
                                        📄 Quick Paste / Scan Text Data (CSV)
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowTextScan(!showTextScan)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #93c5fd',
                                        background: '#ffffff',
                                        color: '#1d4ed8',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showTextScan ? 'Hide Parser' : 'Open Paste Box'}
                                </button>
                            </div>

                            {showTextScan && (
                                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>
                                        Paste lines formatted as: <code>Code, Batch, Color, Finish, Width(mm), Thickness(mm), Stock(m), Price(₹)</code>
                                    </span>
                                    <textarea
                                        rows={4}
                                        placeholder={`EB-101, B-01, Natural Walnut, Matt, 22, 0.8, 150, 18\nEB-102, B-02, Light Oak, Grain, 22, 2.0, 50, 35`}
                                        value={rawText}
                                        onChange={e => setRawText(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid #93c5fd',
                                            fontFamily: 'monospace',
                                            fontSize: '0.82rem',
                                            background: '#ffffff'
                                        }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            type="button"
                                            onClick={handleParseRawText}
                                            disabled={!rawText.trim()}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: '#2563eb',
                                                color: '#ffffff',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <Check size={14} /> Parse & Fill Rows
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bulk Rows Table */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>
                                    Edge Band Items ({bulkRows.length} rows)
                                </h4>
                                <button
                                    type="button"
                                    onClick={handleAddBulkRow}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #bae6fd',
                                        background: '#f0f9ff',
                                        color: '#0284c7',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <Plus size={14} /> Add Row
                                </button>
                            </div>

                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', fontWeight: 700 }}>
                                            <th style={{ padding: '8px 10px', width: '20%' }}>Code *</th>
                                            <th style={{ padding: '8px 10px', width: '15%' }}>Batch</th>
                                            <th style={{ padding: '8px 10px', width: '18%' }}>Color</th>
                                            <th style={{ padding: '8px 10px', width: '12%' }}>Finish</th>
                                            <th style={{ padding: '8px 10px', width: '10%' }}>W (mm)</th>
                                            <th style={{ padding: '8px 10px', width: '10%' }}>Th (mm)</th>
                                            <th style={{ padding: '8px 10px', width: '10%' }}>Stock (m)</th>
                                            <th style={{ padding: '8px 10px', width: '5%', textAlign: 'center' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bulkRows.map((row, idx) => (
                                            <tr key={idx} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '6px 8px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="EB-001"
                                                        value={row.code}
                                                        onChange={e => handleBulkRowChange(idx, 'code', e.target.value)}
                                                        required
                                                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '6px 8px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="BATCH-1"
                                                        value={row.batch}
                                                        onChange={e => handleBulkRowChange(idx, 'batch', e.target.value)}
                                                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '6px 8px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Walnut"
                                                        value={row.color}
                                                        onChange={e => handleBulkRowChange(idx, 'color', e.target.value)}
                                                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '6px 8px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Matt"
                                                        value={row.finish}
                                                        onChange={e => handleBulkRowChange(idx, 'finish', e.target.value)}
                                                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '6px 8px' }}>
                                                    <input
                                                        type="number"
                                                        step="0.5"
                                                        value={row.widthMm}
                                                        onChange={e => handleBulkRowChange(idx, 'widthMm', e.target.value)}
                                                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '6px 8px' }}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={row.thicknessMm}
                                                        onChange={e => handleBulkRowChange(idx, 'thicknessMm', e.target.value)}
                                                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '6px 8px' }}>
                                                    <input
                                                        type="number"
                                                        value={row.stockQtyM}
                                                        onChange={e => handleBulkRowChange(idx, 'stockQtyM', e.target.value)}
                                                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveBulkRow(idx)}
                                                        disabled={bulkRows.length <= 1}
                                                        style={{ border: 'none', background: 'transparent', color: bulkRows.length <= 1 ? '#cbd5e1' : '#ef4444', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <button type="button" onClick={closeModal} style={{ padding: '0.7rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={bulkSubmitting}
                                style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Zap size={16} />
                                {bulkSubmitting ? 'Adding Bulk Items...' : `Save All ${bulkRows.length} Edge Bands`}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EdgeBandFormModal;
