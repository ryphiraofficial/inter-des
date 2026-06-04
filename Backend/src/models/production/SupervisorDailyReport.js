import mongoose from 'mongoose';

const supervisorDailyReportSchema = new mongoose.Schema({
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ProductionProject', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    submittedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    materialReceived: { 
        type: String 
    },
    materialUsed: { 
        type: String 
    },
    equipmentStatus: [{
        equipmentName: String,
        status: { type: String, enum: ['Working', 'Broken', 'Maintenance'] }
    }],
    laborCount: { 
        type: Number 
    },
    comments: { 
        type: String 
    }
}, { timestamps: true });

export default mongoose.model('SupervisorDailyReport', supervisorDailyReportSchema);
