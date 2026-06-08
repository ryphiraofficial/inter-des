import mongoose from 'mongoose';

const QuotationItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    section: {
        type: String,
        trim: true
    },
    finish: {
        type: String,
        trim: true
    },
    material: {
        type: String,
        trim: true
    },
    unit: {
        type: String,
        required: true,
        default: 'SCM'
    },
    size: {
        type: String,
        trim: true
    },
    cmL: {
        type: Number,
        min: 0
    },
    cmD: {
        type: Number,
        min: 0
    },
    cmH: {
        type: Number,
        min: 0
    },
    sqft: {
        type: Number,
        min: 0
    },
    measurements: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    costPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    rate: {
        type: Number,
        required: true,
        min: 0
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    discountType: {
        type: String,
        enum: ['percentage', 'amount'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        default: 0,
        min: 0
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    profit: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: null
    }
});

const QuotationVersionSchema = new mongoose.Schema({
    version: {
        type: Number,
        required: true
    },
    items: [QuotationItemSchema],
    subtotal: Number,
    taxRate: Number,
    taxAmount: Number,
    discount: Number,
    offerPrice: Number,
    totalAmount: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const QuotationSchema = new mongoose.Schema({
    quotationNumber: {
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
    projectName: {
        type: String,
        required: [true, 'Please provide project name'],
        trim: true
    },
    projectType: {
        type: String,
        enum: ['Residential', 'Commercial', 'Hospitality', 'Retail', 'Other'],
        default: 'Residential'
    },
    clientPhone: {
        type: String,
        trim: true
    },
    items: [QuotationItemSchema],
    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    totalCost: {
        type: Number,
        default: 0
    },
    totalProfit: {
        type: Number,
        default: 0
    },
    profitMargin: {
        type: Number,
        default: 0
    },
    taxRate: {
        type: Number,
        default: 18,
        min: 0,
        max: 100
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    offerPrice: {
        type: Number
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['Draft', 'Under Review', 'Revision', 'Design Approved', 'Material Approved', 'Sent to Procurement', 'Sent to Accounts', 'Approved', 'Rejected', 'Expired'],
        default: 'Draft'
    },
    validUntil: {
        type: Date
    },
    notes: {
        type: String,
        trim: true
    },
    termsAndConditions: {
        type: String,
        trim: true
    },
    projectDescription: {
        type: String,
        trim: true
    },
    projectStart: {
        type: Date
    },
    projectEnd: {
        type: Date
    },
    scopeOfWork: {
        type: String,
        trim: true
    },
    depositPercent: {
        type: Number,
        default: 30,
        min: 0,
        max: 100
    },
    paymentTerms: {
        type: String,
        trim: true
    },
    warrantyTerms: {
        type: String,
        trim: true
    },
    cancellationPolicy: {
        type: String,
        trim: true
    },
    documentType: {
        type: String,
        default: 'Quotation'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectedAt: {
        type: Date
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    revisionRequestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    revisionRequestedAt: {
        type: Date
    },
    revisionReason: {
        type: String,
        trim: true
    },
    version: {
        type: Number,
        default: 1
    },
    versions: [QuotationVersionSchema],
    currentVersion: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Auto-generate quotation number
QuotationSchema.pre('save', async function (next) {
    if (!this.quotationNumber) {
        const year = new Date().getFullYear();
        let sequence = 1;
        
        // Find the quotation with the highest number for this year
        const lastQuotation = await mongoose.model('Quotation')
            .findOne({ quotationNumber: new RegExp(`^QT-${year}-`) })
            .sort({ quotationNumber: -1 });
            
        if (lastQuotation) {
            const parts = lastQuotation.quotationNumber.split('-');
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
            const tempNumber = `QT-${year}-${String(sequence).padStart(4, '0')}`;
            const exists = await mongoose.model('Quotation').findOne({ quotationNumber: tempNumber });
            if (!exists) {
                this.quotationNumber = tempNumber;
                unique = true;
            } else {
                sequence++;
            }
        }
    }
    next();
});

// Calculate totals before saving
QuotationSchema.pre('save', function (next) {
    let totalCost = 0;
    this.subtotal = this.items.reduce((sum, item) => {
        const baseAmount = (item.quantity || 0) * (item.rate || 0);
        
        let itemDiscountAmount = 0;
        if (item.discountType === 'amount') {
            itemDiscountAmount = item.discountValue || 0;
        } else {
            itemDiscountAmount = (baseAmount * (item.discountValue || 0)) / 100;
        }
        
        item.discountAmount = itemDiscountAmount;
        item.amount = baseAmount - itemDiscountAmount;
        
        item.profit = item.amount - ((item.quantity || 0) * (item.costPrice || 0));
        totalCost += (item.quantity || 0) * (item.costPrice || 0);
        return sum + item.amount;
    }, 0);

    this.totalCost = totalCost;

    // Discount is a percentage
    const discountAmount = (this.subtotal * (this.discount || 0)) / 100;
    this.offerPrice = this.subtotal - discountAmount;

    // Total Profit (Offer Price - Total Cost)
    this.totalProfit = this.offerPrice - this.totalCost;
    
    // Profit Margin %
    if (this.offerPrice > 0) {
        this.profitMargin = (this.totalProfit / this.offerPrice) * 100;
    } else {
        this.profitMargin = 0;
    }

    // Tax is applied on the Offer Price (discounted amount)
    this.taxAmount = (this.offerPrice * (this.taxRate || 0)) / 100;

    this.totalAmount = this.offerPrice + this.taxAmount;
    next();
});

export default mongoose.model('Quotation', QuotationSchema);
