import React from 'react';
import { X, CheckCircle2, Package } from 'lucide-react';

const POHistoryModal = ({ showHistoryModal, setShowHistoryModal, selectedItem }) => {
    if (!showHistoryModal || !selectedItem) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '500px' }}>
                <div className="modal-header">
                    <h3>Material History</h3>
                    <button className="modal-close" onClick={() => setShowHistoryModal(false)}><X size={24} /></button>
                </div>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                    <div className="history-summary" style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{selectedItem.itemName}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#64748b' }}>Current Stock: <strong>{selectedItem.currentStock} {selectedItem.unit}</strong></span>
                            <span style={{ color: '#64748b' }}>Last Updated: <strong>{new Date(selectedItem.updatedAt).toLocaleDateString()}</strong></span>
                        </div>
                    </div>

                    <div className="history-timeline">
                        <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Update Activity</h5>
                        <div className="timeline-item" style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
                            <div className="timeline-icon" style={{ color: '#10b981' }}><CheckCircle2 size={18} /></div>
                            <div className="timeline-info">
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>System Verification</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Stock level verified and synced with master inventory.</p>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(selectedItem.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>
                        {selectedItem.purchaseOrder && (
                            <div className="timeline-item" style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
                                <div className="timeline-icon" style={{ color: '#3b82f6' }}><Package size={18} /></div>
                                <div className="timeline-info">
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Received from PO</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Batch received via Purchase Order <strong>#{selectedItem.purchaseOrder.poNumber || 'Unknown'}</strong></p>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(selectedItem.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-footer" style={{ background: '#f8fafc' }}>
                    <button className="btn-cancel" style={{ width: '100%' }} onClick={() => setShowHistoryModal(false)}>Close Activity Log</button>
                </div>
            </div>
        </div>
    );
};

export default POHistoryModal;
