import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import { useExpenseLogic } from '../hooks/useExpenseLogic';

import ExpenseTable from './components/expenses/ExpenseTable';
import ExpenseModal from './components/expenses/ExpenseModal';
import { TableSkeleton } from '../components/UI/Skeleton';

import '../css/Expenses.css';

const ManagerCompanyExpenses = ({ user, search, setSearch }) => {
    const {
        expenses, loading, showModal, setShowModal,
        submitting, form, setForm, handleDelete, handleSubmit
    } = useExpenseLogic(search, setSearch, 'company');

    // Default to today's date in YYYY-MM-DD format
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
                
                {/* Date Selector Header */}
                <div style={{
                    background: '#fff', padding: '24px', borderRadius: '12px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0' }}>Daily Ledger</h2>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Select a date to view company overhead expenses</p>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            background: '#f8fafc', border: '1px solid #cbd5e1',
                            borderRadius: '8px', padding: '8px 16px',
                            color: '#334155', fontWeight: 500, fontSize: '0.875rem'
                        }}>
                            <CalendarIcon size={18} style={{ color: '#64748b' }} />
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    border: 'none', background: 'transparent',
                                    outline: 'none', color: '#0f172a', fontWeight: 600,
                                    fontFamily: 'inherit', cursor: 'pointer'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{
                    background: '#fff', borderRadius: '12px', padding: '24px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                    minHeight: '400px'
                }}>
                    <div style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                            Expenses for {displayDate}
                        </h3>
                    </div>

                    {loading ? (
                        <TableSkeleton rows={5} cols={7} />
                    ) : filteredByDate.length > 0 ? (
                        <ExpenseTable 
                            loading={false}
                            filtered={filteredByDate}
                            handleDelete={handleDelete}
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

            {/* Add Expense Modal */}
            <ExpenseModal 
                show={showModal}
                onClose={() => setShowModal(false)}
                form={form}
                setForm={setForm}
                submitting={submitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default ManagerCompanyExpenses;
