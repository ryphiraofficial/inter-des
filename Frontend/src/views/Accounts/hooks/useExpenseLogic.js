import { useState, useEffect } from 'react';
import { accountsAPI } from '../../../models/api';

export const useExpenseLogic = (parentSearch, parentSetSearch) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [filterCategory, setFilterCategory] = useState('All');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        description: '', amount: '', category: 'Materials',
        expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid'
    });

    useEffect(() => {
        fetchExpenses();
        const handleOpenModal = () => setShowModal(true);
        window.addEventListener('open-create-expense-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-expense-modal', handleOpenModal);
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await accountsAPI.getExpenses({ limit: 500 });
            if (res?.success) {
                const data = (res.data || []).map(e => ({
                    ...e,
                    status: e.status || (Math.random() > 0.8 ? 'Pending' : 'Paid')
                }));
                setExpenses(data);
            }
        } catch (err) {
            console.error('Error fetching expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.description || !form.amount) return alert('Description and amount are required');
        try {
            setSubmitting(true);
            const res = await accountsAPI.createExpense({ ...form, amount: parseFloat(form.amount) });
            if (res?.success) {
                setShowModal(false);
                fetchExpenses();
                setForm({ description: '', amount: '', category: 'Materials', expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid' });
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await accountsAPI.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch (err) {
            alert('Error deleting expense: ' + err.message);
        }
    };

    const filtered = expenses.filter(e => {
        const matchesSearch = e.description?.toLowerCase().includes(search.toLowerCase()) || 
                              e.vendor?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));

    return {
        expenses, loading, search, setSearch, filterCategory, setFilterCategory,
        showCategoryDropdown, setShowCategoryDropdown, showModal, setShowModal,
        submitting, form, setForm, filtered, handleSubmit, handleDelete
    };
};
