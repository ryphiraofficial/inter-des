import { 
    useCreatePurchaseOrderMutation, 
    useDeletePurchaseOrderMutation, 
    useMarkPOReceivedMutation 
} from '../../../../store/api/adminApi';

export const usePOActions = ({ 
    fetchPurchaseOrders, setSubmitting, setShowCreateModal, setFormData, setPurchaseOrders, purchaseOrders 
}) => {
    
    const [createPurchaseOrder] = useCreatePurchaseOrderMutation();
    const [deletePurchaseOrder] = useDeletePurchaseOrderMutation();
    const [markPOReceived] = useMarkPOReceivedMutation();

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
                taxRate: Number(formData.taxRate) || 0,
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

            const subtotal = poData.items.reduce((sum, item) => sum + item.amount, 0);
            poData.subtotal = subtotal;
            poData.taxAmount = (subtotal * poData.taxRate) / 100;
            poData.totalAmount = subtotal + poData.taxAmount;

            await createPurchaseOrder(poData).unwrap();
            setShowCreateModal(false);
            fetchPurchaseOrders();
            setFormData({ 
                supplier: '', 
                supplierContact: '', 
                supplierEmail: '', 
                deliveryAddress: '', 
                deliveryDate: '', 
                paymentTerms: 'Net 30 days', 
                taxRate: 18, 
                notes: '', 
                items: [] 
            });
        } catch (err) {
            alert('Error creating PO: ' + (err.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this purchase order?')) return;
        try {
            await deletePurchaseOrder(id).unwrap();
            setPurchaseOrders(purchaseOrders.filter(po => po._id !== id));
        } catch (err) {
            alert('Error deleting PO: ' + (err.data?.message || err.message));
        }
    };

    const handleMarkReceived = async (id) => {
        if (!window.confirm('Mark this purchase order as received? This will update inventory.')) return;
        try {
            setSubmitting(true);
            await markPOReceived(id).unwrap();
            setPurchaseOrders(purchaseOrders.map(po =>
                po._id === id ? { ...po, status: 'Received' } : po
            ));
        } catch (err) {
            alert('Error updating PO: ' + (err.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return { handleCreatePO, handleDelete, handleMarkReceived };
};
