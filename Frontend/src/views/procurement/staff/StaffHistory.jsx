import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Search, Filter, Package } from 'lucide-react';
import Skeleton from '../../common/Skeleton';
import '../css/ProcurementPremium.css';

const StaffHistory = ({ 
    searchQuery, 
    setSearchQuery, 
    handleSearch, 
    vendorStats, 
    formatCurrency, 
    handleComparePrices, 
    itemsToBuy,
    loading 
}) => {
    const [portalContainer, setPortalContainer] = useState(null);

    useEffect(() => {
        const container = document.getElementById('procurement-navbar-actions');
        if (container) {
            setPortalContainer(container);
        }
    }, []);

    const searchInputEl = (
        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '100px', padding: '6px 12px', width: '280px', border: '1px solid #e2e8f0', transition: 'all 0.3s' }}>
            <Search size={16} color="#94a3b8" />
            <input
                type="text"
                placeholder="Search historical products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', marginLeft: '8px', color: '#1c1917' }}
            />
        </div>
    );

    return (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: 0 }}>
            {portalContainer && ReactDOM.createPortal(searchInputEl, portalContainer)}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button 
                    className="btn-approve"
                    style={{ background: '#ffffff', color: '#4f46e5', border: '1px solid #e0e7ff', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', cursor: itemsToBuy?.length === 0 ? 'not-allowed' : 'pointer', opacity: itemsToBuy?.length === 0 ? 0.6 : 1 }}
                    onClick={handleComparePrices}
                    disabled={itemsToBuy?.length === 0}
                >
                    <Filter size={16} /> Compare Market Prices
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="assigned-item-premium" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="item-header" style={{ marginBottom: '1rem' }}>
                                <div className="title-group" style={{ width: '60%' }}>
                                    <Skeleton width="80%" height="20px" style={{ marginBottom: '6px' }} />
                                    <Skeleton width="50%" height="14px" />
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: '#fafaf9', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Skeleton width="40px" height="10px" />
                                    <Skeleton width="30px" height="20px" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Skeleton width="40px" height="10px" />
                                    <Skeleton width="60px" height="20px" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Skeleton width="40px" height="10px" />
                                    <Skeleton width="50px" height="20px" />
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <Skeleton width="120px" height="12px" style={{ marginBottom: '12px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[1, 2, 3].map(itemIdx => (
                                        <div key={itemIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <Skeleton width="40%" height="14px" />
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <Skeleton width="20px" height="12px" />
                                                <Skeleton width="50px" height="14px" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : vendorStats && vendorStats.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {vendorStats.map(v => (
                        <div key={v.vendor?._id || Math.random()} className="assigned-item-premium" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="item-header" style={{ marginBottom: '1rem' }}>
                                <div className="title-group">
                                    <span className="req-number" style={{ fontSize: '1.15rem' }}>{v.vendor?.name || 'Unknown Vendor'}</span>
                                    <span className="proj-name">Code: {v.vendor?.vendorCode || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: '#fafaf9', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Orders</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1c1917' }}>{v.totalPurchases}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Spent</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1c1917' }}>{formatCurrency(v.totalAmount)}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saved</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{formatCurrency(v.totalDiscount)}</span>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.75rem' }}>Commonly Purchased</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {v.items && Object.entries(v.items).slice(0, 3).map(([itemName, data]) => (
                                        <div key={itemName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#44403c', fontWeight: 500 }}>{itemName}</span>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>x{data.quantity}</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1c1917' }}>{formatCurrency(data.totalAmount)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px dashed #e7e5e4' }}>
                    <div style={{ width: '64px', height: '64px', background: '#fafaf9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#d6d3d1' }}>
                        <Package size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1c1917', marginBottom: '0.5rem' }}>No Purchase History</h3>
                    <p style={{ color: '#78716c', margin: 0, fontSize: '0.95rem' }}>We couldn't find any completed purchase records yet.</p>
                </div>
            )}
        </div>
    );
};

export default StaffHistory;
