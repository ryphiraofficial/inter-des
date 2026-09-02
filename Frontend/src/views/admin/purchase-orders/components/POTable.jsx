import React from 'react';
import { FileText, Eye, CheckCircle2, Trash2, ChevronDown } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'ordered': return 'status-ordered';
        case 'received': return 'status-received';
        case 'approved': return 'status-approved';
        case 'pending': return 'status-pending';
        default: return '';
    }
};

const POTable = ({ 
    purchaseOrders, loading, expandedRow, toggleRow, handleMarkReceived, handleDelete, handleViewPO 
}) => {
    if (loading) {
        return (
            <table className="po-table">
                <thead>
                    <tr>
                        <th>PO Number</th><th>Supplier</th>
                        <th className="desktop-hide">Order Date</th>
                        <th className="desktop-hide">Delivery Date</th>
                        <th className="desktop-hide">Items</th>
                        <th className="desktop-hide">Amount</th>
                        <th className="desktop-hide">Status</th>
                        <th className="desktop-hide">Actions</th>
                        <th className="mobile-show">Amount</th><th className="mobile-show"></th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(6)].map((_, i) => (
                        <tr key={i}>
                            <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Skeleton width="18px" height="18px" borderRadius="4px" /><Skeleton width="100px" height="16px" /></div></td>
                            <td><Skeleton width="140px" height="16px" /></td>
                            <td className="desktop-hide"><Skeleton width="80px" height="16px" /></td>
                            <td className="desktop-hide"><Skeleton width="80px" height="16px" /></td>
                            <td className="desktop-hide"><Skeleton width="60px" height="16px" /></td>
                            <td className="desktop-hide"><Skeleton width="90px" height="16px" /></td>
                            <td className="desktop-hide"><Skeleton width="80px" height="24px" borderRadius="12px" /></td>
                            <td className="desktop-hide"><div style={{ display: 'flex', gap: '8px' }}><Skeleton width="32px" height="32px" borderRadius="8px" /><Skeleton width="32px" height="32px" borderRadius="8px" /></div></td>
                            <td className="mobile-show"><Skeleton width="80px" height="16px" /></td>
                            <td className="mobile-show"><Skeleton width="24px" height="24px" borderRadius="50%" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <table className="po-table">
            <thead>
                <tr>
                    <th>PO Number</th><th>Supplier</th>
                    <th className="desktop-hide">Order Date</th>
                    <th className="desktop-hide">Delivery Date</th>
                    <th className="desktop-hide">Items</th>
                    <th className="desktop-hide">Amount</th>
                    <th className="desktop-hide">Status</th>
                    <th className="desktop-hide">Actions</th>
                    <th className="mobile-show">Amount</th><th className="mobile-show"></th>
                </tr>
            </thead>
            <tbody>
                {purchaseOrders.map((po) => (
                    <React.Fragment key={po._id}>
                        <tr 
                            className={`po-row ${expandedRow === po._id ? 'expanded' : ''}`}
                            onClick={() => {
                                if (window.innerWidth <= 768) {
                                    toggleRow(po._id);
                                } else if (handleViewPO) {
                                    handleViewPO(po);
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <td><div className="po-number-cell"><FileText size={18} className="po-icon" />{po.poNumber}</div></td>
                            <td>
                                <div className="supplier-info">
                                    <span className="name">{po.supplier}</span>
                                    <span className="mobile-status-hint mobile-show">
                                        <span className={`status-dot ${getStatusClass(po.status)}`}></span>{po.status}
                                    </span>
                                </div>
                            </td>
                            <td className="desktop-hide date-cell">{new Date(po.orderDate).toLocaleDateString()}</td>
                            <td className="desktop-hide date-cell">{po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString() : 'TBD'}</td>
                            <td className="desktop-hide items-cell">{po.items?.length || 0} items</td>
                            <td className="desktop-hide amount-cell">₹{po.totalAmount?.toLocaleString()}</td>
                            <td className="desktop-hide"><div className={`status-badge ${getStatusClass(po.status)}`}>{po.status}</div></td>
                            <td className="desktop-hide">
                                <div className="action-buttons">
                                    <button className="btn-action" title="View" onClick={(e) => { e.stopPropagation(); handleViewPO && handleViewPO(po); }}><Eye size={18} /></button>
                                    {po.status === 'Ordered' && (
                                        <button className="btn-action done" title="Mark Received" onClick={(e) => { e.stopPropagation(); handleMarkReceived(po._id); }}><CheckCircle2 size={18} /></button>
                                    )}
                                    <button className="btn-action delete" title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(po._id); }}><Trash2 size={18} /></button>
                                </div>
                            </td>
                            <td className="mobile-show amount-cell">₹{po.totalAmount?.toLocaleString()}</td>
                            <td className="mobile-show toggle-cell"><ChevronDown size={18} className={`toggle-icon ${expandedRow === po._id ? 'active' : ''}`} /></td>
                        </tr>
                        {expandedRow === po._id && (
                            <tr className="mobile-expansion-row mobile-show">
                                <td colSpan="4">
                                    <div className="expansion-content">
                                        <div className="info-grid">
                                            <div className="info-item"><label>Order Date</label><span>{new Date(po.orderDate).toLocaleDateString()}</span></div>
                                            <div className="info-item"><label>Delivery Date</label><span>{po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString() : 'TBD'}</span></div>
                                            <div className="info-item"><label>Status</label><span className={`status-badge ${getStatusClass(po.status)}`}>{po.status}</span></div>
                                            <div className="info-item"><label>Items Count</label><span>{po.items?.length || 0} items</span></div>
                                        </div>
                                        <div className="expansion-actions">
                                            <button className="btn-mobile-action primary" onClick={() => handleViewPO && handleViewPO(po)}><Eye size={16} /> View Details</button>
                                            {po.status === 'Ordered' && <button className="btn-mobile-action success" onClick={() => handleMarkReceived(po._id)}><CheckCircle2 size={16} /> Mark Received</button>}
                                            <button className="btn-mobile-action danger" onClick={() => handleDelete(po._id)}><Trash2 size={16} /> Delete PO</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default POTable;
