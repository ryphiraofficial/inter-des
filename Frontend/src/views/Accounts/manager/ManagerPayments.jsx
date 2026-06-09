import React, { useMemo } from 'react';
import { Search, Filter, Wallet, Hash, CalendarDays, TrendingUp } from 'lucide-react';
import { usePaymentLogic } from '../hooks/usePaymentLogic';

// Sub-components
import PaymentTable from './components/payments/PaymentTable';
import PaymentModal from './components/payments/PaymentModal';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';
import '../css/Expenses.css'; // Import to use the shared KPI card styles

const ManagerPayments = ({ search, setSearch }) => {
    const user = useAppSelector(selectUser);
    const {
        payments, clients, loading, showModal, setShowModal,
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

    // Calculate KPIs
    const kpiData = useMemo(() => {
        const validPayments = payments || [];
        const totalAmount = validPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        
        const now = new Date();
        const thisMonthAmount = validPayments.filter(p => {
            if (!p.paymentDate) return false;
            const d = new Date(p.paymentDate);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        const largestPayment = validPayments.reduce((max, p) => Math.max(max, Number(p.amount) || 0), 0);

        return {
            totalAmount,
            totalTransactions: validPayments.length,
            thisMonthAmount,
            largestPayment
        };
    }, [payments]);

    return (
        <div className="accounts-manager-hub">
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* KPI Dashboard Boxes */}
                <div className="invoice-stats-grid">
                    <div className="invoice-stat-card">
                        <div className="stat-content">
                            <h4>Total Received</h4>
                            <h2>₹{kpiData.totalAmount.toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="stat-icon-wrapper green">
                            <Wallet size={24} />
                        </div>
                    </div>
                    
                    <div className="invoice-stat-card">
                        <div className="stat-content">
                            <h4>Total Transactions</h4>
                            <h2>{kpiData.totalTransactions}</h2>
                        </div>
                        <div className="stat-icon-wrapper blue">
                            <Hash size={24} />
                        </div>
                    </div>

                    <div className="invoice-stat-card">
                        <div className="stat-content">
                            <h4>Received This Month</h4>
                            <h2>₹{kpiData.thisMonthAmount.toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="stat-icon-wrapper yellow" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                            <CalendarDays size={24} />
                        </div>
                    </div>

                    <div className="invoice-stat-card">
                        <div className="stat-content">
                            <h4>Largest Payment</h4>
                            <h2>₹{kpiData.largestPayment.toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="stat-icon-wrapper purple">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

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
