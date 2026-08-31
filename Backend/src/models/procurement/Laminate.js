import mongoose from 'mongoose';

const LaminateSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide laminate code'],
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Please provide laminate name'],
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
    color: {
        type: String,
        trim: true
    },
    finish: {
        type: String,
        trim: true
    },
    thicknessMm: {
        type: Number,
        default: 1.0,
        min: 0
    },
    sheetSize: {
        type: String,
        default: '8x4 ft',
        trim: true
    },
    stockQty: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    reorderLevel: {
        type: Number,
        default: 5,
        min: 0
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    costPrice: {
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

LaminateSchema.pre('save', function (next) {
    if (this.stockQty === 0) {
        this.status = 'Out of Stock';
    } else if (this.stockQty <= this.reorderLevel) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
    next();
});

LaminateSchema.index({ code: 1, brandName: 1 });
LaminateSchema.index({ name: 'text', code: 'text', color: 'text', finish: 'text' });

export default mongoose.model('Laminate', LaminateSchema);
