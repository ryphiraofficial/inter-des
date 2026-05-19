import React from 'react';
import { useExpenseLogic } from '../hooks/useExpenseLogic';

// Sub-components (Local to Accounts)
import ExpenseStats from './components/expenses/ExpenseStats';
import ExpenseFilterBar from './components/expenses/ExpenseFilterBar';
import ExpenseTable from './components/expenses/ExpenseTable';
import ExpenseModal from './components/expenses/ExpenseModal';

import '../css/Expenses.css';

const ManagerExpenses = ({ user, search, setSearch }) => {
    const {
        expenses, loading, filterCategory, setFilterCategory,
        showCategoryDropdown, setShowCategoryDropdown, showModal, setShowModal,
        submitting, form, setForm, filtered, handleSubmit, handleDelete
    } = useExpenseLogic(search, setSearch);

    React.useEffect(() => {
        const handleExport = (e) => {
            if (e.detail?.tab === 'expenses') {
                if (!filtered || filtered.length === 0) {
                    alert('No expenses to export!');
                    return;
                }
                
                const headers = ['Date', 'Description', 'Category', 'Vendor', 'Amount', 'Status', 'Notes'];
                const rows = filtered.map(exp => [
                    exp.expenseDate ? new Date(exp.expenseDate).toLocaleDateString('en-IN') : '',
                    `"${(exp.description || '').replace(/"/g, '""')}"`,
                    exp.category || '',
                    `"${(exp.vendor || '').replace(/"/g, '""')}"`,
                    exp.amount || 0,
                    exp.status || '',
                    `"${(exp.notes || '').replace(/"/g, '""')}"`
                ]);
                
                const csvContent = "data:text/csv;charset=utf-8," 
                    + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `expenses_report_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        window.addEventListener('accounts-export-data', handleExport);
        return () => window.removeEventListener('accounts-export-data', handleExport);
    }, [filtered]);

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

                {/* Data Table Filter Controls (Outside of the Card) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <ExpenseFilterBar 
                        filterCategory={filterCategory}
                        setFilterCategory={setFilterCategory}
                        showCategoryDropdown={showCategoryDropdown}
                        setShowCategoryDropdown={setShowCategoryDropdown}
                    />
                </div>

                {/* Data Table Card */}
                <div className="expenses-table-card">
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
