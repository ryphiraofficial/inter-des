import React from 'react';
import { Package, ArrowUpRight, Trash2 } from 'lucide-react';

const getStatusInfo = (item) => {
    const stock = item.currentStock || 0;
    if (stock <= 0) return { label: 'Out of Stock', class: 'out-of-stock', color: '#ef4444' };
    if (stock <= item.reorderPoint) return { label: 'Low Stock', class: 'low-stock', color: '#eab308' };
    return { label: 'In Stock', class: 'in-stock', color: '#16a34a' };
};

const getStockPercentage = (current, reorder) => {
    const target = reorder * 2;
    const perc = (current / target) * 100;
    return Math.min(perc, 100);
};

const POInventoryCard = ({ item, onViewHistory, onDelete }) => {
    const status = getStatusInfo(item);
    
    return (
        <div className="po-inv-card" style={{ position: 'relative' }}>
            <div className="card-top">
                <div className="item-icon-box">
                    <Package size={24} color="#3b82f6" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`item-badge status-${status.class}`}>
                        {status.label}
                    </span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete && onDelete(); }}
                        style={{
                            background: 'none', border: 'none', color: '#ef4444', 
                            cursor: 'pointer', padding: '4px', borderRadius: '4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Delete Item"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="item-title">
                <span className="item-sku">{item.sku || 'NO-SKU'}</span>
                <h3>{item.itemName}</h3>
                <p>{item.supplier || 'No Supplier'}</p>
            </div>

            <div className="stock-meter-box">
                <div className="meter-label">
                    <span style={{ fontWeight: 700 }}>{item.currentStock} {item.unit}</span>
                    <span style={{ color: '#94a3b8' }}>Min: {item.reorderPoint}</span>
                </div>
                <div className="meter-bar">
                    <div
                        className="meter-fill"
                        style={{
                            width: `${getStockPercentage(item.currentStock, item.reorderPoint)}%`,
                            backgroundColor: status.color
                        }}
                    ></div>
                </div>
            </div>

            <div className="meta-grid">
                <div>
                    <span className="meta-label">Unit Price</span>
                    <span className="meta-value">₹{item.price?.toLocaleString() || 'N/A'}</span>
                </div>
                <div>
                    <span className="meta-label">Last In</span>
                    <span className="meta-value">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Never'}</span>
                </div>
            </div>

            <button className="btn-link-action" onClick={() => onViewHistory(item)}>
                View History <ArrowUpRight size={14} />
            </button>
        </div>
    );
};

export default POInventoryCard;
