import React from 'react';
import { Search, Filter } from 'lucide-react';
import { usePaymentLogic } from '../hooks/usePaymentLogic';

// Sub-components
import PaymentTable from './components/payments/PaymentTable';
import PaymentModal from './components/payments/PaymentModal';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ManagerPayments = ({ search, setSearch }) => {
    const user = useAppSelector(selectUser);
    const {
        clients, loading, showModal, setShowModal,
        submitting, form, setForm, filtered, handleSubmit, handleDelete,
        filterMethod, setFilterMethod
    } = usePaymentLogic(search, setSearch);

    const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Top Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }} ref={dropdownRef}>
                    <button 
                        className="btn-outline" 
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', height: '42px', fontWeight: 600, background: filterMethod !== 'All' ? '#e0e7ff' : '#fff', border: '1px solid #e2e8f0', color: filterMethod !== 'All' ? '#4338ca' : '#334155' }}
                    >
                        <Filter size={16} /> 
                        <span className="desktop-only">{filterMethod === 'All' ? 'Filter' : filterMethod}</span>
                    </button>
                    
                    {showFilterDropdown && (
                        <div style={{ position: 'absolute', top: '48px', right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', zIndex: 10, minWidth: '160px', overflow: 'hidden' }}>
                            <div style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Method
                            </div>
                            {['All', 'Cash', 'Bank Transfer', 'Cheque', 'UPI', 'Card'].map(method => (
                                <div 
                                    key={method} 
                                    style={{ 
                                        padding: '10px 14px', 
                                        fontSize: '13px', 
                                        color: filterMethod === method ? '#2563eb' : '#334155', 
                                        cursor: 'pointer', 
                                        background: filterMethod === method ? '#eff6ff' : '#fff', 
                                        fontWeight: filterMethod === method ? '600' : '500',
                                        transition: 'background 0.15s'
                                    }} 
                                    onClick={() => { setFilterMethod(method); setShowFilterDropdown(false); }}
                                    onMouseEnter={(e) => { if(filterMethod !== method) e.currentTarget.style.background = '#f8fafc'; }}
                                    onMouseLeave={(e) => { if(filterMethod !== method) e.currentTarget.style.background = '#fff'; }}
                                >
                                    {method}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="payments-table-container">
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
