import React from 'react';
import { usePaymentLogic } from '../hooks/usePaymentLogic';

// Sub-components
import PaymentTable from './components/payments/PaymentTable';
import PaymentModal from './components/payments/PaymentModal';

const ManagerPayments = ({ user, search, setSearch }) => {
    const {
        clients, loading, showModal, setShowModal,
        submitting, form, setForm, filtered, handleSubmit, handleDelete
    } = usePaymentLogic(search, setSearch);

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Table */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <PaymentTable 
                        loading={loading}
                        filtered={filtered}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Modal */}
                <PaymentModal 
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    form={form}
                    setForm={setForm}
                    clients={clients}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default ManagerPayments;
