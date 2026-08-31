import EdgeBand from '../../models/procurement/EdgeBand.js';
import Laminate from '../../models/procurement/Laminate.js';
import Brand from '../../models/procurement/Brand.js';
import LaminateEdgeBandMatch from '../../models/procurement/LaminateEdgeBandMatch.js';
import AuditLog from '../../models/shared/AuditLog.js';
import { createNotification } from '../../utils/notificationHelper.js';

// --- BRAND CONTROLLERS ---
export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });
        res.status(200).json({ success: true, data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBrand = async (req, res) => {
    try {
        const brand = await Brand.create({
            ...req.body,
            createdBy: req.user?._id || req.user?.id
        });
        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- LAMINATE CONTROLLERS ---
export const getLaminates = async (req, res) => {
    try {
        const { search, brandName, status, page = 1, limit = 50 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { code: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { color: { $regex: search, $options: 'i' } },
                { finish: { $regex: search, $options: 'i' } }
            ];
        }

        if (brandName) query.brandName = brandName;
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const laminates = await Laminate.find(query)
            .populate('brandId', 'name codeSeries')
            .populate('createdBy', 'fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Laminate.countDocuments(query);

        res.status(200).json({
            success: true,
            count: laminates.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: laminates
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createLaminate = async (req, res) => {
    try {
        const laminate = await Laminate.create({
            ...req.body,
            createdBy: req.user?._id || req.user?.id
        });
        res.status(201).json({ success: true, data: laminate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateLaminate = async (req, res) => {
    try {
        let laminate = await Laminate.findById(req.params.id);
        if (!laminate) {
            return res.status(404).json({ success: false, message: 'Laminate not found' });
        }

        laminate = await Laminate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: laminate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteLaminate = async (req, res) => {
    try {
        const laminate = await Laminate.findById(req.params.id);
        if (!laminate) {
            return res.status(404).json({ success: false, message: 'Laminate not found' });
        }

        await LaminateEdgeBandMatch.deleteMany({ laminateId: req.params.id });
        await laminate.deleteOne();

        res.status(200).json({ success: true, message: 'Laminate deleted', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- EDGE BAND CONTROLLERS ---
export const getEdgeBands = async (req, res) => {
    try {
        const { search, brandName, status, page = 1, limit = 50 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { code: { $regex: search, $options: 'i' } },
                { batch: { $regex: search, $options: 'i' } },
                { color: { $regex: search, $options: 'i' } },
                { finish: { $regex: search, $options: 'i' } },
                { supplier: { $regex: search, $options: 'i' } }
            ];
        }

        if (brandName) query.brandName = brandName;
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const edgeBands = await EdgeBand.find(query)
            .populate('brandId', 'name codeSeries')
            .populate('createdBy', 'fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await EdgeBand.countDocuments(query);

        res.status(200).json({
            success: true,
            count: edgeBands.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: edgeBands
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEdgeBand = async (req, res) => {
    try {
        const edgeBand = await EdgeBand.findById(req.params.id)
            .populate('brandId', 'name codeSeries')
            .populate('createdBy', 'fullName');

        if (!edgeBand) {
            return res.status(404).json({ success: false, message: 'Edge Band not found' });
        }
        res.status(200).json({ success: true, data: edgeBand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createEdgeBand = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const edgeBand = new EdgeBand({
            ...req.body,
            createdBy: userId
        });
        await edgeBand.save();

        if (edgeBand.status === 'Low Stock' || edgeBand.status === 'Out of Stock') {
            await createNotification({
                title: `⚠️ Edge Band Stock Alert (${edgeBand.status})`,
                description: `Edge Band "${edgeBand.code}" (${edgeBand.color || 'Default'}) is added with low stock: ${edgeBand.stockQtyM}m`,
                type: edgeBand.status === 'Out of Stock' ? 'Error' : 'Warning',
                relatedModel: 'InventoryEdgeBand',
                relatedId: edgeBand._id,
                createdBy: userId
            });
        }

        res.status(201).json({ success: true, data: edgeBand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const bulkCreateEdgeBands = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const items = Array.isArray(req.body.items) ? req.body.items : Array.isArray(req.body) ? req.body : [];

        if (items.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide at least one Edge Band to add' });
        }

        const preparedItems = items.map(item => ({
            ...item,
            code: (item.code || '').trim().toUpperCase(),
            createdBy: userId
        }));

        const createdBands = await EdgeBand.insertMany(preparedItems);

        res.status(201).json({
            success: true,
            count: createdBands.length,
            data: createdBands
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateEdgeBand = async (req, res) => {
    try {
        let edgeBand = await EdgeBand.findById(req.params.id);
        if (!edgeBand) {
            return res.status(404).json({ success: false, message: 'Edge Band not found' });
        }

        Object.assign(edgeBand, req.body);
        await edgeBand.save();

        res.status(200).json({ success: true, data: edgeBand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteEdgeBand = async (req, res) => {
    try {
        const edgeBand = await EdgeBand.findById(req.params.id);
        if (!edgeBand) {
            return res.status(404).json({ success: false, message: 'Edge Band not found' });
        }

        await LaminateEdgeBandMatch.deleteMany({ edgeBandId: req.params.id });
        await edgeBand.deleteOne();

        res.status(200).json({ success: true, message: 'Edge Band deleted', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adjustEdgeBandStock = async (req, res) => {
    try {
        const { adjustmentMeters, reason } = req.body;
        const userId = req.user?._id || req.user?.id;

        const edgeBand = await EdgeBand.findById(req.params.id);
        if (!edgeBand) {
            return res.status(404).json({ success: false, message: 'Edge Band not found' });
        }

        const oldStockM = edgeBand.stockQtyM;
        const newStockM = Math.max(0, oldStockM + Number(adjustmentMeters || 0));

        edgeBand.stockQtyM = newStockM;
        await edgeBand.save();

        if (userId) {
            await AuditLog.create({
                userId,
                action: 'STOCK_ADJUSTMENT',
                module: 'Material',
                referenceId: edgeBand._id,
                referenceModel: 'InventoryEdgeBand',
                oldValue: { stockQtyM: oldStockM },
                newValue: { stockQtyM: newStockM },
                description: `Stock adjusted by ${adjustmentMeters}m. Reason: ${reason || 'Manual adjustment'}`
            });
        }

        if (edgeBand.status === 'Low Stock') {
            await createNotification({
                title: '⚠️ Edge Band Low Stock Alert',
                description: `Edge Band "${edgeBand.code}" stock is running low (${edgeBand.stockQtyM}m remaining).`,
                type: 'Warning',
                relatedModel: 'InventoryEdgeBand',
                relatedId: edgeBand._id,
                createdBy: userId
            });
        } else if (edgeBand.status === 'Out of Stock') {
            await createNotification({
                title: '🚨 Edge Band Out of Stock',
                description: `Edge Band "${edgeBand.code}" is out of stock!`,
                type: 'Error',
                relatedModel: 'InventoryEdgeBand',
                relatedId: edgeBand._id,
                createdBy: userId
            });
        }

        res.status(200).json({ success: true, data: edgeBand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- LAMINATE MATCHES CONTROLLERS ---
export const getLaminateMatches = async (req, res) => {
    try {
        const matches = await LaminateEdgeBandMatch.find({ laminateId: req.params.laminateId })
            .populate({
                path: 'edgeBandId',
                populate: { path: 'brandId', select: 'name' }
            })
            .populate('createdBy', 'fullName')
            .sort({ isPrimary: -1, matchPercent: -1 });

        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addOrUpdateMatch = async (req, res) => {
    try {
        const { laminateId } = req.params;
        const { edgeBandId, matchPercent = 100, isPrimary = false, notes } = req.body;
        const userId = req.user?._id || req.user?.id;

        if (isPrimary) {
            await LaminateEdgeBandMatch.updateMany(
                { laminateId },
                { isPrimary: false }
            );
        }

        let match = await LaminateEdgeBandMatch.findOne({ laminateId, edgeBandId });
        if (match) {
            match.matchPercent = matchPercent;
            match.isPrimary = isPrimary;
            if (notes !== undefined) match.notes = notes;
            await match.save();
        } else {
            match = await LaminateEdgeBandMatch.create({
                laminateId,
                edgeBandId,
                matchPercent,
                isPrimary,
                notes,
                createdBy: userId
            });
        }

        const populatedMatch = await LaminateEdgeBandMatch.findById(match._id)
            .populate({
                path: 'edgeBandId',
                populate: { path: 'brandId', select: 'name' }
            });

        res.status(200).json({ success: true, data: populatedMatch });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const setPrimaryMatch = async (req, res) => {
    try {
        const { laminateId, matchId } = req.params;

        await LaminateEdgeBandMatch.updateMany(
            { laminateId },
            { isPrimary: false }
        );

        const match = await LaminateEdgeBandMatch.findByIdAndUpdate(
            matchId,
            { isPrimary: true },
            { new: true }
        ).populate({
            path: 'edgeBandId',
            populate: { path: 'brandId', select: 'name' }
        });

        if (!match) {
            return res.status(404).json({ success: false, message: 'Match not found' });
        }

        res.status(200).json({ success: true, data: match });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteMatch = async (req, res) => {
    try {
        const match = await LaminateEdgeBandMatch.findById(req.params.matchId);
        if (!match) {
            return res.status(404).json({ success: false, message: 'Match not found' });
        }

        await match.deleteOne();
        res.status(200).json({ success: true, message: 'Match deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
