import React from 'react';
import { Package, User, UserPlus, DollarSign, CheckCircle } from 'lucide-react';

const ProcurementPipeline = ({ 
    procurementItems, selectedPM, setSelectedPM,
    productionManagers, handleProcurementApprove, approving 
}) => {
    if (procurementItems.length === 0) {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '5rem 2rem', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                <div style={{ width: '80px', height: '80px', background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>All Caught Up!</h3>
                <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>There are no procurement requests currently awaiting your review.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', gap: '2rem' }}>
            {procurementItems.map((item) => {
                const pmAssigned = !!selectedPM[item._id];
                const isApproving = !!approving[item._id];
                
                // Get project payment details
                const project = item.project;
                const advanceAmt = project?.advanceAmount || 0;
                const paidAmt = project?.collectedAmount || 0;
                const payStatus = project?.paymentStatus || 'Pending Advance';
                const collStatus = project?.paymentCollectionStatus || 'Pending Assignment';

                return (
                    <div key={item._id} className="approval-card" style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.3s ease', position: 'relative' }}>
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>{item.requestNumber || item.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                                        <Package size={14} />
                                        <span>{item.project?.name || 'N/A'}</span>
                                    </div>
                                </div>
                                <span style={{ padding: '6px 12px', background: '#fef08a', color: '#a16207', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Pending Admin Review
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                                <User size={14} />
                                <span>Sourced by: {item.assignedTo?.name || item.assignedTo?.fullName || 'Procurement Team'}</span>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#1e293b' }}>Items to Approve:</h4>
                                <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '12px', maxHeight: '120px', overflowY: 'auto' }}>
                                    {item.items && item.items.length > 0 ? (
                                        item.items.map((i, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: idx < item.items.length - 1 ? '1px solid #e2e8f0' : 'none', padding: '0.5rem 0' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#475569' }}>{i.itemName}</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{i.quantity} {i.unit}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Check materials in details.</div>
                                    )}
                                </div>
                            </div>

                            {/* Step 1: Assign Project Manager */}
                            <div style={{ marginBottom: '1.25rem', padding: '1rem', background: pmAssigned ? '#f0fdf4' : '#fffbeb', borderRadius: '14px', border: `1px solid ${pmAssigned ? '#bbf7d0' : '#fde68a'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <UserPlus size={16} color={pmAssigned ? '#16a34a' : '#d97706'} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: pmAssigned ? '#16a34a' : '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {pmAssigned ? '✓ Project Manager Assigned' : 'Step 1: Assign Project Manager'}
                                    </span>
                                </div>
                                <select
                                    value={selectedPM[item._id] || ''}
                                    onChange={(e) => setSelectedPM(prev => ({ ...prev, [item._id]: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', background: 'white', cursor: 'pointer', outline: 'none' }}
                                >
                                    <option value="">Select Project Manager...</option>
                                    {productionManagers.map(pm => (
                                        <option key={pm._id} value={pm._id}>{pm.fullName} ({pm.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Client Payment Status Info Box (No separate action step needed) */}
                            <div style={{ 
                                marginBottom: '1.5rem', 
                                padding: '1rem', 
                                background: payStatus === 'Cleared' ? '#f0fdf4' : (collStatus === 'Collected' ? '#eff6ff' : '#fff5f5'), 
                                borderRadius: '14px', 
                                border: `1px solid ${payStatus === 'Cleared' ? '#bbf7d0' : (collStatus === 'Collected' ? '#bfdbfe' : '#fecaca')}` 
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <DollarSign size={16} color={payStatus === 'Cleared' ? '#16a34a' : (collStatus === 'Collected' ? '#2563eb' : '#dc2626')} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: payStatus === 'Cleared' ? '#16a34a' : (collStatus === 'Collected' ? '#1e40af' : '#991b1b'), textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Client Payment Status
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#64748b' }}>Advance Required:</span>
                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>₹{advanceAmt.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#64748b' }}>Amount Collected:</span>
                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>₹{paidAmt.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1' }}>
                                        <span style={{ color: '#64748b' }}>Status:</span>
                                        {payStatus === 'Cleared' ? (
                                            <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                Cleared
                                            </span>
                                        ) : collStatus === 'Collected' ? (
                                            <span style={{ padding: '2px 8px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                Collected (Awaiting Clearance)
                                            </span>
                                        ) : paidAmt > 0 ? (
                                            <span style={{ padding: '2px 8px', background: '#ffedd5', color: '#c2410c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                Partial Payment
                                            </span>
                                        ) : (
                                            <span style={{ padding: '2px 8px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                Pending Advance
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleProcurementApprove(item)}
                                disabled={isApproving}
                                style={{ padding: '14px', background: pmAssigned ? '#10b981' : '#94a3b8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: isApproving ? 'wait' : 'pointer', transition: 'all 0.2s', width: '100%', opacity: isApproving ? 0.7 : 1 }}
                            >
                                <CheckCircle size={18} /> {isApproving ? 'Approving...' : 'Approve Procurement'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProcurementPipeline;
