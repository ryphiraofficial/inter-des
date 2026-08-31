import mongoose from 'mongoose';

const EdgeBandItemSchema = new mongoose.Schema({
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    brandName: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Please provide edge band code'],
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Please provide edge band name'],
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    finish: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

EdgeBandItemSchema.index({ brandId: 1, code: 1 }, { unique: true });
EdgeBandItemSchema.index({ code: 1 });

export default mongoose.model('EdgeBandItem', EdgeBandItemSchema);
