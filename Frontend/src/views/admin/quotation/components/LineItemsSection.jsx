import React from 'react';
import { Layers, Plus, Search, X, Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import AISuggestButton from '../../components/AISuggestButton';
import LineItemCard from './LineItemCard';

const LineItemsSection = ({
    lineItems,
    categoryDiscounts = [],
    updateCategoryDiscount,
    addLineItem,
    removeLineItem,
    updateLineItem,
    batchUpdateLineItem,
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
    handleImageUpload,
    fieldErrors
}) => {
    const groupedItems = React.useMemo(() => {
        const groups = {};
        lineItems.forEach(item => {
            const section = item.section || 'Uncategorized';
            if (!groups[section]) groups[section] = [];
            groups[section].push(item);
        });
        return groups;
    }, [lineItems]);

    return (
        <div className="form-section" id="lineItems-field-group" style={{ marginTop: '1.5rem' }}>
            <div className="section-header-row" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
                <div className="section-header-left">
                    <Layers className="section-icon" size={18} />
                    <h3>Line Items</h3>
                </div>
                <button type="button" onClick={() => addLineItem()} className="btn-add-item">
                    <Plus size={14} /> Add Item
                </button>
            </div>

            {fieldErrors?.lineItems && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.875rem', fontWeight: '500' }}>
                    {fieldErrors.lineItems}
                </div>
            )}

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <div className="global-search-container" style={{
                    background: '#ffffff',
                    padding: '0.4rem 1.25rem',
                    borderRadius: '4px',
                    border: '2px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <Search size={20} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search inventory to quick-add or type a custom item and press Enter..."
                        style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.6rem 0', fontSize: '0.95rem', outline: 'none' }}
                        value={globalSearchQuery}
                        onChange={(e) => handleGlobalSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && globalSearchQuery.trim()) {
                                e.preventDefault();
                                addLineItem('Uncategorized', { name: globalSearchQuery.trim() });
                                handleGlobalSearch(''); // Clear search
                            }
                        }}
                    />
                    {globalSearchQuery && (
                        <X size={18} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setGlobalSearchQuery('')} />
                    )}
                </div>

                {globalSearchQuery.trim() && (
                    <div className="product-search-dropdown" style={{ width: '100%', top: '100%', left: 0 }}>
                        {globalSearchResults.length > 0 && Object.entries(
                            globalSearchResults.reduce((groups, res) => {
                                const section = res.section || 'General';
                                if (!groups[section]) groups[section] = [];
                                groups[section].push(res);
                                return groups;
                            }, {})
                        ).map(([section, items]) => (
                            <div key={section}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', padding: '0.5rem 0.75rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>{section}</div>
                                {items.map(res => (
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
                        ))}
                        
                        <div 
                            className="search-result-item" 
                            style={{ background: '#f0f9ff', borderTop: '1px solid #e0f2fe' }}
                            onClick={() => {
                                addLineItem('Uncategorized', { name: globalSearchQuery.trim() });
                                handleGlobalSearch(''); // Clear search
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 600 }}>
                                <Plus size={16} /> Add "{globalSearchQuery}" as custom item
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="line-item-container">
                {Object.entries(groupedItems).map(([section, items]) => {
                    const categoryDiscount = Array.isArray(categoryDiscounts) 
                        ? categoryDiscounts.find(cd => cd.category === section)
                        : null;

                    const catSubtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
                    let catDiscountAmount = 0;
                    if (categoryDiscount && Number(categoryDiscount.discountValue) > 0) {
                        if (categoryDiscount.discountType === 'amount') {
                            catDiscountAmount = Number(categoryDiscount.discountValue) || 0;
                        } else {
                            catDiscountAmount = (catSubtotal * (Number(categoryDiscount.discountValue) || 0)) / 100;
                        }
                    }
                    const catTotal = Math.max(0, catSubtotal - catDiscountAmount);

                    return (
                        <div key={section} className="category-group-section" style={{
                            background: '#ffffff',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            marginBottom: '2rem',
                            overflow: 'hidden'
                        }}>
                            <div className="category-group-header" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem 1.25rem',
                                background: '#f8fafc',
                                borderBottom: '1.5px solid #cbd5e1',
                                borderLeft: '4px solid #2563eb'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{section}</span>
                                    <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#475569', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                                        {items.length} {items.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Category Discount:</span>
                                    <select
                                        className="select-styled"
                                        style={{ width: 'auto', padding: '0.35rem 0.5rem', fontSize: '0.8rem', outline: 'none' }}
                                        value={categoryDiscount?.discountType || 'percentage'}
                                        onChange={(e) => updateCategoryDiscount(section, 'discountType', e.target.value)}
                                    >
                                        <option value="percentage">%</option>
                                        <option value="amount">Fixed (₹)</option>
                                    </select>
                                    <input
                                        type="number"
                                        className="input-styled"
                                        placeholder="0"
                                        style={{ width: '80px', padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                                        value={categoryDiscount?.discountValue || ''}
                                        onChange={(e) => updateCategoryDiscount(section, 'discountValue', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {items.map(item => {
                                    const globalIndex = lineItems.findIndex(li => li.id === item.id);
                                    return (
                                        <LineItemCard
                                            key={item.id}
                                            item={item}
                                            index={globalIndex}
                                            updateLineItem={updateLineItem}
                                            batchUpdateLineItem={batchUpdateLineItem}
                                            removeLineItem={removeLineItem}
                                            expandedItems={expandedItems}
                                            setExpandedItems={setExpandedItems}
                                            activeSearchId={activeSearchId}
                                            searchResults={searchResults}
                                            handleProductSearch={handleProductSearch}
                                            selectProduct={selectProduct}
                                            handleImageUpload={handleImageUpload}
                                        />
                                    );
                                })}
                                <div style={{ padding: '0.75rem 1.25rem', background: '#fcfcfd', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => addLineItem(section)}
                                        style={{ background: 'transparent', border: '1px dashed #cbd5e1', padding: '6px 16px', borderRadius: '6px', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#475569'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}
                                    >
                                        <Plus size={14} /> Add Item to {section}
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '1.5rem',
                                padding: '1rem 1.25rem',
                                fontSize: '0.875rem',
                                color: '#475569',
                                background: '#f8fafc',
                                borderTop: '1.5px dashed #cbd5e1'
                            }}>
                                <span>Subtotal: <strong style={{ color: '#0f172a' }}>₹{catSubtotal.toLocaleString()}</strong></span>
                                {catDiscountAmount > 0 && (
                                    <span style={{ color: '#ef4444', fontWeight: 600 }}>
                                        Category Discount: <strong>-₹{catDiscountAmount.toLocaleString()}</strong>
                                    </span>
                                )}
                                <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.95rem' }}>
                                    Category Total: <strong>₹{catTotal.toLocaleString()}</strong>
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LineItemsSection;
