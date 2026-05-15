import { purchaseOrderAPI } from '../../../../models/api';

export const usePOActions = ({ 
    fetchPurchaseOrders, setSubmitting, setShowCreateModal, setFormData, setPurchaseOrders, purchaseOrders 
}) => {
    
    const handleCreatePO = async (formData) => {
        if (!formData.supplier || formData.items.length === 0 || !formData.deliveryDate || !formData.deliveryAddress) {
            alert('Please fill in all required fields: Supplier, Delivery Date, Address, and at least one item.');
            return;
        }

        try {
            setSubmitting(true);
            const poData = {
                ...formData,
                expectedDeliveryDate: formData.deliveryDate,
                poNumber: `PO-${Date.now().toString().slice(-6)}`,
                orderDate: new Date(),
                items: formData.items.map(item => {
                    const qty = Number(item.quantity) || 0;
                    const r = Number(item.rate) || 0;
                    return {
                        ...item,
                        quantity: qty,
                        rate: r,
                        amount: qty * r,
                        unit: item.unit || 'pcs'
                    };
                }),
                status: 'Ordered'
            };

            poData.totalAmount = poData.items.reduce((sum, item) => sum + item.amount, 0);

            const response = await purchaseOrderAPI.create(poData);
            if (response.success) {
                setShowCreateModal(false);
                fetchPurchaseOrders();
                setFormData({ supplier: '', deliveryAddress: '', deliveryDate: '', paymentTerms: '', notes: '', items: [] });
            }
        } catch (err) {
            alert('Error creating PO: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this purchase order?')) return;
        try {
            const response = await purchaseOrderAPI.delete(id);
            if (response.success) {
                setPurchaseOrders(purchaseOrders.filter(po => po._id !== id));
            }
        } catch (err) {
            alert('Error deleting PO: ' + err.message);
        }
    };

    const handleMarkReceived = async (id) => {
        if (!window.confirm('Mark this purchase order as received? This will update inventory.')) return;
        try {
            setSubmitting(true);
            const response = await purchaseOrderAPI.markReceived(id);
            if (response.success) {
                setPurchaseOrders(purchaseOrders.map(po =>
                    po._id === id ? { ...po, status: 'Received' } : po
                ));
            }
        } catch (err) {
            alert('Error updating PO: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return { handleCreatePO, handleDelete, handleMarkReceived };
};
