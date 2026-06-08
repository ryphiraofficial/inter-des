import React from 'react';
import { User, Phone, CheckCircle, Clock, AlertCircle, CreditCard, ArrowRight } from 'lucide-react';

const CollectionProjectCard = ({ p, handleOpenCollect }) => {
    const isCollected = p.paymentCollectionStatus === 'Collected';
    const isBal = p.paymentStatus !== 'Pending Advance';
    const targetAmount = isBal ? (p.budget - (p.advanceAmount || p.collectedAmount || 0)) : (p.advanceAmount || 0);
    
    return (
        <div className="collection-card">
            {/* Top status bar */}
            <div style={{ 
                padding: '14px 20px', 
                borderBottom: '1px solid #f1f5f9', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: isCollected ? '#f0fdf4' : '#f8fafc',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
            }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.05em' }}>
                    {p.projectNumber || 'PROJ'}
                </span>
                <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: isCollected ? '#166534' : '#ea580c',
                    background: isCollected ? '#dcfce7' : '#ffedd5',
                    padding: '4px 10px',
                    borderRadius: '20px'
                }}>
                    {isCollected ? (
                        <>
                            <CheckCircle size={14} /> Collected
                        </>
                    ) : (
                        <>
                            <Clock size={14} /> Pending
                        </>
                    )}
                </span>
            </div>

            {/* Details Area */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{p.name}</h4>
                    <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '4px', fontWeight: 500 }}>
                        Total Budget: ₹{p.budget?.toLocaleString('en-IN')}
                    </span>
                </div>

                {/* Client Info Widget */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Client Details</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <User size={14} style={{ color: '#64748b' }} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{p.client?.name || 'Client'}</span>
                    </div>
                    {p.client?.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone size={14} style={{ color: '#64748b' }} />
                            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{p.client.phone}</span>
                        </div>
                    )}
                </div>

                {/* Target Amount */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{isBal ? 'Balance Due:' : 'Advance Due:'}</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>₹{targetAmount.toLocaleString('en-IN')}</span>
                </div>
            </div>

            {/* Action footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', background: '#fff', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                {isCollected ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '14px', fontWeight: 600, padding: '10px 0', justifyContent: 'center' }}>
                        <CheckCircle size={18} /> Verified by Manager
                    </div>
                ) : (
                    <button 
                        onClick={() => handleOpenCollect(p)}
                        className="collect-btn"
                    >
                        <CreditCard size={16} /> Record Payment
                    </button>
                )}
            </div>
        </div>
    );
};

export default CollectionProjectCard;
