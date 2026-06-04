import React from 'react';
import { useVendorLogic } from '../hooks/useVendorLogic';

// Sub-components
import VendorTable from './components/vendors/VendorTable';
import VendorModal from './components/vendors/VendorModal';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ManagerVendors = ({ search, setSearch }) => {
    const user = useAppSelector(selectUser);
    const {
        loading, showModal, setShowModal, editVendor, submitting, form, setForm, filtered, handleSubmit, handleDelete, openEdit
    } = useVendorLogic(search, setSearch);

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

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
            </div>
        </div>
    );
};

export default ManagerVendors;
