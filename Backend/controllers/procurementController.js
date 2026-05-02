const procurementService = require('../services/procurementService');


exports.getMaterialRequests = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.getMaterialRequests(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.createMaterialRequest = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.createMaterialRequest(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.updateMaterialRequest = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.updateMaterialRequest(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.approveMaterialRequest = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.approveMaterialRequest(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.createVendorComparison = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.createVendorComparison(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getVendorComparisons = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.getVendorComparisons(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.selectVendor = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.selectVendor(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.createPOFromComparison = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.createPOFromComparison(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getProcurementStats = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.getProcurementStats(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.assignStaffToRequest = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.assignStaffToRequest(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getStaffTasks = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.getStaffTasks(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.requestTimeExtension = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.requestTimeExtension(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.respondTimeExtension = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.respondTimeExtension(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.createVendorPurchase = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.createVendorPurchase(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getVendorPurchaseHistory = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.getVendorPurchaseHistory(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.compareVendorPrices = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.compareVendorPrices(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getProcurementStaff = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.getProcurementStaff(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.updatePurchaseStatus = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.updatePurchaseStatus(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.adminApproveProcurement = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.adminApproveProcurement(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getProductionManagers = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await procurementService.getProductionManagers(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};