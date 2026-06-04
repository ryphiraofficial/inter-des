import Quotation from '../../models/sales/Quotation.js';
import Invoice from '../../models/sales/Invoice.js';
import Project from '../../models/design/Project.js';
import Checklist from '../../models/design/Checklist.js';
import { createNotification, notifyUser } from '../../utils/notificationHelper.js';
import { logAction } from '../../services/auditService.js';

export const createQuotation = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const quotation = await Quotation.create(req.body);

        await createNotification({
            title: 'New Quotation Created',
            description: `Quotation "${quotation.projectName || quotation.quotationNumber}" worth ₹${quotation.totalAmount?.toLocaleString('en-IN') || 0} has been created.`,
            type: 'Quote',
            relatedModel: 'Quotation',
            relatedId: quotation._id,
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, data: quotation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateQuotation = async (req, res) => {
    try {
        let quotation = await Quotation.findById(req.params.id);
        if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
        
        console.log("UPDATE QUOTATION PAYLOAD ITEMS:", JSON.stringify(req.body.items, null, 2));

        if (req.body.items && req.body.items !== quotation.items) {
            const versionSnapshot = {
                version: quotation.currentVersion,
                items: JSON.parse(JSON.stringify(quotation.items)),
                subtotal: quotation.subtotal,
                taxRate: quotation.taxRate,
                taxAmount: quotation.taxAmount,
                discount: quotation.discount,
                offerPrice: quotation.offerPrice,
                totalAmount: quotation.totalAmount,
                createdAt: new Date(),
                createdBy: quotation.createdBy
            };
            quotation.versions.push(versionSnapshot);
            quotation.currentVersion += 1;
            quotation.version = quotation.currentVersion;
        }

        if (req.body.status === 'Revision') {
            quotation.revisionRequestedBy = req.user.id;
            quotation.revisionRequestedAt = new Date();
            quotation.revisionReason = req.body.revisionReason || '';

            logAction({
                userId: req.user.id, action: 'Revision Requested', module: 'BOQ',
                referenceId: quotation._id, referenceModel: 'Quotation',
                newValue: { status: 'Revision', reason: req.body.revisionReason },
                description: `Revision requested for quotation "${quotation.projectName || quotation.quotationNumber}"`
            });

            await createNotification({
                title: 'BOQ Revision Requested',
                description: `Revision requested for quotation "${quotation.projectName || quotation.quotationNumber}".${req.body.revisionReason ? ` Reason: ${req.body.revisionReason}` : ''}`,
                type: 'Quote', relatedModel: 'Quotation', relatedId: quotation._id, createdBy: req.user.id
            });
        }

        if (req.body.status === 'Rejected') {
            quotation.rejectedBy = req.user.id;
            quotation.rejectedAt = new Date();
            quotation.rejectionReason = req.body.rejectionReason || '';

            logAction({
                userId: req.user.id, action: 'BOQ Rejected', module: 'BOQ',
                referenceId: quotation._id, referenceModel: 'Quotation',
                newValue: { status: 'Rejected', reason: req.body.rejectionReason },
                description: `Quotation "${quotation.projectName || quotation.quotationNumber}" rejected`
            });

            await createNotification({
                title: 'BOQ Rejected',
                description: `Quotation "${quotation.projectName || quotation.quotationNumber}" has been rejected.${req.body.rejectionReason ? ` Reason: ${req.body.rejectionReason}` : ''}`,
                type: 'Error', relatedModel: 'Quotation', relatedId: quotation._id, createdBy: req.user.id
            });
        }

        if (req.body.status === 'Design Approved') {
            quotation.approvedBy = req.user.id;
            quotation.approvedAt = new Date();

            logAction({
                userId: req.user.id, action: 'BOQ Design Approved', module: 'BOQ',
                referenceId: quotation._id, referenceModel: 'Quotation',
                newValue: { status: 'Design Approved', approvedBy: req.user.id },
                description: `Quotation "${quotation.projectName || quotation.quotationNumber}" design approved`
            });

            await createNotification({
                title: 'BOQ Design Approved',
                description: `Quotation "${quotation.projectName || quotation.quotationNumber}" has been approved by design manager.`,
                type: 'Success', relatedModel: 'Quotation', relatedId: quotation._id, createdBy: req.user.id
            });
        }

        Object.keys(req.body).forEach(key => { quotation[key] = req.body[key]; });
        await quotation.save();

        res.status(200).json({ success: true, data: quotation, message: 'Quotation updated successfully' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });

        await quotation.deleteOne();
        res.status(200).json({ success: true, message: 'Quotation deleted successfully', data: {} });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const approveQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });

        const { designManagerId } = req.body;
        quotation.status = 'Approved';
        quotation.approvedBy = req.user.id;
        quotation.approvedAt = new Date();
        await quotation.save();

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15);

        const invoiceItems = quotation.items.map(item => ({
            description: `${item.itemName} ${item.section ? `(${item.section})` : ''}`,
            quantity: item.quantity,
            rate: item.rate,
            tax: quotation.taxRate || 18,
            amount: item.amount
        }));

        const project = await Project.create({
            client: quotation.client, quotation: quotation._id, name: quotation.projectName,
            description: `Project created from quotation ${quotation.quotationNumber}`,
            budget: quotation.totalAmount, stage: 'Design', status: 'Not Started',
            paymentStatus: 'Pending Advance', advanceAmount: quotation.totalAmount * 0.5,
            assignedDesignManager: designManagerId || undefined, createdBy: req.user.id
        });

        await Invoice.create({
            client: quotation.client, quotation: quotation._id, project: project._id,
            invoiceDate: new Date(), dueDate: dueDate, items: invoiceItems,
            subtotal: quotation.subtotal, totalTax: quotation.taxAmount, grandTotal: quotation.totalAmount,
            status: 'Draft', createdBy: req.user.id, notes: quotation.notes,
            termsAndConditions: quotation.termsAndConditions
        });

        const defaultSteps = [
            { name: 'Demolition', order: 1 }, { name: 'Cleaning', order: 2 },
            { name: 'Installation', order: 3 }, { name: 'Final Handover', order: 4 }
        ];

        await Checklist.create({ project: project._id, steps: defaultSteps, createdBy: req.user.id });

        await createNotification({
            title: 'Quotation Approved - Project Created',
            description: `Quotation "${quotation.projectName || quotation.quotationNumber}" approved. Project "${project.name}" (${project.projectNumber}) created and moved to Design stage.`,
            type: 'Quote', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id
        });

        if (designManagerId) {
            await notifyUser(designManagerId, {
                title: '🎨 New Project Assigned for Design',
                description: `You have been assigned as the Design Manager for "${project.name}". Please assign a team member to start design drawings.`,
                type: 'Info', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id
            });
        }

        res.status(200).json({ success: true, data: { quotation, project } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const calculateTotals = async (req, res) => {
    try {
        const { items, taxRate, discount } = req.body;
        if (!items || !Array.isArray(items)) return res.status(400).json({ success: false, message: 'Items array is required' });

        const calculatedItems = items.map(item => ({ ...item, amount: (item.quantity || 0) * (item.rate || 0) }));
        const subtotal = calculatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        const discountAmount = (subtotal * (discount || 0)) / 100;
        const offerPrice = subtotal - discountAmount;
        const taxAmount = (offerPrice * (taxRate || 0)) / 100;
        const totalAmount = offerPrice + taxAmount;

        res.status(200).json({
            success: true,
            data: { items: calculatedItems, subtotal, discountAmount, offerPrice, taxRate: taxRate || 0, taxAmount, totalAmount }
        });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
