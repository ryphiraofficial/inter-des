import React from 'react';
import { Layers, Plus, Search, Trash2, ChevronDown, ChevronUp, Upload, Package } from 'lucide-react';

const LineItemsSection = ({ 
    lineItems, addLineItem, removeLineItem, updateLineItem, 
    expandedItems, setExpandedItems, globalSearchQuery, setGlobalSearchQuery,
    globalSearchResults, handleGlobalSearch, addFromInventorySelect,
    activeSearchId, searchResults, handleProductSearch, selectProduct,
    handleImageUpload
}) => {
    return (
        <div className="form-section" style={{ marginTop: '1.5rem' }}>
            <div className="section-header-row" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
                <div className="section-header-left">
                    <Layers className="section-icon" size={18} />
                    <h3>Line Items</h3>
                </div>
                <button type="button" onClick={addLineItem} className="btn-add-item">
                    <Plus size={14} /> Add Item
                </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <div style={{
                    background: '#ffffff',
                    padding: '0.4rem 1.25rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }} className="global-search-container">
                    <Search size={20} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search inventory to quick-add (e.g., Marble, Paint, Wood)..."
                        style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.6rem 0', fontSize: '0.95rem', outline: 'none' }}
                        value={globalSearchQuery}
                        onChange={(e) => handleGlobalSearch(e.target.value)}
                    />
                </div>
                {globalSearchResults.length > 0 && (
                    <div className="product-search-dropdown" style={{ width: '100%', top: '100%', left: 0, marginTop: '4px', zIndex: 100 }}>
                        {globalSearchResults.map(p => (
                            <div key={p._id} className="search-result-item" onClick={() => addFromInventorySelect(p)}>
                                <div className="res-icon" style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <Package size={18} color="#94a3b8" />}
                                </div>
                                <div className="res-info">
                                    <span className="res-name">{p.itemName}</span>
                                    <span className="res-cat">{p.section} • {p.unit}</span>
                                </div>
                                <div className="res-price">₹{p.price?.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="line-items-grid">
                {lineItems.map((item, index) => (
                    <div key={item.id} className={`line-item-card ${expandedItems[item.id] ? 'expanded' : ''}`}>
                        <div className="item-main-row">
                            <div className="item-number">{index + 1}</div>
                            <div className="item-primary-info">
                                <div style={{ position: 'relative' }}>
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
                                <div className="compact-val">
                                    <input type="number" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)} />
                                    <span>{item.unit}</span>
                                </div>
                                <div className="compact-val">
                                    <span className="currency-prefix">₹</span>
                                    <input type="number" value={item.rate} onChange={(e) => updateLineItem(item.id, 'rate', e.target.value)} />
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
                                        <div className="form-group" style={{ marginTop: '1rem' }}>
                                            <label>Dimensions/Size</label>
                                            <input type="text" value={item.size} onChange={(e) => updateLineItem(item.id, 'size', e.target.value)} placeholder="e.g., 2400mm x 600mm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {lineItems.length === 0 && (
                <div className="empty-items-state" onClick={addLineItem}>
                    <div className="empty-icon-circle"><Package size={32} /></div>
                    <p>No line items added yet. Click to start adding items.</p>
                </div>
            )}
        </div>
    );
};

export default LineItemsSection;
