import Staff from '../../models/admin/Staff.js';
import Task from '../../models/design/Task.js';
import Quotation from '../../models/sales/Quotation.js';

export const getQuotations = async (req, res) => {
    try {
        const { search, status, client, page = 1, limit = 10 } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { quotationNumber: { $regex: search, $options: 'i' } },
                { projectName: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) query.status = status;
        if (client) query.client = client;

        const roleLower = req.user.role.toLowerCase();
        if (roleLower.includes('procurement')) {
            query.status = { $in: ['Sent to Procurement', 'Approved'] };
        }

        if (roleLower === 'staff' && !roleLower.includes('procurement')) {
            const staffMember = await Staff.findOne({ email: req.user.email });
            if (staffMember) {
                const assignedTasks = await Task.find({ assignedTo: staffMember._id }).select('quotation');
                const quoteIds = [...new Set(assignedTasks.map(t => t.quotation).filter(q => q))];
                query._id = { $in: quoteIds };
            } else {
                return res.status(200).json({ success: true, count: 0, data: [] });
            }
        }

        const skip = (page - 1) * limit;

        const quotations = await Quotation.find(query)
            .populate('client', 'name email phone')
            .populate('createdBy', 'fullName email')
            .populate('approvedBy', 'fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Quotation.countDocuments(query);

        res.status(200).json({
            success: true,
            count: quotations.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: quotations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id)
            .populate('client')
            .populate('createdBy', 'fullName email')
            .populate('approvedBy', 'fullName');

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        res.status(200).json({
            success: true,
            data: quotation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getQuotationStats = async (req, res) => {
    try {
        const total = await Quotation.countDocuments();
        const pending = await Quotation.countDocuments({ status: 'Under Review' });
        const approved = await Quotation.countDocuments({ status: 'Approved' });
        const rejected = await Quotation.countDocuments({ status: 'Rejected' });

        const totalRevenue = await Quotation.aggregate([
            { $match: { status: 'Approved' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const potentialRevenue = await Quotation.aggregate([
            { $match: { status: 'Pending' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                approved,
                rejected,
                totalRevenue: totalRevenue[0]?.total || 0,
                potentialRevenue: potentialRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getVersionHistory = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id)
            .select('versions currentVersion quotationNumber projectName')
            .populate('versions.createdBy', 'fullName');

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        res.status(200).json({
            success: true,
            currentVersion: quotation.currentVersion,
            versions: quotation.versions,
            data: quotation.versions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const compareVersions = async (req, res) => {
    try {
        const { v1, v2 } = req.query;

        const quotation = await Quotation.findById(req.params.id)
            .select('versions currentVersion items subtotal taxRate taxAmount discount offerPrice totalAmount');

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        const version1 = v1 ? quotation.versions.find(v => v.version === parseInt(v1)) : null;
        const version2 = v2 ? quotation.versions.find(v => v.version === parseInt(v2)) : null;
        const currentData = {
            items: quotation.items,
            subtotal: quotation.subtotal,
            taxRate: quotation.taxRate,
            taxAmount: quotation.taxAmount,
            discount: quotation.discount,
            offerPrice: quotation.offerPrice,
            totalAmount: quotation.totalAmount
        };

        res.status(200).json({
            success: true,
            data: {
                current: currentData,
                version1: version1 || null,
                version2: version2 || null,
                canCompare: !!(version1 && version2)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
