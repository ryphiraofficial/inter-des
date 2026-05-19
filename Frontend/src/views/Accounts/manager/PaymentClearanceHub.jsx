import React from 'react';
import { usePaymentClearanceLogic } from '../hooks/usePaymentClearanceLogic';
import ClearanceTable from './components/ClearanceTable';

const PaymentClearanceHub = ({ user, search, setSearch }) => {
    const {
        staffList, loading, assigningId, setAssigningId,
        selectedStaff, setSelectedStaff, filtered, handleAssign, handleClear
    } = usePaymentClearanceLogic(search, setSearch);

    return (
        <div className="accounts-manager-hub">
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>

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
