import React from 'react';
import { Search } from 'lucide-react';
import { useClientLogic } from '../hooks/useClientLogic';

// Sub-components (Local to Accounts)
import ClientTable from './components/clients/ClientTable';
import ClientModal from './components/clients/ClientModal';

const ManagerClients = ({ user }) => {
    const {
        loading, search, setSearch, showModal, setShowModal,
        editClient, form, setForm, submitting, filtered, handleSubmit, handleDelete, openEdit
    } = useClientLogic();

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Filter Bar (Simplified local component as per rules) */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', height: '45px', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}
                    />
                </div>

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
