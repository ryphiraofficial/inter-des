import * as svc from '../services/libraryService.js';

export const getBrands = async (req, res) => {
    try {
        const brands = await svc.getBrands(req.query.type);
        res.json({ success: true, data: brands, brands });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createBrand = async (req, res) => {
    try {
        const brand = await svc.createBrand({ ...req.body, createdBy: req.user?._id });
        res.status(201).json({ success: true, data: brand });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getLaminationItems = async (req, res) => {
    try {
        const items = await svc.getLaminationItems(req.query);
        res.json({ success: true, items, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const lookupLamination = async (req, res) => {
    try {
        const { brandId, code } = req.query;
        if (!brandId || !code) {
            return res.status(400).json({ success: false, message: 'brandId and code are required' });
        }
        const item = await svc.lookupLamination(brandId, code);
        res.json({ success: true, item: item || null });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createLaminationItem = async (req, res) => {
    try {
        const item = await svc.createLaminationItem({ ...req.body, createdBy: req.user?._id });
        res.status(201).json({ success: true, item });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const getEdgeBandItems = async (req, res) => {
    try {
        const items = await svc.getEdgeBandItems(req.query);
        res.json({ success: true, items, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createEdgeBandItem = async (req, res) => {
    try {
        const item = await svc.createEdgeBandItem({ ...req.body, createdBy: req.user?._id });
        res.status(201).json({ success: true, item });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

export const getMatchedEdgeBands = async (req, res) => {
    try {
        const matches = await svc.getMatchedEdgeBandsForLamination(req.params.laminationItemId);
        res.json({ success: true, matches, results: matches });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createMatch = async (req, res) => {
    try {
        const match = await svc.createMatch(req.body);
        res.status(201).json({ success: true, match });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteMatch = async (req, res) => {
    try {
        await svc.deleteMatch(req.params.id);
        res.json({ success: true, message: 'Match removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
