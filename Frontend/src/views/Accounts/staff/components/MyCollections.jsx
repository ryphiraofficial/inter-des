import React from 'react';
import { Wallet, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { useMyCollections } from '../hooks/useMyCollections';
import CollectionProjectCard from './collections/CollectionProjectCard';
import RecordPaymentModal from './collections/RecordPaymentModal';

const MyCollections = ({ search: parentSearch, setSearch: parentSetSearch }) => {
    const {
        search,
        loading,
        fetchData,
        collectingProject,
        setCollectingProject,
        formData,
        setFormData,
        submitting,
        handleOpenCollect,
        handleSubmitCollection,
        pendingCollections,
        collectedCollections,
        totalPendingAmount,
        filtered
    } = useMyCollections(parentSearch, parentSetSearch);

    return (
        <div style={{ padding: '0 8px' }}>
            <style>
                {`
                .collection-card {
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
                }
                .collection-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
                    border-color: #cbd5e1;
                }
                .collect-btn {
                    width: 100%;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: #0f172a;
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                .collect-btn:hover {
                    background: #1e293b;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 20px -6px rgba(15, 23, 42, 0.3);
                }
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06) !important;
                }
                `}
            </style>

            {/* Premium Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9', transition: 'all 0.3s ease' }} className="stat-card">
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)' }}>
                        <Wallet size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Pending Value</div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '4px', letterSpacing: '-0.02em' }}>₹{totalPendingAmount.toLocaleString('en-IN')}</div>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9', transition: 'all 0.3s ease' }} className="stat-card">
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)' }}>
                        <Clock size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Collections</div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '4px', letterSpacing: '-0.02em' }}>{pendingCollections.length} <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 600 }}>Tasks</span></div>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9', transition: 'all 0.3s ease' }} className="stat-card">
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)' }}>
                        <CheckCircle size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting Verification</div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '4px', letterSpacing: '-0.02em' }}>{collectedCollections.length} <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 600 }}>Projects</span></div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
                        <RefreshCw className="spin-anim" style={{ color: '#6366f1', marginBottom: '12px' }} size={32} />
                        <div style={{ color: '#64748b', fontWeight: 500 }}>Loading assigned collection tasks...</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', textAlign: 'center' }}>
                        <AlertCircle size={44} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1e293b', textAlign: 'center' }}>No Collection Tasks Found</h3>
                        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6 }}>
                            {search ? "No projects match your current search terms." : "You do not have any active payment collection assignments right now."}
                        </p>
                    </div>
                ) : (
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
                        {filtered.map(p => (
                            <CollectionProjectCard 
                                key={p._id} 
                                p={p} 
                                handleOpenCollect={handleOpenCollect} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Collection Input Wizard Modal */}
            <RecordPaymentModal 
                collectingProject={collectingProject}
                setCollectingProject={setCollectingProject}
                formData={formData}
                setFormData={setFormData}
                submitting={submitting}
                handleSubmitCollection={handleSubmitCollection}
            />
        </div>
    );
};

export default MyCollections;
