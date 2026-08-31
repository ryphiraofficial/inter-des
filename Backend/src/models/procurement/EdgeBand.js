import mongoose from 'mongoose';

const EdgeBandSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide edge band code'],
        trim: true,
        uppercase: true
    },
    batch: {
        type: String,
        trim: true,
        default: 'BATCH-001'
    },
    color: {
        type: String,
        trim: true
    },
    finish: {
        type: String,
        trim: true
    },
    widthMm: {
        type: Number,
        default: 22,
        min: 0
    },
    thicknessMm: {
        type: Number,
        default: 0.8,
        min: 0
    },
    rollLengthM: {
        type: Number,
        default: 50,
        min: 0
    },
    stockQtyM: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    reorderLevelM: {
        type: Number,
        default: 10,
        min: 0
    },
    pricePerMeter: {
        type: Number,
        default: 0,
        min: 0
    },
    supplier: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    brandName: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

EdgeBandSchema.pre('save', function (next) {
    if (this.stockQtyM === 0) {
        this.status = 'Out of Stock';
    } else if (this.stockQtyM <= this.reorderLevelM) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
    next();
});

EdgeBandSchema.index({ code: 1, batch: 1 });
EdgeBandSchema.index({ code: 'text', color: 'text', finish: 'text', brandName: 'text', supplier: 'text' });

export default mongoose.model('InventoryEdgeBand', EdgeBandSchema);
