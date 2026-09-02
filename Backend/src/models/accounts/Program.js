import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
    programNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Please link a project'],
        unique: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Please link a client']
    },
    clientAmountPaid: {
        type: Number,
        default: 0
    },
    projectExpenses: {
        type: Number,
        default: 0
    },
    balanceDue: {
        type: Number,
        default: 0
    },
    projectBudget: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'On Hold', 'Cancelled'],
        default: 'Active'
    },
    clearanceStatus: {
        type: String,
        enum: ['Pending', 'Cleared For Procurement', 'Hold'],
        default: 'Pending'
    },
    notes: {
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

ProgramSchema.pre('save', async function (next) {
    if (!this.programNumber) {
        const count = await mongoose.model('Program').countDocuments();
        this.programNumber = `PRG-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

export default mongoose.model('Program', ProgramSchema);
