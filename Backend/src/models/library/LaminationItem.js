import mongoose from 'mongoose';

const LaminationItemSchema = new mongoose.Schema({
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    brandName: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Please provide lamination code'],
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Please provide lamination name'],
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    finish: {
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

LaminationItemSchema.index({ brandId: 1, code: 1 }, { unique: true });
LaminationItemSchema.index({ code: 1 });

export default mongoose.model('LaminationItem', LaminationItemSchema);
