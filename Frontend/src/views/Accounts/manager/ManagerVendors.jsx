import React from 'react';
import { Search } from 'lucide-react';
import { useVendorLogic } from '../hooks/useVendorLogic';

// Sub-components
import VendorTable from './components/vendors/VendorTable';
import VendorModal from './components/vendors/VendorModal';

const ManagerVendors = ({ user }) => {
    const {
        loading, search, setSearch, showModal, setShowModal, editVendor, submitting, form, setForm, filtered, handleSubmit, handleDelete, openEdit
    } = useVendorLogic();

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" placeholder="Search by name, category or email..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', height: '45px', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }} />
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
            </div>
        </div>
    );
};

export default ManagerVendors;
