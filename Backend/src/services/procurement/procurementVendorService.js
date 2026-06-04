import VendorComparison from '../../models/procurement/VendorComparison.js';
import VendorPurchase from '../../models/procurement/VendorPurchase.js';
import Vendor from '../../models/procurement/Vendor.js';
import MaterialRequest from '../../models/procurement/MaterialRequest.js';
import { createNotification } from '../../utils/notificationHelper.js';

export const createVendorComparison = async (reqData) => {
    try {
        reqData.body.createdBy = reqData.user.id;
        const comparison = await VendorComparison.create(reqData.body);
        return { status: 201, success: true, data: comparison };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getVendorComparisons = async (reqData) => {
    try {
        const { project, status } = reqData.query;
        let query = {};
        if (project) query.project = project;
        if (status) query.status = status;

        const comparisons = await VendorComparison.find(query)
            .populate('materialRequest', 'requestNumber')
            .populate('project', 'name projectNumber')
            .populate('quotes.vendor', 'name email phone')
            .populate('selectedVendor', 'name')
            .populate('purchaseOrder', 'poNumber')
            .sort({ createdAt: -1 });

        return { status: 200, success: true, count: comparisons.length, data: comparisons };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const selectVendor = async (reqData) => {
    try {
        const { vendorId, quoteIndex } = reqData.body;
        const comparison = await VendorComparison.findById(reqData.params.id);
        if (!comparison) return { status: 404, success: false, message: 'Comparison not found' };

        comparison.quotes.forEach((q, i) => { q.selected = i === quoteIndex; });
        comparison.selectedVendor = vendorId;
        comparison.status = 'Approved';
        await comparison.save();

        await createNotification({ title: 'Vendor Selected', description: `Vendor has been selected for comparison "${comparison.comparisonNumber}".`, type: 'Info', relatedModel: 'VendorComparison', relatedId: comparison._id });

        return { status: 200, success: true, data: comparison };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const createVendorPurchase = async (reqData) => {
    try {
        const { vendor, materialRequest, project, items, totalAmount, totalDiscount, finalAmount, expectedDeliveryDate, deliveryLocation, vendorLocation, notes } = reqData.body;

        const purchase = await VendorPurchase.create({
            vendor, materialRequest, project, items, totalAmount, totalDiscount, finalAmount, expectedDeliveryDate, deliveryLocation, vendorLocation, notes, purchasedBy: reqData.user.id
        });

        if (materialRequest) await MaterialRequest.findByIdAndUpdate(materialRequest, { status: 'Purchasing', staffRemarks: notes });

        if (vendor && items && items.length > 0) {
            for (const item of items) {
                await Vendor.updateOne({ _id: vendor }, { $addToSet: { materialsSupplied: item.itemName } });
            }
        }

        return { status: 201, success: true, data: purchase };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getVendorPurchaseHistory = async (reqData) => {
    try {
        const { vendorId, search } = reqData.query;
        let query = {};
        if (vendorId) query.vendor = vendorId;

        let purchases = await VendorPurchase.find(query)
            .populate('vendor', 'name email phone address')
            .populate('project', 'name projectNumber')
            .populate('materialRequest', 'requestNumber')
            .populate('purchasedBy', 'fullName')
            .sort({ purchaseDate: -1 });

        if (search && search.trim()) {
            const searchLower = search.toLowerCase();
            purchases = purchases.filter(p => p.items.some(item => item.itemName.toLowerCase().includes(searchLower)));
        }

        const vendorStats = {};
        for (const purchase of purchases) {
            const vendorId = purchase.vendor._id.toString();
            if (!vendorStats[vendorId]) vendorStats[vendorId] = { vendor: purchase.vendor, totalPurchases: 0, totalAmount: 0, items: {}, totalDiscount: 0 };
            vendorStats[vendorId].totalPurchases += 1;
            vendorStats[vendorId].totalAmount += purchase.finalAmount;
            vendorStats[vendorId].totalDiscount += purchase.totalDiscount;

            for (const item of purchase.items) {
                if (!vendorStats[vendorId].items[item.itemName]) vendorStats[vendorId].items[item.itemName] = { quantity: 0, totalAmount: 0, totalDiscount: 0 };
                vendorStats[vendorId].items[item.itemName].quantity += item.quantity;
                vendorStats[vendorId].items[item.itemName].totalAmount += item.amount;
                vendorStats[vendorId].items[item.itemName].totalDiscount += (item.amount - item.finalAmount);
            }
        }

        return { status: 200, success: true, data: purchases, vendorStats: Object.values(vendorStats) };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const compareVendorPrices = async (reqData) => {
    try {
        const { items } = reqData.body;
        if (!items || !items.length) return { status: 400, success: false, message: 'Items are required for comparison' };

        const itemNames = items.map(i => i.itemName);
        const purchases = await VendorPurchase.find({ 'items.itemName': { $in: itemNames } }).populate('vendor', 'name email phone address');

        const vendorPrices = {};
        for (const purchase of purchases) {
            const vendorId = purchase.vendor._id.toString();
            if (!vendorPrices[vendorId]) vendorPrices[vendorId] = { vendor: purchase.vendor, items: {}, totalOriginalAmount: 0, totalFinalAmount: 0, totalDiscount: 0 };

            for (const item of purchase.items) {
                if (!vendorPrices[vendorId].items[item.itemName]) vendorPrices[vendorId].items[item.itemName] = { quantity: 0, rate: 0, amount: 0, finalAmount: 0, discountPercent: 0 };
                vendorPrices[vendorId].items[item.itemName].quantity += item.quantity;
                vendorPrices[vendorId].items[item.itemName].amount += item.amount;
                vendorPrices[vendorId].items[item.itemName].finalAmount += item.finalAmount;
            }
        }

        for (const vendorId in vendorPrices) {
            const vendor = vendorPrices[vendorId];
            for (const itemName in vendor.items) {
                const item = vendor.items[itemName];
                if (item.quantity > 0) item.rate = item.amount / item.quantity;
                vendor.totalOriginalAmount += item.amount;
                vendor.totalFinalAmount += item.finalAmount;
                vendor.totalDiscount = vendor.totalOriginalAmount - vendor.totalFinalAmount;
            }
        }

        const comparisonResults = Object.values(vendorPrices).map(v => {
            let itemTotals = {};
            for (const itemName of itemNames) {
                if (v.items[itemName]) itemTotals[itemName] = { rate: v.items[itemName].rate, amount: v.items[itemName].amount, finalAmount: v.items[itemName].finalAmount };
                else itemTotals[itemName] = null;
            }

            let totalOriginal = 0;
            let totalFinal = 0;
            for (const item of items) {
                const itemData = itemTotals[item.itemName];
                if (itemData) {
                    totalOriginal += itemData.amount || (itemData.rate * item.quantity);
                    totalFinal += itemData.finalAmount || (itemData.rate * item.quantity);
                }
            }

            return { vendor: v.vendor, items: itemTotals, totalOriginalAmount: totalOriginal, totalFinalAmount: totalFinal, totalDiscountAmount: totalOriginal - totalFinal, totalDiscountPercent: totalOriginal > 0 ? ((totalOriginal - totalFinal) / totalOriginal) * 100 : 0 };
        });

        comparisonResults.sort((a, b) => b.totalDiscountPercent - a.totalDiscountPercent);
        return { status: 200, success: true, data: comparisonResults };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
