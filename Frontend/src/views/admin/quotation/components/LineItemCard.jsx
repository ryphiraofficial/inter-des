import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Upload } from 'lucide-react';
import AISuggestButton from '../../components/AISuggestButton';

const LineItemCard = ({
    item,
    index,
    updateLineItem,
    removeLineItem,
    expandedItems,
    setExpandedItems,
    activeSearchId,
    searchResults,
    handleProductSearch,
    selectProduct,
    handleImageUpload
}) => {
    return (
        <div className="line-item-card" style={{ padding: '0.75rem 1rem' }}>
            <div className="line-item-main-grid">
                <span className="line-item-number">#{index + 1}</span>
                <div style={{ position: 'relative' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Item</span>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Qty</span>
                    <input
                        type="number"
                        className="input-styled"
                        style={{ padding: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Rate</span>
                    <input
                        type="number"
                        className="input-styled"
                        style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="line-item-amount" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span>₹{item.amount?.toLocaleString()}</span>
                    <div style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        Profit: ₹{(item.amount - ((Number(item.quantity) || 0) * (Number(item.costPrice) || 0))).toLocaleString()}
                    </div>
                </div>
                <div className="line-item-actions">
                    <button
                        type="button"
                        onClick={() => setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        style={{ border: 'none', background: '#4f5d6eff', color: '#fafbfdff', cursor: 'pointer' }}
                    >
                        {expandedItems[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <button type="button" onClick={() => removeLineItem(item.id)} className="btn-delete-item" style={{ color: '#d92626ff' }}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {['sqft', 'sft', 'sq.ft'].includes(item.unit?.toLowerCase().replace(/\s/g, '')) && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <div className="line-item-detail-grid">
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.75rem' }}>Dimensions (cm)</label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input type="number" className="input-styled" placeholder="L" style={{ padding: '0.4rem', fontSize: '0.85rem', width: '65px' }} value={item.cmL ?? ''} onChange={(e) => {
                                    const v = e.target.value ? parseFloat(e.target.value) : null;
                                    updateLineItem(item.id, 'cmL', v);
                                    if (v && (item.cmH || 0) > 0) {
                                        const sqft = (v * (item.cmH || 0)) / 900;
                                        updateLineItem(item.id, 'quantity', Math.round(sqft * 100) / 100);
                                        updateLineItem(item.id, 'size', Math.round(sqft * 100) / 100 + ' SFT');
                                    } else if (!v || !item.cmH) {
                                        updateLineItem(item.id, 'quantity', 1);
                                        updateLineItem(item.id, 'size', '');
                                    }
                                }} />
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>×</span>
                                <input type="number" className="input-styled" placeholder="D" style={{ padding: '0.4rem', fontSize: '0.85rem', width: '65px' }} value={item.cmD ?? ''} onChange={(e) => {
                                    const v = e.target.value ? parseFloat(e.target.value) : null;
                                    updateLineItem(item.id, 'cmD', v);
                                }} />
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>×</span>
                                <input type="number" className="input-styled" placeholder="H" style={{ padding: '0.4rem', fontSize: '0.85rem', width: '65px' }} value={item.cmH ?? ''} onChange={(e) => {
                                    const v = e.target.value ? parseFloat(e.target.value) : null;
                                    updateLineItem(item.id, 'cmH', v);
                                    if (v && (item.cmL || 0) > 0) {
                                        const sqft = ((item.cmL || 0) * v) / 900;
                                        updateLineItem(item.id, 'quantity', Math.round(sqft * 100) / 100);
                                        updateLineItem(item.id, 'size', Math.round(sqft * 100) / 100 + ' SFT');
                                    } else if (!v || !item.cmL) {
                                        updateLineItem(item.id, 'quantity', 1);
                                        updateLineItem(item.id, 'size', '');
                                    }
                                }} />
                                <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 0.75rem', minWidth: '90px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                                    {item.size || '— SFT'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {expandedItems[item.id] && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <div className="line-item-expanded-grid">
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
                            <div className="line-item-detail-grid">
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Cost Price (Purchase)</span>
                                        <span style={{ color: '#166534', fontWeight: 600 }}>ADMIN ONLY</span>
                                    </label>
                                    <input type="number" className="input-styled" style={{ border: '1px solid #bbf7d0', background: '#f0fdf4' }} placeholder="Cost per unit" value={item.costPrice || ''} onChange={(e) => updateLineItem(item.id, 'costPrice', parseFloat(e.target.value) || 0)} />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem' }}>Finish/Brand</label>
                                    <input type="text" className="input-styled" placeholder="e.g., Duco Paint" value={item.finishBrand} onChange={(e) => updateLineItem(item.id, 'finishBrand', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem' }}>Material/Origin</label>
                                    <input type="text" className="input-styled" placeholder="e.g., Plywood" value={item.materialOrigin} onChange={(e) => updateLineItem(item.id, 'materialOrigin', e.target.value)} />
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
    );
};

export default LineItemCard;
