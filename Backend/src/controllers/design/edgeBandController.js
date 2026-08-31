import * as svc from '../../services/edgeBandService.js';

export const createProcurementQueue = async (req, res) => {
    const { edgeBandRequestId } = req.body;
    if (!edgeBandRequestId) return res.status(400).json({ success: false, message: 'edgeBandRequestId is required' });
    try {
        const doc = await svc.createProcurementQueue(edgeBandRequestId, req.user._id);
        res.status(201).json({ success: true, doc });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const getProcurementQueue = async (req, res) => {
    try {
        const docs = await svc.getProcurementQueue(req.query);
        res.json({ success: true, docs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const selectProcurementCandidate = async (req, res) => {
    const { groupId } = req.params;
    const { selectedEdgeBandId } = req.body;
    if (!selectedEdgeBandId) return res.status(400).json({ success: false, message: 'selectedEdgeBandId is required' });
    try {
        const doc = await svc.selectProcurementCandidate(groupId, selectedEdgeBandId);
        res.json({ success: true, doc });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const markGroupNeedsPurchase = async (req, res) => {
    const { groupId } = req.params;
    try {
        const doc = await svc.markGroupNeedsPurchase(groupId);
        res.json({ success: true, doc });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const assignProcurementStaff = async (req, res) => {
    const { id } = req.params;
    const { assignedTo } = req.body;
    try {
        const doc = await svc.assignProcurementStaff(id, assignedTo);
        res.json({ success: true, doc });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const getBrands = async (req, res) => {
    try {
        const brands = await svc.getBrands();
        res.json({ success: true, brands });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const searchEdgeBands = async (req, res) => {
    const { brand, code } = req.query;
    try {
        const results = await svc.searchEdgeBands(brand, code ? code.trim() : '');
        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getEdgeBandById = async (req, res) => {
    try {
        const band = await svc.getEdgeBandById(req.params.id);
        if (!band) return res.status(404).json({ success: false, message: 'Edge band not found' });
        res.json({ success: true, band });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const saveSelections = async (req, res) => {
    const { projectId, taskId, items } = req.body;
    if (!projectId) return res.status(400).json({ success: false, message: 'projectId is required' });
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'items array is required' });
    }
    try {
        const saved = await svc.saveSelections(projectId, taskId, items, req.user._id);
        res.status(201).json({ success: true, saved });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const getProjectSelections = async (req, res) => {
    const { projectId } = req.params;
    try {
        const selections = await svc.getProjectSelections(projectId);
        res.json({ success: true, selections });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteSelection = async (req, res) => {
    try {
        await svc.deleteSelection(req.params.id, req.user._id);
        res.json({ success: true });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const submitRequest = async (req, res) => {
    const { projectId, taskId, items } = req.body;
    if (!projectId) return res.status(400).json({ success: false, message: 'projectId is required' });
    try {
        const request = await svc.submitRequest(projectId, taskId, items, req.user._id);
        res.status(201).json({ success: true, request });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const getRequests = async (req, res) => {
    try {
        const requests = await svc.getRequests(req.query);
        res.json({ success: true, requests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const managerReviewRequest = async (req, res) => {
    try {
        const request = await svc.managerReviewRequest(req.params.id, req.body, req.user._id);
        res.json({ success: true, request });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const adminReviewRequest = async (req, res) => {
    try {
        const request = await svc.adminReviewRequest(req.params.id, req.body, req.user._id);
        res.json({ success: true, request });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
