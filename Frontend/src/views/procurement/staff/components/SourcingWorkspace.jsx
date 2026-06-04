import React from 'react';
import { Package, ShoppingCart, Trash2, Users, MapPin, Save, Search, Filter, Plus } from 'lucide-react';
import Skeleton from '../../../common/Skeleton';

const SourcingWorkspace = ({ 
    loading, 
    sourcingBucket, 
    handleRemoveFromBucket, 
    dailyUpdate, 
    setDailyUpdate, 
    handleSaveSourcing, 
    sourcingSearch, 
    setSourcingSearch, 
    marketResults, 
    handleAddToBucket 
}) => {
    return (
        <div className="sourcing-workspace">
            {/* Left Side: Project Bucket */}
            <div className="sourcing-bucket-column">
                <div className="column-header">
                    <div className="title-grp">
                        <h4><Package size={18} /> Project Item List</h4>
                        {!loading && <span className="item-count-badge">{sourcingBucket.length} Items</span>}
                    </div>
                </div>
                
                <div className="sourcing-scroll-area">
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                            {[1, 2, 3].map(idx => (
                                <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
                                    <Skeleton width="40%" height="12px" style={{ marginBottom: '16px' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Skeleton width="60px" height="24px" borderRadius="6px" />
                                        <Skeleton width="80px" height="24px" borderRadius="6px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : sourcingBucket.length === 0 ? (
                        <div className="empty-bucket-state">
                            <ShoppingCart size={48} />
                            <p>Your sourcing bucket is empty.<br/>Search and add items from the market.</p>
                        </div>
                    ) : (
                        <div className="bucket-items-list">
                            {sourcingBucket.map((item, idx) => (
                                <div key={idx} className="bucket-item-premium">
                                    <button className="btn-remove-item" onClick={() => handleRemoveFromBucket(idx)}><Trash2 size={16} /></button>
                                    <div className="item-name">{item.itemName}</div>
                                    <div className="item-meta">
                                        <span><Users size={12} /> {item.vendorName}</span>
                                        <span><MapPin size={12} /> {item.vendorLocation}</span>
                                    </div>
                                    <div className="item-price">₹{item.unitPrice} / {item.unit}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="column-footer">
                    <div className="update-form-field">
                        <label>Daily Update to Manager</label>
                        <textarea 
                            value={dailyUpdate}
                            onChange={(e) => setDailyUpdate(e.target.value)}
                            placeholder="Enter progress update for the manager..."
                        />
                    </div>
                    <button 
                        className="btn-save-sourcing"
                        onClick={handleSaveSourcing}
                        disabled={sourcingBucket.length === 0}
                    >
                        <Save size={18} /> Save & Send Update
                    </button>
                </div>
            </div>

            {/* Right Side: Search / Market */}
            <div className="sourcing-market-column">
                <div className="market-search-bar">
                    <div className="search-input-wrap">
                        <Search size={20} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search Items or Vendors..."
                            value={sourcingSearch}
                            onChange={(e) => setSourcingSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-btn-wrap"><Filter size={20} /></div>
                </div>

                <div className="sourcing-scroll-area market-results-list">
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
                            {[1, 2, 3].map(idx => (
                                <div key={idx} className="market-vendor-card" style={{ padding: '1.5rem' }}>
                                    <div className="vendor-card-header" style={{ marginBottom: '1rem' }}>
                                        <div className="vendor-info" style={{ flex: 1 }}>
                                            <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
                                            <Skeleton width="40%" height="12px" />
                                        </div>
                                        <Skeleton width="60px" height="24px" borderRadius="12px" />
                                    </div>
                                    <div className="vendor-products-list">
                                        {[1, 2].map(pIdx => (
                                            <div key={pIdx} className="product-row-premium" style={{ border: 'none', padding: '0.75rem 0' }}>
                                                <div className="product-info" style={{ flex: 1 }}>
                                                    <Skeleton width="70%" height="14px" style={{ marginBottom: '6px' }} />
                                                    <Skeleton width="30%" height="12px" />
                                                </div>
                                                <Skeleton width="32px" height="32px" borderRadius="8px" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : marketResults.map(vendor => (
                        <div key={vendor._id} className="market-vendor-card">
                            <div className="vendor-card-header">
                                <div className="vendor-info">
                                    <h5>{vendor.name}</h5>
                                    <div className="vendor-loc"><MapPin size={12} /> {vendor.location || vendor.address}</div>
                                </div>
                                <span className="vendor-cat-badge">{vendor.category}</span>
                            </div>
                            
                            <div className="vendor-products-list">
                                {vendor.products?.map((p, i) => (
                                    <div key={i} className="product-row-premium">
                                        <div className="product-info">
                                            <div className="p-name">{p.itemName}</div>
                                            <div className="p-price">₹{p.unitPrice} / {p.unit}</div>
                                        </div>
                                        <button 
                                            className="btn-add-to-bucket"
                                            onClick={() => handleAddToBucket(p, vendor)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {!loading && marketResults.length === 0 && (
                        <div className="no-results-state">
                            No matches found for "{sourcingSearch}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SourcingWorkspace;
