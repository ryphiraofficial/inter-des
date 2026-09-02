import React, { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { useVendorLogic } from '../hooks/useVendorLogic';

// Sub-components
import VendorTable from './components/vendors/VendorTable';
import VendorModal from './components/vendors/VendorModal';
import VoucherModal from '../common/components/VoucherModal';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ManagerVendors = ({ search, setSearch }) => {
    const user = useAppSelector(selectUser);
    const {
        loading, showModal, setShowModal, editVendor, submitting, form, setForm, filtered, handleSubmit, handleDelete, openEdit
    } = useVendorLogic(search, setSearch);

    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Top Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        onClick={() => setIsVoucherModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                        <CreditCard size={16} /> Pay Vendor (Voucher)
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
                    >
                        <Plus size={16} /> Add Vendor
                    </button>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <VendorTable 
                        loading={loading}
                        filtered={filtered}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                </div>

                <VendorModal 
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    form={form}
                    setForm={setForm}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    isEdit={!!editVendor}
                />

                <VoucherModal
                    isOpen={isVoucherModalOpen}
                    onClose={() => setIsVoucherModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default ManagerVendors;
