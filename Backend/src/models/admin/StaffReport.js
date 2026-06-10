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
        enum: ['Issue', 'Feedback', 'Daily Update', 'Other'],
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
    adminNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('StaffReport', staffReportSchema);
