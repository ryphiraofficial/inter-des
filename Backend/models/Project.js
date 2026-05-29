const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Please select a client']
    },
    quotation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quotation',
        required: [true, 'Please link a quotation']
    },
    name: {
        type: String,
        required: [true, 'Please provide project name'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    stage: {
        type: String,
        enum: ['Accounts', 'Design', 'Pending Payment', 'Procurement', 'Production', 'Completed'],
        default: 'Accounts'
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
        default: 'Not Started'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    budget: {
        type: Number,
        default: 0,
        min: 0
    },
    spent: {
        type: Number,
        default: 0,
        min: 0
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    targetEndDate: {
        type: Date
    },
    actualEndDate: {
        type: Date
    },
    assignedDesignManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedProcurementManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedProductionManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedAccountsStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending Advance', 'Invoice Sent', 'Partial Payment', 'Cleared', 'Overdue'],
        default: 'Pending Advance'
    },
    advancePercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    advanceAmount: {
        type: Number,
        default: 0
    },
    collectedAmount: {
        type: Number,
        default: 0
    },
    paymentDueDate: {
        type: Date
    },
    adminPaymentNotes: {
        type: String,
        trim: true
    },
    paymentCollectionStatus: {
        type: String,
        enum: ['Not Required', 'Pending Assignment', 'Assigned', 'Collected', 'Verified'],
        default: 'Not Required'
    },
    tempCollectionDetails: {
        amount: { type: Number },
        paymentMode: { type: String },
        referenceNumber: { type: String },
        paymentNotes: { type: String },
        collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        collectedAt: { type: Date, default: Date.now }
    },
    notes: {
        type: String,
        trim: true
    },
    designComplete: {
        type: Boolean,
        default: false
    },
    materialsReady: {
        type: Boolean,
        default: false
    },
    productionComplete: {
        type: Boolean,
        default: false
    },
    handoverComplete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

ProjectSchema.pre('validate', async function (next) {
    if (!this.projectNumber) {
        const year = new Date().getFullYear();
        let sequence = 1;
        
        // Find the project with the highest number for this year
        const lastProject = await mongoose.model('Project')
            .findOne({ projectNumber: new RegExp(`^PRJ-${year}-`) })
            .sort({ projectNumber: -1 });
            
        if (lastProject) {
            const parts = lastProject.projectNumber.split('-');
            if (parts.length === 3) {
                const lastSeq = parseInt(parts[2], 10);
                if (!isNaN(lastSeq)) {
                    sequence = lastSeq + 1;
                }
            }
        }
        
        // Final safety check loop to guarantee absolute uniqueness
        let unique = false;
        while (!unique) {
            const tempNumber = `PRJ-${year}-${String(sequence).padStart(4, '0')}`;
            const exists = await mongoose.model('Project').findOne({ projectNumber: tempNumber });
            if (!exists) {
                this.projectNumber = tempNumber;
                unique = true;
            } else {
                sequence++;
            }
        }
    }
    next();
});

ProjectSchema.pre('save', function (next) {
    let completedCount = 0;
    if (this.designComplete) completedCount++;
    if (this.materialsReady) completedCount++;
    if (this.productionComplete) completedCount++;
    if (this.handoverComplete) completedCount++;
    
    this.progress = Math.round((completedCount / 4) * 100);
    
    if (this.status === 'Completed' || this.stage === 'Completed' || this.handoverComplete) {
        this.progress = 100;
        this.designComplete = true;
        this.materialsReady = true;
        this.productionComplete = true;
        this.handoverComplete = true;
        this.stage = 'Completed';
        this.status = 'Completed';
        if (!this.actualEndDate) {
            this.actualEndDate = new Date();
        }
    } else if (this.productionComplete) {
        this.stage = 'Production';
    } else if (this.materialsReady) {
        this.stage = 'Procurement';
    } else if (this.designComplete) {
        this.stage = 'Procurement'; // Or Design if workflow dictates
    }
    // We shouldn't auto-downgrade to Design/Accounts just based on booleans unless we want to,
    // so let's only auto-advance if it reaches the end states.
    
    if (['Design', 'Procurement', 'Production'].includes(this.stage) && this.status === 'Not Started') {
        this.status = 'In Progress';
    }
    
    next();
});

ProjectSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update) {
        const updateObj = update.$set || update;
        if (updateObj.stage && !updateObj.status) {
            if (['Design', 'Procurement', 'Production'].includes(updateObj.stage)) {
                if (update.$set) {
                    update.$set.status = 'In Progress';
                } else {
                    update.status = 'In Progress';
                }
            }
        }
    }
    next();
});

ProjectSchema.index({ name: 'text', projectNumber: 'text' });
ProjectSchema.index({ client: 1, stage: 1, status: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
