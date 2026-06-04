import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import { useExpenseLogic } from '../hooks/useExpenseLogic';
import { Calendar } from '../../../components/ui/calendar';

import ExpenseTable from './components/expenses/ExpenseTable';
import ExpenseModal from './components/expenses/ExpenseModal';
import { TableSkeleton } from '../components/UI/Skeleton';

import '../css/Expenses.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ManagerCompanyExpenses = ({ search, setSearch }) => {
    const user = useAppSelector(selectUser);
    const {
        expenses, loading, showModal, setShowModal,
        submitting, form, setForm, handleDelete, handleSubmit, handleEdit, editingId
    } = useExpenseLogic(search, setSearch, 'company');

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter expenses specifically for the selected date
    const filteredByDate = expenses.filter(exp => {
        if (!exp.expenseDate) return false;
        const expDateStr = new Date(exp.expenseDate).toISOString().split('T')[0];
        return expDateStr === selectedDate;
    });

    const displayDate = new Date(selectedDate).toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="expenses-dashboard-container">
            <div className="expenses-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                


                {/* Main Content Area */}
                <div style={{
                    background: '#fff', borderRadius: '12px', padding: '24px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                    minHeight: '400px'
                }}>
                    <div style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Daily Ledger</h3>
                        <div style={{ position: 'relative' }} ref={calendarRef}>
                            <button 
                                onClick={() => setShowCalendar(!showCalendar)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    background: '#f8fafc', border: '1px solid #cbd5e1',
                                    borderRadius: '8px', padding: '8px 16px',
                                    color: '#0f172a', fontWeight: 600, fontSize: '0.875rem',
                                    cursor: 'pointer', outline: 'none'
                                }}
                            >
                                <CalendarIcon size={18} style={{ color: '#64748b' }} />
                                {new Date(selectedDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </button>
                            
                            {showCalendar && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                    zIndex: 50, padding: '16px'
                                }}>
                                    <Calendar
                                        mode="single"
                                        selected={new Date(selectedDate)}
                                        onSelect={(date) => {
                                            if (date) {
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const day = String(date.getDate()).padStart(2, '0');
                                                setSelectedDate(`${year}-${month}-${day}`);
                                                setShowCalendar(false);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <TableSkeleton rows={5} cols={7} />
                    ) : filteredByDate.length > 0 ? (
                        <ExpenseTable 
                            loading={false}
                            filtered={filteredByDate}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                        />
                    ) : (
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', height: '300px', textAlign: 'center',
                            background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1'
                        }}>
                            <div style={{ width: '48px', height: '48px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#64748b' }}>
                                <FileText size={24} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>No expenses recorded</h3>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '300px', margin: 0 }}>
                                There are no company overhead expenses logged for {displayDate}.
                            </p>
                        </div>
                    )}
                </div>

            </div>

            {/* Add/Edit Expense Modal */}
            <ExpenseModal 
                show={showModal}
                onClose={() => setShowModal(false)}
                form={form}
                setForm={setForm}
                submitting={submitting}
                onSubmit={handleSubmit}
                editingId={editingId}
            />
        </div>
    );
};

export default ManagerCompanyExpenses;
