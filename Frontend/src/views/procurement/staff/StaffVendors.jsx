import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Users, Search, MapPin, Phone, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../../common/Skeleton';
import '../css/ProcurementPremium.css';

const StaffVendors = ({ 
    vendors, 
    vendorSearch, 
    setVendorSearch, 
    setSelectedVendor, 
    fetchPurchaseHistory, 
    vendorPurchaseCounts,
    loading
}) => {
    const navigate = useNavigate();
    const searchLower = vendorSearch.toLowerCase();
    
    const filteredVendors = vendors.filter(v =>
        v.status === 'Active' &&
        (vendorSearch === '' ||
            v.name?.toLowerCase().includes(searchLower) ||
            v.category?.toLowerCase().includes(searchLower) ||
            v.phone?.includes(searchLower) ||
            v.address?.toLowerCase().includes(searchLower) ||
            v.location?.toLowerCase().includes(searchLower) ||
            v.products?.some(p => p.itemName?.toLowerCase().includes(searchLower)))
    );

    const [portalContainer, setPortalContainer] = useState(null);

    React.useEffect(() => {
        const container = document.getElementById('procurement-navbar-actions');
        if (container) {
            setPortalContainer(container);
        }
    }, []);

    const searchInputEl = (
        <div style={{ background: '#f1f5f9', borderRadius: '50px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '10px', width: '260px' }}>
            <Search size={15} color="#94a3b8" />
            <input
                type="text"
                placeholder="Search vendors..."
                value={vendorSearch}
                onChange={e => setVendorSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', width: '100%' }}
            />
        </div>
    );

    return (
        <div className="fade-in">
            {portalContainer && ReactDOM.createPortal(searchInputEl, portalContainer)}
            <div className="section-card">
                {loading ? (
                    <div className="vendors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                        {[1, 2, 3, 4, 5, 6].map(idx => (
                            <div key={idx} style={{ background: '#ffffff', border: '1px solid #f5f5f4', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                                    <Skeleton width="44px" height="44px" borderRadius="50%" />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                        <Skeleton width="80%" height="16px" />
                                        <Skeleton width="50%" height="12px" />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                                    <Skeleton width="90%" height="12px" />
                                    <Skeleton width="75%" height="12px" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #fafaf9' }}>
                                    <Skeleton width="70px" height="20px" borderRadius="20px" />
                                    <Skeleton width="90px" height="30px" borderRadius="8px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredVendors.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        {vendorSearch ? `No vendors matching "${vendorSearch}"` : 'No active vendors found.'}
                    </div>
                ) : (
                    <div className="vendors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                        {filteredVendors.map(vendor => (
                            <div
                                key={vendor._id}
                                className="assigned-item-premium"
                                onClick={() => {
                                    setSelectedVendor(vendor);
                                    fetchPurchaseHistory(vendor._id);
                                    navigate('?tab=history');
                                }}
                            >
                                <div className="item-header">
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div className="item-icon-box" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                                            <Users size={20} strokeWidth={2.5} />
                                        </div>
                                        <div className="title-group">
                                            <h4 className="req-number" style={{ fontSize: '1.1rem' }}>{vendor.name}</h4>
                                            <span className="proj-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={12} />
                                                {vendor.category || vendor.address || 'General Supplier'}
                                            </span>
                                        </div>
                                    </div>
                                    <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                                </div>
                                
                                {vendor.products?.length > 0 && (
                                    <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {vendor.products.slice(0, 3).map((p, i) => (
                                            <span key={i} style={{ 
                                                background: '#f8fafc', 
                                                color: '#475569', 
                                                fontSize: '0.75rem', 
                                                padding: '4px 10px', 
                                                borderRadius: '6px',
                                                border: '1px solid #e2e8f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <ShoppingBag size={12} color="#94a3b8" />
                                                <span>{p.itemName} <strong style={{ color: '#0f172a', fontWeight: 700 }}>₹{p.unitPrice}</strong>/{p.unit}</span>
                                            </span>
                                        ))}
                                        {vendor.products.length > 3 && (
                                            <span style={{ fontSize: '0.75rem', color: '#64748b', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
                                                +{vendor.products.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}
                                
                                <div className="item-footer" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifySelf: 'flex-end', width: '100%' }}>
                                    <div className="staff-info">
                                        <div className="staff-avatar" style={{ background: '#f0fdfa', color: '#0d9488', borderColor: '#ccfbf1' }}>
                                            <Phone size={14} />
                                        </div>
                                        <span className="staff-details" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{vendor.phone}</span>
                                    </div>
                                    <span style={{ 
                                        background: 'linear-gradient(to right, #eef2ff, #ffffff)', 
                                        color: '#4f46e5', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 700, 
                                        padding: '4px 12px', 
                                        borderRadius: '50px',
                                        border: '1px solid #e0e7ff',
                                        boxShadow: '0 2px 4px rgba(79, 70, 229, 0.05)'
                                    }}>
                                        {vendorPurchaseCounts[vendor._id]?.totalPurchases || 0} Deals
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffVendors;
