import mongoose from 'mongoose';

const staffReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the report'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide the report description'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Issue', 'Feedback', 'Daily Update', 'Weekly Bundle', 'Other'],
        default: 'Daily Update'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Low'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    isAssignedToMe: {
        type: Boolean,
        default: false
    },
    reportDate: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    },
    images: [{
        type: String
    }],
    adminNotes: {
        type: String,
        trim: true
    },
    forwardedToAdmin: {
        type: Boolean,
        default: false
    },
    department: {
        type: String,
        trim: true
    },
    dailyEntries: [{
        date: Date,
        content: String,
        originalReportId: mongoose.Schema.Types.ObjectId,
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved', 'Approved'],
            default: 'Pending'
        },
        image: String,
        images: [String],
        type: { type: String },
        priority: String,
        projectStr: String,
        submittedBy: {
            fullName: String,
            role: String,
            _id: mongoose.Schema.Types.ObjectId
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('StaffReport', staffReportSchema);
