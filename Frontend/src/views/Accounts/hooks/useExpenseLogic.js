import { useState, useEffect } from 'react';
import { accountsAPI } from '../../../models/api';
import { uploadAPI } from '../../../models/api/admin/miscAPI';

export const useExpenseLogic = (parentSearch, parentSetSearch, filterMode = 'all') => {
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
        expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid', receiptFile: null
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchExpenses();
        const handleOpenModal = () => {
            setEditingId(null);
            setForm({
                description: '', amount: '', category: 'Materials',
                expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid', receiptFile: null
            });
            setShowModal(true);
        };
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

    const handleEdit = (expense) => {
        setEditingId(expense._id);
        setForm({
            description: expense.description || '',
            amount: expense.amount || '',
            category: expense.type || expense.category || 'Materials',
            expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            vendor: expense.vendorName || (typeof expense.vendor === 'object' ? expense.vendor?.name : (expense.vendor || '')),
            notes: expense.notes || '',
            status: expense.status || expense.paymentStatus || 'Paid',
            receiptFile: null,
            existingReceipt: expense.receipt || null
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.description || !form.amount) return alert('Description and amount are required');
        try {
            setSubmitting(true);
            let receiptUrl = '';
            if (form.receiptFile) {
                const formData = new FormData();
                formData.append('image', form.receiptFile);
                const uploadRes = await uploadAPI.image(formData);
                if (uploadRes && uploadRes.url) {
                    receiptUrl = uploadRes.url;
                }
            }

            const payload = {
                ...form,
                amount: parseFloat(form.amount),
                type: form.category,
                vendorName: form.vendor
            };
            
            if (receiptUrl) {
                payload.receipt = receiptUrl;
            } else if (form.existingReceipt) {
                payload.receipt = form.existingReceipt;
            }

            delete payload.receiptFile; // Don't send file object in JSON payload
            delete payload.existingReceipt;
            delete payload.vendor; // vendor is an ObjectId, use vendorName for string

            let res;
            if (editingId) {
                res = await accountsAPI.updateExpense(editingId, payload);
            } else {
                res = await accountsAPI.createExpense(payload);
            }
            
            if (res?.success) {
                setShowModal(false);
                fetchExpenses();
                setEditingId(null);
                setForm({ description: '', amount: '', category: 'Materials', expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid', receiptFile: null });
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
        const vendorText = e.vendorName || (e.vendor && e.vendor.name) || (typeof e.vendor === 'string' ? e.vendor : '');
        const matchesSearch = e.description?.toLowerCase().includes(search.toLowerCase()) || 
                              vendorText.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'All' || e.category === filterCategory || e.type === filterCategory;
        
        let matchesMode = true;
        if (filterMode === 'company') {
            matchesMode = !e.project;
        }

        return matchesSearch && matchesCategory && matchesMode;
    }).sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));

    return {
        expenses, loading, search, setSearch, filterCategory, setFilterCategory,
        showCategoryDropdown, setShowCategoryDropdown, showModal, setShowModal,
        submitting, form, setForm, filtered, handleSubmit, handleDelete, handleEdit, editingId, setEditingId
    };
};
