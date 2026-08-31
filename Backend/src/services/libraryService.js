import Brand from '../models/procurement/Brand.js';
import LaminationItem from '../models/library/LaminationItem.js';
import EdgeBandItem from '../models/library/EdgeBandItem.js';
import LaminateEdgeBandMatch from '../models/procurement/LaminateEdgeBandMatch.js';
import InventoryEdgeBand from '../models/procurement/EdgeBand.js';
import Laminate from '../models/procurement/Laminate.js';

// Brands
export const getBrands = async (type) => {
    const filter = {};
    if (type && type !== 'BOTH') {
        filter.$or = [{ type: type }, { type: 'BOTH' }];
    }
    return Brand.find(filter).sort({ name: 1 }).lean();
};

export const createBrand = async (data) => {
    return Brand.create(data);
};

// Lamination Items (Master Catalog)
export const getLaminationItems = async (query = {}) => {
    const filter = {};
    if (query.brandId) filter.brandId = query.brandId;
    if (query.search) {
        filter.$or = [
            { code: { $regex: query.search, $options: 'i' } },
            { name: { $regex: query.search, $options: 'i' } }
        ];
    }
    return LaminationItem.find(filter).populate('brandId', 'name').sort({ code: 1 }).lean();
};

export const lookupLamination = async (brandId, code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return null;

    // 1. Try exact finding in LaminationItem (Library)
    let lam = await LaminationItem.findOne({ brandId, code: cleanCode })
        .populate('brandId', 'name')
        .lean();

    // 1b. Fallback: try prefix/contains regex match in LaminationItem
    if (!lam) {
        lam = await LaminationItem.findOne({ brandId, code: { $regex: cleanCode, $options: 'i' } })
            .populate('brandId', 'name')
            .lean();
    }

    // 2. Fallback: try finding in Laminate (Procurement/Inventory) by brandName or brandId
    if (!lam) {
        const brandObj = await Brand.findById(brandId).lean();
        const brandName = brandObj?.name;
        const legacyLam = await Laminate.findOne({
            $or: [{ brandId }, { brandName }],
            code: { $regex: cleanCode, $options: 'i' }
        }).lean();

        if (legacyLam) {
            lam = {
                _id: legacyLam._id,
                brandId: legacyLam.brandId || brandId,
                brandName: legacyLam.brandName || brandName,
                code: legacyLam.code,
                name: legacyLam.name || legacyLam.code,
                color: legacyLam.color,
                finish: legacyLam.finish,
                isLegacy: true
            };
        }
    }

    return lam;
};

export const createLaminationItem = async (data) => {
    const brand = await Brand.findById(data.brandId).lean();
    if (!brand) throw Object.assign(new Error('Brand not found'), { status: 400 });

    return LaminationItem.create({
        ...data,
        brandName: brand.name,
        code: data.code.trim().toUpperCase()
    });
};

// Edge Band Items (Master Catalog)
export const getEdgeBandItems = async (query = {}) => {
    const filter = {};
    if (query.brandId) filter.brandId = query.brandId;
    if (query.search) {
        filter.$or = [
            { code: { $regex: query.search, $options: 'i' } },
            { name: { $regex: query.search, $options: 'i' } }
        ];
    }
    return EdgeBandItem.find(filter).populate('brandId', 'name').sort({ code: 1 }).lean();
};

export const createEdgeBandItem = async (data) => {
    const brand = await Brand.findById(data.brandId).lean();
    if (!brand) throw Object.assign(new Error('Brand not found'), { status: 400 });

    return EdgeBandItem.create({
        ...data,
        brandName: brand.name,
        code: data.code.trim().toUpperCase()
    });
};

// Matched Edge Bands for a Lamination Item
export const getMatchedEdgeBandsForLamination = async (laminationItemId) => {
    // Check matches by laminationItemId OR legacy laminateId
    const matches = await LaminateEdgeBandMatch.find({
        $or: [{ laminationItemId }, { laminateId: laminationItemId }]
    })
        .populate({
            path: 'edgeBandItemId',
            populate: { path: 'brandId', select: 'name' }
        })
        .populate({
            path: 'edgeBandId',
            populate: { path: 'brandId', select: 'name' }
        })
        .sort({ matchPercent: -1 })
        .lean();

    // Transform and attach live stock from InventoryEdgeBand
    const results = [];
    for (const m of matches) {
        const item = m.edgeBandItemId || m.edgeBandId;
        if (!item) continue;

        const code = item.code;
        const inv = await InventoryEdgeBand.findOne({ code }).lean();

        results.push({
            matchId: m._id,
            edgeBandItemId: item._id,
            brand: item.brandName || item.brandId?.name || 'Generic',
            code: item.code,
            name: item.name || item.code,
            color: item.color || inv?.color || '—',
            finish: item.finish || inv?.finish || '—',
            matchPercent: m.matchPercent ?? 100,
            stockQtyM: inv?.stockQtyM ?? 0,
            stockStatus: inv?.status ?? (inv ? 'Out of Stock' : 'Not in Stock'),
            inventoryId: inv?._id || null
        });
    }

    return results;
};

// Create a match
export const createMatch = async ({ laminationItemId, edgeBandItemId, matchPercent }) => {
    return LaminateEdgeBandMatch.create({
        laminationItemId,
        edgeBandItemId,
        matchPercent: parseFloat(matchPercent) || 100
    });
};

export const deleteMatch = async (matchId) => {
    await LaminateEdgeBandMatch.findByIdAndDelete(matchId);
    return true;
};
