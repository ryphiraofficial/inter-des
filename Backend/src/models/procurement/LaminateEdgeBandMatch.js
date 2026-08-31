import mongoose from 'mongoose';

const LaminateEdgeBandMatchSchema = new mongoose.Schema({
    laminateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Laminate'
    },
    edgeBandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryEdgeBand'
    },
    laminationItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LaminationItem'
    },
    edgeBandItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EdgeBandItem'
    },
    matchPercent: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 100
    },
    isPrimary: {
        type: Boolean,
        default: false
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

LaminateEdgeBandMatchSchema.index({ laminationItemId: 1, edgeBandItemId: 1 }, { unique: true, sparse: true });
LaminateEdgeBandMatchSchema.index({ laminateId: 1, edgeBandId: 1 }, { unique: true, sparse: true });

export default mongoose.model('LaminateEdgeBandMatch', LaminateEdgeBandMatchSchema);
