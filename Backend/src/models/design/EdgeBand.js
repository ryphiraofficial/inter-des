import mongoose from 'mongoose';

const FIXED_DIMENSIONS = ['22x0.8', '22x2', '45x0.8', '45x2'];

const EdgeBandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Code is required'],
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    finish: {
        type: String,
        trim: true
    },
    material: {
        type: String,
        trim: true
    },
    dimensions: [{
        dimension: {
            type: String,
            enum: FIXED_DIMENSIONS,
            required: true
        },
        available: {
            type: Boolean,
            default: true
        }
    }]
}, {
    timestamps: true
});

// Compound unique: code is unique within a brand
EdgeBandSchema.index({ brand: 1, code: 1 }, { unique: true });
// Text index for search
EdgeBandSchema.index({ code: 1, brand: 1 });

export { FIXED_DIMENSIONS };
export default mongoose.model('EdgeBand', EdgeBandSchema);
