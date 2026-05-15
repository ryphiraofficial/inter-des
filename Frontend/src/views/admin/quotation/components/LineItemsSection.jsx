import React from 'react';
import { Layers, Plus, Search, X, Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import AISuggestButton from '../../components/AISuggestButton';

const LineItemsSection = ({ 
    lineItems, 
    addLineItem, 
    removeLineItem, 
    updateLineItem, 
    expandedItems, 
    setExpandedItems,
    globalSearchQuery,
    setGlobalSearchQuery,
    globalSearchResults,
    handleGlobalSearch,
    addFromInventorySelect,
    activeSearchId,
    searchResults,
    handleProductSearch,
    selectProduct,
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
                <div className="global-search-container" style={{
                    background: '#ffffff',
                    padding: '0.4rem 1.25rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <Search size={20} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search inventory to quick-add..."
                        className="input-styled"
                        style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '0.6rem 0' }}
                        value={globalSearchQuery}
                        onChange={(e) => handleGlobalSearch(e.target.value)}
                    />
                    {globalSearchQuery && (
                        <X size={18} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setGlobalSearchQuery('')} />
                    )}
                </div>

                {globalSearchResults.length > 0 && (
                    <div className="product-search-dropdown" style={{ width: '100%', top: '100%', left: 0 }}>
                        {globalSearchResults.map(res => (
                            <div key={res._id} className="search-result-item" onClick={() => addFromInventorySelect(res)}>
                                <div className="res-info">
                                    <span className="res-name">{res.itemName}</span>
                                    <span className="res-cat">{res.section || 'General'}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="res-price">₹{res.price}</span>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Click to Add</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="line-item-container">
                {lineItems.map((item, index) => (
                    <div key={item.id} className="line-item-card" style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 70px 120px 100px 120px 70px', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>#{index + 1}</span>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className="input-styled"
                                    style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                                    placeholder="Item name..."
                                    value={item.name}
                                    onChange={(e) => handleProductSearch(item.id, e.target.value, updateLineItem)}
                                />
                                {activeSearchId === item.id && searchResults.length > 0 && (
                                    <div className="product-search-dropdown">
                                        {searchResults.map(res => (
                                            <div key={res._id} className="search-result-item" onClick={() => selectProduct(item.id, res)}>
                                                <div className="res-info">
                                                    <span className="res-name">{res.itemName}</span>
                                                    <span className="res-cat">{res.section}</span>
                                                </div>
                                                <span className="res-price">₹{res.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="number"
                                className="input-styled"
                                style={{ padding: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}
                                value={item.quantity}
                                onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                            <CustomSelect
                                value={item.unit}
                                onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                                options={[
                                    { value: 'SCM', label: 'SCM' },
                                    { value: 'SFT', label: 'SFT' },
                                    { value: 'RFT', label: 'RFT' },
                                    { value: 'Nos', label: 'Nos' },
                                    { value: 'Lumpsum', label: 'Lumpsum' }
                                ]}
                            />
                            <input
                                type="number"
                                className="input-styled"
                                style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                value={item.rate}
                                onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            />
                            <div style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                                ₹{item.amount?.toLocaleString()}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                    style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                >
                                    {expandedItems[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                <button type="button" onClick={() => removeLineItem(item.id)} className="btn-delete-item" style={{ color: '#fca5a5' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {expandedItems[item.id] && (
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem' }}>
                                    <div onClick={() => document.getElementById(`file-${item.id}`).click()} className="image-upload-dashed" style={{ height: '120px' }}>
                                        {item.image ? (
                                            <img src={`${item.image}`} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                        ) : (
                                            <>
                                                <Upload size={20} />
                                                <span style={{ fontSize: '0.7rem' }}>Photo</span>
                                            </>
                                        )}
                                        <input type="file" id={`file-${item.id}`} hidden onChange={(e) => handleImageUpload(item.id, e.target.files[0])} accept="image/*" />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.75rem' }}>Finish/Brand</label>
                                                <input type="text" className="input-styled" placeholder="e.g., Duco Paint" value={item.finishBrand} onChange={(e) => updateLineItem(item.id, 'finishBrand', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.75rem' }}>Material/Origin</label>
                                                <input type="text" className="input-styled" placeholder="e.g., Plywood" value={item.materialOrigin} onChange={(e) => updateLineItem(item.id, 'materialOrigin', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.75rem' }}>Size</label>
                                                <input type="text" className="input-styled" placeholder="e.g., 8' x 4'" value={item.size} onChange={(e) => updateLineItem(item.id, 'size', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <label style={{ fontSize: '0.75rem' }}>Item Description</label>
                                                <AISuggestButton
                                                    field="itemDescription"
                                                    value={item.name}
                                                    onSuggest={(v) => updateLineItem(item.id, 'description', v)}
                                                />
                                            </div>
                                            <textarea
                                                className="textarea-styled"
                                                placeholder="Detailed specifications..."
                                                value={item.description}
                                                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                                rows="2"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LineItemsSection;
