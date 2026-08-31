import mongoose from 'mongoose';
import '../admin/User.js';
import './Project.js';
import './Task.js';
import './EdgeBandRequest.js';

const CandidateSchema = new mongoose.Schema({
    edgeBandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryEdgeBand',
        required: true
    }
}, { _id: false });

const GroupSchema = new mongoose.Schema({
    requestedBrand: { type: String, default: '' },
    edgeBandCode: { type: String, required: true, uppercase: true, trim: true },
    quantityNeededM: { type: Number, required: true, min: 0 },
    matchPercent: { type: Number, default: null },
    candidates: [CandidateSchema],
    selectedEdgeBandId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryEdgeBand', default: null },
    status: {
        type: String,
        enum: ['pending', 'fulfilled_from_stock', 'needs_purchase'],
        default: 'pending'
    }
}, { timestamps: true });

const EdgeBandProcurementRequestSchema = new mongoose.Schema({
    edgeBandRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EdgeBandRequest',
        required: true
    },
    taskLabel: { type: String, default: '' },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'partially_fulfilled', 'fulfilled', 'needs_purchase'],
        default: 'pending'
    },
    groups: [GroupSchema]
}, { timestamps: true });

export default mongoose.model('EdgeBandProcurementRequest', EdgeBandProcurementRequestSchema);
