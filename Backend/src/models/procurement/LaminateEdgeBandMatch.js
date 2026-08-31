import mongoose from 'mongoose';

const LaminateEdgeBandMatchSchema = new mongoose.Schema({
    laminateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Laminate',
        required: true
    },
    edgeBandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryEdgeBand',
        required: true
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

LaminateEdgeBandMatchSchema.index({ laminateId: 1, edgeBandId: 1 }, { unique: true });
LaminateEdgeBandMatchSchema.index({ laminateId: 1, isPrimary: 1 });

export default mongoose.model('LaminateEdgeBandMatch', LaminateEdgeBandMatchSchema);
