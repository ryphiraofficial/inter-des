import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    transactionNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'Please link an account']
    },
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher'
    },
    type: {
        type: String,
        enum: ['Credit', 'Debit'],
        required: [true, 'Please specify transaction type']
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount'],
        min: 0
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    reference: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Reversed'],
        default: 'Completed'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

TransactionSchema.pre('save', async function (next) {
    if (!this.transactionNumber) {
        const count = await mongoose.model('Transaction').countDocuments();
        const year = new Date().getFullYear();
        this.transactionNumber = `TRX-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

TransactionSchema.index({ account: 1, date: -1 });

export default mongoose.model('Transaction', TransactionSchema);
