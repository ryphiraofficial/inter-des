import mongoose from 'mongoose';
import '../admin/User.js';
import './Project.js';
import './Task.js';
import './EdgeBand.js';

const EdgeBandRequestItemSchema = new mongoose.Schema({
    brand: { type: String, required: true, trim: true },
    enteredCode: { type: String, required: true, trim: true, uppercase: true },
    matchedCode: { type: String, required: true, trim: true, uppercase: true },
    matchPercentage: { type: Number, required: true },
    edgeBandRef: { type: mongoose.Schema.Types.ObjectId, ref: 'EdgeBand', required: false },
    dimension: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { _id: true });

const EdgeBandRequestSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project is required']
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: null
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [EdgeBandRequestItemSchema],
    status: {
        type: String,
        enum: ['draft', 'pending_manager', 'pending_admin', 'approved', 'rejected'],
        default: 'pending_manager'
    },
    managerNote: { type: String, default: '' },
    adminNote: { type: String, default: '' },
    reviewedByManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null }
}, {
    timestamps: true
});

export default mongoose.model('EdgeBandRequest', EdgeBandRequestSchema);
