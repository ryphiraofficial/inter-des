import VendorComparison from '../../models/procurement/VendorComparison.js';
import PurchaseOrder from '../../models/procurement/PurchaseOrder.js';
import VendorPurchase from '../../models/procurement/VendorPurchase.js';
import MaterialRequest from '../../models/procurement/MaterialRequest.js';
import { notifyByRole } from '../../utils/notificationHelper.js';

export const createPOFromComparison = async (reqData) => {
    try {
        const comparison = await VendorComparison.findById(reqData.params.id)
            .populate('selectedVendor')
            .populate('project');

        if (!comparison || !comparison.selectedVendor) {
            return { status: 400, success: false, message: 'No vendor selected' };
        }

        const selectedQuote = comparison.quotes.find(q => q.selected);

        const po = await PurchaseOrder.create({
            supplier: comparison.selectedVendor.name,
            supplierContact: comparison.selectedVendor.phone,
            supplierEmail: comparison.selectedVendor.email,
            items: selectedQuote.items.map(item => ({
                itemName: item.itemName,
                quantity: item.quantity,
                unit: 'pieces',
                rate: item.rate,
                amount: item.amount
            })),
            deliveryAddress: comparison.project?.name || 'Project Site',
            createdBy: reqData.user.id
        });

        comparison.purchaseOrder = po._id;
        comparison.status = 'PO Created';
        await comparison.save();

        await notifyByRole('Project Manager', {
            title: 'Purchase Order Created',
            description: `PO "${po.poNumber}" has been created. Materials will be delivered soon.`,
            type: 'PO',
            relatedModel: 'PurchaseOrder',
            relatedId: po._id
        });

        return { status: 201, success: true, data: { comparison, po } };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

export const updatePurchaseStatus = async (reqData) => {
    try {
        const { status, actualDeliveryDate } = reqData.body;
        const purchase = await VendorPurchase.findById(reqData.params.id);

        if (!purchase) {
            return { status: 404, success: false, message: 'Purchase not found' };
        }

        if (purchase.purchasedBy?.toString() !== reqData.user.id && reqData.user.role !== 'Procurement Manager') {
            return { status: 403, success: false, message: 'You can only update your own purchases' };
        }

        purchase.status = status;
        if (status === 'Received' && actualDeliveryDate) {
            purchase.actualDeliveryDate = actualDeliveryDate;
        }
        await purchase.save();

        if (purchase.materialRequest) {
            let materialStatus = 'Completed';
            if (status === 'Ordered') materialStatus = 'Purchasing';
            if (status === 'Pending') materialStatus = 'Assigned';
            
            await MaterialRequest.findByIdAndUpdate(purchase.materialRequest, {
                status: materialStatus
            });
        }

        return { status: 200, success: true, data: purchase };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};
