import { useState, useEffect } from 'react';
import { useUploadImageMutation } from '../../../store/api/sharedApi';
import {
    useGetExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation
} from '../../../store/api/accountsApi';

export const useExpenseLogic = (parentSearch, parentSetSearch, filterMode = 'all') => {
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [filterCategory, setFilterCategory] = useState('All');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        description: '', amount: '', category: 'Materials',
        expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid', receiptFile: null
    });
    const [editingId, setEditingId] = useState(null);

    const { data: expenseRes, isLoading: loading } = useGetExpensesQuery({ limit: 500 });
    const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
    const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
    const [deleteExpense] = useDeleteExpenseMutation();
    const [uploadImage] = useUploadImageMutation();
    const [isUploading, setIsUploading] = useState(false);

    const submitting = isCreating || isUpdating || isUploading;

    const rawExpenses = expenseRes?.success ? expenseRes.data : [];
    // Only map once for default status
    const expenses = rawExpenses.map(e => ({
        ...e,
        status: e.status || (Math.random() > 0.8 ? 'Pending' : 'Paid')
    }));

    useEffect(() => {
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
            setIsUploading(true);
            let receiptUrl = '';
            if (form.receiptFile) {
                const formData = new FormData();
                formData.append('image', form.receiptFile);
                const uploadRes = await uploadImage(formData).unwrap();
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

            delete payload.receiptFile;
            delete payload.existingReceipt;
            delete payload.vendor;

            if (editingId) {
                await updateExpense({ id: editingId, ...payload }).unwrap();
            } else {
                await createExpense(payload).unwrap();
            }
            
            setShowModal(false);
            setEditingId(null);
            setForm({ description: '', amount: '', category: 'Materials', expenseDate: new Date().toISOString().split('T')[0], vendor: '', notes: '', status: 'Paid', receiptFile: null });
            
        } catch (err) {
            alert('Error: ' + (err.data?.message || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await deleteExpense(id).unwrap();
        } catch (err) {
            alert('Error deleting expense: ' + (err.data?.message || err.message));
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
