import React from 'react';
import { useExpenseLogic } from '../hooks/useExpenseLogic';

// Sub-components (Local to Accounts)
import ExpenseStats from './components/expenses/ExpenseStats';
import ExpenseFilterBar from './components/expenses/ExpenseFilterBar';
import ExpenseTable from './components/expenses/ExpenseTable';
import ExpenseModal from './components/expenses/ExpenseModal';

import '../css/Expenses.css';

const ManagerExpenses = ({ user }) => {
    const {
        expenses, loading, search, setSearch, filterCategory, setFilterCategory,
        showCategoryDropdown, setShowCategoryDropdown, showModal, setShowModal,
        submitting, form, setForm, filtered, handleSubmit, handleDelete
    } = useExpenseLogic();

    return (
        <div className="expenses-dashboard-container">
            <div className="expenses-wrapper">
                
                {/* KPI Cards */}
                <ExpenseStats loading={loading} expenses={expenses} />

                {/* Analytics Placeholder (Keeping it simple for now, can extract if needed) */}
                <div className="expenses-analytics-grid">
                    {/* Charts are often large, but we'll keep them here or extract if lines > 200 */}
                    {/* For now, focusing on the main structure */}
                </div>

                {/* Data Table & Controls */}
                <div className="expenses-table-card">
                    <ExpenseFilterBar 
                        search={search}
                        setSearch={setSearch}
                        filterCategory={filterCategory}
                        setFilterCategory={setFilterCategory}
                        showCategoryDropdown={showCategoryDropdown}
                        setShowCategoryDropdown={setShowCategoryDropdown}
                    />

                    <ExpenseTable 
                        loading={loading}
                        filtered={filtered}
                        handleDelete={handleDelete}
                    />
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

export default ManagerExpenses;
