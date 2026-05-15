import { invoiceAPI } from '../../../../models/api';

export const useInvoiceActions = ({ 
    fetchInvoices, setSubmitting, setShowCreateModal, setFormData, setInvoices, invoices 
}) => {
    
    const handleCreateInvoice = async (formData) => {
        if (!formData.client || formData.items.length === 0) {
            alert('Please select a client and add at least one item.');
            return;
        }

        try {
            setSubmitting(true);
            const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
            const totalTax = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate * item.tax / 100), 0);

            const preparedItems = formData.items.map(item => ({
                ...item,
                amount: item.quantity * item.rate
            }));

            const response = await invoiceAPI.create({
                ...formData,
                items: preparedItems,
                subtotal,
                totalTax,
                grandTotal: subtotal + totalTax,
                status: 'Unpaid'
            });

            if (response.success) {
                setShowCreateModal(false);
                fetchInvoices();
                setFormData({ 
                    client: '', 
                    invoiceDate: new Date().toISOString().split('T')[0], 
                    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                    items: [] 
                });
            }
        } catch (err) {
            alert('Error creating invoice: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this invoice?')) return;
        try {
            await invoiceAPI.delete(id);
            setInvoices(invoices.filter(inv => inv._id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
        }
    };

    const handleUpdatePayment = async (id, amountToPay) => {
        try {
            await invoiceAPI.recordPayment(id, {
                amount: amountToPay,
                paymentMethod: 'Bank Transfer',
                paymentDate: new Date()
            });
            fetchInvoices();
        } catch (err) {
            alert('Error updating payment: ' + err.message);
        }
    };

    return { handleCreateInvoice, handleDelete, handleUpdatePayment };
};
