import React from 'react';
import { Target, MapPin, Users, ArrowRight, Package, ShoppingCart, Trash2, Save, Search, Filter, Plus, CheckSquare } from 'lucide-react';
import Skeleton from '../../common/Skeleton';
import '../css/SourcingHub.css';

const SourcingHub = ({ 
    sourcingSearch, 
    setSourcingSearch, 
    selectedSourcingProject, 
    setSelectedSourcingProject, 
    projects, 
    vendors, 
    sourcingBucket, 
    setSourcingBucket, 
    dailyUpdate, 
    setDailyUpdate, 
    savedSourcing, 
    handleSaveSourcing, 
    handleAddToBucket, 
    handleRemoveFromBucket, 
    handleDeleteSaved,
    loading 
}) => {
    const marketResults = vendors.filter(v => 
        v.status === 'Active' && (
            v.name.toLowerCase().includes(sourcingSearch.toLowerCase()) ||
            v.products?.some(p => p.itemName.toLowerCase().includes(sourcingSearch.toLowerCase()))
        )
    );

    return (
        <div className="fade-in sourcing-hub">
            {selectedSourcingProject && (
                <div className="sourcing-header-row" style={{ justifyContent: 'flex-end' }}>
                    <button 
                        onClick={() => setSelectedSourcingProject(null)}
                        className="btn-back-projects"
                    >
                        <ArrowRight size={16} /> Back to Projects
                    </button>
                </div>
            )}

            {!selectedSourcingProject ? (
                <div className="sourcing-projects-grid">
                    {loading ? (
                        [1, 2, 3].map(idx => (
                            <div key={idx} className="sourcing-project-card project-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className="card-header-row">
                                    <div className="title-grp" style={{ width: '70%' }}>
                                        <Skeleton width="80%" height="18px" style={{ marginBottom: '8px' }} />
                                        <Skeleton width="50%" height="12px" />
                                    </div>
                                    <Skeleton width="40px" height="40px" borderRadius="12px" />
                                </div>
                                <div className="project-details-mini" style={{ flex: 1, marginTop: '20px' }}>
                                    <Skeleton width="60%" height="12px" style={{ marginBottom: '8px' }} />
                                    <Skeleton width="75%" height="12px" />
                                </div>
                                <div className="card-footer-action" style={{ justifyContent: 'flex-start' }}>
                                    <Skeleton width="120px" height="14px" />
                                </div>
                            </div>
                        ))
                    ) : projects.length === 0 ? (
                        <div className="sourcing-empty-state">
                            <Target size={48} />
                            <h4>No Procurement Projects</h4>
                            <p>There are currently no active projects in the procurement stage.</p>
                        </div>
                    ) : (
                        projects.map(project => (
                            <div 
                                key={project._id} 
                                onClick={() => setSelectedSourcingProject(project)}
                                className="sourcing-project-card project-card-hover"
                            >
                                <div className="card-header-row">
                                    <div className="title-grp">
                                        <h4>{project.name}</h4>
                                        <span className="project-id">{project.projectNumber}</span>
                                    </div>
                                    <div className="icon-badge">
                                        <Target size={20} />
                                    </div>
                                </div>
                                
                                <div className="project-details-mini">
                                    <div className="detail-item">
                                        <MapPin size={14} /> {project.location || 'Location not specified'}
                                    </div>
                                    <div className="detail-item">
                                        <Users size={14} /> Client: {project.client?.name || 'N/A'}
                                    </div>
                                </div>

                                <div className="card-footer-action">
                                    <span>Start Sourcing</span>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
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
            )}

            {/* Saved Section */}
            <div className="saved-drafts-section">
                <div className="section-title-row">
                    <div className="icon-box"><CheckSquare size={20} /></div>
                    <h4>Saved Sourcing Drafts</h4>
                </div>
                <div className="saved-sourcing-grid">
                    {savedSourcing.map(draft => (
                        <div key={draft.id} className="saved-sourcing-card">
                            <div className="card-header">
                                <div className="project-info">
                                    <h5>{draft.project?.name}</h5>
                                    <span className="save-date">Saved: {new Date(draft.savedAt).toLocaleDateString()}</span>
                                </div>
                                <button className="btn-delete-draft" onClick={() => handleDeleteSaved(draft.id)}><Trash2 size={16} /></button>
                            </div>
                            <div className="draft-items-preview">
                                {draft.items.slice(0, 2).map((item, i) => (
                                    <div key={i} className="preview-item">
                                        <span>{item.itemName}</span>
                                        <span className="price">₹{item.unitPrice}</span>
                                    </div>
                                ))}
                                {draft.items.length > 2 && <span className="more-count">+{draft.items.length - 2} more items</span>}
                            </div>
                            <div className="draft-update-preview">
                                "{draft.dailyUpdate || 'No update provided'}"
                            </div>
                            <button 
                                className="btn-edit-continue"
                                onClick={() => {
                                    setSelectedSourcingProject(draft.project);
                                    setSourcingBucket(draft.items);
                                    setDailyUpdate(draft.dailyUpdate);
                                    handleDeleteSaved(draft.id);
                                }}
                            >
                                Edit & Continue
                            </button>
                        </div>
                    ))}
                    {savedSourcing.length === 0 && (
                        <div className="no-drafts-state">
                            No saved sourcing lists yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SourcingHub;
