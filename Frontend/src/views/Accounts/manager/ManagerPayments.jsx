import React from 'react';
import { Search } from 'lucide-react';
import { usePaymentLogic } from '../hooks/usePaymentLogic';

// Sub-components
import PaymentTable from './components/payments/PaymentTable';
import PaymentModal from './components/payments/PaymentModal';

const ManagerPayments = ({ user }) => {
    const {
        clients, loading, search, setSearch, showModal, setShowModal,
        submitting, form, setForm, filtered, handleSubmit, handleDelete
    } = usePaymentLogic();

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" placeholder="Search by client or reference..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', height: '45px', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }} />
                </div>

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
