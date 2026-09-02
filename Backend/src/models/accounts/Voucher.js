import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
    voucherNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Sale', 'Receipt', 'Purchase', 'Payment', 'Journal'],
        required: [true, 'Please specify voucher type']
    },
    ledger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ledger',
        required: [true, 'Please link a ledger']
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount'],
        min: 0
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'Cheque', 'UPI', 'Card', 'Other', null],
        default: null
    },
    reference: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Posted', 'Cancelled'],
        default: 'Posted'
    },
    expenseCategory: {
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

VoucherSchema.pre('save', async function (next) {
    if (!this.voucherNumber) {
        const count = await mongoose.model('Voucher').countDocuments({ type: this.type });
        const year = new Date().getFullYear();
        let prefix = 'VCH';
        if (this.type === 'Sale') prefix = 'SLS';
        if (this.type === 'Receipt') prefix = 'RCP';
        if (this.type === 'Purchase') prefix = 'PUR';
        if (this.type === 'Payment') prefix = 'PMT';
        if (this.type === 'Journal') prefix = 'JNL';
        this.voucherNumber = `${prefix}-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

VoucherSchema.index({ ledger: 1, type: 1, date: -1 });
VoucherSchema.index({ program: 1, type: 1 });

export default mongoose.model('Voucher', VoucherSchema);
