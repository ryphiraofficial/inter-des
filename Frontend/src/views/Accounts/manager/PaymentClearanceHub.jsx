import React from 'react';
import { Search } from 'lucide-react';
import { usePaymentClearanceLogic } from '../hooks/usePaymentClearanceLogic';
import ClearanceTable from './components/ClearanceTable';

const PaymentClearanceHub = ({ user }) => {
    const {
        staffList, loading, search, setSearch, assigningId, setAssigningId,
        selectedStaff, setSelectedStaff, filtered, handleAssign, handleClear
    } = usePaymentClearanceLogic();

    return (
        <div className="accounts-manager-hub">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>Payment Clearance Hub</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b' }}>Manage advance payment collections before releasing projects to Design.</p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', height: '40px', padding: '0 16px 0 36px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} />
                    </div>
                </div>

                <ClearanceTable 
                    loading={loading}
                    filtered={filtered}
                    staffList={staffList}
                    assigningId={assigningId}
                    setAssigningId={setAssigningId}
                    selectedStaff={selectedStaff}
                    setSelectedStaff={setSelectedStaff}
                    handleAssign={handleAssign}
                    handleClear={handleClear}
                />
            </div>
        </div>
    );
};

export default PaymentClearanceHub;
