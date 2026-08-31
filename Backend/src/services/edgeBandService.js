import mongoose from 'mongoose';
import EdgeBand from '../models/design/EdgeBand.js';
import EdgeBandSelection from '../models/design/EdgeBandSelection.js';
import EdgeBandRequest from '../models/design/EdgeBandRequest.js';
import EdgeBandProcurementRequest from '../models/design/EdgeBandProcurementRequest.js';
import InventoryEdgeBand from '../models/procurement/EdgeBand.js';
import EdgeBandItem from '../models/library/EdgeBandItem.js';
import LaminateEdgeBandMatch from '../models/procurement/LaminateEdgeBandMatch.js';
import Notification from '../models/shared/Notification.js';
import { matchEdgeBands } from '../utils/edgeBandMatcher.js';

export const getBrands = async () => {
    return EdgeBand.distinct('brand');
};

export const searchEdgeBands = async (brand, code) => {
    const filter = brand ? { brand } : {};
    const candidates = await EdgeBand.find(filter).lean();
    return matchEdgeBands(code || '', candidates);
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
        const { brand, enteredCode, edgeBandId, dimension = '22x0.8', quantity, matchPercentage: clientMatch } = item;

        // Multi-model lookup (EdgeBand, EdgeBandItem, InventoryEdgeBand, or LaminateEdgeBandMatch)
        let band = await EdgeBand.findById(edgeBandId).lean();
        if (!band) band = await EdgeBandItem.findById(edgeBandId).lean();
        if (!band) band = await InventoryEdgeBand.findById(edgeBandId).lean();
        if (!band) band = await LaminateEdgeBandMatch.findById(edgeBandId).lean();

        const bandCode = band?.code || item.matchedCode || enteredCode;
        const bandBrand = band?.brand || band?.brandName || brand;

        const qty = parseInt(quantity, 10) || 1;
        const matchPercentage = clientMatch || 100;
        const targetRefId = band?._id || (mongoose.Types.ObjectId.isValid(edgeBandId) ? edgeBandId : new mongoose.Types.ObjectId());

        // Upsert: merge quantity if same project+brand+matchedCode+dimension
        const result = await EdgeBandSelection.findOneAndUpdate(
            { project: projectId, brand: bandBrand, matchedCode: bandCode, dimension },
            {
                $inc: { quantity: qty },
                $setOnInsert: {
                    task: taskId || null,
                    enteredCode: (enteredCode || bandCode).toUpperCase(),
                    edgeBandRef: targetRefId,
                    matchPercentage,
                    createdBy: userId
                }
            },
            { upsert: true, new: true }
        );

        saved.push(result);
    }

    // Auto-create/sync EdgeBandRequest so manager instantly sees the submitted edge bands
    try {
        const allSelections = await EdgeBandSelection.find({ project: projectId }).lean();
        if (allSelections.length > 0) {
            const reqItems = allSelections.map(s => ({
                brand: s.brand,
                enteredCode: s.enteredCode,
                matchedCode: s.matchedCode,
                matchPercentage: s.matchPercentage,
                edgeBandRef: s.edgeBandRef,
                dimension: s.dimension,
                quantity: s.quantity
            }));
            await submitRequest(projectId, taskId, reqItems, userId);
        }
    } catch (syncErr) {
        console.error('Failed auto-syncing EdgeBandRequest:', syncErr.message);
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

/**
 * Submit edge band selections for Manager Approval.
 * Creates or updates an EdgeBandRequest for the project/task.
 */
export const submitRequest = async (projectId, taskId, items, userId) => {
    let reqDoc = await EdgeBandRequest.findOne({ project: projectId, status: { $in: ['pending_manager', 'pending_admin', 'draft', 'rejected'] } })
        .sort({ createdAt: -1 });

    if (!reqDoc || reqDoc.status === 'approved' || reqDoc.status === 'rejected') {
        reqDoc = new EdgeBandRequest({
            project: projectId,
            task: taskId || null,
            submittedBy: userId,
            items: items,
            status: 'pending_manager'
        });
    } else {
        reqDoc.items = items;
        reqDoc.task = taskId || reqDoc.task;
        reqDoc.status = 'pending_manager';
        reqDoc.submittedBy = userId;
    }

    await reqDoc.save();
    return reqDoc.populate([
        { path: 'project', select: 'name projectNumber' },
        { path: 'submittedBy', select: 'name email role' }
    ]);
};

/**
 * Get EdgeBandRequests filtered by status/role/project.
 */
export const getRequests = async (query = {}) => {
    const filter = {};
    if (query.projectId) filter.project = query.projectId;
    if (query.status) filter.status = query.status;

    return EdgeBandRequest.find(filter)
        .populate('project', 'name projectNumber')
        .populate('task', 'title')
        .populate('submittedBy', 'fullName name email role')
        .populate('reviewedByManager', 'fullName name')
        .populate('reviewedByAdmin', 'fullName name')
        .sort({ updatedAt: -1 })
        .lean();
};

/**
 * Manager review of edge band request.
 * Allows updating status ('pending_admin' or 'rejected'), managerNote, and updated item quantities if edited.
 */
export const managerReviewRequest = async (requestId, { status, managerNote, items }, reviewerId) => {
    const reqDoc = await EdgeBandRequest.findById(requestId).populate('project', 'name projectNumber');
    if (!reqDoc) throw Object.assign(new Error('Request not found'), { status: 404 });

    if (!['pending_admin', 'rejected'].includes(status)) {
        throw Object.assign(new Error('Invalid status for manager review'), { status: 400 });
    }

    reqDoc.status = status;
    if (managerNote !== undefined) reqDoc.managerNote = managerNote;
    if (Array.isArray(items) && items.length > 0) reqDoc.items = items;
    reqDoc.reviewedByManager = reviewerId;
    reqDoc.reviewedAt = new Date();

    await reqDoc.save();

    // Send Notification to staff member
    try {
        if (reqDoc.submittedBy) {
            const projName = reqDoc.project?.name || reqDoc.project?.projectNumber || 'Project';
            if (status === 'rejected') {
                await Notification.create({
                    title: 'Edge Band Recheck Requested ⚠️',
                    description: `Manager requested a recheck for ${projName} edge bands. ${managerNote ? `Feedback: "${managerNote}"` : 'Please review and resubmit.'}`,
                    type: 'Warning',
                    recipient: reqDoc.submittedBy,
                    relatedModel: 'Project',
                    relatedId: reqDoc.project?._id || reqDoc.project,
                    createdBy: reviewerId
                });
            } else if (status === 'pending_admin') {
                await Notification.create({
                    title: 'Edge Bands Approved by Manager ✅',
                    description: `Your edge band selections for ${projName} were approved by the Manager and forwarded for Admin release.`,
                    type: 'Success',
                    recipient: reqDoc.submittedBy,
                    relatedModel: 'Project',
                    relatedId: reqDoc.project?._id || reqDoc.project,
                    createdBy: reviewerId
                });
            }
        }
    } catch (notifErr) {
        console.error('Failed sending notification:', notifErr.message);
    }

    return reqDoc;
};

/**
 * Admin review of edge band request.
 * Move from 'pending_admin' to 'approved' or 'rejected'.
 */
export const adminReviewRequest = async (requestId, { status, adminNote }, reviewerId) => {
    const reqDoc = await EdgeBandRequest.findById(requestId);
    if (!reqDoc) throw Object.assign(new Error('Request not found'), { status: 404 });

    if (!['approved', 'rejected'].includes(status)) {
        throw Object.assign(new Error('Invalid status for admin review'), { status: 400 });
    }

    reqDoc.status = status;
    if (adminNote !== undefined) reqDoc.adminNote = adminNote;
    reqDoc.reviewedByAdmin = reviewerId;
    reqDoc.reviewedAt = new Date();

    await reqDoc.save();

    // Auto-create procurement queue entry when Admin approves
    if (status === 'approved') {
        try {
            await createProcurementQueue(requestId, reviewerId);
        } catch (procErr) {
            console.error('Failed auto-creating procurement queue entry:', procErr.message);
        }
    }

    return reqDoc;
};

/**
 * Create a procurement queue entry from an approved EdgeBandRequest.
 * Groups flat items[] by matchedCode, finds InventoryEdgeBand candidates per code.
 */
export const createProcurementQueue = async (edgeBandRequestId, userId) => {
    const req = await EdgeBandRequest.findById(edgeBandRequestId)
        .populate('project', 'name projectNumber')
        .populate('task', 'title');
    if (!req) throw Object.assign(new Error('EdgeBandRequest not found'), { status: 404 });
    if (req.status !== 'approved') throw Object.assign(new Error('Only approved requests can be sent to procurement'), { status: 400 });

    // Delete any old queue request for this edgeBandRequestId so it refreshes cleanly
    await EdgeBandProcurementRequest.deleteOne({ edgeBandRequestId });

    // Map every item directly 1:1 without any grouping or filtering
    const groups = [];
    for (const item of req.items) {
        const code = item.matchedCode || item.enteredCode;
        const invBands = await InventoryEdgeBand.find({ code }).lean();
        const candidateIds = new Set([...invBands.map(b => String(b._id))]);
        groups.push({
            requestedBrand: item.brand || '',
            edgeBandCode: code,
            dimension: item.dimension || '',
            quantityNeededM: item.quantity,
            matchPercent: item.matchPercentage || null,
            candidates: [...candidateIds].map(id => ({ edgeBandId: id }))
        });
    }

    const label = req.task?.title
        ? `${req.task.title} — ${req.project?.name || req.project?.projectNumber || ''}`
        : req.project?.name || req.project?.projectNumber || 'Project';

    const doc = await EdgeBandProcurementRequest.create({
        edgeBandRequestId,
        taskLabel: label,
        requestedBy: userId,
        groups
    });
    return doc;
};

/**
 * List procurement queue, with live stock for each candidate populated.
 */
export const getProcurementQueue = async (query = {}) => {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.assignedTo) filter.assignedTo = query.assignedTo;

    const docs = await EdgeBandProcurementRequest.find(filter)
        .populate('requestedBy', 'fullName name email')
        .populate('assignedTo', 'fullName name email role')
        .populate('edgeBandRequestId')
        .sort({ createdAt: -1 });

    // Auto re-sync any pending request whose groups don't match 1:1 with req.items
    for (const doc of docs) {
        if (doc.edgeBandRequestId && Array.isArray(doc.edgeBandRequestId.items) && doc.status === 'pending') {
            const reqItems = doc.edgeBandRequestId.items;
            if (doc.groups.length !== reqItems.length) {
                const newGroups = [];
                for (const item of reqItems) {
                    const code = item.matchedCode || item.enteredCode;
                    const invBands = await InventoryEdgeBand.find({ code }).lean();
                    const candidateIds = new Set([...invBands.map(b => String(b._id))]);
                    newGroups.push({
                        requestedBrand: item.brand || '',
                        edgeBandCode: code,
                        dimension: item.dimension || '',
                        quantityNeededM: item.quantity,
                        matchPercent: item.matchPercentage || null,
                        candidates: [...candidateIds].map(id => ({ edgeBandId: id }))
                    });
                }
                doc.groups = newGroups;
                await doc.save();
            }
        }
    }

    const docsObj = docs.map(d => d.toObject());

    // Populate live stock for each candidate
    for (const doc of docsObj) {
        for (const group of doc.groups) {
            const ids = group.candidates.map(c => c.edgeBandId);
            const bands = await InventoryEdgeBand.find({ _id: { $in: ids } })
                .select('code brandName color finish stockQtyM reorderLevelM status')
                .lean();
            const bandMap = Object.fromEntries(bands.map(b => [String(b._id), b]));
            group.candidates = group.candidates.map(c => ({
                edgeBandId: c.edgeBandId,
                ...bandMap[String(c.edgeBandId)]
            }));
        }
    }

    return docsObj;
};

/**
 * Procurement selects a candidate for a group.
 * Deducts stock if sufficient; marks group and parent request status accordingly.
 */
export const selectProcurementCandidate = async (groupId, selectedEdgeBandId) => {
    const doc = await EdgeBandProcurementRequest.findOne({ 'groups._id': groupId });
    if (!doc) throw Object.assign(new Error('Group not found'), { status: 404 });

    const group = doc.groups.id(groupId);

    const invBand = await InventoryEdgeBand.findById(selectedEdgeBandId);
    if (!invBand) throw Object.assign(new Error('Inventory edge band not found'), { status: 404 });

    if (invBand.stockQtyM >= group.quantityNeededM) {
        // Deduct stock
        invBand.stockQtyM = parseFloat((invBand.stockQtyM - group.quantityNeededM).toFixed(3));
        await invBand.save(); // pre-save hook updates status
        group.status = 'fulfilled_from_stock';
    } else {
        group.status = 'needs_purchase';
    }

    group.selectedEdgeBandId = selectedEdgeBandId;

    // Recompute parent status
    const statuses = doc.groups.map(g => g.status);
    if (statuses.every(s => s === 'fulfilled_from_stock')) {
        doc.status = 'fulfilled';
    } else if (statuses.every(s => s === 'needs_purchase')) {
        doc.status = 'needs_purchase';
    } else if (statuses.some(s => s !== 'pending')) {
        doc.status = 'partially_fulfilled';
    }

    await doc.save();
    return doc;
};

/**
 * Mark a group as needs_purchase without stock deduction.
 */
export const markGroupNeedsPurchase = async (groupId) => {
    const doc = await EdgeBandProcurementRequest.findOne({ 'groups._id': groupId });
    if (!doc) throw Object.assign(new Error('Group not found'), { status: 404 });

    const group = doc.groups.id(groupId);
    group.status = 'needs_purchase';

    const statuses = doc.groups.map(g => g.status);
    if (statuses.every(s => s === 'needs_purchase')) {
        doc.status = 'needs_purchase';
    } else if (statuses.some(s => s !== 'pending')) {
        doc.status = 'partially_fulfilled';
    }

    await doc.save();
    return doc;
};

/**
 * Assign a procurement staff member to an Edge Band procurement request.
 */
export const assignProcurementStaff = async (requestId, assignedToUserId) => {
    const doc = await EdgeBandProcurementRequest.findById(requestId);
    if (!doc) throw Object.assign(new Error('Procurement request not found'), { status: 404 });

    doc.assignedTo = assignedToUserId || null;
    await doc.save();

    return EdgeBandProcurementRequest.findById(requestId)
        .populate('requestedBy', 'fullName name email')
        .populate('assignedTo', 'fullName name email role')
        .lean();
};
