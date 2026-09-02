import React from 'react';
import { Layers, Plus, Search, X, Trash2, ChevronUp, ChevronDown, Upload, Folder, Edit2 } from 'lucide-react';
import LineItemCard from './LineItemCard';

const LineItemsSection = ({
    lineItems,
    categoryDiscounts = [],
    updateCategoryDiscount,
    renameCategory,
    deleteCategory,
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
    const [editingCatName, setEditingCatName] = React.useState(null);
    const [tempCatName, setTempCatName] = React.useState('');

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
                        placeholder="Search categories (e.g., Kitchen, Bedroom) or type a new category and press Enter..."
                        style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.6rem 0', fontSize: '0.95rem', outline: 'none' }}
                        value={globalSearchQuery}
                        onChange={(e) => handleGlobalSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && globalSearchQuery.trim()) {
                                e.preventDefault();
                                addLineItem(globalSearchQuery.trim(), { name: '' });
                                handleGlobalSearch(''); // Clear search
                            }
                        }}
                    />
                    {globalSearchQuery && (
                        <X size={18} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setGlobalSearchQuery('')} />
                    )}
                </div>

                {globalSearchQuery.trim() && (
                    <div className="product-search-dropdown" style={{ width: '100%', top: '100%', left: 0, marginTop: '4px', zIndex: 100 }}>
                        {globalSearchResults.map(catName => (
                            <div 
                                key={catName} 
                                className="search-result-item" 
                                onClick={() => {
                                    addLineItem(catName, { name: '' });
                                    handleGlobalSearch('');
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', fontWeight: 600 }}>
                                    <Folder size={18} color="#4f46e5" />
                                    <span>{catName}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#6366f1', background: '#e0e7ff', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                                    + Add Category
                                </span>
                            </div>
                        ))}

                        {!globalSearchResults.includes(globalSearchQuery.trim()) && (
                            <div 
                                className="search-result-item" 
                                style={{ background: '#f0f9ff', borderTop: '1px solid #e0f2fe' }}
                                onClick={() => {
                                    addLineItem(globalSearchQuery.trim(), { name: '' });
                                    handleGlobalSearch(''); // Clear search
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 600 }}>
                                    <Plus size={16} /> Add Category "{globalSearchQuery}"
                                </div>
                            </div>
                        )}
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
                                    {editingCatName === section ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <input 
                                                type="text" 
                                                value={tempCatName} 
                                                onChange={(e) => setTempCatName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        renameCategory && renameCategory(section, tempCatName);
                                                        setEditingCatName(null);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingCatName(null);
                                                    }
                                                }}
                                                autoFocus
                                                style={{ padding: '2px 8px', fontSize: '0.95rem', fontWeight: 700, borderRadius: '4px', border: '1.5px solid #3b82f6', outline: 'none' }}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => { renameCategory && renameCategory(section, tempCatName); setEditingCatName(null); }}
                                                style={{ padding: '3px 8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                Save
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setEditingCatName(null)}
                                                style={{ padding: '3px 8px', background: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{section}</span>
                                            <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#475569', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                                                {items.length} {items.length === 1 ? 'item' : 'items'}
                                            </span>
                                            {section !== 'Uncategorized' && (
                                                <button 
                                                    type="button" 
                                                    title="Rename Category"
                                                    onClick={() => { setEditingCatName(section); setTempCatName(section); }}
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b', display: 'inline-flex', alignItems: 'center' }}
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

                                    <button
                                        type="button"
                                        title="Delete Category"
                                        onClick={() => {
                                            if (window.confirm(`Delete category "${section}" and all its items?`)) {
                                                deleteCategory && deleteCategory(section);
                                            }
                                        }}
                                        style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}
                                    >
                                        <Trash2 size={14} /> Delete Category
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {items.map((item, categoryIndex) => {
                                    return (
                                        <LineItemCard
                                            key={item.id}
                                            item={item}
                                            index={categoryIndex}
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
