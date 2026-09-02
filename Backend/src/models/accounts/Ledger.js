import mongoose from 'mongoose';

const LedgerSchema = new mongoose.Schema({
    ledgerNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please provide ledger name'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Customer', 'Vendor', 'General'],
        required: [true, 'Please specify ledger type']
    },
    linkedClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    linkedVendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    openingBalance: {
        type: Number,
        default: 0
    },
    balanceDue: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Closed'],
        default: 'Active'
    },
    notes: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

LedgerSchema.pre('save', async function (next) {
    if (!this.ledgerNumber) {
        const count = await mongoose.model('Ledger').countDocuments();
        this.ledgerNumber = `LDG-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

LedgerSchema.index({ linkedClient: 1, linkedVendor: 1 });

export default mongoose.model('Ledger', LedgerSchema);
