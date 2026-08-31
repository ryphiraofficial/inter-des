import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide brand name'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['LAMINATION', 'EDGE_BAND', 'BOTH'],
        default: 'BOTH'
    },
    codeSeries: {
        type: String,
        trim: true
    },
    supplier: {
        type: String,
        trim: true
    },
    description: {
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

export default mongoose.model('Brand', BrandSchema);
