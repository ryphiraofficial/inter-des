import * as svc from '../../services/edgeBandService.js';

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
    if (!code || code.trim().length < 2) {
        return res.json({ success: true, results: [] });
    }
    try {
        const results = await svc.searchEdgeBands(brand, code.trim());
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
