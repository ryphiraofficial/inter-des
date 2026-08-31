import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Trash2, Zap } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api/inventory';

const BulkUploadModal = ({
    showModal,
    closeModal,
    onSuccess
}) => {
    const [rawText, setRawText] = useState('');
    const [previewRows, setPreviewRows] = useState([]);
    const [step, setStep] = useState('input'); // 'input' | 'preview' | 'result'
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);

    if (!showModal) return null;

    const parseCSVText = (text) => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const rows = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (i === 0 && (line.toLowerCase().includes('code') || line.toLowerCase().includes('batch'))) {
                continue; // Skip header row
            }

            const parts = line.split(/,|\t|\|/).map(p => p.trim());
            if (parts.length === 0 || parts.every(p => !p)) continue;

            const code = parts[0] || '';
            const batch = parts[1] || 'BATCH-001';
            const brandName = parts[2] || 'Generic';
            const color = parts[3] || 'Standard';
            const finish = parts[4] || 'Matt';
            const widthMm = parseFloat(parts[5]) || 22;
            const thicknessMm = parseFloat(parts[6]) || 0.8;
            const rollLengthM = parseFloat(parts[7]) || 50;
            const stockQtyM = parseFloat(parts[8]) || 0;
            const reorderLevelM = parseFloat(parts[9]) || 10;
            const pricePerMeter = parseFloat(parts[10]) || 0;
            const supplier = parts[11] || '';
            const location = parts[12] || '';

            // Validation checks
            const errors = [];
            if (!code) errors.push('Missing Edge Band Code');
            if (stockQtyM < 0) errors.push('Stock cannot be negative');
            if (pricePerMeter < 0) errors.push('Price cannot be negative');

            rows.push({
                id: Math.random().toString(36).substring(2, 9),
                code,
                batch,
                brandName,
                color,
                finish,
                widthMm,
                thicknessMm,
                rollLengthM,
                stockQtyM,
                reorderLevelM,
                pricePerMeter,
                supplier,
                location,
                isValid: errors.length === 0,
                errorMsg: errors.join('; ')
            });
        }

        return rows;
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            setRawText(content);
            const parsed = parseCSVText(content);
            setPreviewRows(parsed);
            setStep('preview');
        };
        reader.readAsText(file);
    };

    const handleParseText = () => {
        if (!rawText.trim()) return;
        const parsed = parseCSVText(rawText);
        setPreviewRows(parsed);
        setStep('preview');
    };

    const handleCellChange = (id, field, value) => {
        setPreviewRows(prev => prev.map(row => {
            if (row.id !== id) return row;
            const updated = { ...row, [field]: value };
            
            // Re-validate
            const errors = [];
            if (!updated.code || !updated.code.trim()) errors.push('Missing Edge Band Code');
            if (parseFloat(updated.stockQtyM) < 0) errors.push('Stock cannot be negative');
            if (parseFloat(updated.pricePerMeter) < 0) errors.push('Price cannot be negative');

            return {
                ...updated,
                isValid: errors.length === 0,
                errorMsg: errors.join('; ')
            };
        }));
    };

    const handleRemoveRow = (id) => {
        setPreviewRows(prev => prev.filter(r => r.id !== id));
    };

    const handleConfirmImport = async () => {
        const validItems = previewRows.filter(r => r.isValid);
        if (validItems.length === 0) {
            alert('No valid rows to import. Please correct row errors first.');
            return;
        }

        setImporting(true);
        const token = localStorage.getItem('token');
        try {
            const items = validItems.map(r => ({
                code: r.code.trim().toUpperCase(),
                batch: r.batch || 'BATCH-001',
                brandName: r.brandName || 'Generic',
                color: r.color || '',
                finish: r.finish || '',
                widthMm: Number(r.widthMm || 22),
                thicknessMm: Number(r.thicknessMm || 0.8),
                rollLengthM: Number(r.rollLengthM || 50),
                stockQtyM: Number(r.stockQtyM || 0),
                reorderLevelM: Number(r.reorderLevelM || 10),
                pricePerMeter: Number(r.pricePerMeter || 0),
                supplier: r.supplier || '',
                location: r.location || ''
            }));

            const res = await axios.post(
                `${API_BASE}/edge-bands/bulk`,
                { items },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setImportResult({
                    successCount: res.data.count,
                    failedCount: previewRows.length - validItems.length
                });
                setStep('result');
                if (onSuccess) onSuccess();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error executing bulk import');
        } finally {
            setImporting(false);
        }
    };

    const handleClose = () => {
        setStep('input');
        setRawText('');
        setPreviewRows([]);
        setImportResult(null);
        closeModal();
    };

    const validCount = previewRows.filter(r => r.isValid).length;
    const invalidCount = previewRows.length - validCount;

    return (
        <div className="modal-overlay" onClick={handleClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1200, padding: '1rem'
        }}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: step === 'preview' ? '1000px' : '650px',
                    maxHeight: '92vh',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.75rem',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#0284c7', color: '#fff', padding: '8px', borderRadius: '10px' }}>
                            <Upload size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                                Bulk Upload Edge Bands (CSV)
                            </h3>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                Upload or paste CSV data with preview and per-row validation
                            </span>
                        </div>
                    </div>
                    <button onClick={handleClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Step 1: Input */}
                {step === 'input' && (
                    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Drag & Drop File Box */}
                        <div style={{
                            border: '2px dashed #93c5fd',
                            background: '#eff6ff',
                            borderRadius: '16px',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: 'pointer'
                        }}>
                            <Upload size={36} style={{ color: '#2563eb', marginBottom: '0.5rem' }} />
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e40af' }}>Upload CSV File</h4>
                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#3b82f6' }}>
                                Drag & drop your <code>.csv</code> file or click to browse
                            </p>
                            <input
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                id="csv-file-input"
                            />
                            <label
                                htmlFor="csv-file-input"
                                style={{
                                    padding: '0.6rem 1.5rem',
                                    background: '#2563eb',
                                    color: '#fff',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Select CSV File
                            </label>
                        </div>

                        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>— OR PASTE CSV TEXT —</div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Expected Columns Format:
                            </label>
                            <code style={{ display: 'block', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', color: '#475569', marginBottom: '8px' }}>
                                code, batch, brand, color, finish, widthMm, thicknessMm, rollLengthM, stockQtyM, reorderLevelM, pricePerMeter, supplier, location
                            </code>
                            <textarea
                                rows={5}
                                placeholder="EB-101, B-01, Merino, Walnut, Matt, 22, 0.8, 50, 150, 10, 18, Supplier A, Shelf-1"
                                value={rawText}
                                onChange={e => setRawText(e.target.value)}
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button onClick={handleClose} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button
                                onClick={handleParseText}
                                disabled={!rawText.trim()}
                                style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <FileText size={16} /> Preview Parsed Data
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Preview Table */}
                {step === 'preview' && (
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle size={14} /> {validCount} Valid Rows
                                </span>
                                {invalidCount > 0 && (
                                    <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <AlertCircle size={14} /> {invalidCount} Invalid Rows (Fix or Remove below)
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => setStep('input')}
                                style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Edit CSV Source
                            </button>
                        </div>

                        {/* Editable Preview Table */}
                        <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '12px', maxHeight: '50vh' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', fontWeight: 700 }}>
                                        <th style={{ padding: '8px' }}>Status</th>
                                        <th style={{ padding: '8px' }}>Code *</th>
                                        <th style={{ padding: '8px' }}>Batch</th>
                                        <th style={{ padding: '8px' }}>Brand</th>
                                        <th style={{ padding: '8px' }}>Color</th>
                                        <th style={{ padding: '8px' }}>W (mm)</th>
                                        <th style={{ padding: '8px' }}>Th (mm)</th>
                                        <th style={{ padding: '8px' }}>Stock (m)</th>
                                        <th style={{ padding: '8px' }}>Price/m</th>
                                        <th style={{ padding: '8px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewRows.map(row => (
                                        <tr key={row.id} style={{ borderTop: '1px solid #e2e8f0', background: row.isValid ? '#ffffff' : '#fef2f2' }}>
                                            <td style={{ padding: '6px' }}>
                                                {row.isValid ? (
                                                    <CheckCircle size={16} style={{ color: '#16a34a' }} />
                                                ) : (
                                                    <span title={row.errorMsg} style={{ color: '#dc2626', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                        <AlertCircle size={16} /> Error
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '6px' }}>
                                                <input
                                                    type="text"
                                                    value={row.code}
                                                    onChange={e => handleCellChange(row.id, 'code', e.target.value)}
                                                    style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: row.code ? '1px solid #cbd5e1' : '1px solid #ef4444' }}
                                                />
                                            </td>
                                            <td style={{ padding: '6px' }}>
                                                <input
                                                    type="text"
                                                    value={row.batch}
                                                    onChange={e => handleCellChange(row.id, 'batch', e.target.value)}
                                                    style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                                />
                                            </td>
                                            <td style={{ padding: '6px' }}>
                                                <input
                                                    type="text"
                                                    value={row.brandName}
                                                    onChange={e => handleCellChange(row.id, 'brandName', e.target.value)}
                                                    style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                                />
                                            </td>
                                            <td style={{ padding: '6px' }}>
                                                <input
                                                    type="text"
                                                    value={row.color}
                                                    onChange={e => handleCellChange(row.id, 'color', e.target.value)}
                                                    style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                                />
                                            </td>
                                            <td style={{ padding: '6px' }}>
                                                <input
                                                    type="number"
                                                    value={row.widthMm}
                                                    onChange={e => handleCellChange(row.id, 'widthMm', e.target.value)}
                                                    style={{ width: '60px', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                                />
                                            </td>
                                            <td style={{ padding: '6px' }}>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={row.thicknessMm}
                                                    onChange={e => handleCellChange(row.id, 'thicknessMm', e.target.value)}
                                                    style={{ width: '50px', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                                />
                                            </td>
                                            <td style={{ padding: '6px' }}>
                                                <input
                                                    type="number"
                                                    value={row.stockQtyM}
                                                    onChange={e => handleCellChange(row.id, 'stockQtyM', e.target.value)}
                                                    style={{ width: '65px', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                                />
                                            </td>
                                            <td style={{ padding: '6px' }}>
                                                <input
                                                    type="number"
                                                    value={row.pricePerMeter}
                                                    onChange={e => handleCellChange(row.id, 'pricePerMeter', e.target.value)}
                                                    style={{ width: '60px', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                                />
                                            </td>
                                            <td style={{ padding: '6px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleRemoveRow(row.id)}
                                                    style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                                                    title="Remove Row"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button onClick={handleClose} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmImport}
                                disabled={importing || validCount === 0}
                                style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Zap size={16} />
                                {importing ? 'Importing...' : `Confirm & Import ${validCount} Edge Bands`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Result Summary */}
                {step === 'result' && importResult && (
                    <div style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '16px', borderRadius: '50%' }}>
                            <CheckCircle size={48} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Bulk Import Completed!</h3>
                        <div style={{ background: '#f8fafc', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '400px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
                                <span style={{ color: '#16a34a' }}>Successfully Imported:</span>
                                <span>{importResult.successCount} items</span>
                            </div>
                            {importResult.failedCount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#dc2626' }}>
                                    <span>Skipped Invalid Rows:</span>
                                    <span>{importResult.failedCount} items</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            style={{ padding: '0.75rem 2rem', borderRadius: '12px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}
                        >
                            Done & Refresh Inventory
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkUploadModal;
