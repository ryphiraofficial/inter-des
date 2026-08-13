import mongoose from 'mongoose';
import { FIXED_DIMENSIONS } from './EdgeBand.js';

const EdgeBandSelectionSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project is required']
    },
    // Optional task anchor — useful for linking to the specific design task
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: null
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    enteredCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    matchedCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    // Server-computed — never trusted from client
    matchPercentage: {
        type: Number,
        required: true,
        min: 70,
        max: 100
    },
    edgeBandRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EdgeBand',
        required: true
    },
    dimension: {
        type: String,
        required: true,
        enum: FIXED_DIMENSIONS
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be a whole number'
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Unique constraint: no duplicate brand+matchedCode+dimension per project
EdgeBandSelectionSchema.index(
    { project: 1, brand: 1, matchedCode: 1, dimension: 1 },
    { unique: true }
);

export default mongoose.model('EdgeBandSelection', EdgeBandSelectionSchema);
