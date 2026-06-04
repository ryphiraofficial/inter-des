import React from 'react';
import { Layers, Plus, Search, X, Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import AISuggestButton from '../../components/AISuggestButton';
import LineItemCard from './LineItemCard';

const LineItemsSection = ({
    lineItems,
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
    return (
        <div className="form-section" id="lineItems-field-group" style={{ marginTop: '1.5rem' }}>
            <div className="section-header-row" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
                <div className="section-header-left">
                    <Layers className="section-icon" size={18} />
                    <h3>Line Items</h3>
                </div>
                <button type="button" onClick={addLineItem} className="btn-add-item">
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
                        {Object.entries(
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
                    </div>
                )}
            </div>

            <div className="line-item-container">
                {lineItems.map((item, index) => (
                    <LineItemCard
                        key={item.id}
                        item={item}
                        index={index}
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
                ))}
            </div>
        </div>
    );
};

export default LineItemsSection;
