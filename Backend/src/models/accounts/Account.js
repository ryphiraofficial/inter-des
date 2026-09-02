import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please provide account name'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Cash', 'Bank', 'Company', 'Overdraft', 'Other'],
        required: [true, 'Please specify account type']
    },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        branchName: String
    },
    currency: {
        type: String,
        default: 'INR'
    },
    openingBalance: {
        type: Number,
        default: 0
    },
    currentBalance: {
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

AccountSchema.pre('save', async function (next) {
    if (!this.accountNumber) {
        const count = await mongoose.model('Account').countDocuments();
        this.accountNumber = `ACC-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

export default mongoose.model('Account', AccountSchema);
