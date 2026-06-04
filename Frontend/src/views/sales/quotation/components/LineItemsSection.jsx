import React from 'react';
import { Layers, Plus, Search, Package } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import LineItemCard from './LineItemCard';

const LineItemsSection = ({
    lineItems, addLineItem, removeLineItem, updateLineItem, batchUpdateLineItem,
    expandedItems, setExpandedItems, globalSearchQuery, setGlobalSearchQuery,
    globalSearchResults, handleGlobalSearch, addFromInventorySelect,
    activeSearchId, searchResults, handleProductSearch, selectProduct,
    handleImageUpload, fieldErrors
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
                <div style={{
                    background: '#ffffff',
                    padding: '0.4rem 1.25rem',
                    borderRadius: '4px',
                    border: '2px solid #cbd5e1',
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
                        {Object.entries(
                            globalSearchResults.reduce((groups, p) => {
                                const section = p.section || 'General';
                                if (!groups[section]) groups[section] = [];
                                groups[section].push(p);
                                return groups;
                            }, {})
                        ).map(([section, items]) => (
                            <div key={section}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', padding: '0.5rem 0.75rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>{section}</div>
                                {items.map(p => (
                                    <div key={p._id} className="search-result-item" onClick={() => addFromInventorySelect(p)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="res-icon" style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <Package size={18} color="#94a3b8" />}
                                            </div>
                                            <div className="res-info">
                                                <span className="res-name">{p.itemName}</span>
                                                <span className="res-cat">{p.section} • {p.unit}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="res-price">₹{p.price?.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Click to Add</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="line-items-grid">
                {lineItems.map((item, index) => (
                        <LineItemCard
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
