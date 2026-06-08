import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const LineItemCard = ({
    item, index, updateLineItem, batchUpdateLineItem, removeLineItem, expandedItems, setExpandedItems,
    activeSearchId, searchResults, handleProductSearch, selectProduct, handleImageUpload
}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <div className={`line-item-card ${expandedItems[item.id] ? 'expanded' : ''}`}>
            {isPreviewOpen && item.image && (
                <div 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(4px)' }}
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={() => setIsPreviewOpen(false)} 
                            style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                        >
                            Close <X size={24} />
                        </button>
                        <img src={item.image} alt="preview" style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} />
                    </div>
                </div>
            )}
            <div className="item-main-row">
                <div className="item-number">{index + 1}</div>
                <div className="item-primary-info" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {item.image && (
                        <div 
                            onClick={() => setIsPreviewOpen(true)}
                            title="Click to preview"
                            style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, marginTop: '16px', border: '1px solid #cbd5e1', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <img src={item.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                    <div style={{ position: 'relative', flex: 1 }}>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Item</span>
                        <input
                            type="text"
                            className="item-name-input"
                            placeholder="Item Name (e.g., Modular Kitchen Cabinet)"
                            value={item.name}
                            onChange={(e) => handleProductSearch(item.id, e.target.value, updateLineItem)}
                        />
                        {activeSearchId === item.id && searchResults.length > 0 && (
                            <div className="product-search-dropdown">
                                {searchResults.map(p => (
                                    <div key={p._id} className="search-result-item" onClick={() => selectProduct(item.id, p)}>
                                        <div className="res-info">
                                            <span className="res-name">{p.itemName}</span>
                                            <span className="res-cat">{p.section}</span>
                                        </div>
                                        <div className="res-price">₹{p.price?.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="item-controls-compact">
                    <div className="compact-val" style={{ flexDirection: 'column', gap: '2px', alignItems: 'stretch' }}>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Qty</span>
                        <input type="number" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)} />
                    </div>
                    <div className="unit-select-compact" style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'stretch' }}>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', paddingLeft: '0.75rem' }}>Unit</span>
                        <CustomSelect
                            value={item.unit}
                            onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                            options={[
                                { value: 'SCM', label: 'SCM' },
                                { value: 'SFT', label: 'SFT' },
                                { value: 'Sq Ft', label: 'Sq Ft' },
                                { value: 'RFT', label: 'RFT' },
                                { value: 'Nos', label: 'Nos' },
                                { value: 'Numbers', label: 'Numbers' },
                                { value: 'Lumpsum', label: 'Lumpsum' }
                            ]}
                        />
                    </div>
                    <div className="compact-val" style={{ flexDirection: 'column', gap: '2px', alignItems: 'stretch' }}>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Rate</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span className="currency-prefix">₹</span>
                            <input type="number" value={item.rate} onChange={(e) => updateLineItem(item.id, 'rate', e.target.value)} />
                        </div>
                    </div>
                    <div className="compact-val" style={{ flexDirection: 'column', gap: '2px', alignItems: 'stretch' }}>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Discount</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <select 
                                style={{ padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#f8fafc', fontSize: '0.8rem', outline: 'none' }}
                                value={item.discountType || 'percentage'}
                                onChange={(e) => updateLineItem(item.id, 'discountType', e.target.value)}
                            >
                                <option value="percentage">%</option>
                                <option value="amount">₹</option>
                            </select>
                            <input 
                                type="number" 
                                style={{ width: '60px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.85rem' }} 
                                value={item.discountValue || ''} 
                                onChange={(e) => updateLineItem(item.id, 'discountValue', e.target.value)} 
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="item-total-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <span>₹{item.amount?.toLocaleString()}</span>
                        {item.discountAmount > 0 && <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 600 }}>-₹{item.discountAmount?.toLocaleString()} off</span>}
                    </div>
                    <div className="item-actions">
                        <button type="button" onClick={() => document.getElementById(`file-quick-sales-${item.id}`).click()} className="btn-icon-item" title={item.image ? "Change Image" : "Upload Image"}>
                            {item.image ? <img src={item.image} alt="preview" style={{width: '16px', height: '16px', borderRadius: '4px', objectFit: 'cover'}} /> : <Upload size={16} />}
                        </button>
                        <input type="file" id={`file-quick-sales-${item.id}`} hidden onChange={(e) => handleImageUpload(item.id, e.target.files[0])} accept="image/*" />
                        <button type="button" onClick={() => setExpandedItems(p => ({ ...p, [item.id]: !p[item.id] }))} className="btn-icon-item">
                            {expandedItems[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button type="button" onClick={() => removeLineItem(item.id)} className="btn-icon-item delete">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {['sqft', 'sft', 'sq.ft', 'sqft'].includes(item.unit?.toLowerCase().replace(/\s/g, '')) && (
                <div style={{ padding: '0.75rem 0 0.25rem', borderTop: '1px solid #f1f5f9', marginTop: '0.5rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Dimensions (cm)</label>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input type="number" placeholder="L" style={{ padding: '0.4rem', fontSize: '0.85rem', width: '60px', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#f8fafc' }} value={item.cmL ?? ''} onChange={(e) => {
                                const v = e.target.value ? parseFloat(e.target.value) : null;
                                const h = item.cmH || 0;
                                if (v && h > 0) {
                                    const sqft = Math.round((v * h) / 900 * 100) / 100;
                                    batchUpdateLineItem(item.id, { cmL: v, cmH: h, sqft, quantity: sqft, size: sqft + ' SFT' });
                                } else {
                                    batchUpdateLineItem(item.id, { cmL: v, cmH: item.cmH ?? null, sqft: null, quantity: 1, size: '' });
                                }
                            }} />
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>×</span>
                            <input type="number" placeholder="D" style={{ padding: '0.4rem', fontSize: '0.85rem', width: '60px', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#f8fafc' }} value={item.cmD ?? ''} onChange={(e) => {
                                const v = e.target.value ? parseFloat(e.target.value) : null;
                                updateLineItem(item.id, 'cmD', v);
                            }} />
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>×</span>
                            <input type="number" placeholder="H" style={{ padding: '0.4rem', fontSize: '0.85rem', width: '60px', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#f8fafc' }} value={item.cmH ?? ''} onChange={(e) => {
                                const v = e.target.value ? parseFloat(e.target.value) : null;
                                const l = item.cmL || 0;
                                if (v && l > 0) {
                                    const sqft = Math.round((l * v) / 900 * 100) / 100;
                                    batchUpdateLineItem(item.id, { cmL: l, cmH: v, sqft, quantity: sqft, size: sqft + ' SFT' });
                                } else {
                                    batchUpdateLineItem(item.id, { cmL: item.cmL ?? null, cmH: v, sqft: null, quantity: 1, size: '' });
                                }
                            }} />
                            <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.4rem 0.75rem', minWidth: '80px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                                {item.size || '— SFT'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {expandedItems[item.id] && (
                <div className="item-expanded-content">
                    <div className="expanded-grid">
                        <div className="expanded-left">
                            <div className="form-group">
                                <label>Detailed Description</label>
                                <textarea value={item.description} onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} placeholder="Material specifications, manufacturing details, etc." rows="3"></textarea>
                            </div>
                            <div className="inner-grid-3">
                                <div className="form-group">
                                    <label>Section/Category</label>
                                    <input type="text" value={item.section} onChange={(e) => updateLineItem(item.id, 'section', e.target.value)} placeholder="e.g., Kitchen, Wardrobe" />
                                </div>
                                <div className="form-group">
                                    <label>Material Origin</label>
                                    <input type="text" value={item.materialOrigin} onChange={(e) => updateLineItem(item.id, 'materialOrigin', e.target.value)} placeholder="e.g., Imported Birch" />
                                </div>
                                <div className="form-group">
                                    <label>Finish/Brand</label>
                                    <input type="text" value={item.finishBrand} onChange={(e) => updateLineItem(item.id, 'finishBrand', e.target.value)} placeholder="e.g., High Gloss Laminate" />
                                </div>
                            </div>
                        </div>
                        <div className="expanded-right">
                            <label>Item Preview Image</label>
                            <div className="item-image-upload-zone">
                                {item.image ? (
                                    <div className="preview-image-container">
                                        <img src={item.image} alt="Item" />
                                        <button type="button" onClick={() => updateLineItem(item.id, 'image', null)} className="btn-remove-img"><Trash2 size={12} /></button>
                                    </div>
                                ) : (
                                    <label className="upload-placeholder">
                                        <Upload size={20} />
                                        <span>Upload Image</span>
                                        <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(item.id, e.target.files[0])} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LineItemCard;
