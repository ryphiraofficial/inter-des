import React from 'react';
import { X, Upload, Plus, Trash2, Package } from 'lucide-react';
import { PREDEFINED_ITEMS, ITEM_UNITS } from '../hooks/useUploadActions';
import { BASE_IMAGE_URL } from '../../../../config/constants';

const UploadDesignModal = ({
    show, onClose, selectedTask,
    uploadData, setUploadData,
    handleFileUpload, handleAddDesignItem,
    handleRemoveDesignItem, handleDesignItemChange,
    handleRemoveFile, handleSubmitTask,
    uploading
}) => {
    if (!show) return null;

    const getFilePreview = (url) => url?.startsWith('http') ? url : `${BASE_IMAGE_URL}${url}`;

    return (
        <div className="modal-overlay">
            <div className="modal-content-styled">
                <div className="modal-header">
                    <h3>Submit Design: {selectedTask?.title}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {/* File Upload */}
                    <div className="upload-area">
                        <label className="file-input-label">
                            <Upload size={24} />
                            <span>Click to upload design files (2D/3D)</span>
                            <input type="file" multiple onChange={handleFileUpload} hidden />
                        </label>
                        {uploading && <p className="loading-text">Uploading files...</p>}
                        <div className="uploaded-preview" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginTop: '10px' }}>
                            {uploadData.files.map((f, i) => (
                                <div key={i} style={{ position: 'relative', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    <img src={getFilePreview(f.url)} alt={f.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={e => { e.target.src = 'https://via.placeholder.com/80?text=File'; }} />
                                    <button onClick={() => handleRemoveFile(i)}
                                        style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239,68,68,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <X size={12} />
                                    </button>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2px 5px', fontSize: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {f.filename}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Design Items Builder */}
                    <div className="design-items-builder" style={{ marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={18} color="#6366f1" /> Required Materials & Items
                            </label>
                            <button type="button" onClick={handleAddDesignItem}
                                style={{ background: '#f0f9ff', color: '#0ea5e9', border: '1px solid #bae6fd', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Plus size={14} /> Add Item
                            </button>
                        </div>

                        {uploadData.designItems.length > 0 ? (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {uploadData.designItems.map((item, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                list={`predefined-items-${idx}`}
                                                placeholder="Item Name..."
                                                value={item.name}
                                                onChange={e => handleDesignItemChange(idx, 'name', e.target.value)}
                                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                            />
                                            <datalist id={`predefined-items-${idx}`}>
                                                {PREDEFINED_ITEMS.map((pi, i) => <option key={i} value={pi} />)}
                                            </datalist>
                                        </div>
                                        <input placeholder="Size (e.g. 700cm)" value={item.size}
                                            onChange={e => handleDesignItemChange(idx, 'size', e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                                        <select value={item.unit} onChange={e => handleDesignItemChange(idx, 'unit', e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                                            {ITEM_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                        <input type="number" placeholder="Qty" value={item.quantity}
                                            onChange={e => handleDesignItemChange(idx, 'quantity', e.target.value)}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                                        <button onClick={() => handleRemoveDesignItem(idx)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#94a3b8', fontSize: '0.85rem' }}>
                                No items added yet. Click "Add Item" to specify materials.
                            </div>
                        )}
                    </div>

                    {/* Staff Notes */}
                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', display: 'block', color: '#1e293b' }}>Staff Notes</label>
                        <textarea
                            placeholder="Add any additional notes about the design..."
                            style={{ height: '80px', borderRadius: '12px', padding: '12px' }}
                            value={uploadData.staffNotes}
                            onChange={e => setUploadData({ ...uploadData, staffNotes: e.target.value })}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="action-btn" onClick={onClose}>Cancel</button>
                    <button className="action-btn primary" onClick={() => handleSubmitTask(selectedTask)} disabled={uploading}>
                        {uploading ? 'Submitting...' : 'Submit to Manager'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadDesignModal;
