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
            {/* Header section with Refresh only (since title is in navbar) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={fetchData} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#fff' }}>
                    <RefreshCw size={15} className={loading ? 'spin-anim' : ''} /> Refresh
                </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Total Pending Value</div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>₹{totalPendingAmount.toLocaleString('en-IN')}</div>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Pending Collections</div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{pendingCollections.length} Tasks</div>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Awaiting Verification</div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{collectedCollections.length} Projects</div>
                    </div>
                </div>
            </div>

            {/* Filter and Content Card */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
                        <RefreshCw className="spin-anim" style={{ color: '#6366f1', marginBottom: '12px' }} size={32} />
                        <div style={{ color: '#64748b', fontWeight: 500 }}>Loading assigned collection tasks...</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', textClassName: 'text-center' }}>
                        <AlertCircle size={44} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>No Collection Tasks Found</h3>
                        <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px', maxWidth: '360px', textAlign: 'center', lineHeight: 1.5 }}>
                            {search ? "No projects match your current search terms." : "You do not have any active payment collection assignments right now."}
                        </p>
                    </div>
                ) : (
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
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
