import EdgeBand from '../models/design/EdgeBand.js';
import EdgeBandSelection from '../models/design/EdgeBandSelection.js';
import { matchEdgeBands } from '../utils/edgeBandMatcher.js';

export const getBrands = async () => {
    return EdgeBand.distinct('brand');
};

export const searchEdgeBands = async (brand, code) => {
    const filter = brand ? { brand } : {};
    const candidates = await EdgeBand.find(filter).lean();
    return matchEdgeBands(code, candidates);
};

export const getEdgeBandById = async (id) => {
    return EdgeBand.findById(id).lean();
};

/**
 * Save edge band selections.
 * - Validates brand, edgeBandRef, dimension on the server.
 * - Re-computes match percentage — does NOT trust the client value.
 * - Merges quantity on duplicate brand+matchedCode+dimension per project.
 */
export const saveSelections = async (projectId, taskId, items, userId) => {
    const saved = [];

    for (const item of items) {
        const { brand, enteredCode, edgeBandId, dimension, quantity } = item;

        // Server-side validation
        const band = await EdgeBand.findById(edgeBandId).lean();
        if (!band) throw Object.assign(new Error(`Edge band not found: ${edgeBandId}`), { status: 400 });
        if (band.brand !== brand) throw Object.assign(new Error(`Brand mismatch for code ${band.code}`), { status: 400 });

        const dimRecord = band.dimensions.find(d => d.dimension === dimension);
        if (!dimRecord || !dimRecord.available) {
            throw Object.assign(new Error(`Dimension ${dimension} not available for ${band.code}`), { status: 400 });
        }

        const qty = parseInt(quantity, 10);
        if (!Number.isInteger(qty) || qty < 1) {
            throw Object.assign(new Error(`Invalid quantity: ${quantity}`), { status: 400 });
        }

        // Recompute match on server
        const [matchResult] = matchEdgeBands(enteredCode, [band]);
        const matchPercentage = matchResult?.match ?? 100; // exact if not fuzzy

        // Upsert: merge quantity if same project+brand+matchedCode+dimension
        const result = await EdgeBandSelection.findOneAndUpdate(
            { project: projectId, brand, matchedCode: band.code, dimension },
            {
                $inc: { quantity: qty },
                $setOnInsert: {
                    task: taskId || null,
                    enteredCode: enteredCode.toUpperCase(),
                    edgeBandRef: band._id,
                    matchPercentage,
                    createdBy: userId
                }
            },
            { upsert: true, new: true }
        );

        saved.push(result);
    }

    return saved;
};

export const getProjectSelections = async (projectId) => {
    return EdgeBandSelection.find({ project: projectId })
        .populate('edgeBandRef', 'name code brand')
        .lean();
};

export const deleteSelection = async (selectionId, userId) => {
    const sel = await EdgeBandSelection.findById(selectionId);
    if (!sel) throw Object.assign(new Error('Selection not found'), { status: 404 });
    await sel.deleteOne();
    return true;
};
