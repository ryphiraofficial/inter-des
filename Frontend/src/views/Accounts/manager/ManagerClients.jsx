import React from 'react';
import { useClientLogic } from '../hooks/useClientLogic';

// Sub-components (Local to Accounts)
import ClientTable from './components/clients/ClientTable';
import ClientModal from './components/clients/ClientModal';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ManagerClients = ({ search, setSearch }) => {
    const user = useAppSelector(selectUser);
    const {
        loading, showModal, setShowModal,
        editClient, form, setForm, submitting, filtered, handleSubmit, handleDelete, openEdit
    } = useClientLogic(search, setSearch);

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Table Component */}
                <ClientTable 
                    loading={loading}
                    filtered={filtered}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                />

                {/* Modal Component */}
                <ClientModal 
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    form={form}
                    setForm={setForm}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    isEdit={!!editClient}
                />
            </div>
        </div>
    );
};

export default ManagerClients;
