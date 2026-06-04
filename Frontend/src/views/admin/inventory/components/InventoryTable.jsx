import React from 'react';
import { Package, Edit2, Trash2, ChevronDown } from 'lucide-react';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${url.startsWith('/') ? '' : '/'}${url}`;
};

const InventoryTable = ({ 
    items, expandedRow, toggleRow, handleEdit, handleDelete 
}) => {
    if (items.length === 0) {
        return (
            <div className="empty-state-card">
                <Package size={48} className="empty-icon" />
                <h4>Inventory Empty</h4>
                <p>Start adding items to build your catalog</p>
            </div>
        );
    }

    return (
        <div className="inventory-table-card">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th style={{ width: '40%' }}>Item Details</th>
                        <th className="desktop-hide" style={{ width: '15%' }}>Category</th>
                        <th className="desktop-hide" style={{ width: '15%' }}>Stock Level</th>
                        <th className="desktop-hide" style={{ width: '15%' }}>Cost Price</th>
                        <th className="desktop-hide" style={{ width: '15%' }}>Price</th>
                        <th className="desktop-hide" style={{ width: '15%' }}>Actions</th>
                        <th className="mobile-show">Price</th>
                        <th className="mobile-show"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <React.Fragment key={item._id}>
                            <tr 
                                className={`inv-row ${expandedRow === item._id ? 'expanded' : ''}`}
                                onClick={() => window.innerWidth <= 768 && toggleRow(item._id)}
                            >
                                <td>
                                    <div className="item-details-cell">
                                        <div className="item-thumbnail-wrapper">
                                            {item.image ? (
                                                <img src={getImageUrl(item.image)} alt={item.itemName} className="item-list-thumb" />
                                            ) : (
                                                <div className="item-list-thumb-placeholder">
                                                    <Package size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="item-text-info">
                                            <span className="item-name">{item.itemName}</span>
                                            <span className="item-desc desktop-hide">{item.description}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="desktop-hide">
                                    <span className="section-badge">{item.section}</span>
                                </td>
                                <td className="desktop-hide">
                                    <span className={`stock-value ${item.stock <= item.reorderLevel ? 'low' : ''}`}>
                                        {item.stock} {item.unit}
                                    </span>
                                </td>
                                <td className="desktop-hide">
                                    <span className="price-value" style={{ color: '#64748b' }}>₹{(item.costPrice || 0).toLocaleString()}</span>
                                </td>
                                <td className="desktop-hide">
                                    <span className="price-value">₹{item.price.toLocaleString()}</span>
                                </td>
                                <td className="desktop-hide">
                                    <div className="table-actions">
                                        <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                                <td className="mobile-show">
                                    <span className="price-value-mobile">₹{item.price.toLocaleString()}</span>
                                </td>
                                <td className="mobile-show toggle-cell">
                                    <ChevronDown size={18} className={`toggle-icon ${expandedRow === item._id ? 'active' : ''}`} />
                                </td>
                            </tr>
                            {expandedRow === item._id && (
                                <tr className="mobile-expansion-row mobile-only">
                                    <td colSpan="3">
                                        <div className="expansion-content">
                                            <div className="info-grid">
                                                <div className="info-item">
                                                    <label>Category</label>
                                                    <span>{item.section}</span>
                                                </div>
                                                <div className="info-item">
                                                    <label>Stock Level</label>
                                                    <span className={item.stock <= item.reorderLevel ? 'stock-low' : ''}>
                                                        {item.stock} {item.unit}
                                                    </span>
                                                </div>
                                                <div className="info-item">
                                                    <label>Cost Price</label>
                                                    <span style={{ color: '#64748b' }}>₹{(item.costPrice || 0).toLocaleString()}</span>
                                                </div>
                                                <div className="info-item full">
                                                    <label>Description</label>
                                                    <span>{item.description || 'No description provided'}</span>
                                                </div>
                                            </div>
                                            <div className="expansion-actions">
                                                <button className="btn-mobile-action primary" onClick={() => handleEdit(item)}>
                                                    <Edit2 size={16} /> Edit Material
                                                </button>
                                                <button className="btn-mobile-action danger" onClick={() => handleDelete(item._id)}>
                                                    <Trash2 size={16} /> Remove from Inventory
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
