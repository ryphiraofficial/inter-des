import React from 'react';
import { Package, User, UserPlus, DollarSign, Send, BadgeCheck, CheckCircle } from 'lucide-react';

const ProcurementPipeline = ({ 
    procurementItems, selectedPM, setSelectedPM, sentToAccounts, setSentToAccounts, 
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

    const handleSendToAccounts = (itemId) => {
        setSentToAccounts(prev => ({ ...prev, [itemId]: true }));
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', gap: '2rem' }}>
            {procurementItems.map((item) => {
                const pmAssigned = !!selectedPM[item._id];
                const accountsSent = !!sentToAccounts[item._id];
                const isApproving = !!approving[item._id];
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

                            <div style={{ marginBottom: '1rem', padding: '1rem', background: pmAssigned ? '#f0fdf4' : '#fffbeb', borderRadius: '14px', border: `1px solid ${pmAssigned ? '#bbf7d0' : '#fde68a'}` }}>
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

                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: accountsSent ? '#f0fdf4' : '#eff6ff', borderRadius: '14px', border: `1px solid ${accountsSent ? '#bbf7d0' : '#bfdbfe'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <DollarSign size={16} color={accountsSent ? '#16a34a' : '#2563eb'} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: accountsSent ? '#16a34a' : '#1e40af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {accountsSent ? '✓ Quotation Marked for Accounts' : 'Step 2: Send Quotation to Accounts'}
                                    </span>
                                </div>
                                {!accountsSent ? (
                                    <button
                                        onClick={() => handleSendToAccounts(item._id)}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                    >
                                        <Send size={16} /> Send Quotation to Accounts for Collection
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#dcfce7', borderRadius: '10px', color: '#166534', fontWeight: 600, fontSize: '0.85rem' }}>
                                        <BadgeCheck size={16} /> Will be sent to accounts on approval
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => handleProcurementApprove(item)}
                                disabled={isApproving}
                                style={{ padding: '14px', background: (pmAssigned && accountsSent) ? '#10b981' : '#94a3b8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: isApproving ? 'wait' : 'pointer', transition: 'all 0.2s', width: '100%', opacity: isApproving ? 0.7 : 1 }}
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
