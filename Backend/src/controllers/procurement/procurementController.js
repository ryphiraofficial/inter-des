import * as procurementOrderService from '../../services/procurement/procurementOrderService.js';
import * as procurementVendorService from '../../services/procurement/procurementVendorService.js';
import * as procurementMaterialService from '../../services/procurement/procurementMaterialService.js';
import * as procurementDashboardService from '../../services/procurement/procurementDashboardService.js';

export const getMaterialRequests = async (req, res) => {
    try {
        const result = await procurementMaterialService.getMaterialRequests({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const createMaterialRequest = async (req, res) => {
    try {
        const result = await procurementMaterialService.createMaterialRequest({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const updateMaterialRequest = async (req, res) => {
    try {
        const result = await procurementMaterialService.updateMaterialRequest({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const approveMaterialRequest = async (req, res) => {
    try {
        const result = await procurementMaterialService.approveMaterialRequest({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const createVendorComparison = async (req, res) => {
    try {
        const result = await procurementVendorService.createVendorComparison({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getVendorComparisons = async (req, res) => {
    try {
        const result = await procurementVendorService.getVendorComparisons({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const selectVendor = async (req, res) => {
    try {
        const result = await procurementVendorService.selectVendor({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const createPOFromComparison = async (req, res) => {
    try {
        const result = await procurementOrderService.createPOFromComparison({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getProcurementStats = async (req, res) => {
    try {
        const result = await procurementDashboardService.getProcurementStats({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const assignStaffToRequest = async (req, res) => {
    try {
        const result = await procurementMaterialService.assignStaffToRequest({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getStaffTasks = async (req, res) => {
    try {
        const result = await procurementDashboardService.getStaffTasks({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const requestTimeExtension = async (req, res) => {
    try {
        const result = await procurementMaterialService.requestTimeExtension({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const respondTimeExtension = async (req, res) => {
    try {
        const result = await procurementMaterialService.respondTimeExtension({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const createVendorPurchase = async (req, res) => {
    try {
        const result = await procurementVendorService.createVendorPurchase({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getVendorPurchaseHistory = async (req, res) => {
    try {
        const result = await procurementVendorService.getVendorPurchaseHistory({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const compareVendorPrices = async (req, res) => {
    try {
        const result = await procurementVendorService.compareVendorPrices({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

// Also used getProcurementStaff, wait where was this exported? Let me check procurementVendorService for this... I might have missed it
// Let me look at procurementController.js
// getProcurementStaff was exported from procurementService. I forgot to extract it. Wait, I should add it to procurementDashboardService.js
export const getProcurementStaff = async (req, res) => {
    try {
        // Need to extract this into a service
        const result = await procurementDashboardService.getProcurementStaff({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const updatePurchaseStatus = async (req, res) => {
    try {
        const result = await procurementOrderService.updatePurchaseStatus({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const adminApproveProcurement = async (req, res) => {
    try {
        const result = await procurementDashboardService.adminApproveProcurement({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getProductionManagers = async (req, res) => {
    try {
        const result = await procurementDashboardService.getProductionManagers({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};