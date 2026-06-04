import React from 'react';
import { Trash2, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const LineItemCard = ({
    item, index, updateLineItem, batchUpdateLineItem, removeLineItem, expandedItems, setExpandedItems,
    activeSearchId, searchResults, handleProductSearch, selectProduct, handleImageUpload
}) => {
    return (
        <div className={`line-item-card ${expandedItems[item.id] ? 'expanded' : ''}`}>
            <div className="item-main-row">
                <div className="item-number">{index + 1}</div>
                <div className="item-primary-info">
                    <div style={{ position: 'relative' }}>
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
                    <div className="item-total-display">₹{item.amount?.toLocaleString()}</div>
                    <div className="item-actions">
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
                                    batchUpdateLineItem(item.id, { cmL: v, sqft, quantity: sqft, size: sqft + ' SFT' });
                                } else {
                                    batchUpdateLineItem(item.id, { cmL: v, sqft: null, quantity: 1, size: '' });
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
                                    batchUpdateLineItem(item.id, { cmH: v, sqft, quantity: sqft, size: sqft + ' SFT' });
                                } else {
                                    batchUpdateLineItem(item.id, { cmH: v, sqft: null, quantity: 1, size: '' });
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
