import mongoose from 'mongoose';

const InviteeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    }
}, { _id: false });

const MeetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a meeting title'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    meetLink: {
        type: String,
        required: [true, 'Please provide a Google Meet link'],
        trim: true
    },
    scheduledAt: {
        type: Date,
        required: [true, 'Please provide a scheduled date and time']
    },
    duration: {
        type: Number,
        default: 60, // minutes
        min: [5, 'Duration must be at least 5 minutes']
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invitees: {
        type: [InviteeSchema],
        default: []
    }
}, {
    timestamps: true
});

// Auto-update status based on time
MeetingSchema.virtual('computedStatus').get(function () {
    const now = new Date();
    const start = new Date(this.scheduledAt);
    const end = new Date(start.getTime() + this.duration * 60000);

    if (this.status === 'cancelled') return 'cancelled';
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
});

MeetingSchema.index({ scheduledAt: -1 });
MeetingSchema.index({ 'invitees.user': 1 });

export default mongoose.model('Meeting', MeetingSchema);
