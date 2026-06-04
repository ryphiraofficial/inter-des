import React from 'react';
import { User, Phone, CheckCircle, Clock, AlertCircle, CreditCard, ArrowRight } from 'lucide-react';

const CollectionProjectCard = ({ p, handleOpenCollect }) => {
    const isCollected = p.paymentCollectionStatus === 'Collected';
    const isBal = p.paymentStatus !== 'Pending Advance';
    const targetAmount = isBal ? (p.budget - (p.advanceAmount || p.collectedAmount || 0)) : (p.advanceAmount || 0);
    
    return (
        <div style={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            background: '#fff',
            display: 'flex', 
            flexDirection: 'column',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
            {/* Top status bar */}
            <div style={{ 
                padding: '12px 18px', 
                borderBottom: '1px solid #f1f5f9', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: isCollected ? '#f0fdf4' : '#fef3c7',
                borderTopLeftRadius: '11px',
                borderTopRightRadius: '11px'
            }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                    {p.projectNumber || 'PROJ'}
                </span>
                <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: isCollected ? '#166534' : '#92400e',
                }}>
                    {isCollected ? (
                        <>
                            <CheckCircle size={12} /> Collected
                        </>
                    ) : (
                        <>
                            <Clock size={12} /> Pending Collection
                        </>
                    )}
                </span>
            </div>

            {/* Details Area */}
            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{p.name}</h4>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                        Total Budget: ₹{p.budget?.toLocaleString('en-IN')}
                    </span>
                </div>

                {/* Client Info Widget */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>CLIENT DETAILS</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <User size={13} style={{ color: '#64748b' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{p.client?.name || 'Client'}</span>
                    </div>
                    {p.client?.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone size={13} style={{ color: '#64748b' }} />
                            <span style={{ fontSize: '13px', color: '#64748b' }}>{p.client.phone}</span>
                        </div>
                    )}
                </div>

                {/* Target Amount */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px dashed #e2e8f0' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{isBal ? 'Balance Due:' : 'Advance Due (50%):'}</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#6366f1' }}>₹{targetAmount.toLocaleString('en-IN')}</span>
                </div>
            </div>

            {/* Action footer */}
            <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', borderBottomLeftRadius: '11px', borderBottomRightRadius: '11px' }}>
                {isCollected ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '13px', fontWeight: 600, padding: '8px 0', justifyContent: 'center' }}>
                        <AlertCircle size={15} /> Awaiting Manager Verification
                    </div>
                ) : (
                    <button 
                        onClick={() => handleOpenCollect(p)}
                        style={{ 
                            width: '100%', 
                            height: '40px',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '8px',
                            background: '#6366f1',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#4f46e5'}
                        onMouseOut={e => e.currentTarget.style.background = '#6366f1'}
                    >
                        <CreditCard size={15} /> Collect Payment <ArrowRight size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CollectionProjectCard;
