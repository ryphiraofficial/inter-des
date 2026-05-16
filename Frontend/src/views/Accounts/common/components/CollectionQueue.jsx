import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const CollectionQueue = ({ 
    pendingCollections, 
    accountsStaff, 
    selectedStaff, 
    setSelectedStaff, 
    assigningStaff, 
    handleAssignStaff,
    collectedAmounts,
    setCollectedAmounts,
    handleVerifyPayment,
    verifyingPayment
}) => {
    if (pendingCollections.length === 0) return null;

    return (
        <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={15} /> {pendingCollections.length} Pending Collection{pendingCollections.length > 1 ? 's' : ''}
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Payment Collection Queue</h3>
                </div>
            </div>

            <div className="collection-queue-grid">
                {pendingCollections.map(proj => {
                    const isAssigned = proj.paymentCollectionStatus === 'Assigned';
                    return (
                        <div key={proj._id} className="collection-card">
                            <div className="collection-card-header">
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800 }}>{proj.name}</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{proj.client?.name || 'Unknown Client'}</p>
                                </div>
                                <span className={`status-badge ${isAssigned ? 'success' : 'warning'}`}>
                                    {proj.paymentCollectionStatus || 'Pending'}
                                </span>
                            </div>

                            <div className="collection-card-info">
                                <div className="info-item">
                                    <p className="info-label">Advance to Collect</p>
                                    <p className="info-value success">₹{(proj.advanceAmount || 0).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="info-item">
                                    <p className="info-label">Assigned To</p>
                                    <p className="info-value">{proj.assignedAccountsStaff?.fullName || '—'}</p>
                                </div>
                            </div>

                            {!isAssigned ? (
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select 
                                            value={selectedStaff[proj._id] || ''} 
                                            onChange={e => setSelectedStaff(prev => ({ ...prev, [proj._id]: e.target.value }))}
                                            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        >
                                            <option value=''>Select staff...</option>
                                            {accountsStaff.map(s => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                                        </select>
                                        <button onClick={() => handleAssignStaff(proj._id)} className="btn-primary-sm">
                                            {assigningStaff[proj._id] ? '...' : 'Assign'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                                    <input 
                                        type='number' placeholder="Amount"
                                        value={collectedAmounts[proj._id] || ''}
                                        onChange={e => setCollectedAmounts(prev => ({ ...prev, [proj._id]: e.target.value }))}
                                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                                    />
                                    <button onClick={() => handleVerifyPayment(proj._id)} className="btn-success-sm">
                                        {verifyingPayment[proj._id] ? '...' : 'Verify'}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CollectionQueue;
